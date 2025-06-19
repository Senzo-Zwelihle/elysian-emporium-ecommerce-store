export type NoteTag =
  | "Idea"
  | "Todo"
  | "Inspiration"
  | "Reminder"
  | "Task"
  | "Note"
  | "Journal"
  | "Thought"
  | string;

export type NoteStatus =
  | "Draft"
  | "InProgess"
  | "Review"
  | "Final"
  | "Archived"
  | string;

export type NoteAction = "Urgent" | "Important" | "LowPriority" | string;

export function setNoteTag(tag: NoteTag): {
  label: string;
  color: string;
} {
  switch (tag) {
    case "Idea":
      return { label: "Idea", color: "bg-green-700" };

    case "Todo":
      return { label: "Todo", color: "bg-red-700" };

    case "Inspiration":
      return { label: "Inspiration", color: "bg-yellow-700" };

    case "Reminder":
      return { label: "Reminder", color: "bg-orange-700" };

    case "Task":
      return { label: "Task", color: "bg-blue-700" };

    case "Note":
      return { label: "Note", color: "bg-purple-700" };

    case "Journal":
      return { label: "Journal", color: "bg-pink-700" };

    case "Thought":
      return { label: "Thought", color: "bg-teal-700" };

    default:
      return {
        label: tag,
        color: "bg-gray-700",
      };
  }
}

export function setNoteStatus(status: NoteStatus): {
  label: string;
  color: string;
} {
  switch (status) {
    case "Draft":
      return { label: "Draft", color: "bg-gray-700" };

    case "InProgess":
      return { label: "InProgess", color: "bg-amber-700" };

    case "Review":
      return { label: "Review", color: "bg-blue-700" };

    case "Final":
      return { label: "Final", color: "bg-green-700" };

    case "Archived":
      return { label: "Archived", color: "bg-slate-700" };

    default:
      return {
        label: status,
        color: "bg-gray-700",
      };
  }
}

export function setNoteAction(action: NoteAction): {
  label: string;
  color: string;
} {
  switch (action) {
    case "Urgent":
      return { label: "Urgent", color: "bg-red-700" };

    case "Important":
      return { label: "Important", color: "bg-amber-700" };

    case "LowPriority":
      return { label: "LowPriority", color: "bg-blue-700" };

    default:
      return {
        label: action,
        color: "bg-gray-700",
      };
  }
}
