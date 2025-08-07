import { MoreHorizontal, Clock, X, User, Calendar, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { TableSettingsSidebar } from "./TableSettingsSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  closestCorners,
  UniqueIdentifier,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Sidebar } from 'primereact/sidebar';

interface DealCard {
  id: string;
  title: string;
  value?: string;
  squareFootage?: string;
  category: string;
  description?: string;
  contact: {
    name: string;
    timestamp: string;
  };
  activity: {
    task: string;
    dueDate: string;
  };
  isAngled?: boolean;
}

interface PipelineColumn {
  id: string; // Unique identifier for drag operations
  title: string;
  count: number;
  totalValue: string;
  totalSquareFootage: string;
  deals: DealCard[];
  enabled: boolean;
  editable: boolean;
  deletable?: boolean; // Controls if column can be deleted (optional, defaults to editable)
}

const Badge = ({ variant, children }: { variant: 'success' | 'info' | 'default', children: React.ReactNode }) => {
  const variants = {
    success: 'bg-badge-success-bg text-badge-success-text',
    info: 'bg-badge-info-bg text-badge-info-text',
    default: 'bg-[#F5F5F5] text-[#424242]'
  };
  
  return (
    <div className={`px-[5.6px] py-[3.5px] rounded-[6px] text-[10.5px] font-semibold leading-[15.75px] ${variants[variant]}`}>
      {children}
    </div>
  );
};

