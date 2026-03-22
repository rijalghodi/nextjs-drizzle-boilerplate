import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  columns: number;
  rows: number;
};

export function TableSkeleton({ columns, rows }: Props) {
  return (
    <div className="rounded-xl border overflow-hidden w-full bg-card">
      <div className="w-full">
        {/* Header row */}
        <div className="flex w-full items-center border-b bg-muted/50 p-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={`header-col-${colIndex}`} className="flex-1 px-3">
              <Skeleton className="h-5 w-full max-w-[80%]" />
            </div>
          ))}
        </div>

        {/* Body rows */}
        <div className="flex flex-col w-full divide-y">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex w-full items-center p-3">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={`cell-${rowIndex}-${colIndex}`} className="flex-1 px-3">
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TableSkeleton;
