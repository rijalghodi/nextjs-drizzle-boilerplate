"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataGrid } from "@/components/ui/data-grid";

/**
 * DataGridBulkActions
 *
 * A floating toolbar that appears at the bottom of the screen when one or more
 * rows are selected. Place this component anywhere inside a <DataGrid> tree.
 *
 * Requires:
 *  - `tableLayout={{ rowsSelectable: true }}` on <DataGrid>
 *  - `bulkActions={(selected) => <...buttons...>}` render-prop on <DataGrid>
 *
 * Example:
 * ```tsx
 * <DataGrid
 *   table={table}
 *   tableLayout={{ rowsSelectable: true }}
 *   bulkActions={(selected) => (
 *     <Button variant="destructive" size="sm" onClick={() => handleDelete(selected)}>
 *       Delete {selected.length}
 *     </Button>
 *   )}
 * >
 *   ...
 *   <DataGridBulkActions />
 * </DataGrid>
 * ```
 */
function DataGridBulkActions() {
  const { props, selectedRows, clearSelection } = useDataGrid();

  if (!props.tableLayout?.rowsSelectable) return null;
  if (!props.bulkActions) return null;
  if (selectedRows.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-xl border border-border bg-background shadow-lg px-4 py-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        {selectedRows.length} row{selectedRows.length > 1 ? "s" : ""} selected
      </span>
      <div className="h-4 w-px bg-border shrink-0" />

      {/* Consumer-supplied action buttons */}
      <div className="flex items-center gap-2">{props.bulkActions(selectedRows)}</div>

      <div className="h-4 w-px bg-border shrink-0" />

      {/* Always-present clear button */}
      <Button variant="ghost" size="sm" onClick={clearSelection}>
        <X className="size-4" />
        Clear
      </Button>
    </div>
  );
}

export { DataGridBulkActions };
