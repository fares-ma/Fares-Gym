export interface ProgramOrderItem {
  id: string;
  orderIndex: number;
}

/**
 * Pure domain logic to determine the next workout program in the rotation cycle.
 *
 * Sequence:
 * 1. Anterior A (order: 1)
 * 2. Posterior A (order: 2)
 * 3. Anterior B (order: 3)
 * 4. Posterior B (order: 4)
 * -> Wraps back to Anterior A
 *
 * @param programs List of programs with their orderIndex
 * @param lastCompletedProgramId The program ID of the most recently completed session
 * @returns The program ID of the next scheduled workout
 */
export function getNextProgramId(
  programs: ProgramOrderItem[],
  lastCompletedProgramId?: string | null
): string {
  if (!programs || programs.length === 0) {
    return "";
  }

  // Sort strictly by orderIndex ascending
  const sorted = [...programs].sort((a, b) => a.orderIndex - b.orderIndex);

  if (!lastCompletedProgramId) {
    // Default to the first program in rotation
    return sorted[0].id;
  }

  const currentIndex = sorted.findIndex((p) => p.id === lastCompletedProgramId);

  if (currentIndex === -1) {
    // If last completed program is no longer found, default to first
    return sorted[0].id;
  }

  const nextIndex = (currentIndex + 1) % sorted.length;
  return sorted[nextIndex].id;
}
