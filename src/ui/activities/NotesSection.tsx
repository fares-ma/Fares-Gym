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
        className="comic-card p-4 border border-[#2A242E] bg-[#151318] space-y-3 shadow-sm"
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={ar.activities.noteModal.contentPlaceholder}
          rows={2}
          disabled={isPending}
          className="w-full px-3.5 py-2.5 rounded-xl bg-[#110F14] border border-[#2A242E] text-xs sm:text-sm text-[#F1E9DD] placeholder-[#6B646B] focus:outline-none focus:border-[#C9A15A] resize-none"
        />

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending || !content.trim()}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#7A1735] hover:bg-[#942042] text-[#F1E9DD] font-black text-xs shadow-lg shadow-[#7A1735]/30 transition-all disabled:opacity-40 min-h-[44px] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isPending ? ar.activities.saving : ar.activities.noteModal.submitBtn}</span>
          </button>
        </div>
      </form>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="comic-card p-8 border border-dashed border-[#2A242E] text-center space-y-3 bg-[#151318]">
          <div className="w-12 h-12 rounded-2xl bg-[#1D1920] text-[#C9A15A] mx-auto flex items-center justify-center border border-[#2A242E]">
            <StickyNote className="w-6 h-6" />
          </div>
          <p className="text-xs sm:text-sm text-[#A7A0A6] max-w-sm mx-auto leading-relaxed">
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
                className="comic-card p-3.5 sm:p-4 border border-[#2A242E] bg-[#151318] hover:border-[#3D3342] transition-all flex items-start justify-between gap-3 text-start shadow-sm"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-[#F1E9DD] whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                  <span className="text-[10px] font-mono text-[#A7A0A6] flex items-center gap-1 bg-[#1D1920] px-2 py-0.5 rounded-md border border-[#2A242E] w-fit">
                    <Clock className="w-3 h-3 text-[#C9A15A]" />
                    {dateStr}
                  </span>
                </div>

                <button
                  onClick={() => handleDelete(note.id)}
                  disabled={isPending}
                  className="p-2 rounded-lg text-[#A7A0A6] hover:text-red-400 hover:bg-red-950/30 transition-all disabled:opacity-40 shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
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
