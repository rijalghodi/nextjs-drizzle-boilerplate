import { format } from "date-fns";

export function generateInvoiceNumber(): string {
  const now = new Date();
  const yyMM = format(now, "yyMM");
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `TRX-${yyMM}-${rand}`;
}
