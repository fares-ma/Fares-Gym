"use client";

import { useState, useTransition } from "react";
import { StickyNote, Plus, Trash2, Clock } from "lucide-react";
import { QuickNote } from "@/src/domain/activities/types";
import { createNoteAction, deleteNoteAction } from "@/src/server/activities-actions";
import { ar } from "@/src/i18n/ar";

interface NotesSectionProps {
  notes: QuickNote[];
  onChanged?: () => void;
}

export function NotesSection({ notes, onChanged }: NotesSectionProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    startTransition(async () => {
      const res = await createNoteAction(content.trim());
      if (res.success) {
        setContent("");
        onChanged?.();
      } else {
        alert(res.error || ar.errors.generic);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(ar.activities.deleteConfirm)) return;

    startTransition(async () => {
      const res = await deleteNoteAction(id);
      if (res.success) {
        onChanged?.();
      } else {
        alert(res.error || ar.errors.generic);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Quick Add Note */}
      <form
        onSubmit={handleAddNote}
        className="comic-card p-4 border border-[#2B252E] bg-[#1A151D] space-y-3"
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={ar.activities.noteModal.contentPlaceholder}
          rows={2}
          disabled={isPending}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#110D13] border border-[#2B252E] text-xs sm:text-sm text-[#F2EADF] placeholder-[#5A525E] focus:outline-none focus:border-[#D6AA63] resize-none"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending || !content.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D6AA63] hover:bg-[#C29650] text-[#110D13] font-black text-xs shadow-md shadow-amber-950/30 transition-all disabled:opacity-40"
          >
            <Plus className="w-4 h-4" />
            <span>{isPending ? ar.activities.saving : ar.activities.noteModal.submitBtn}</span>
          </button>
        </div>
      </form>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="comic-card p-8 border border-dashed border-[#2B252E] text-center space-y-3 bg-[#161218]">
          <div className="w-12 h-12 rounded-2xl bg-[#211C23] text-[#D6AA63] mx-auto flex items-center justify-center">
            <StickyNote className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm text-[#9D969D] max-w-sm mx-auto leading-relaxed">
            {ar.activities.emptyNotes}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {notes.map((note) => {
            const dateStr = new Date(note.createdAt).toLocaleDateString("ar-EG", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={note.id}
                className="comic-card p-3.5 sm:p-4 border border-[#2B252E] bg-[#1A151D] hover:border-[#3B3240] transition-all flex items-start justify-between gap-3 text-start"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-[#F2EADF] whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                  <span className="text-[10px] font-mono text-[#9D969D] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {dateStr}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(note.id)}
                  disabled={isPending}
                  className="p-1.5 rounded-lg text-[#9D969D] hover:text-red-400 hover:bg-red-950/20 transition-all disabled:opacity-40 shrink-0"
                  title={ar.activities.deleteNoteTooltip}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
