import { useState, useEffect } from "react";
import { X, GripVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sidebar } from 'primereact/sidebar';
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

interface PipelineColumn {
  id: string; // Unique identifier for drag operations
  title: string;
  enabled: boolean;
  editable: boolean; // Controls if column can be edited
  deletable?: boolean; // Controls if column can be deleted (optional, defaults to editable)
}

interface TableSettingsSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: PipelineColumn[];
  onColumnsChange: (columns: PipelineColumn[]) => void;
  onEditColumn: (oldTitle: string, newTitle: string) => void;
  onDeleteColumn: (title: string) => void;
}

const SortableColumnItem = ({ 
  column, 
  onToggle,
  onEdit,
  onDelete,
  isDragging = false 
}: { 
  column: PipelineColumn; 
  onToggle: (title: string) => void;
  onEdit: (title: string) => void;
  onDelete: (title: string) => void;
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
        onCheckedChange={() => onToggle(column.title)}
        disabled={!column.editable}
        className="w-[17.5px] h-[17.5px] border border-border-color data-[state=checked]:bg-[#006BB6] data-[state=checked]:border-[#006BB6]"
      />
      <div className="flex-1">
        <div className="text-sm font-normal text-[#334155]">
          {column.title.startsWith('temp_column_') ? 'title' : column.title}
        </div>
      </div>
      
      {/* Action buttons */}
      {column.editable && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(column.title)}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <Edit className="w-3 h-3 text-[#64748B]" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(column.title)}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <Trash2 className="w-3 h-3 text-[#64748B]" />
          </Button>
        </div>
      )}
      
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

const DragOverlayItem = ({ column }: { column: PipelineColumn | null }) => {
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
          {column.title.startsWith('temp_column_') ? 'title' : column.title}
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
  onEditColumn,
  onDeleteColumn,
}: TableSettingsSidebarProps) => {
  const [localColumns, setLocalColumns] = useState<PipelineColumn[]>(columns);
  const [activeColumn, setActiveColumn] = useState<PipelineColumn | null>(null);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [pendingEdits, setPendingEdits] = useState<{oldTitle: string, newTitle: string}[]>([]);
  const [pendingDeletes, setPendingDeletes] = useState<string[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    setLocalColumns(columns);
    setPendingEdits([]);
    setPendingDeletes([]);
  }, [columns]);

  const handleToggleColumn = (columnTitle: string) => {
    setLocalColumns(prev => 
      prev.map(col => 
        col.title === columnTitle 
          ? { ...col, enabled: !col.enabled }
          : col
      )
    );
  };

  const handleEditStart = (columnTitle: string) => {
    setEditingColumn(columnTitle);
    // For temporary columns, start with empty string so user can type a proper name
    setEditingName(columnTitle.startsWith('temp_column_') ? '' : columnTitle);
  };

  const handleEditSave = () => {
    if (editingColumn && editingName.trim() && editingName !== editingColumn) {
      // Track the edit for later application
      setPendingEdits(prev => [...prev, { oldTitle: editingColumn, newTitle: editingName.trim() }]);
      
      // Update local state for immediate visual feedback
      setLocalColumns(prev => 
        prev.map(col => 
          col.title === editingColumn 
            ? { ...col, title: editingName.trim() }
            : col
        )
      );
    }
    setEditingColumn(null);
    setEditingName("");
  };

  const handleEditCancel = () => {
    setEditingColumn(null);
    setEditingName("");
  };

  const handleDelete = (columnTitle: string) => {
    // Track the deletion for later application
    setPendingDeletes(prev => [...prev, columnTitle]);
    
    // Update local state for immediate visual feedback
    setLocalColumns(prev => prev.filter(col => col.title !== columnTitle));
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

      // Add error handling for invalid indices
      if (oldIndex === -1 || newIndex === -1) {
        console.warn('Drag operation failed: column not found', { activeId: active.id, overId: over.id });
        return prev;
      }

      const newArray = [...prev];
      const [removed] = newArray.splice(oldIndex, 1);
      newArray.splice(newIndex, 0, removed);

      return newArray;
    });
  };

  const handleReset = () => {
    // Reset to default state - all columns enabled in original order
    const defaultColumns: PipelineColumn[] = [
      { id: "lead", title: "Lead", enabled: true, editable: true },
      { id: "pitching", title: "Pitching", enabled: true, editable: true },
      { id: "touring", title: "Touring", enabled: true, editable: true },
      { id: "closed", title: "Closed", enabled: true, editable: true },
    ];
    setLocalColumns(defaultColumns);
    setPendingEdits([]);
    setPendingDeletes([]);
  };

  const handleApply = () => {
    // Apply pending edits first
    for (const edit of pendingEdits) {
      onEditColumn(edit.oldTitle, edit.newTitle);
    }
    
    // Apply pending deletions
    for (const deleteTitle of pendingDeletes) {
      onDeleteColumn(deleteTitle);
    }
    
    // Apply all other changes (visibility, reordering, etc.)
    onColumnsChange(localColumns);
    
    // Clear pending changes
    setPendingEdits([]);
    setPendingDeletes([]);
    
    onOpenChange(false);
  };

  const handleCancel = () => {
    // Revert local state to original columns
    setLocalColumns(columns);
    setPendingEdits([]);
    setPendingDeletes([]);
    onOpenChange(false);
  };

  return (
    <Sidebar 
      visible={open}
      onHide={handleCancel}
      position="right"
      style={{ width: '496px' }}
      className="p-0 custom-sidebar"
      header={
        <div style={{ color: '#0F172A', fontSize: '17.5px', fontFamily: 'Inter', fontWeight: 600, lineHeight: '26.25px', wordWrap: 'break-word' }}>
          Table Settings
        </div>
      }
    >
      <div className="h-full flex flex-col" style={{ backgroundColor: '#F8FAFC' }}>
        {/* Content Area */}
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
                      <div key={column.id}>
                        {editingColumn === column.title ? (
                          <div className="flex items-center gap-[7px] px-[10.5px] py-[7px] rounded-[4px] bg-blue-50">
                            <input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              placeholder={editingColumn?.startsWith('temp_column_') ? 'Enter column name' : ''}
                              className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleEditSave();
                                if (e.key === 'Escape') handleEditCancel();
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleEditSave}
                              className="h-6 w-6 p-0 text-green-600 hover:bg-green-100"
                            >
                              ✓
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleEditCancel}
                              className="h-6 w-6 p-0 text-red-600 hover:bg-red-100"
                            >
                              ✕
                            </Button>
                          </div>
                        ) : (
                          <SortableColumnItem
                            column={column}
                            onToggle={handleToggleColumn}
                            onEdit={handleEditStart}
                            onDelete={handleDelete}
                          />
                        )}
                      </div>
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
          <div className="bg-white border-t border-[#DFE1E6] px-6 py-4 flex justify-end items-center gap-4">
            <button 
              onClick={handleApply}
              className="px-[17.5px] py-[10.5px] rounded-[6px] font-bold text-sm"
              style={{
                backgroundColor: '#026BB6',
                color: '#FFFFFF',
                border: '1px solid #026BB6'
              }}
            >
              Apply
            </button>
          </div>
      </div>
    </Sidebar>
  );
};