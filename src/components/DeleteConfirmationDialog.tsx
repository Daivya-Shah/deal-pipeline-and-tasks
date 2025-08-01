import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType: "task" | "column";
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 border-0 shadow-[4px_20px_50px_-12px_rgba(13,13,18,0.12)] max-w-[603px] w-[603px] h-[202px] bg-white rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="flex items-center gap-2">
            <div className="text-[#111827] text-[17.5px] font-bold font-['Inter'] leading-none">
              Are you sure you want to delete {itemName}?
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-[34px] h-8 rounded-md border border-[#64748B] flex items-center justify-center hover:bg-gray-50"
          >
            <X className="w-[14px] h-[14px] text-[#64748B]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <div className="text-[#111827] text-sm font-normal font-['Inter'] leading-[21px]">
            Once deleted, the {itemType}, its due date, assignee and company will no longer be recoverable.
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-white border-t border-[#DFE1E6] flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-[17.5px] py-[10.5px] rounded-md border border-[#026BB6] text-[#026BB6] text-sm font-bold font-['Inter'] hover:bg-[#026BB6]/5"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-[17.5px] py-[10.5px] bg-[#EF4444] border border-[#EF4444] rounded-md text-white text-sm font-bold font-['Inter'] hover:bg-[#EF4444]/90"
          >
            Delete {itemType}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};