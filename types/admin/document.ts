export type DocumentStatus = "Active" | "Inactive" | "Archived" | string;

export type DocumentType =
  | "File"
  | "Tutorial"
  | "Artical"
  | "Guide"
  | "Image"
  | "Other"
  | "Invoices"
  | "Miscellaneous"
  | string;

export function setDocumentStatus(status: DocumentStatus): {
  label: string;
  color: string;
} {
  switch (status) {
    case "Active":
      return { label: "Active", color: "bg-amber-700" };

    case "Inactive":
      return { label: "Inactive", color: "bg-blue-700" };

    case "Archived":
      return { label: "Archived", color: "bg-red-700" };

    default:
      return {
        label: status,
        color: "bg-gray-700",
      };
  }
}

export function setDocumentType(type: DocumentType): {
  label: string;
  color: string;
} {
  switch (type) {
    case "File":
      return { label: "File", color: "bg-amber-700" };

    case "Tutorial":
      return { label: "Tutorial", color: "bg-blue-700" };

    case "Artical":
      return { label: "Artical", color: "bg-blue-700" };

    case "Guide":
      return { label: "Guide", color: "bg-purple-700" };

    case "Image":
      return { label: "Image", color: "bg-teal-700" };

    case "Other":
      return { label: "Other", color: "bg-blue-700" };

    case "Invoices":
      return { label: "Invoices", color: "bg-orange-700" };

    case "Miscellaneous":
      return { label: "Miscellaneous", color: "bg-cyan-700" };

    default:
      return {
        label: type,
        color: "bg-gray-700",
      };
  }
}