const TaskDrawer = ({ children, columnTitle, onAddCard }: { 
  children: React.ReactNode, 
  columnTitle: string,
  onAddCard: (columnTitle: string, cardData: Partial<DealCard>) => void 
}) => {
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    squareFootage: '',
    category: '',
    contactName: '',
    activityTask: '',
    dueDate: '',
    description: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString('en-US', options);
  };

  // Check if all required fields are filled
  const isFormValid = formData.title && formData.category && formData.contactName && formData.activityTask && formData.dueDate;

  const handleSave = () => {
    if (!formData.title || !formData.category || !formData.contactName || !formData.activityTask || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    const cardData = {
      title: formData.title,
      value: formData.value || undefined,
      squareFootage: formData.squareFootage || undefined,
      category: formData.category,
      description: formData.description || undefined,
      contact: {
        name: formData.contactName,
        timestamp: "just now"
      },
      activity: {
        task: formData.activityTask,
        dueDate: formData.dueDate
      }
    };

    onAddCard(columnTitle, cardData);
    setVisible(false);
    // Reset form
    setFormData({
      title: '',
      value: '',
      squareFootage: '',
      category: '',
      contactName: '',
      activityTask: '',
      dueDate: '',
      description: ''
    });
  };

    return (
    <>
      <div onClick={() => setVisible(true)}>
        {children}
      </div>
      <Sidebar 
        visible={visible}
        onHide={() => setVisible(false)}
        position="right"
        style={{ width: '481px' }}
        className="p-0 custom-sidebar"
        header={
          <div style={{ color: '#0F172A', fontSize: '20px', fontFamily: 'Inter', fontWeight: 600, lineHeight: '25px', wordWrap: 'break-word' }}>
            Add Deal
          </div>
        }
      >
        <div className="h-full flex flex-col">
          {/* Content Area */}
          <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
            {/* Deal Title */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Deal Title *</label>
              <input 
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter deal title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          {/* Value and Square Footage */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Value</label>
              <input 
                value={formData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                placeholder="e.g., $500k"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Square Footage</label>
              <input 
                value={formData.squareFootage}
                onChange={(e) => handleInputChange('squareFootage', e.target.value)}
                placeholder="e.g., 2,500 sqft"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category */}
                      <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
              <input 
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="e.g., Commercial, Residential, Industrial"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

          {/* Contact Information */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Name *</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                value={formData.contactName}
                onChange={(e) => handleInputChange('contactName', e.target.value)}
                placeholder="Enter contact name"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Activity Task */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Activity Task *</label>
            <input 
              value={formData.activityTask}
              onChange={(e) => handleInputChange('activityTask', e.target.value)}
              placeholder="e.g., Follow up call, Send proposal"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Due Date */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date *</label>
            <div className="relative">
              <input 
                id="due-date-display"
                value={formatDateForDisplay(formData.dueDate)}
                readOnly
                placeholder="Select date"
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                onClick={() => {
                  const input = document.getElementById('due-date-hidden') as HTMLInputElement;
                  if (input) {
                    input.focus();
                    input.showPicker?.();
                  }
                }}
              />
              <input 
                id="due-date-hidden"
                value={formData.dueDate}
                onChange={(e) => handleInputChange('dueDate', e.target.value)}
                type="date"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 w-4 h-4"
                style={{ pointerEvents: 'none' }}
              />
              <Calendar 
                size={16} 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer z-10" 
                onClick={() => {
                  const input = document.getElementById('due-date-hidden') as HTMLInputElement;
                  if (input) {
                    input.focus();
                    input.showPicker?.();
                  }
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter deal description or notes..."
              maxLength={120}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="text-right text-xs text-gray-500 mt-1">{formData.description.length}/120</div>
          </div>
        </div>
          
        {/* Footer - Action Buttons */}
          <div className="bg-white border-t border-gray-200 p-6 flex justify-end gap-4">
            <button 
              onClick={() => setVisible(false)}
              className="px-4 py-2 border rounded-md font-semibold"
              style={{ borderColor: '#7AC8FF', color: '#006BB6' }}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-4 py-2 rounded-md font-semibold"
              style={{
                backgroundColor: isFormValid ? '#006BB6' : '#F1F5F9',
                color: isFormValid ? '#FFFFFF' : '#475569',
                border: isFormValid ? '1px solid #006BB6' : '1px solid #F1F5F9'
              }}
            >
              Save
            </button>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

const EditTaskDrawer = ({ card, visible, onHide, onUpdateCard }: { 
  card: DealCard | null,
  visible: boolean,
  onHide: () => void,
  onUpdateCard: (cardId: string, cardData: Partial<DealCard>) => void 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    squareFootage: '',
    category: '',
    contactName: '',
    activityTask: '',
    dueDate: '',
    description: ''
  });

  // Pre-populate form when card changes
  useEffect(() => {
    if (card) {
      setFormData({
        title: card.title || '',
        value: card.value || '',
        squareFootage: card.squareFootage || '',
        category: card.category || '',
        contactName: card.contact?.name || '',
        activityTask: card.activity?.task || '',
        dueDate: card.activity?.dueDate || '',
        description: card.description || ''
      });
    }
  }, [card]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString('en-US', options);
  };

  // Check if all required fields are filled
  const isFormValid = formData.title && formData.category && formData.contactName && formData.activityTask && formData.dueDate;

  const handleSave = () => {
    if (!formData.title || !formData.category || !formData.contactName || !formData.activityTask || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (!card) return;

    const cardData = {
      title: formData.title,
      value: formData.value || undefined,
      squareFootage: formData.squareFootage || undefined,
      category: formData.category,
      description: formData.description || undefined,
      contact: {
        name: formData.contactName,
        timestamp: card.contact.timestamp // Keep original timestamp
      },
      activity: {
        task: formData.activityTask,
        dueDate: formData.dueDate
      }
    };

    onUpdateCard(card.id, cardData);
    onHide();
  };

  const handleCancel = () => {
    onHide();
    // Reset form to original card data
    if (card) {
      setFormData({
        title: card.title || '',
        value: card.value || '',
        squareFootage: card.squareFootage || '',
        category: card.category || '',
        contactName: card.contact?.name || '',
        activityTask: card.activity?.task || '',
        dueDate: card.activity?.dueDate || '',
        description: card.description || ''
      });
    }
  };

  return (
    <Sidebar 
      visible={visible}
      onHide={handleCancel}
      position="right"
      style={{ width: '481px' }}
      className="p-0 custom-sidebar"
      header={
        <div style={{ color: '#0F172A', fontSize: '20px', fontFamily: 'Inter', fontWeight: 600, lineHeight: '25px', wordWrap: 'break-word' }}>
          Edit Deal
        </div>
      }
    >
      <div className="h-full flex flex-col">
        {/* Content Area */}
        <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
          {/* Deal Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Deal Title *</label>
            <input 
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter deal title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        {/* Value and Square Footage */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Value</label>
            <input 
              value={formData.value}
              onChange={(e) => handleInputChange('value', e.target.value)}
              placeholder="e.g., $500k"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Square Footage</label>
            <input 
              value={formData.squareFootage}
              onChange={(e) => handleInputChange('squareFootage', e.target.value)}
              placeholder="e.g., 2,500 sqft"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
          <input 
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            placeholder="e.g., Commercial, Residential, Industrial"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contact Information */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Name *</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              value={formData.contactName}
              onChange={(e) => handleInputChange('contactName', e.target.value)}
              placeholder="Enter contact name"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Activity Task */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Activity Task *</label>
          <input 
            value={formData.activityTask}
            onChange={(e) => handleInputChange('activityTask', e.target.value)}
            placeholder="e.g., Follow up call, Send proposal"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Due Date */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date *</label>
          <div className="relative">
            <input 
              id="edit-due-date-display"
              value={formatDateForDisplay(formData.dueDate)}
              readOnly
              placeholder="Select date"
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              onClick={() => {
                const input = document.getElementById('edit-due-date-hidden') as HTMLInputElement;
                if (input) {
                  input.focus();
                  input.showPicker?.();
                }
              }}
            />
            <input 
              id="edit-due-date-hidden"
              value={formData.dueDate}
              onChange={(e) => handleInputChange('dueDate', e.target.value)}
              type="date"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-0 w-4 h-4"
              style={{ pointerEvents: 'none' }}
            />
            <Calendar 
              size={16} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer z-10" 
              onClick={() => {
                const input = document.getElementById('edit-due-date-hidden') as HTMLInputElement;
                if (input) {
                  input.focus();
                  input.showPicker?.();
                }
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea 
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Enter deal description or notes..."
            maxLength={120}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <div className="text-right text-xs text-gray-500 mt-1">{formData.description.length}/120</div>
        </div>
      </div>
        
      {/* Footer - Action Buttons */}
        <div className="bg-white border-t border-gray-200 p-6 flex justify-end gap-4">
          <button 
            onClick={handleCancel}
            className="px-4 py-2 border rounded-md font-semibold"
            style={{ borderColor: '#7AC8FF', color: '#006BB6' }}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 rounded-md font-semibold"
            style={{
              backgroundColor: isFormValid ? '#006BB6' : '#F1F5F9',
              color: isFormValid ? '#FFFFFF' : '#475569',
              border: isFormValid ? '1px solid #006BB6' : '1px solid #F1F5F9'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </Sidebar>
  );
};

const DropIndicator = ({ width = '270px', height = '140px' }: { width?: string, height?: string }) => {
  return (
    <div 
      className="transition-all duration-200 ease-in-out"
      style={{ 
        width: width, 
        height: height,
        margin: '16px 0' // Same gap as between cards
      }}
    >
      <div 
        className="w-full h-full rounded-[8px] border-2 border-dashed border-blue-500 bg-blue-50 flex items-center justify-center relative overflow-hidden"
        style={{
          boxShadow: '0px 2px 8px rgba(59, 130, 246, 0.15)',
        }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 opacity-50 animate-pulse"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-blue-600">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="mb-2 opacity-70"
          >
            <path 
              d="M12 5V19M5 12H19" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm font-medium opacity-70">Drop here</span>
        </div>
        
        {/* Subtle animation border */}
        <div className="absolute inset-0 rounded-[8px] border-2 border-blue-400 opacity-30 animate-ping"></div>
      </div>
    </div>
  );
};

const DealCardComponent = ({ deal, onCardClick, showIcons, onEditCard, onDeleteCard }: { 
  deal: DealCard, 
  onCardClick?: (id: string) => void, 
  showIcons?: boolean,
  onEditCard: (cardId: string) => void,
  onDeleteCard: (cardId: string) => void
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: deal.id,
    disabled: false,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Calculate position for angled card to appear above everything
  const getFixedPosition = () => {
    if (!cardRef.current) return { top: 0, left: 0 };
    const rect = cardRef.current.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
    };
  };

  // Render shadow placeholder when card is angled
  if (deal.isAngled) {
    const fixedPos = getFixedPosition();
    const cardHeight = cardRef.current ? cardRef.current.offsetHeight : 'auto';
    
    return (
      <div 
        ref={cardRef}
        style={{
          width: '270px',
          position: 'relative',
        }}
      >
        {/* Shadow placeholder - takes up space in layout */}
        <div 
          style={{
            width: '270px',
            height: cardHeight,
            borderRadius: '8px',
          }}
          className="bg-surface-200"
        ></div>
        
        {/* Actual tilted card - fixed positioned to appear above everything */}
        <div 
          ref={setNodeRef}
          style={{
            width: '270px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
            outline: '1px #DFE7EF solid',
            outlineOffset: '-1px',
            transform: isDragging ? `${CSS.Translate.toString(transform)} rotate(8deg)` : 'rotate(8deg)',
            transformOrigin: 'top left',
            opacity: isDragging ? 0 : 1,
            cursor: 'grab',
            zIndex: 9999,
            position: 'fixed',
            top: `${fixedPos.top}px`,
            left: `${fixedPos.left}px`,
          }}
          className="p-4 bg-white rounded-[8px] flex flex-col gap-3"
          data-card-id={deal.id}
          onClick={() => onCardClick?.(deal.id)}
          {...listeners}
          {...attributes}
        >
        <div className="flex items-center gap-2">
            <div className="flex-1 text-[14px] font-semibold text-[#111827]">{deal.title}</div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                                  <button className="cursor-pointer focus:outline-none focus:ring-0 border-0 rounded p-1" onClick={(e) => e.stopPropagation()}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_13948_4497_card1)">
                      <path fillRule="evenodd" clipRule="evenodd" d="M6.00017 2.4C6.66291 2.4 7.20017 1.86274 7.20017 1.2C7.20017 0.537258 6.66291 0 6.00017 0C5.33743 0 4.80017 0.537258 4.80017 1.2C4.80017 1.86274 5.33743 2.4 6.00017 2.4ZM6.00017 7.20001C6.66291 7.20001 7.20017 6.66275 7.20017 6.00001C7.20017 5.33726 6.66291 4.80001 6.00017 4.80001C5.33743 4.80001 4.80017 5.33726 4.80017 6.00001C4.80017 6.66275 5.33743 7.20001 6.00017 7.20001ZM7.20017 10.8C7.20017 11.4628 6.66291 12 6.00017 12C5.33743 12 4.80017 11.4628 4.80017 10.8C4.80017 10.1373 5.33743 9.60001 6.00017 9.60001C6.66291 9.60001 7.20017 10.1373 7.20017 10.8Z" fill="#111827"/>
                    </g>
                    <defs>
                      <clipPath id="clip0_13948_4497_card1">
                        <rect width="12" height="12" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-auto min-w-0 py-1">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEditCard(deal.id); }} className="px-2 py-1 text-xs">
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => { e.stopPropagation(); onDeleteCard(deal.id); }}
                  className="text-red-600 px-2 py-1 text-xs"
                >
                  <Trash2 className="mr-2 h-3 w-3" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2">
            {deal.value && <Badge variant="success">{deal.value}</Badge>}
            {deal.squareFootage && <Badge variant="info">{deal.squareFootage}</Badge>}
          <Badge variant="default">{deal.category}</Badge>
        </div>
        
        {/* Description Field - only show when icons are enabled */}
        {showIcons && deal.description && (
          <div className="text-xs text-gray-800 leading-relaxed">
            {deal.description}
          </div>
        )}
        
        <div className="flex flex-col">
            <div 
              className="p-2 bg-white rounded-[6px] flex items-center justify-between"
              style={{
                outline: '1px #DFE7EF solid',
                outlineOffset: '-1px'
              }}
            >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#9CA3AF] rounded-full"></div>
              <div className="text-[10.5px] text-[#111827] leading-[15.75px]">{deal.contact.name}</div>
            </div>
            <div className="text-[10.5px] text-[#6B7280] leading-[15.75px]">{deal.contact.timestamp}</div>
          </div>
            <div className="pt-3 pb-2 px-2 bg-[#F9FAFB] rounded-b-[6px] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-[#9CA3AF]" />
              <div className="text-[10.5px] text-[#111827] leading-[15.75px]">{deal.activity.task}</div>
            </div>
            <div className="text-[10.5px] text-[#6B7280] leading-[15.75px]">{deal.activity.dueDate}</div>
          </div>
        </div>
        
          {showIcons && (
          <div className="pt-2 px-6 relative flex items-center justify-between">
            {/* Phone Icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_13917_2673)">
                <path d="M13.892 16H13.6816C11.3111 15.7421 9.03368 14.9339 7.03092 13.6398C5.17036 12.4548 3.59067 10.8782 2.40199 9.02001C1.10493 7.012 0.296577 4.72793 0.0417846 2.35106C0.0126508 2.06756 0.0414149 1.78109 0.126332 1.50904C0.211249 1.23699 0.350549 0.985029 0.535781 0.768439C0.715941 0.548949 0.938315 0.367844 1.18973 0.235849C1.44115 0.103855 1.7165 0.0236552 1.99947 0H4.37798C4.89312 0.000519712 5.39109 0.185219 5.78198 0.520744C6.17287 0.85627 6.4309 1.32051 6.50948 1.82962C6.59634 2.48359 6.75905 3.12523 6.99433 3.74157C7.13744 4.12888 7.16698 4.54901 7.07947 4.95253C6.99195 5.35606 6.79103 5.72621 6.50033 6.01944L5.9423 6.57747C6.8209 7.96451 7.99944 9.1368 9.39113 10.008L9.94916 9.45912C10.2424 9.16842 10.6125 8.9675 11.0161 8.87998C11.4196 8.79247 11.8397 8.82201 12.227 8.96512C12.844 9.19825 13.4854 9.3609 14.139 9.44997C14.6568 9.52781 15.1284 9.79195 15.4653 10.1928C15.8021 10.5937 15.9811 11.1037 15.9686 11.6272V13.8228C15.9686 14.3938 15.7424 14.9415 15.3395 15.3461C14.9366 15.7508 14.3898 15.9793 13.8188 15.9817L13.892 16ZM4.37798 1.36306H2.19158C2.08423 1.37016 1.97943 1.39895 1.88352 1.4477C1.7876 1.49644 1.70257 1.56412 1.63355 1.64666C1.56638 1.72397 1.51554 1.81407 1.4841 1.91155C1.45266 2.00902 1.44126 2.11184 1.45059 2.21384C1.67242 4.36983 2.39615 6.44391 3.5638 8.26987C4.6402 9.95923 6.07341 11.3924 7.76277 12.4688C9.58987 13.6488 11.6662 14.3879 13.8279 14.6278C13.9404 14.6341 14.0529 14.6171 14.1584 14.5777C14.2639 14.5383 14.3601 14.4775 14.4409 14.3991C14.5865 14.2497 14.6685 14.0497 14.6696 13.8411V11.6547C14.6737 11.4621 14.6071 11.2748 14.4823 11.1281C14.3575 10.9814 14.1833 10.8856 13.9926 10.8588C13.2368 10.7572 12.4945 10.5731 11.7788 10.3099C11.6378 10.2572 11.4847 10.2455 11.3374 10.2763C11.19 10.3071 11.0544 10.379 10.9463 10.4837L10.0315 11.3985C9.92435 11.503 9.78636 11.5701 9.63802 11.5899C9.48969 11.6096 9.33894 11.581 9.20816 11.5083C7.25613 10.4052 5.64038 8.79264 4.53349 6.84277C4.45773 6.71284 4.42739 6.56138 4.44727 6.41229C4.46715 6.2632 4.53611 6.12498 4.64327 6.01944L5.55808 5.10463C5.66299 4.99854 5.73516 4.8645 5.76598 4.71851C5.7968 4.57252 5.78497 4.42075 5.73189 4.2813C5.46769 3.56591 5.2836 2.82343 5.18301 2.06747C5.16031 1.87103 5.0653 1.69007 4.91648 1.55985C4.76766 1.42964 4.57569 1.35948 4.37798 1.36306Z" fill="#111827"/>
              </g>
              <defs>
                <clipPath id="clip0_13917_2673">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            
            {/* Envelope Icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_13917_2675)">
                <path d="M14.4 0.914062H1.6C1.17639 0.916463 0.770821 1.0858 0.471281 1.38534C0.171742 1.68488 0.00240009 2.09046 0 2.51406V13.4855C0.00240009 13.9091 0.171742 14.3147 0.471281 14.6142C0.770821 14.9137 1.17639 15.0831 1.6 15.0855H14.4C14.8236 15.0831 15.2292 14.9137 15.5287 14.6142C15.8283 14.3147 15.9976 13.9091 16 13.4855V2.51406C15.9976 2.09046 15.8283 1.68488 15.5287 1.38534C15.2292 1.0858 14.8236 0.916463 14.4 0.914062ZM1.6 2.28549H14.4C14.4606 2.28549 14.5188 2.30957 14.5616 2.35244C14.6045 2.3953 14.6286 2.45344 14.6286 2.51406V3.92206L8 7.23178L1.37143 3.92206V2.51406C1.37143 2.45344 1.39551 2.3953 1.43838 2.35244C1.48124 2.30957 1.53938 2.28549 1.6 2.28549ZM14.4 13.7141H1.6C1.53938 13.7141 1.48124 13.69 1.43838 13.6471C1.39551 13.6042 1.37143 13.5461 1.37143 13.4855V5.44892L7.68914 8.61235C7.78566 8.66062 7.89209 8.68576 8 8.68576C8.10791 8.68576 8.21434 8.66062 8.31086 8.61235L14.6286 5.44892V13.4855C14.6286 13.5461 14.6045 13.6042 14.5616 13.6471C14.5188 13.69 14.4606 13.7141 14.4 13.7141Z" fill="#111827"/>
              </g>
              <defs>
                <clipPath id="clip0_13917_2675">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            
            {/* Notes Icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.0809 5.25714L8.93129 0.201143C8.80043 0.0725098 8.62291 0.000160048 8.43774 0H4.2752C3.59602 0 2.94466 0.264897 2.46441 0.736417C1.98416 1.20794 1.71436 1.84746 1.71436 2.51429V13.4857C1.71436 14.1525 1.98416 14.7921 2.46441 15.2636C2.94466 15.7351 3.59602 16 4.2752 16H11.7249C12.4041 16 13.0555 15.7351 13.5357 15.2636C14.016 14.7921 14.2858 14.1525 14.2858 13.4857V5.71429C14.2785 5.54204 14.2053 5.37882 14.0809 5.25714ZM9.16409 2.34057L11.9019 5.02857H9.16409V2.34057ZM11.7249 14.6286H4.2752C3.96648 14.6286 3.67041 14.5082 3.45211 14.2938C3.23382 14.0795 3.11118 13.7888 3.11118 13.4857V2.51429C3.11118 2.21118 3.23382 1.92049 3.45211 1.70616C3.67041 1.49184 3.96648 1.37143 4.2752 1.37143H7.76727V5.71429C7.76968 5.89541 7.84403 6.06845 7.97449 6.19654C8.10495 6.32463 8.2812 6.39763 8.46568 6.4H12.889V13.4857C12.889 13.7888 12.7663 14.0795 12.548 14.2938C12.3297 14.5082 12.0337 14.6286 11.7249 14.6286Z" fill="#111827"/>
              <path d="M5.14282 9.14258H10.8571" stroke="black" strokeLinecap="round"/>
              <path d="M5.14282 11.4287H10.8571" stroke="black" strokeLinecap="round"/>
            </svg>
            
            <div className="absolute right-0 top-1.5 w-1 h-1 bg-[#026BB6] rounded-full"></div>
          </div>
        )}
        </div>
      </div>
    );
  }
  

  
  return (
    <div 
      ref={(node) => {
        setNodeRef(node);
        if (cardRef.current === null) {
          cardRef.current = node;
        }
      }}
      style={{
        width: '270px',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
        outline: '1px #DFE7EF solid',
        outlineOffset: '-1px',
        transform: isDragging ? CSS.Translate.toString(transform) : (deal.isAngled ? 'rotate(8deg)' : 'none'),
        transformOrigin: 'top left',
        opacity: isDragging ? 0 : 1,
        cursor: 'grab',
      }}
      className="p-4 bg-white rounded-[8px] flex flex-col gap-3"
      data-card-id={deal.id}
      onClick={() => onCardClick?.(deal.id)}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-center gap-2">
        <div className="flex-1 text-[14px] font-semibold text-[#111827]">{deal.title}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
                              <button className="cursor-pointer focus:outline-none focus:ring-0 border-0 rounded p-1" onClick={(e) => e.stopPropagation()}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_13948_4497_card2)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M6.00017 2.4C6.66291 2.4 7.20017 1.86274 7.20017 1.2C7.20017 0.537258 6.66291 0 6.00017 0C5.33743 0 4.80017 0.537258 4.80017 1.2C4.80017 1.86274 5.33743 2.4 6.00017 2.4ZM6.00017 7.20001C6.66291 7.20001 7.20017 6.66275 7.20017 6.00001C7.20017 5.33726 6.66291 4.80001 6.00017 4.80001C5.33743 4.80001 4.80017 5.33726 4.80017 6.00001C4.80017 6.66275 5.33743 7.20001 6.00017 7.20001ZM7.20017 10.8C7.20017 11.4628 6.66291 12 6.00017 12C5.33743 12 4.80017 11.4628 4.80017 10.8C4.80017 10.1373 5.33743 9.60001 6.00017 9.60001C6.66291 9.60001 7.20017 10.1373 7.20017 10.8Z" fill="#111827"/>
                </g>
                <defs>
                  <clipPath id="clip0_13948_4497_card2">
                    <rect width="12" height="12" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto min-w-0 py-1">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEditCard(deal.id); }} className="px-2 py-1 text-xs">
              <Edit className="mr-2 h-3 w-3" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => { e.stopPropagation(); onDeleteCard(deal.id); }}
              className="text-red-600 px-2 py-1 text-xs"
            >
              <Trash2 className="mr-2 h-3 w-3" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center gap-2">
        {deal.value && <Badge variant="success">{deal.value}</Badge>}
        {deal.squareFootage && <Badge variant="info">{deal.squareFootage}</Badge>}
        <Badge variant="default">{deal.category}</Badge>
      </div>
      
      {/* Description Field - only show when icons are enabled */}
      {showIcons && deal.description && (
        <div className="text-xs text-gray-800 leading-relaxed">
          {deal.description}
        </div>
      )}
      
      <div className="flex flex-col">
        <div 
          className="p-2 bg-white rounded-[6px] flex items-center justify-between"
          style={{
            outline: '1px #DFE7EF solid',
            outlineOffset: '-1px'
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#9CA3AF] rounded-full"></div>
            <div className="text-[10.5px] text-[#111827] leading-[15.75px]">{deal.contact.name}</div>
          </div>
          <div className="text-[10.5px] text-[#6B7280] leading-[15.75px]">{deal.contact.timestamp}</div>
        </div>
        <div className="pt-3 pb-2 px-2 bg-[#F9FAFB] rounded-b-[6px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-[#9CA3AF]" />
            <div className="text-[10.5px] text-[#111827] leading-[15.75px]">{deal.activity.task}</div>
          </div>
          <div className="text-[10.5px] text-[#6B7280] leading-[15.75px]">{deal.activity.dueDate}</div>
        </div>
      </div>
        
      {showIcons && (
          <div className="pt-2 px-6 relative flex items-center justify-between">
          {/* Phone Icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_13917_2673)">
              <path d="M13.892 16H13.6816C11.3111 15.7421 9.03368 14.9339 7.03092 13.6398C5.17036 12.4548 3.59067 10.8782 2.40199 9.02001C1.10493 7.012 0.296577 4.72793 0.0417846 2.35106C0.0126508 2.06756 0.0414149 1.78109 0.126332 1.50904C0.211249 1.23699 0.350549 0.985029 0.535781 0.768439C0.715941 0.548949 0.938315 0.367844 1.18973 0.235849C1.44115 0.103855 1.7165 0.0236552 1.99947 0H4.37798C4.89312 0.000519712 5.39109 0.185219 5.78198 0.520744C6.17287 0.85627 6.4309 1.32051 6.50948 1.82962C6.59634 2.48359 6.75905 3.12523 6.99433 3.74157C7.13744 4.12888 7.16698 4.54901 7.07947 4.95253C6.99195 5.35606 6.79103 5.72621 6.50033 6.01944L5.9423 6.57747C6.8209 7.96451 7.99944 9.1368 9.39113 10.008L9.94916 9.45912C10.2424 9.16842 10.6125 8.9675 11.0161 8.87998C11.4196 8.79247 11.8397 8.82201 12.227 8.96512C12.844 9.19825 13.4854 9.3609 14.139 9.44997C14.6568 9.52781 15.1284 9.79195 15.4653 10.1928C15.8021 10.5937 15.9811 11.1037 15.9686 11.6272V13.8228C15.9686 14.3938 15.7424 14.9415 15.3395 15.3461C14.9366 15.7508 14.3898 15.9793 13.8188 15.9817L13.892 16ZM4.37798 1.36306H2.19158C2.08423 1.37016 1.97943 1.39895 1.88352 1.4477C1.7876 1.49644 1.70257 1.56412 1.63355 1.64666C1.56638 1.72397 1.51554 1.81407 1.4841 1.91155C1.45266 2.00902 1.44126 2.11184 1.45059 2.21384C1.67242 4.36983 2.39615 6.44391 3.5638 8.26987C4.6402 9.95923 6.07341 11.3924 7.76277 12.4688C9.58987 13.6488 11.6662 14.3879 13.8279 14.6278C13.9404 14.6341 14.0529 14.6171 14.1584 14.5777C14.2639 14.5383 14.3601 14.4775 14.4409 14.3991C14.5865 14.2497 14.6685 14.0497 14.6696 13.8411V11.6547C14.6737 11.4621 14.6071 11.2748 14.4823 11.1281C14.3575 10.9814 14.1833 10.8856 13.9926 10.8588C13.2368 10.7572 12.4945 10.5731 11.7788 10.3099C11.6378 10.2572 11.4847 10.2455 11.3374 10.2763C11.19 10.3071 11.0544 10.379 10.9463 10.4837L10.0315 11.3985C9.92435 11.503 9.78636 11.5701 9.63802 11.5899C9.48969 11.6096 9.33894 11.581 9.20816 11.5083C7.25613 10.4052 5.64038 8.79264 4.53349 6.84277C4.45773 6.71284 4.42739 6.56138 4.44727 6.41229C4.46715 6.2632 4.53611 6.12498 4.64327 6.01944L5.55808 5.10463C5.66299 4.99854 5.73516 4.8645 5.76598 4.71851C5.7968 4.57252 5.78497 4.42075 5.73189 4.2813C5.46769 3.56591 5.2836 2.82343 5.18301 2.06747C5.16031 1.87103 5.0653 1.69007 4.91648 1.55985C4.76766 1.42964 4.57569 1.35948 4.37798 1.36306Z" fill="#111827"/>
            </g>
            <defs>
              <clipPath id="clip0_13917_2673">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          
          {/* Envelope Icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_13917_2675)">
              <path d="M14.4 0.914062H1.6C1.17639 0.916463 0.770821 1.0858 0.471281 1.38534C0.171742 1.68488 0.00240009 2.09046 0 2.51406V13.4855C0.00240009 13.9091 0.171742 14.3147 0.471281 14.6142C0.770821 14.9137 1.17639 15.0831 1.6 15.0855H14.4C14.8236 15.0831 15.2292 14.9137 15.5287 14.6142C15.8283 14.3147 15.9976 13.9091 16 13.4855V2.51406C15.9976 2.09046 15.8283 1.68488 15.5287 1.38534C15.2292 1.0858 14.8236 0.916463 14.4 0.914062ZM1.6 2.28549H14.4C14.4606 2.28549 14.5188 2.30957 14.5616 2.35244C14.6045 2.3953 14.6286 2.45344 14.6286 2.51406V3.92206L8 7.23178L1.37143 3.92206V2.51406C1.37143 2.45344 1.39551 2.3953 1.43838 2.35244C1.48124 2.30957 1.53938 2.28549 1.6 2.28549ZM14.4 13.7141H1.6C1.53938 13.7141 1.48124 13.69 1.43838 13.6471C1.39551 13.6042 1.37143 13.5461 1.37143 13.4855V5.44892L7.68914 8.61235C7.78566 8.66062 7.89209 8.68576 8 8.68576C8.10791 8.68576 8.21434 8.66062 8.31086 8.61235L14.6286 5.44892V13.4855C14.6286 13.5461 14.6045 13.6042 14.5616 13.6471C14.5188 13.69 14.4606 13.7141 14.4 13.7141Z" fill="#111827"/>
            </g>
            <defs>
              <clipPath id="clip0_13917_2675">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          
          {/* Notes Icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.0809 5.25714L8.93129 0.201143C8.80043 0.0725098 8.62291 0.000160048 8.43774 0H4.2752C3.59602 0 2.94466 0.264897 2.46441 0.736417C1.98416 1.20794 1.71436 1.84746 1.71436 2.51429V13.4857C1.71436 14.1525 1.98416 14.7921 2.46441 15.2636C2.94466 15.7351 3.59602 16 4.2752 16H11.7249C12.4041 16 13.0555 15.7351 13.5357 15.2636C14.016 14.7921 14.2858 14.1525 14.2858 13.4857V5.71429C14.2785 5.54204 14.2053 5.37882 14.0809 5.25714ZM9.16409 2.34057L11.9019 5.02857H9.16409V2.34057ZM11.7249 14.6286H4.2752C3.96648 14.6286 3.67041 14.5082 3.45211 14.2938C3.23382 14.0795 3.11118 13.7888 3.11118 13.4857V2.51429C3.11118 2.21118 3.23382 1.92049 3.45211 1.70616C3.67041 1.49184 3.96648 1.37143 4.2752 1.37143H7.76727V5.71429C7.76968 5.89541 7.84403 6.06845 7.97449 6.19654C8.10495 6.32463 8.2812 6.39763 8.46568 6.4H12.889V13.4857C12.889 13.7888 12.7663 14.0795 12.548 14.2938C12.3297 14.5082 12.0337 14.6286 11.7249 14.6286Z" fill="#111827"/>
            <path d="M5.14282 9.14258H10.8571" stroke="black" strokeLinecap="round"/>
            <path d="M5.14282 11.4287H10.8571" stroke="black" strokeLinecap="round"/>
          </svg>
            <div className="absolute right-0 top-1.5 w-1 h-1 bg-[#026BB6] rounded-full"></div>
          </div>
        )}
    </div>
  );
};

// Clean card component for drag overlay (no shadow placeholder)
const DragCardComponent = ({ deal, showIcons }: { deal: DealCard, showIcons?: boolean }) => {
  return (
    <div 
      style={{
        width: '270px',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
        outline: '1px #DFE7EF solid',
        outlineOffset: '-1px',
        transform: 'rotate(8deg)',
        transformOrigin: 'top left',
        cursor: 'grab',
        zIndex: 1000,
      }}
      className="p-4 bg-white rounded-[8px] flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <div className="flex-1 text-[14px] font-semibold text-[#111827]">{deal.title}</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="cursor-pointer focus:outline-none focus:ring-0 border-0 rounded p-1" disabled>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_13948_4497_drag)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M6.00017 2.4C6.66291 2.4 7.20017 1.86274 7.20017 1.2C7.20017 0.537258 6.66291 0 6.00017 0C5.33743 0 4.80017 0.537258 4.80017 1.2C4.80017 1.86274 5.33743 2.4 6.00017 2.4ZM6.00017 7.20001C6.66291 7.20001 7.20017 6.66275 7.20017 6.00001C7.20017 5.33726 6.66291 4.80001 6.00017 4.80001C5.33743 4.80001 4.80017 5.33726 4.80017 6.00001C4.80017 6.66275 5.33743 7.20001 6.00017 7.20001ZM7.20017 10.8C7.20017 11.4628 6.66291 12 6.00017 12C5.33743 12 4.80017 11.4628 4.80017 10.8C4.80017 10.1373 5.33743 9.60001 6.00017 9.60001C6.66291 9.60001 7.20017 10.1373 7.20017 10.8Z" fill="#111827"/>
                </g>
                <defs>
                  <clipPath id="clip0_13948_4497_drag">
                    <rect width="12" height="12" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </DropdownMenuTrigger>
          {/* No DropdownMenuContent to avoid any interactions during drag */}
        </DropdownMenu>
        </div>
      
      <div className="flex items-center gap-2">
        {deal.value && <Badge variant="success">{deal.value}</Badge>}
        {deal.squareFootage && <Badge variant="info">{deal.squareFootage}</Badge>}
        <Badge variant="default">{deal.category}</Badge>
      </div>
      
      {/* Description Field - only show when icons are enabled */}
      {showIcons && deal.description && (
        <div className="text-xs text-gray-800 leading-relaxed">
          {deal.description}
        </div>
      )}
      
      <div className="flex flex-col">
        <div 
          className="p-2 bg-white rounded-[6px] flex items-center justify-between"
          style={{
            outline: '1px #DFE7EF solid',
            outlineOffset: '-1px'
          }}
        >
      <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#9CA3AF] rounded-full"></div>
            <div className="text-[10.5px] text-[#111827] leading-[15.75px]">{deal.contact.name}</div>
          </div>
          <div className="text-[10.5px] text-[#6B7280] leading-[15.75px]">{deal.contact.timestamp}</div>
        </div>
        <div className="pt-3 pb-2 px-2 bg-[#F9FAFB] rounded-b-[6px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={12} className="text-[#9CA3AF]" />
            <div className="text-[10.5px] text-[#111827] leading-[15.75px]">{deal.activity.task}</div>
          </div>
          <div className="text-[10.5px] text-[#6B7280] leading-[15.75px]">{deal.activity.dueDate}</div>
        </div>
      </div>
      
      {showIcons && (
        <div className="pt-2 px-6 relative flex items-center justify-between">
          {/* Phone Icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_13917_2673)">
              <path d="M13.892 16H13.6816C11.3111 15.7421 9.03368 14.9339 7.03092 13.6398C5.17036 12.4548 3.59067 10.8782 2.40199 9.02001C1.10493 7.012 0.296577 4.72793 0.0417846 2.35106C0.0126508 2.06756 0.0414149 1.78109 0.126332 1.50904C0.211249 1.23699 0.350549 0.985029 0.535781 0.768439C0.715941 0.548949 0.938315 0.367844 1.18973 0.235849C1.44115 0.103855 1.7165 0.0236552 1.99947 0H4.37798C4.89312 0.000519712 5.39109 0.185219 5.78198 0.520744C6.17287 0.85627 6.4309 1.32051 6.50948 1.82962C6.59634 2.48359 6.75905 3.12523 6.99433 3.74157C7.13744 4.12888 7.16698 4.54901 7.07947 4.95253C6.99195 5.35606 6.79103 5.72621 6.50033 6.01944L5.9423 6.57747C6.8209 7.96451 7.99944 9.1368 9.39113 10.008L9.94916 9.45912C10.2424 9.16842 10.6125 8.9675 11.0161 8.87998C11.4196 8.79247 11.8397 8.82201 12.227 8.96512C12.844 9.19825 13.4854 9.3609 14.139 9.44997C14.6568 9.52781 15.1284 9.79195 15.4653 10.1928C15.8021 10.5937 15.9811 11.1037 15.9686 11.6272V13.8228C15.9686 14.3938 15.7424 14.9415 15.3395 15.3461C14.9366 15.7508 14.3898 15.9793 13.8188 15.9817L13.892 16ZM4.37798 1.36306H2.19158C2.08423 1.37016 1.97943 1.39895 1.88352 1.4477C1.7876 1.49644 1.70257 1.56412 1.63355 1.64666C1.56638 1.72397 1.51554 1.81407 1.4841 1.91155C1.45266 2.00902 1.44126 2.11184 1.45059 2.21384C1.67242 4.36983 2.39615 6.44391 3.5638 8.26987C4.6402 9.95923 6.07341 11.3924 7.76277 12.4688C9.58987 13.6488 11.6662 14.3879 13.8279 14.6278C13.9404 14.6341 14.0529 14.6171 14.1584 14.5777C14.2639 14.5383 14.3601 14.4775 14.4409 14.3991C14.5865 14.2497 14.6685 14.0497 14.6696 13.8411V11.6547C14.6737 11.4621 14.6071 11.2748 14.4823 11.1281C14.3575 10.9814 14.1833 10.8856 13.9926 10.8588C13.2368 10.7572 12.4945 10.5731 11.7788 10.3099C11.6378 10.2572 11.4847 10.2455 11.3374 10.2763C11.19 10.3071 11.0544 10.379 10.9463 10.4837L10.0315 11.3985C9.92435 11.503 9.78636 11.5701 9.63802 11.5899C9.48969 11.6096 9.33894 11.581 9.20816 11.5083C7.25613 10.4052 5.64038 8.79264 4.53349 6.84277C4.45773 6.71284 4.42739 6.56138 4.44727 6.41229C4.46715 6.2632 4.53611 6.12498 4.64327 6.01944L5.55808 5.10463C5.66299 4.99854 5.73516 4.8645 5.76598 4.71851C5.7968 4.57252 5.78497 4.42075 5.73189 4.2813C5.46769 3.56591 5.2836 2.82343 5.18301 2.06747C5.16031 1.87103 5.0653 1.69007 4.91648 1.55985C4.76766 1.42964 4.57569 1.35948 4.37798 1.36306Z" fill="#111827"/>
            </g>
            <defs>
              <clipPath id="clip0_13917_2673">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          
          {/* Envelope Icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_13917_2675)">
              <path d="M14.4 0.914062H1.6C1.17639 0.916463 0.770821 1.0858 0.471281 1.38534C0.171742 1.68488 0.00240009 2.09046 0 2.51406V13.4855C0.00240009 13.9091 0.171742 14.3147 0.471281 14.6142C0.770821 14.9137 1.17639 15.0831 1.6 15.0855H14.4C14.8236 15.0831 15.2292 14.9137 15.5287 14.6142C15.8283 14.3147 15.9976 13.9091 16 13.4855V2.51406C15.9976 2.09046 15.8283 1.68488 15.5287 1.38534C15.2292 1.0858 14.8236 0.916463 14.4 0.914062ZM1.6 2.28549H14.4C14.4606 2.28549 14.5188 2.30957 14.5616 2.35244C14.6045 2.3953 14.6286 2.45344 14.6286 2.51406V3.92206L8 7.23178L1.37143 3.92206V2.51406C1.37143 2.45344 1.39551 2.3953 1.43838 2.35244C1.48124 2.30957 1.53938 2.28549 1.6 2.28549ZM14.4 13.7141H1.6C1.53938 13.7141 1.48124 13.69 1.43838 13.6471C1.39551 13.6042 1.37143 13.5461 1.37143 13.4855V5.44892L7.68914 8.61235C7.78566 8.66062 7.89209 8.68576 8 8.68576C8.10791 8.68576 8.21434 8.66062 8.31086 8.61235L14.6286 5.44892V13.4855C14.6286 13.5461 14.6045 13.6042 14.5616 13.6471C14.5188 13.69 14.4606 13.7141 14.4 13.7141Z" fill="#111827"/>
            </g>
            <defs>
              <clipPath id="clip0_13917_2675">
                <rect width="16" height="16" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          
          {/* Notes Icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.0809 5.25714L8.93129 0.201143C8.80043 0.0725098 8.62291 0.000160048 8.43774 0H4.2752C3.59602 0 2.94466 0.264897 2.46441 0.736417C1.98416 1.20794 1.71436 1.84746 1.71436 2.51429V13.4857C1.71436 14.1525 1.98416 14.7921 2.46441 15.2636C2.94466 15.7351 3.59602 16 4.2752 16H11.7249C12.4041 16 13.0555 15.7351 13.5357 15.2636C14.016 14.7921 14.2858 14.1525 14.2858 13.4857V5.71429C14.2785 5.54204 14.2053 5.37882 14.0809 5.25714ZM9.16409 2.34057L11.9019 5.02857H9.16409V2.34057ZM11.7249 14.6286H4.2752C3.96648 14.6286 3.67041 14.5082 3.45211 14.2938C3.23382 14.0795 3.11118 13.7888 3.11118 13.4857V2.51429C3.11118 2.21118 3.23382 1.92049 3.45211 1.70616C3.67041 1.49184 3.96648 1.37143 4.2752 1.37143H7.76727V5.71429C7.76968 5.89541 7.84403 6.06845 7.97449 6.19654C8.10495 6.32463 8.2812 6.39763 8.46568 6.4H12.889V13.4857C12.889 13.7888 12.7663 14.0795 12.548 14.2938C12.3297 14.5082 12.0337 14.6286 11.7249 14.6286Z" fill="#111827"/>
            <path d="M5.14282 9.14258H10.8571" stroke="black" strokeLinecap="round"/>
            <path d="M5.14282 11.4287H10.8571" stroke="black" strokeLinecap="round"/>
          </svg>
          <div className="absolute right-0 top-1.5 w-1 h-1 bg-[#026BB6] rounded-full"></div>
        </div>
      )}
    </div>
  );
};

const DropZoneBottom = ({ columnTitle, width = '270px', height = '140px' }: { 
  columnTitle: string, 
  width?: string, 
  height?: string 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${columnTitle}-drop-zone`,
  });

  return (
    <div
      ref={setNodeRef}
      className="flex items-center justify-center transition-colors"
      style={{
        width: width,
        height: height,
        backgroundColor: isOver ? '#dbeafe' : 'transparent',
        border: isOver ? '2px dashed #3b82f6' : '2px dashed transparent',
        borderRadius: '8px',
        marginTop: '8px',
      }}
    >
      {isOver && (
        <div className="text-sm text-blue-600 font-medium">
          Drop here to add to end
        </div>
      )}
    </div>
  );
};

const PipelineColumnComponent = ({ column, columnIndex, dropIndicator, draggedCardDimensions, onCardClick, showIcons, onAddCard, onEditColumn, onDeleteColumn, onEditCard, onDeleteCard, isEditingColumn, onStartEditColumn, onCancelEditColumn }: { 
  column: PipelineColumn,
  columnIndex: number,
  dropIndicator: { columnIndex: number; cardIndex: number } | null,
  draggedCardDimensions: { width: string, height: string } | null,
  onCardClick?: (id: string) => void, 
  showIcons?: boolean, 
  onAddCard: (columnTitle: string, cardData?: Partial<DealCard>) => void,
  onEditColumn: (columnTitle: string) => void,
  onDeleteColumn: (columnTitle: string) => void,
  onEditCard: (cardId: string) => void,
  onDeleteCard: (cardId: string) => void,
  isEditingColumn?: boolean,
  onStartEditColumn: (columnTitle: string) => void,
  onCancelEditColumn: () => void
}) => {
  const [editingTitle, setEditingTitle] = useState(column.title);
  const titleInputRef = useRef<HTMLInputElement>(null);
  
  const { setNodeRef, isOver } = useDroppable({
    id: column.title,
  });

  // Focus on input when editing starts
  useEffect(() => {
    if (isEditingColumn && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingColumn]);

  // Update local editing title when column title changes
  useEffect(() => {
    // If it's a temporary column title, show "title" for editing
    if (column.title.startsWith('temp_column_')) {
      setEditingTitle('title');
    } else {
      setEditingTitle(column.title);
    }
  }, [column.title]);

  const handleTitleEdit = () => {
    onStartEditColumn(column.title);
    // If it's a temporary column title, show "title" for editing
    if (column.title.startsWith('temp_column_')) {
      setEditingTitle('title');
    } else {
      setEditingTitle(column.title);
    }
  };

  const handleTitleSave = () => {
    if (editingTitle.trim() && editingTitle !== column.title) {
      onEditColumn(editingTitle.trim());
    } else {
      onCancelEditColumn();
    }
  };

  const handleTitleCancel = () => {
    setEditingTitle(column.title);
    onCancelEditColumn();
  };

  // Handle click outside to close edit mode
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEditingColumn && titleInputRef.current) {
        const target = event.target as Node;
        // Check if click is outside the input and not on dropdown elements
        if (!titleInputRef.current.contains(target)) {
          // Inline the save logic to avoid dependency issues
          if (editingTitle.trim() && editingTitle !== column.title) {
            onEditColumn(editingTitle.trim());
          } else {
            onCancelEditColumn();
          }
        }
      }
    };

    if (isEditingColumn) {
      // Add a small delay to ensure dropdown is closed and focus is set
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside, true);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isEditingColumn, editingTitle, column.title, onEditColumn, onCancelEditColumn]);

  // Calculate totals from cards in this column
  const calculateTotals = () => {
    let totalValue = 0;
    let totalSquareFootage = 0;

    column.deals.forEach(deal => {
      // Parse value (remove $ and M/K, convert to numbers)
      if (deal.value) {
        const valueStr = deal.value.replace('$', '');
        if (valueStr.includes('M')) {
          totalValue += parseFloat(valueStr.replace('M', '')) * 1000000;
        } else if (valueStr.includes('K')) {
          totalValue += parseFloat(valueStr.replace('K', '')) * 1000;
        } else {
          totalValue += parseFloat(valueStr);
        }
      }

      // Parse square footage (remove SF and K, convert to numbers)
      if (deal.squareFootage) {
        const sfStr = deal.squareFootage.replace(' SF', '').replace('SF', '');
        if (sfStr.includes('K')) {
          totalSquareFootage += parseFloat(sfStr.replace('K', '')) * 1000;
        } else {
          totalSquareFootage += parseFloat(sfStr);
        }
      }
    });

    // Format back to display strings
    const formatValue = (value: number) => {
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
      } else {
        return `$${value}`;
      }
    };

    const formatSquareFootage = (sf: number) => {
      if (sf >= 1000) {
        return `${(sf / 1000).toFixed(0)}K SF`;
      } else {
        return `${sf} SF`;
      }
    };

    return {
      totalValue: formatValue(totalValue),
      totalSquareFootage: formatSquareFootage(totalSquareFootage),
      hasAnyTotals: totalValue > 0 || totalSquareFootage > 0
    };
  };

  const totals = calculateTotals();

  return (
    <div 
      ref={setNodeRef}
      className="h-[932px] pt-4 px-4 bg-surface-50 rounded-2xl border border-surface-200 flex flex-col gap-4"
      data-column-title
      style={{ 
        width: '306px',
        minWidth: '306px',
        maxWidth: '306px',
        flexShrink: 0,
        backgroundColor: isOver ? '#f0f9ff' : undefined,
      }}
    >
      <div className="flex items-center justify-between">
          <div className="flex-1 mr-2">
            {isEditingColumn ? (
              <input
                ref={titleInputRef}
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                onBlur={handleTitleSave}
                className="text-base font-semibold text-[#111827] leading-6 bg-white border border-gray-300 rounded outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                style={{ height: '24px', padding: '0 4px', margin: '0', boxSizing: 'border-box' }}
              />
            ) : (
              <div className="text-base font-semibold text-[#111827] leading-6" data-column-name>
                {column.title.startsWith('temp_column_') ? 'title' : column.title}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
          <Badge variant="default">{column.count}</Badge>
            <TaskDrawer columnTitle={column.title} onAddCard={onAddCard}>
                              <button className="cursor-pointer focus:outline-none focus:ring-0 border-0 rounded p-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_13948_4495)">
                  <path d="M6.58065 5.41935V0.580645C6.58065 0.426648 6.51947 0.278959 6.41058 0.170067C6.30169 0.0611749 6.154 0 6 0C5.846 0 5.69831 0.0611749 5.58942 0.170067C5.48053 0.278959 5.41935 0.426648 5.41935 0.580645V5.41935H0.580645C0.426648 5.41935 0.278959 5.48053 0.170067 5.58942C0.0611749 5.69831 0 5.846 0 6C0 6.154 0.0611749 6.30169 0.170067 6.41058C0.278959 6.51947 0.426648 6.58065 0.580645 6.58065H5.41935V11.4194C5.42136 11.5727 5.48318 11.7193 5.59164 11.8277C5.7001 11.9362 5.84663 11.998 6 12C6.154 12 6.30169 11.9388 6.41058 11.8299C6.51947 11.721 6.58065 11.5734 6.58065 11.4194V6.58065H11.4194C11.5734 6.58065 11.721 6.51947 11.8299 6.41058C11.9388 6.30169 12 6.154 12 6C11.998 5.84663 11.9362 5.7001 11.8277 5.59164C11.7193 5.48318 11.5727 5.42136 11.4194 5.41935H6.58065Z" fill="#111827"/>
                </g>
                <defs>
                  <clipPath id="clip0_13948_4495">
                    <rect width="12" height="12" fill="white"/>
                  </clipPath>
                </defs>
              </svg>
            </button>
          </TaskDrawer>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
                                <button className="cursor-pointer focus:outline-none focus:ring-0 border-0 rounded p-1" onClick={(e) => e.stopPropagation()}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_13948_4497)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6.00017 2.4C6.66291 2.4 7.20017 1.86274 7.20017 1.2C7.20017 0.537258 6.66291 0 6.00017 0C5.33743 0 4.80017 0.537258 4.80017 1.2C4.80017 1.86274 5.33743 2.4 6.00017 2.4ZM6.00017 7.20001C6.66291 7.20001 7.20017 6.66275 7.20017 6.00001C7.20017 5.33726 6.66291 4.80001 6.00017 4.80001C5.33743 4.80001 4.80017 5.33726 4.80017 6.00001C4.80017 6.66275 5.33743 7.20001 6.00017 7.20001ZM7.20017 10.8C7.20017 11.4628 6.66291 12 6.00017 12C5.33743 12 4.80017 11.4628 4.80017 10.8C4.80017 10.1373 5.33743 9.60001 6.00017 9.60001C6.66291 9.60001 7.20017 10.1373 7.20017 10.8Z" fill="#111827"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_13948_4497">
                      <rect width="12" height="12" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto min-w-0 py-1">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleTitleEdit(); }} className="px-2 py-1 text-xs">
                <Edit className="mr-2 h-3 w-3" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDeleteColumn(column.title); }}
                className="text-red-600 px-2 py-1 text-xs"
              >
                <Trash2 className="mr-2 h-3 w-3" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex items-center gap-2" style={{ minHeight: '32px' }}>
        {totals.hasAnyTotals && (
          <>
            {totals.totalValue !== "$0" && <Badge variant="success">{totals.totalValue}</Badge>}
            {totals.totalSquareFootage !== "0 SF" && <Badge variant="info">{totals.totalSquareFootage}</Badge>}
          </>
        )}
      </div>
      
      <SortableContext 
        items={column.deals.map(deal => deal.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col items-center gap-4 flex-1 overflow-y-auto no-scrollbar" style={{ width: '100%', maxWidth: '100%' }}>
          {column.deals.map((deal, dealIndex) => (
            <div key={deal.id} className="w-full flex flex-col items-center">
              {/* Show drop indicator before this card if needed */}
                      {dropIndicator &&
        dropIndicator.columnIndex === columnIndex &&
        dropIndicator.cardIndex === dealIndex && (
          <DropIndicator 
            width="270px"
            height={draggedCardDimensions?.height} 
          />
        )}
              
              <DealCardComponent 
                deal={deal} 
                onCardClick={onCardClick}
                showIcons={showIcons}
                onEditCard={onEditCard}
                onDeleteCard={onDeleteCard}
              />
            </div>
          ))}
          
          {/* Show drop indicator at the end if needed */}
                {dropIndicator &&
      dropIndicator.columnIndex === columnIndex &&
      dropIndicator.cardIndex === column.deals.length && (
        <DropIndicator 
          width="270px"
          height={draggedCardDimensions?.height} 
        />
      )}
          
          {/* Explicit drop zone at the bottom of the column */}
          <DropZoneBottom 
            columnTitle={column.title} 
            width="270px"
            height={draggedCardDimensions?.height} 
          />
        </div>
      </SortableContext>
    </div>
  );
};

interface TableSettingsColumn {
  id: string; // Unique identifier for drag operations
  title: string;
  enabled: boolean;
  editable: boolean;
  deletable?: boolean; // Controls if column can be deleted (optional, defaults to editable)
}

export default function DealPipeline({ showIcons }: { showIcons?: boolean }) {
  const [editingColumnTitle, setEditingColumnTitle] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<DealCard | null>(null);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(false);
  const [tableSettingsColumns, setTableSettingsColumns] = useState<TableSettingsColumn[]>([
    { id: "lead", title: "Lead", enabled: true, editable: true },
    { id: "pitching", title: "Pitching", enabled: true, editable: true },
    { id: "touring", title: "Touring", enabled: true, editable: true },
    { id: "closed", title: "Closed", enabled: true, editable: true },
  ]);
  const [pipelineData, setPipelineData] = useState<PipelineColumn[]>([
    {
      id: "lead",
      title: "Lead",
      count: 5,
      totalValue: "$4.2M",
      totalSquareFootage: "75K SF",
      enabled: true,
      editable: true,
      deals: [
        {
          id: "1",
          title: "Crucial AI NYC HQ",
          category: "Technology",
          contact: { name: "John Smith", timestamp: "yesterday" },
          activity: { task: "Midtown analysis", dueDate: "due tomorrow" }
        },
        {
          id: "2",
          title: "Preston & McGwire Expansion", 
          category: "Legal",
          contact: { name: "Samantha Preston", timestamp: "last week" },
          activity: { task: "Follow-up", dueDate: "in 3 days" }
        },
        {
          id: "3",
          title: "Block & Hornsby NY Office",
          category: "Legal", 
          contact: { name: "Matt Hornsby", timestamp: "2 weeks ago" },
          activity: { task: "Get comps", dueDate: "in 3 weeks" }
        },
        {
          id: "4",
          title: "Nimbus AI Downtown Office",
          category: "Technology",
          contact: { name: "Lisa Perez", timestamp: "1 month ago" },
          activity: { task: "Follow-up", dueDate: "in 1 month" }
        },
        {
          id: "5",
          title: "Percy Law Partners Office",
          category: "Legal",
          contact: { name: "Thomas Percy", timestamp: "3 months ago" },
          activity: { task: "Follow-up", dueDate: "in 1 week" }
        }
      ]
    },
    {
      id: "pitching",
      title: "Pitching",
      count: 2,
      totalValue: "$4.2M", 
      totalSquareFootage: "75K SF",
      enabled: true,
      editable: true,
      deals: [
        {
          id: "9",
          title: "Parallax Jersey City Office",
          value: "$3M",
          squareFootage: "55K SF",
          category: "Technology",
          contact: { name: "Wendy Aparicio", timestamp: "2 days ago" },
          activity: { task: "Pitch", dueDate: "tomorrow" }
        },
        {
          id: "10", 
          title: "Outwater Associates Expansion",
          value: "$1.2M",
          squareFootage: "20K SF",
          category: "Legal",
          contact: { name: "Howard Foster", timestamp: "1 week ago" },
          activity: { task: "Mark to market", dueDate: "in 4 days" }
        }
      ]
    },
    {
      id: "touring",
      title: "Touring",
      count: 5,
      totalValue: "$12.7M",
      totalSquareFootage: "250K SF",
      enabled: true,
      editable: true, 
      deals: [
        {
          id: "11",
          title: "Pinnacle Wealth NYC Office",
          value: "$4.3M",
          squareFootage: "45K SF",
          category: "Finance",
          contact: { name: "Nick Wilson", timestamp: "4 days ago" },
          activity: { task: "Prepare offer", dueDate: "tomorrow" }
        },
        {
          id: "12",
          title: "Gargulio Associates Renewal", 
          value: "$2.7M",
          squareFootage: "35K SF",
          category: "Legal",
          contact: { name: "April Reardon", timestamp: "2 days ago" },
          activity: { task: "Print tourbook", dueDate: "in 2 days" }
        },
        {
          id: "13",
          title: "Hunter Partners Midtown",
          value: "$1.5M",
          squareFootage: "20K SF", 
          category: "Finance",
          contact: { name: "Hailey Waltz", timestamp: "1 week ago" },
          activity: { task: "Schedule rd 2", dueDate: "in 1 week" }
        },
        {
          id: "14",
          title: "Needle AI Brooklyn Office",
          value: "$625K",
          squareFootage: "12K SF",
          category: "Technology",
          contact: { name: "Greg Thomas", timestamp: "1 week ago" },
          activity: { task: "Confirm tour times", dueDate: "in 1 week" }
        },
        {
          id: "15",
          title: "Peregrine Data Center",
          value: "$275K",
          squareFootage: "9K SF",
          category: "Technology",
          contact: { name: "Ellen Vidal", timestamp: "2 weeks ago" },
          activity: { task: "Verify spaces", dueDate: "in 2 weeks" }
        }
      ]
    },
    {
      id: "closed",
      title: "Closed",
      count: 5,
      totalValue: "$3.7M",
      totalSquareFootage: "62K SF",
      enabled: true,
      editable: true,
      deals: [
        {
          id: "19",
          title: "Porter & Reynolds 2nd Office",
          value: "$725K", 
          squareFootage: "42K SF",
          category: "Legal",
          contact: { name: "Hal Porter", timestamp: "yesterday" },
          activity: { task: "Share abstract", dueDate: "tomorrow" }
        },
        {
          id: "20",
          title: "Cloudscale NJ Office",
          value: "$327K",
          squareFootage: "21K SF",
          category: "Technology",
          contact: { name: "Everett Smith", timestamp: "3 days ago" },
          activity: { task: "Buildout advisory", dueDate: "in 2 days" }
        },
        {
          id: "21",
          title: "Bradford Law Office",
          value: "$275K",
          squareFootage: "15K SF",
          category: "Legal", 
          contact: { name: "Joan Salerno", timestamp: "5 days ago" },
          activity: { task: "Review utilization", dueDate: "in 1 week" }
        },
        {
          id: "22",
          title: "Warpdrive Logistics Space",
          value: "$194K",
          squareFootage: "12K SF",
          category: "Technology",
          contact: { name: "Winston Gray", timestamp: "3 weeks ago" },
          activity: { task: "Renewal option", dueDate: "in 1 week" }
        },
        {
          id: "23",
          title: "Putnam Wealth Office",
          value: "$215K",
          squareFootage: "16K SF",
          category: "Finance",
          contact: { name: "Betty DiPaolo", timestamp: "1 month ago" },
          activity: { task: "Expansion option", dueDate: "in 2 weeks" }
        }
      ]
    }
  ]);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [originalCardState, setOriginalCardState] = useState<DealCard | null>(null);
  const [draggedCardDimensions, setDraggedCardDimensions] = useState<{ width: string, height: string } | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    columnIndex: number;
    cardIndex: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [columnIdCounter, setColumnIdCounter] = useState(5); // Start from 5 since we have 4 initial columns
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    itemName: string;
    itemType: "task" | "column";
    onConfirm: () => void;
  }>({
    isOpen: false,
    itemName: "",
    itemType: "task",
    onConfirm: () => {}
  });
  const pipelineRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle scroll to reset angled cards
  useEffect(() => {
    const handleScroll = () => {
      // Reset all angled cards when scrolling
      setPipelineData(prevData =>
        prevData.map(column => ({
          ...column,
          deals: column.deals.map(deal => ({
            ...deal,
            isAngled: false
          }))
        }))
      );
    };

    const scrollContainer = scrollContainerRef.current;

    // Listen for scroll events on the pipeline container with capture to catch all scroll events 
    // (both horizontal pipeline scroll and vertical column scrolls)
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    }

    // Also listen for window scroll events
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll, true);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle click outside to reset angled cards
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // Don't reset if clicking outside the pipeline
      if (pipelineRef.current && !pipelineRef.current.contains(target)) {
        // Reset all angled cards
        setPipelineData(prevData =>
          prevData.map(column => ({
            ...column,
            deals: column.deals.map(deal => ({ ...deal, isAngled: false }))
          }))
        );
      }
      // Don't reset if clicking on a card (let card's onClick handle it)
      else if (target.closest('[data-card-id]')) {
        return;
      }
      // Reset if clicking on empty space within the pipeline
      else if (pipelineRef.current && pipelineRef.current.contains(target)) {
        setPipelineData(prevData =>
          prevData.map(column => ({
            ...column,
            deals: column.deals.map(deal => ({ ...deal, isAngled: false }))
          }))
        );
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleCardClick = (cardId: string) => {
    setPipelineData(prevData =>
      prevData.map(column => ({
        ...column,
        deals: column.deals.map(deal => {
          if (deal.id === cardId) {
            // Toggle the clicked card
            return { ...deal, isAngled: !deal.isAngled };
          }
          // Un-tilt every other card
          return { ...deal, isAngled: false };
        })
      }))
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
    setDropIndicator(null);
    
    // Capture the original card state and dimensions before modifying it
    const cardId = event.active.id as string;
    
    // Get the actual DOM element to measure its height in normal (non-tilted) state
    const cardElement = document.querySelector(`[data-card-id="${cardId}"]`) as HTMLElement;
    if (cardElement) {
      // Temporarily remove any rotation to get the normal height
      const originalTransform = cardElement.style.transform;
      cardElement.style.transform = 'none';
      
      const rect = cardElement.getBoundingClientRect();
      setDraggedCardDimensions({
        width: '270px', // Always use consistent width
        height: `${rect.height}px` // Use normal (non-tilted) card height
      });
      
      // Restore the original transform
      cardElement.style.transform = originalTransform;
    }
    
    for (const column of pipelineData) {
      const card = column.deals.find(deal => deal.id === cardId);
      if (card) {
        setOriginalCardState({ ...card });
        break;
      }
    }
    
    // Automatically angle the card when drag starts
    setPipelineData(prevData =>
      prevData.map(column => ({
        ...column,
        deals: column.deals.map(deal => {
          if (deal.id === cardId) {
            return { ...deal, isAngled: true };
          }
          // Un-tilt every other card
          return { ...deal, isAngled: false };
        })
      }))
    );
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over || !active) {
      setDropIndicator(null);
      return;
    }

    const overId = over.id as string;
    const draggedCardId = active.id as string;

    // Find which column and position we're hovering over
    let targetColumnIndex = -1;
    let targetCardIndex = -1;

    // Check if we're hovering over a card
    for (let i = 0; i < pipelineData.length; i++) {
      const cardIndex = pipelineData[i].deals.findIndex(deal => deal.id === overId);
      if (cardIndex !== -1) {
        targetColumnIndex = i;
        targetCardIndex = cardIndex;
        break;
      }
    }

    // If not hovering over a card, check if we're hovering over a column
    if (targetColumnIndex === -1) {
      targetColumnIndex = pipelineData.findIndex(col => col.title === overId);
      if (targetColumnIndex !== -1) {
        // When hovering over column, position at the end
        targetCardIndex = pipelineData[targetColumnIndex].deals.length;
      }
    }

    // Don't show indicator if we're hovering over the dragged card itself
    if (draggedCardId === overId) {
      setDropIndicator(null);
      return;
    }

    // Find the original position of the dragged card to exclude drop indicators around it
    let draggedCardOriginalColumn = -1;
    let draggedCardOriginalIndex = -1;
    for (let i = 0; i < pipelineData.length; i++) {
      const cardIndex = pipelineData[i].deals.findIndex(deal => deal.id === draggedCardId);
      if (cardIndex !== -1) {
        draggedCardOriginalColumn = i;
        draggedCardOriginalIndex = cardIndex;
        break;
      }
    }

    // Don't show drop indicators around the original position of the dragged card
    if (targetColumnIndex === draggedCardOriginalColumn && 
        (targetCardIndex === draggedCardOriginalIndex || 
         targetCardIndex === draggedCardOriginalIndex + 1)) {
      setDropIndicator(null);
      return;
    }

    // Set the drop indicator position
    if (targetColumnIndex !== -1) {
      setDropIndicator({
        columnIndex: targetColumnIndex,
        cardIndex: targetCardIndex
      });
    } else {
      setDropIndicator(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setOriginalCardState(null);
      setDraggedCardDimensions(null);
      return;
    }

    const draggedCardId = active.id as string;
    const overId = over.id as string;

    // Find the card being dragged
    let draggedCard: DealCard | null = null;
    let sourceColumnIndex = -1;
    let sourceCardIndex = -1;

    for (let i = 0; i < pipelineData.length; i++) {
      const cardIndex = pipelineData[i].deals.findIndex(deal => deal.id === draggedCardId);
      if (cardIndex !== -1) {
        draggedCard = pipelineData[i].deals[cardIndex];
        sourceColumnIndex = i;
        sourceCardIndex = cardIndex;
        break;
      }
    }

    if (!draggedCard) {
      setActiveId(null);
      setOriginalCardState(null);
      setDraggedCardDimensions(null);
      return;
    }

    // Check if we're dropping on another card (for positional insertion)
    let targetColumnIndex = -1;
    let targetCardIndex = -1;
    let isCard = false;

    // First, check if we're dropping on a card
    for (let i = 0; i < pipelineData.length; i++) {
      const cardIndex = pipelineData[i].deals.findIndex(deal => deal.id === overId);
      if (cardIndex !== -1) {
        targetColumnIndex = i;
        targetCardIndex = cardIndex;
        isCard = true;
        break;
      }
    }

    // If not dropping on a card, check if we're dropping on a column or drop zone
    if (!isCard) {
      // Check if dropping on a column
      targetColumnIndex = pipelineData.findIndex(col => col.title === overId);
      
      // If not on a column, check if dropping on a drop zone
      if (targetColumnIndex === -1) {
        // Check for drop zone format: "columnTitle-drop-zone"
        if (overId.endsWith('-drop-zone')) {
          const columnTitle = overId.replace('-drop-zone', '');
          targetColumnIndex = pipelineData.findIndex(col => col.title === columnTitle);
        }
      }
      
      if (targetColumnIndex === -1) {
        setActiveId(null);
        setOriginalCardState(null);
        setDraggedCardDimensions(null);
        return;
      }
      // When dropping on column or drop zone, add to the end
      targetCardIndex = pipelineData[targetColumnIndex].deals.length;
    }

    // If it's the same position, no need to move
    if (sourceColumnIndex === targetColumnIndex && sourceCardIndex === targetCardIndex) {
      setActiveId(null);
      setOriginalCardState(null);
      setDraggedCardDimensions(null);
      return;
    }

    setPipelineData(prevData => {
      const newData = [...prevData];
      const updatedCard = { ...draggedCard, isAngled: false };

      if (sourceColumnIndex === targetColumnIndex) {
        // Reordering within the same column
        const newDeals = [...newData[sourceColumnIndex].deals];
        
        // Remove the card from its current position
        newDeals.splice(sourceCardIndex, 1);
        
        // Insert at the new position
        let insertIndex = targetCardIndex;
        if (sourceCardIndex < targetCardIndex) {
          insertIndex = targetCardIndex - 1;
        }
        
        newDeals.splice(insertIndex, 0, updatedCard);
        
        newData[sourceColumnIndex] = {
          ...newData[sourceColumnIndex],
          deals: newDeals
        };
      } else {
        // Moving between different columns
        
        // Remove from source column
        newData[sourceColumnIndex] = {
          ...newData[sourceColumnIndex],
          deals: newData[sourceColumnIndex].deals.filter(deal => deal.id !== draggedCardId),
          count: newData[sourceColumnIndex].count - 1
        };
        
        // Add to target column at the specified position
        const targetDeals = [...newData[targetColumnIndex].deals];
        targetDeals.splice(targetCardIndex, 0, updatedCard);
        
        newData[targetColumnIndex] = {
          ...newData[targetColumnIndex],
          deals: targetDeals,
          count: newData[targetColumnIndex].count + 1
        };
      }
      
      return newData;
    });

    setActiveId(null);
    setOriginalCardState(null);
    setDraggedCardDimensions(null);
    setDropIndicator(null);
  };

  const findActiveCard = (): DealCard | null => {
    if (!activeId) return null;
    
    for (const column of pipelineData) {
      const card = column.deals.find(deal => deal.id === activeId);
      if (card) return card;
    }
    return null;
  };

  const handleAddColumn = () => {
    // Cancel any existing focus timeout to prevent multiple columns from being focused
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
      focusTimeoutRef.current = null;
    }
    
    // Clear any existing editing state
    setEditingColumnTitle(null);
    
    // Create a unique temporary title and ID for the new column
    const tempTitle = `temp_column_${columnIdCounter}`;
    const tempId = `temp_column_${columnIdCounter}`;
    const newColumn: PipelineColumn = {
      id: tempId,
      title: tempTitle,
      count: 0,
      totalValue: "$0",
      totalSquareFootage: "0 SF",
      enabled: true,
      editable: true,
      deals: []
    };
    
    setPipelineData(prev => [...prev, newColumn]);
    setColumnIdCounter(prev => prev + 1);
    
    // Add to table settings as well
    setTableSettingsColumns(prev => [...prev, {
      id: tempId,
      title: tempTitle,
      enabled: true,
      editable: true
    }]);
    
    // Auto-scroll to show the new column after a short delay to ensure DOM update
    setTimeout(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const newColumnPosition = (pipelineData.length) * (306 + 24); // New column position
        const containerWidth = container.clientWidth;
        const scrollLeft = newColumnPosition - containerWidth + 306; // Show the new column fully
        
        container.scrollTo({
          left: Math.max(0, scrollLeft),
          behavior: 'smooth'
        });
        
        // After scrolling, start editing the new column's title
        // Store the timeout ID so it can be cancelled if needed
        focusTimeoutRef.current = setTimeout(() => {
          setEditingColumnTitle(tempTitle);
          focusTimeoutRef.current = null; // Clear the ref after execution
        }, 500); // Wait for scroll animation to fully complete for smooth experience
      }
    }, 50);
  };

  const handleSettings = () => {
    setSettingsSidebarOpen(true);
  };

  const handleEditColumnFromSettings = (oldTitle: string, newTitle: string) => {
    // Update the actual pipeline data
    setPipelineData(prev => prev.map(column => 
      column.title === oldTitle 
        ? { ...column, title: newTitle }
        : column
    ));
  };

  const handleDeleteColumnFromSettings = (title: string) => {
    // Remove from pipeline data directly (no confirmation needed from sidebar)
    setPipelineData(prev => prev.filter(column => column.title !== title));
  };

  const handleSettingsColumnsChange = (newColumns: TableSettingsColumn[]) => {
    // Update the table settings columns
    setTableSettingsColumns(newColumns);
    
    // Update the pipeline data to match the new settings
    setPipelineData(prev => {
      // Reorder columns to match the new order and update enabled/editable states
      const reorderedColumns = newColumns
        .map(newCol => {
          // Find existing column by ID first, then fall back to title for backwards compatibility
          const existingColumn = prev.find(col => col.id === newCol.id || col.title === newCol.title);
          return existingColumn ? {
            ...existingColumn,
            id: newCol.id, // Update ID in case it changed
            enabled: newCol.enabled,
            editable: newCol.editable
          } : null;
        })
        .filter(col => col !== null) as PipelineColumn[];
      
      return reorderedColumns;
    });
  };

  const handleStartEditColumn = (columnTitle: string) => {
    setEditingColumnTitle(columnTitle);
  };

  const handleCancelEditColumn = () => {
    setEditingColumnTitle(null);
  };

  const handleEditColumn = (newTitle: string) => {
    const currentTitle = editingColumnTitle;
    if (currentTitle && newTitle.trim() && newTitle !== currentTitle) {
      setPipelineData(prev => prev.map(column => 
        column.title === currentTitle 
          ? { ...column, title: newTitle.trim() }
          : column
      ));
      
      // Update table settings as well
      setTableSettingsColumns(prev => prev.map(col => 
        col.title === currentTitle 
          ? { ...col, title: newTitle.trim() }
          : col
      ));
    }
    setEditingColumnTitle(null); // Always exit edit mode after save attempt
  };

  const handleDeleteColumn = (columnTitle: string) => {
    setDeleteConfirmation({
      isOpen: true,
      itemName: columnTitle,
      itemType: "column",
      onConfirm: () => {
        setPipelineData(prev => prev.filter(column => column.title !== columnTitle));
        setTableSettingsColumns(prev => prev.filter(col => col.title !== columnTitle));
      }
    });
  };

  const handleEditCard = (cardId: string) => {
    const card = pipelineData
      .flatMap(column => column.deals)
      .find(deal => deal.id === cardId);
    
    if (card) {
      setEditingCard(card);
      setEditDrawerVisible(true);
    }
  };

  const handleUpdateCard = (cardId: string, cardData: Partial<DealCard>) => {
    setPipelineData(prev => prev.map(column => ({
      ...column,
      deals: column.deals.map(deal => 
        deal.id === cardId 
          ? { ...deal, ...cardData }
          : deal
      )
    })));
  };

  const handleEditDrawerHide = () => {
    setEditDrawerVisible(false);
    setEditingCard(null);
  };

  const handleDeleteCard = (cardId: string) => {
    // Find the card to get its name
    const card = pipelineData
      .flatMap(column => column.deals)
      .find(deal => deal.id === cardId);
    
    const cardName = card?.title || "this task";
    
    setDeleteConfirmation({
      isOpen: true,
      itemName: cardName,
      itemType: "task",
      onConfirm: () => {
        setPipelineData(prev => prev.map(column => ({
          ...column,
          deals: column.deals.filter(deal => deal.id !== cardId),
          count: column.deals.filter(deal => deal.id !== cardId).length
        })));
      }
    });
  };

  const handleAddCard = (columnTitle: string, cardData?: Partial<DealCard>) => {
    const cardId = `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newCard: DealCard = cardData ? {
      id: cardId,
      title: cardData.title!,
      value: cardData.value,
      squareFootage: cardData.squareFootage,
      category: cardData.category!,
      description: cardData.description,
      contact: cardData.contact!,
      activity: cardData.activity!
    } : {
      id: cardId,
      title: "New Deal",
      value: "$0",
      squareFootage: "0 SF",
      category: "New",
      description: "New deal description",
      contact: {
        name: "New Contact",
        timestamp: "just now"
      },
      activity: {
        task: "Initial contact",
        dueDate: "today"
      }
    };

    setPipelineData(prev => prev.map(column => {
      if (column.title === columnTitle) {
        const updatedDeals = [...column.deals, newCard];
        return {
          ...column,
          deals: updatedDeals,
          count: updatedDeals.length
        };
      }
      return column;
    }));

    // Auto-scroll column to bottom to show new card
    setTimeout(() => {
      const columnElements = document.querySelectorAll('[data-column-title]');
      columnElements.forEach(columnElement => {
        const titleElement = columnElement.querySelector('[data-column-name]');
        if (titleElement && titleElement.textContent === columnTitle) {
          const scrollContainer = columnElement.querySelector('.overflow-y-auto');
          if (scrollContainer) {
            scrollContainer.scrollTo({
              top: scrollContainer.scrollHeight,
              behavior: 'smooth'
            });
          }
        }
      });
    }, 50);
  };

  // Filter pipeline data based on search query and enabled state
  const filteredPipelineData = pipelineData
    .filter(column => column.enabled) // Only show enabled columns
    .map(column => ({
      ...column,
      deals: column.deals.filter(deal => 
        deal.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      count: column.deals.filter(deal => 
        deal.title.toLowerCase().includes(searchQuery.toLowerCase())
      ).length
    }));

  return (
    <div ref={pipelineRef} className="flex flex-col gap-6" style={{ width: `${4 * 306 + 3 * 24}px` }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold text-surface-900 leading-[30px]">Deal Pipeline</div>
        <div className="w-[628px] flex items-center justify-end gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <div className="px-2 py-1 h-9 bg-inputtext-background shadow-sm border border-inputtext-border rounded-md flex items-center gap-2">
              {/* Custom Search Icon */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 6.4165C10.5 4.16134 8.67179 2.33317 6.41663 2.33317C4.16146 2.33317 2.33329 4.16134 2.33329 6.4165C2.33329 8.67167 4.16146 10.4998 6.41663 10.4998C8.67179 10.4998 10.5 8.67167 10.5 6.4165ZM11.6666 6.4165C11.6666 7.65607 11.236 8.7945 10.5176 9.69263L12.6624 11.8374C12.8902 12.0652 12.8902 12.4345 12.6624 12.6623C12.4346 12.8901 12.0653 12.8901 11.8375 12.6623L9.69275 10.5175C8.79462 11.2359 7.65619 11.6665 6.41663 11.6665C3.51713 11.6665 1.16663 9.316 1.16663 6.4165C1.16663 3.51701 3.51713 1.1665 6.41663 1.1665C9.31612 1.1665 11.6666 3.51701 11.6666 6.4165Z" fill="#94A3B8"/>
              </svg>
              <input 
                placeholder="Search board"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-0 p-0 text-xs bg-transparent placeholder:text-inputtext-placeholder focus:outline-none"
              />
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="px-2 py-1 rounded-md border-button-outlined-primary text-primary-color hover:bg-primary-color/10"
            onClick={handleAddColumn}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_13948_1090)">
                <path fillRule="evenodd" clipRule="evenodd" d="M2.2 1.9998C1.64772 1.9998 1.2 2.44752 1.2 2.9998V6.3998H6.4V1.9998H2.2ZM7 0.799805H2.2C0.984974 0.799805 0 1.78478 0 2.9998V6.9998V10.9998C0 12.2148 0.984974 13.1998 2.2 13.1998H7H11.8C13.015 13.1998 14 12.2148 14 10.9998V6.9998V2.9998C14 1.78478 13.015 0.799805 11.8 0.799805H7ZM7.6 1.9998V6.3998H12.8V2.9998C12.8 2.44752 12.3523 1.9998 11.8 1.9998H7.6ZM6.4 7.5998H1.2V10.9998C1.2 11.5521 1.64772 11.9998 2.2 11.9998H6.4V7.5998ZM7.6 11.9998V7.5998H12.8V10.9998C12.8 11.5521 12.3523 11.9998 11.8 11.9998H7.6Z" fill="#006BB6"/>
              </g>
              <defs>
                <clipPath id="clip0_13948_1090">
                  <rect width="14" height="14" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            Add column
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="px-2 py-1 rounded-md border-button-outlined-primary text-primary-color hover:bg-primary-color/10"
            onClick={handleSettings}
          >
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.25 15.75V11.25H1.5C1.08579 11.25 0.75 10.9142 0.75 10.5C0.75 10.0858 1.08579 9.75 1.5 9.75H4.5C4.91421 9.75 5.25 10.0858 5.25 10.5C5.25 10.9142 4.91421 11.25 4.5 11.25H3.75V15.75C3.75 16.1642 3.41421 16.5 3 16.5C2.58579 16.5 2.25 16.1642 2.25 15.75ZM8.25 15.75V9C8.25 8.58579 8.58579 8.25 9 8.25C9.41421 8.25 9.75 8.58579 9.75 9V15.75C9.75 16.1642 9.41421 16.5 9 16.5C8.58579 16.5 8.25 16.1642 8.25 15.75ZM14.25 15.75V12.75H13.5C13.0858 12.75 12.75 12.4142 12.75 12C12.75 11.5858 13.0858 11.25 13.5 11.25H16.5C16.9142 11.25 17.25 11.5858 17.25 12C17.25 12.4142 16.9142 12.75 16.5 12.75H15.75V15.75C15.75 16.1642 15.4142 16.5 15 16.5C14.5858 16.5 14.25 16.1642 14.25 15.75ZM14.25 9V2.25C14.25 1.83579 14.5858 1.5 15 1.5C15.4142 1.5 15.75 1.83579 15.75 2.25V9C15.75 9.41421 15.4142 9.75 15 9.75C14.5858 9.75 14.25 9.41421 14.25 9ZM2.25 7.5V2.25C2.25 1.83579 2.58579 1.5 3 1.5C3.41421 1.5 3.75 1.83579 3.75 2.25V7.5C3.75 7.91421 3.41421 8.25 3 8.25C2.58579 8.25 2.25 7.91421 2.25 7.5ZM8.25 2.25C8.25 1.83579 8.58579 1.5 9 1.5C9.41421 1.5 9.75 1.83579 9.75 2.25V5.25H10.5C10.9142 5.25 11.25 5.58579 11.25 6C11.25 6.41421 10.9142 6.75 10.5 6.75H7.5C7.08579 6.75 6.75 6.41421 6.75 6C6.75 5.58579 7.08579 5.25 7.5 5.25H8.25V2.25Z" fill="#006BB6"/>
            </svg>
            Edit column
          </Button>
        </div>
      </div>

      {/* Pipeline Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
      <div ref={scrollContainerRef} className="w-full overflow-x-auto overflow-y-visible no-scrollbar">
        <div className="flex items-start gap-6" style={{ width: `${filteredPipelineData.length * 306 + (filteredPipelineData.length - 1) * 24}px`, minWidth: `${4 * 306 + 3 * 24}px` }}>
          {filteredPipelineData.map((column, index) => (
              <PipelineColumnComponent 
                key={`${column.title}-${index}`} 
                column={column} 
                columnIndex={index}
                dropIndicator={dropIndicator}
                draggedCardDimensions={draggedCardDimensions}
                onCardClick={handleCardClick} 
                showIcons={showIcons} 
                onAddCard={handleAddCard}
                onEditColumn={handleEditColumn}
                onDeleteColumn={handleDeleteColumn}
                onEditCard={handleEditCard}
                onDeleteCard={handleDeleteCard}
                isEditingColumn={editingColumnTitle === column.title}
                onStartEditColumn={handleStartEditColumn}
                onCancelEditColumn={handleCancelEditColumn}
              />
        ))}
      </div>
      </div>
        
        <DragOverlay>
          {activeId ? (
            <DragCardComponent 
              deal={originalCardState || { 
                id: '', 
                title: '', 
                category: '', 
                contact: { name: '', timestamp: '' }, 
                activity: { task: '', dueDate: '' }
              }} 
              showIcons={showIcons}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
      
      {/* Edit Card Drawer */}
      <EditTaskDrawer
        card={editingCard}
        visible={editDrawerVisible}
        onHide={handleEditDrawerHide}
        onUpdateCard={handleUpdateCard}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}
        onConfirm={deleteConfirmation.onConfirm}
        itemName={deleteConfirmation.itemName}
        itemType={deleteConfirmation.itemType}
      />
      
      {/* Table Settings Sidebar */}
      <TableSettingsSidebar
        open={settingsSidebarOpen}
        onOpenChange={setSettingsSidebarOpen}
        columns={tableSettingsColumns}
        onColumnsChange={handleSettingsColumnsChange}
        onEditColumn={handleEditColumnFromSettings}
        onDeleteColumn={handleDeleteColumnFromSettings}
      />
    </div>
  );
}
