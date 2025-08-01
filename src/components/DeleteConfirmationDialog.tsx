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
    <Dialog open={isOpen}>
      <DialogContent className="p-0 border-0 shadow-[4px_20px_50px_-12px_rgba(13,13,18,0.12)] max-w-[603px] w-[603px] h-[202px] bg-white rounded-[8px] overflow-hidden [&>button]:hidden">
          {/* Main container matching exact structure */}
          <div className="w-[603px] h-[202px] relative bg-white flex flex-col">
            {/* Header section */}
            <div className="bg-white flex flex-col">
              <div className="flex items-center justify-between pt-6 pl-6 pr-6">
                <div className="flex items-center gap-2">
                  <div className="text-[#111827] text-[17.5px] font-bold font-['Inter'] leading-none">
                    Are you sure you want to delete {itemName}?
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="w-[34px] h-8 pt-[10.5px] pb-[10.5px] rounded-[6px] border border-[#64748B] flex items-center justify-center hover:bg-gray-50"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.0118 7.00933L12.27 2.75116C12.341 2.68501 12.3979 2.60524 12.4374 2.51661C12.4769 2.42798 12.4981 2.3323 12.4998 2.23529C12.5015 2.13827 12.4837 2.0419 12.4474 1.95194C12.411 1.86197 12.3569 1.78024 12.2883 1.71163C12.2197 1.64302 12.138 1.58893 12.048 1.55259C11.958 1.51625 11.8617 1.4984 11.7647 1.50011C11.6676 1.50182 11.572 1.52306 11.4833 1.56255C11.3947 1.60204 11.3149 1.65898 11.2488 1.72997L6.99061 5.98814L2.73244 1.72997C2.59547 1.60234 2.41431 1.53286 2.22712 1.53616C2.03993 1.53946 1.86134 1.61529 1.72895 1.74767C1.59657 1.88006 1.52074 2.05865 1.51744 2.24584C1.51414 2.43303 1.58362 2.61419 1.71125 2.75116L5.96942 7.00933L1.71125 11.2675C1.57594 11.403 1.49994 11.5866 1.49994 11.7781C1.49994 11.9696 1.57594 12.1532 1.71125 12.2887C1.84672 12.424 2.03037 12.5 2.22184 12.5C2.41332 12.5 2.59696 12.424 2.73244 12.2887L6.99061 8.03052L11.2488 12.2887C11.3843 12.424 11.5679 12.5 11.7594 12.5C11.9509 12.5 12.1345 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.0118 7.00933Z" fill="#64748B"/>
                    </svg>
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
      </DialogContent>
    </Dialog>
  );
};