import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

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
      <DialogContent className="p-0 border-0 shadow-[4px_20px_50px_-12px_rgba(13,13,18,0.12)] max-w-[603px] w-[603px] h-[202px] bg-white rounded-[8px] overflow-hidden">
        {/* Disable default close button */}
        <div className="[&>button]:hidden">
          {/* Main container matching exact structure */}
          <div className="w-[603px] h-[202px] relative bg-white flex flex-col">
            {/* Header section */}
            <div className="bg-white flex flex-col">
              <div className="flex items-center justify-between pt-6 pl-6 pr-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="text-[#111827] text-[17.5px] font-bold font-['Inter'] leading-none">
                      Are you sure you want to delete {itemName}?
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="w-[34px] h-8 pt-[10.5px] pb-[10.5px] rounded-[6px] border border-[#64748B] flex items-center justify-center hover:bg-gray-50"
                  >
                    <div className="w-[14px] h-[14px] relative overflow-hidden">
                      <div className="w-[11px] h-[11px] left-[1.5px] top-[1.5px] absolute bg-[#64748B]" style={{
                        maskImage: 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 24 24\' fill=\'currentColor\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'M18 6L6 18M6 6l12 12\'/%3e%3c/svg%3e")',
                        maskRepeat: 'no-repeat',
                        maskPosition: 'center'
                      }} />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Body section */}
            <div className="flex-1 px-6 py-6 flex flex-col justify-start items-center gap-6">
              <div className="w-full text-[#111827] text-sm font-normal font-['Inter'] leading-[21px]">
                Once deleted, the {itemType}, its due date, assignee and company will no longer be recoverable.
              </div>
            </div>

            {/* Footer section */}
            <div className="w-[603px] px-6 pt-4 pb-4 absolute left-0 top-[130px] bg-white border-t border-[#DFE1E6] flex items-center justify-end gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-[17.5px] py-[10.5px] rounded-[6px] border border-[#026BB6] text-[#026BB6] text-sm font-bold font-['Inter'] hover:bg-[#026BB6]/5 flex items-center justify-center gap-[7px]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-[17.5px] py-[10.5px] bg-[#EF4444] border border-[#EF4444] rounded-[6px] text-white text-sm font-bold font-['Inter'] hover:bg-[#EF4444]/90 flex items-center justify-center gap-[7px]"
              >
                Delete {itemType}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};