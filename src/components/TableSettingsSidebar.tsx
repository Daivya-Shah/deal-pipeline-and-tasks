import { useState, useEffect } from "react";
import { X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TableColumn {
  id: string;
  name: string;
  enabled: boolean;
  editable: boolean; // Company column is not editable/deletable
}

interface TableSettingsSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: TableColumn[];
  onColumnsChange: (columns: TableColumn[]) => void;
}

const SortableColumnItem = ({ 
  column, 
  onToggle,
  isDragging = false 
}: { 
  column: TableColumn; 
  onToggle: (id: string) => void;
  isDragging?: boolean;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-[7px] px-[10.5px] py-[7px] rounded-[4px] hover:bg-gray-50"
    >
      <Checkbox
        checked={column.enabled}
        onCheckedChange={() => onToggle(column.id)}
        disabled={!column.editable}
        className="w-[17.5px] h-[17.5px] border border-border-color data-[state=checked]:bg-[#006BB6] data-[state=checked]:border-[#006BB6]"
      />
      <div className="flex-1">
        <div className="text-sm font-normal text-[#334155]">
          {column.name}
        </div>
      </div>
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-[#64748B] hover:text-[#475569] p-1"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};

const DragOverlayItem = ({ column }: { column: TableColumn | null }) => {
  if (!column) return null;
  
  return (
    <div className="flex items-center gap-[7px] px-[10.5px] py-[7px] rounded-[4px] bg-white shadow-lg border border-[#E2E8F0]">
      <Checkbox
        checked={column.enabled}
        disabled={!column.editable}
        className="w-[17.5px] h-[17.5px] border border-border-color data-[state=checked]:bg-[#006BB6] data-[state=checked]:border-[#006BB6]"
      />
      <div className="flex-1">
        <div className="text-sm font-normal text-[#334155]">
          {column.name}
        </div>
      </div>
      <div className="cursor-grab text-[#64748B] p-1">
        <GripVertical className="w-3.5 h-3.5" />
      </div>
    </div>
  );
};

export const TableSettingsSidebar = ({
  open,
  onOpenChange,
  columns,
  onColumnsChange,
}: TableSettingsSidebarProps) => {
  const [localColumns, setLocalColumns] = useState<TableColumn[]>(columns);
  const [activeColumn, setActiveColumn] = useState<TableColumn | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    setLocalColumns(columns);
  }, [columns]);

  const handleToggleColumn = (columnId: string) => {
    setLocalColumns(prev => 
      prev.map(col => 
        col.id === columnId 
          ? { ...col, enabled: !col.enabled }
          : col
      )
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    const column = localColumns.find(col => col.id === event.active.id);
    setActiveColumn(column || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveColumn(null);

    if (!over || active.id === over.id) {
      return;
    }

    setLocalColumns(prev => {
      const oldIndex = prev.findIndex(col => col.id === active.id);
      const newIndex = prev.findIndex(col => col.id === over.id);

      const newArray = [...prev];
      const [removed] = newArray.splice(oldIndex, 1);
      newArray.splice(newIndex, 0, removed);

      return newArray;
    });
  };

  const handleReset = () => {
    // Reset to default state - all columns enabled in original order
    const defaultColumns: TableColumn[] = [
      { id: "company", name: "Company", enabled: true, editable: false },
      { id: "contacts", name: "Contacts", enabled: true, editable: true },
      { id: "status", name: "Status", enabled: true, editable: true },
      { id: "lastActivity", name: "Last Activity", enabled: true, editable: true },
      { id: "signals", name: "Signals", enabled: true, editable: true },
      { id: "tags", name: "Tags", enabled: true, editable: true },
      { id: "industry", name: "Industry", enabled: false, editable: true },
      { id: "leaseExpiration", name: "Lease Expiration", enabled: false, editable: true },
      { id: "address", name: "Address", enabled: false, editable: true },
      { id: "description", name: "Description", enabled: false, editable: true },
      { id: "employees", name: "# of Employees", enabled: false, editable: true },
      { id: "revenue", name: "Revenue", enabled: false, editable: true },
      { id: "website", name: "Website", enabled: false, editable: true },
      { id: "companyType", name: "Company Type", enabled: false, editable: true },
    ];
    setLocalColumns(defaultColumns);
  };

  const handleApply = () => {
    onColumnsChange(localColumns);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-[496px] p-0 bg-[#F8FAFC] flex flex-col h-full"
      >
        {/* Header */}
        <SheetHeader className="bg-white border-b border-[#DFE7EF] px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-[17.5px] font-semibold text-[#0F172A] leading-[26.25px]">
              Companies Table Settings
            </SheetTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="w-[34px] h-[32px] p-0 border border-[#64748B] rounded-[6px] hover:bg-gray-50"
            >
              <X className="w-3.5 h-3.5 text-[#64748B]" />
            </Button>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 px-6 py-8 overflow-y-auto">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div className="text-sm font-semibold text-[#0F172A]">Columns</div>
              <div className="text-sm font-normal text-[#64748B]">Drag to reorder</div>
            </div>

            <div className="bg-white border border-[#E2E8F0] rounded-[6px] p-[3.5px]">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={localColumns.map(col => col.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-[2px]">
                    {localColumns.map((column) => (
                      <SortableColumnItem
                        key={column.id}
                        column={column}
                        onToggle={handleToggleColumn}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  <DragOverlayItem column={activeColumn} />
                </DragOverlay>
              </DndContext>
            </div>
          </div>
        </div>

        {/* Footer */}
        <SheetFooter className="bg-white border-t border-[#DFE1E6] px-6 py-4 flex-shrink-0">
          <div className="flex justify-end items-center gap-4 w-full">
            <Button
              variant="outline"
              onClick={handleReset}
              className="px-[17.5px] py-[10.5px] border border-[#026BB6] text-[#026BB6] text-sm font-bold rounded-[6px] hover:bg-[#026BB6]/5"
            >
              Reset to default
            </Button>
            <Button
              onClick={handleApply}
              className="px-[17.5px] py-[10.5px] bg-[#026BB6] text-white text-sm font-bold rounded-[6px] hover:bg-[#026BB6]/90 border border-[#026BB6]"
            >
              Apply
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};