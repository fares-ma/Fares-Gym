/**
 * Unified Optimistic UI Helper for Fares Hub.
 * Provides resilient state transition and automatic rollback on server action failure or network error.
 */

export interface OptimisticMutationOptions<
  TState,
  TResult extends { success: boolean; error?: string }
> {
  /** Retrieves current state snapshot before applying optimistic change */
  getCurrentState: () => TState;
  /** Applies optimistic mutation to state snapshot and returns optimistic state */
  applyOptimistic: (current: TState) => TState;
  /** Commits the new state to the UI (e.g. React state setter) */
  commitState: (next: TState) => void;
  /** Optional custom rollback handler; defaults to committing previous state snapshot */
  rollbackState?: (prev: TState) => void;
  /** The asynchronous server action to execute */
  action: () => Promise<TResult>;
  /** Optional callback invoked on error with error message */
  onError?: (error: string) => void;
  /** Optional callback invoked on successful server action completion */
  onSuccess?: (result: TResult) => void;
}

/**
 * Executes an optimistic mutation with automatic rollback if server action fails or throws.
 */
export async function executeOptimisticMutation<
  TState,
  TResult extends { success: boolean; error?: string }
>(options: OptimisticMutationOptions<TState, TResult>): Promise<boolean> {
  const previousState = options.getCurrentState();
  const nextState = options.applyOptimistic(previousState);
  options.commitState(nextState);

  try {
    const result = await options.action();
    if (!result.success) {
      if (options.rollbackState) {
        options.rollbackState(previousState);
      } else {
        options.commitState(previousState);
      }
      options.onError?.(result.error || "Action failed");
      return false;
    }
    options.onSuccess?.(result);
    return true;
  } catch (err: any) {
    if (options.rollbackState) {
      options.rollbackState(previousState);
    } else {
      options.commitState(previousState);
    }
    options.onError?.(err?.message || "Action failed");
    return false;
  }
}

/**
 * Convenience helper for optimistic toggling / updating an item in a list state.
 */
export async function executeOptimisticListUpdate<
  TItem extends { id: string },
  TResult extends { success: boolean; error?: string }
>(
  items: TItem[],
  setItems: React.Dispatch<React.SetStateAction<TItem[]>>,
  itemId: string,
  updateFn: (item: TItem) => TItem,
  action: () => Promise<TResult>,
  onError?: (error: string) => void
): Promise<boolean> {
  const previousItems = [...items];
  const optimisticItems = items.map((item) =>
    item.id === itemId ? updateFn(item) : item
  );
  setItems(optimisticItems);

  try {
    const result = await action();
    if (!result.success) {
      setItems(previousItems);
      onError?.(result.error || "Action failed");
      return false;
    }
    return true;
  } catch (err: any) {
    setItems(previousItems);
    onError?.(err?.message || "Action failed");
    return false;
  }
}
