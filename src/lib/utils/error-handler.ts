// ── T009 — Unified Error Handler for Bidding Operations ───────────────────────

export type BiddingError = {
  code: string;
  message: string;
  arabicMessage: string;
};

const ERROR_MAP: Record<string, BiddingError> = {
  "Project not found": {
    code: "PROJECT_NOT_FOUND",
    message: "Project not found",
    arabicMessage: "المشروع غير موجود",
  },
  "Project is not open for bidding": {
    code: "PROJECT_CLOSED",
    message: "This project is no longer accepting bids",
    arabicMessage: "هذا المشروع لم يعد يقبل العروض",
  },
  "Bid amount exceeds project budget": {
    code: "BID_EXCEEDS_BUDGET",
    message: "Your bid exceeds the project budget",
    arabicMessage: "عرضك يتجاوز ميزانية المشروع",
  },
  "Only the project owner": {
    code: "UNAUTHORIZED",
    message: "You are not authorized to perform this action",
    arabicMessage: "غير مصرح لك بتنفيذ هذا الإجراء",
  },
  "duplicate key value": {
    code: "DUPLICATE_BID",
    message: "You have already placed a bid on this project",
    arabicMessage: "لقد قدمت عرضاً على هذا المشروع بالفعل",
  },
};

export function parseBiddingError(error: unknown): BiddingError {
  const message = error instanceof Error ? error.message : String(error);

  for (const [key, value] of Object.entries(ERROR_MAP)) {
    if (message.includes(key)) {
      return value;
    }
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred. Please try again.",
    arabicMessage: "حدث خطأ غير متوقع. يرجى المحاولة مجدداً.",
  };
}
