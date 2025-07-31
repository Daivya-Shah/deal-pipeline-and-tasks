import { MoreHorizontal, Clock, X, User, Calendar, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
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
  UniqueIdentifier,
} from "@dnd-kit/core";
import {
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
  title: string;
  count: number;
  totalValue: string;
  totalSquareFootage: string;
  deals: DealCard[];
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

const TaskDrawer = ({ children }: { children: React.ReactNode }) => {
    return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent 
        className="fixed inset-y-0 right-0 h-full data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
        style={{ width: '481px' }}
      >
        <div style={{ width: '481px', height: '1024px', background: '#F8FAFC', boxShadow: '4px 20px 50px -12px rgba(13, 13, 18, 0.12)', overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex' }}>
          {/* Header */}
          <div style={{ alignSelf: 'stretch', paddingTop: '16px', paddingBottom: '16px', background: 'white', borderBottom: '1px #DFE7EF solid', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '8px', display: 'flex' }}>
            <div style={{ alignSelf: 'stretch', paddingLeft: '24px', paddingRight: '24px', justifyContent: 'flex-start', alignItems: 'center', gap: '8px', display: 'inline-flex' }}>
              <div style={{ flex: '1 1 0', alignSelf: 'stretch', justifyContent: 'flex-start', alignItems: 'center', gap: '8px', display: 'flex' }}>
                <div style={{ color: '#0F172A', fontSize: '20px', fontFamily: 'Inter', fontWeight: 600, lineHeight: '25px', wordWrap: 'break-word' }}>Add Task</div>
              </div>
              <div style={{ width: '32px', height: '32px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '6px', outline: '1px #E2E8F0 solid', outlineOffset: '-1px', justifyContent: 'center', alignItems: 'center', display: 'flex', cursor: 'pointer' }}>
                <X size={16} style={{ color: '#64748B' }} />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div style={{ alignSelf: 'stretch', flex: '1 1 0', padding: '24px', overflow: 'hidden', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '24px', display: 'flex' }}>
            {/* Task Name */}
            <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', display: 'flex' }}>
              <div style={{ alignSelf: 'stretch', color: '#334155', fontSize: '14px', fontFamily: 'Inter', fontWeight: 600, lineHeight: '22px', wordWrap: 'break-word' }}>Task Name *</div>
              <div style={{ alignSelf: 'stretch', paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', background: 'white', boxShadow: '0px 1px 2px rgba(18, 18, 23, 0.05)', borderRadius: '6px', outline: '1px #CBD5E1 solid', outlineOffset: '-1px', justifyContent: 'flex-start', alignItems: 'center', gap: '8px', display: 'inline-flex' }}>
                <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', display: 'inline-flex' }}>
                  <div style={{ alignSelf: 'stretch', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
                    <input 
                      placeholder="Enter a unique name"
                      style={{ flex: '1 1 0', color: '#64748B', fontSize: '14px', fontFamily: 'Inter', fontWeight: 400, lineHeight: '22px', background: 'transparent', border: 'none', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Assignee */}
            <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', display: 'flex' }}>
              <div style={{ alignSelf: 'stretch', color: '#334155', fontSize: '14px', fontFamily: 'Inter', fontWeight: 600, lineHeight: '22px', wordWrap: 'break-word' }}>Assignee *</div>
              <div style={{ alignSelf: 'stretch', paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', background: 'white', boxShadow: '0px 1px 2px rgba(18, 18, 23, 0.05)', borderRadius: '6px', outline: '1px #CBD5E1 solid', outlineOffset: '-1px', justifyContent: 'flex-start', alignItems: 'center', gap: '8px', display: 'inline-flex' }}>
                <User size={16} style={{ color: '#94A3B8' }} />
                <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', display: 'inline-flex' }}>
                  <div style={{ alignSelf: 'stretch', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
                    <input 
                      placeholder="Who is getting this done?"
                      style={{ flex: '1 1 0', color: '#64748B', fontSize: '14px', fontFamily: 'Inter', fontWeight: 400, lineHeight: '22px', background: 'transparent', border: 'none', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Company */}
            <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', display: 'flex' }}>
              <div style={{ alignSelf: 'stretch', color: '#334155', fontSize: '14px', fontFamily: 'Inter', fontWeight: 600, lineHeight: '22px', wordWrap: 'break-word' }}>Company</div>
              <div style={{ alignSelf: 'stretch', paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', background: 'white', boxShadow: '0px 1px 2px rgba(18, 18, 23, 0.05)', borderRadius: '6px', outline: '1px #CBD5E1 solid', outlineOffset: '-1px', justifyContent: 'flex-start', alignItems: 'center', gap: '8px', display: 'inline-flex' }}>
                <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', display: 'inline-flex' }}>
                  <div style={{ alignSelf: 'stretch', overflow: 'hidden', justifyContent: 'flex-start', alignItems: 'center', display: 'inline-flex' }}>
                    <input 
                      placeholder="Add the client or prospect this task relates to"
                      style={{ flex: '1 1 0', color: '#64748B', fontSize: '14px', fontFamily: 'Inter', fontWeight: 400, lineHeight: '22px', background: 'transparent', border: 'none', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div style={{ alignSelf: 'stretch', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', display: 'flex' }}>
              <div style={{ alignSelf: 'stretch', color: '#334155', fontSize: '14px', fontFamily: 'Inter', fontWeight: 600, lineHeight: '22px', wordWrap: 'break-word' }}>Due Date *</div>
              <div style={{ alignSelf: 'stretch', paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', background: 'white', boxShadow: '0px 1px 2px rgba(18, 18, 23, 0.05)', borderRadius: '6px', outline: '1px #CBD5E1 solid', outlineOffset: '-1px', justifyContent: 'flex-start', alignItems: 'center', gap: '8px', display: 'inline-flex' }}>
                <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', display: 'inline-flex' }}>
                  <input 
                    type="date"
                    style={{ flex: '1 1 0', color: '#64748B', fontSize: '14px', fontFamily: 'Inter', fontWeight: 400, lineHeight: '22px', background: 'transparent', border: 'none', outline: 'none' }}
                  />
                </div>
                <Calendar size={16} style={{ color: '#94A3B8' }} />
              </div>
            </div>

            {/* Description */}
            <div style={{ alignSelf: 'stretch', height: '114px', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '4px', display: 'flex' }}>
              <div style={{ alignSelf: 'stretch', color: '#334155', fontSize: '14px', fontFamily: 'Inter', fontWeight: 600, lineHeight: '22px', wordWrap: 'break-word' }}>Description</div>
              <div style={{ alignSelf: 'stretch', flex: '1 1 0', paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', background: 'white', boxShadow: '0px 1px 2px rgba(18, 18, 23, 0.05)', borderRadius: '6px', outline: '1px #CBD5E1 solid', outlineOffset: '-1px', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '8px', display: 'inline-flex' }}>
                <div style={{ flex: '1 1 0', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', display: 'inline-flex' }}>
                  <textarea 
                    placeholder=" "
                    maxLength={120}
                    style={{ flex: '1 1 0', color: '#64748B', fontSize: '14px', fontFamily: 'Inter', fontWeight: 400, lineHeight: '22px', background: 'transparent', border: 'none', outline: 'none', resize: 'none', width: '100%', minHeight: '60px' }}
                  />
                </div>
              </div>
              <div style={{ alignSelf: 'stretch', textAlign: 'right', color: '#334155', fontSize: '12px', fontFamily: 'Inter', fontWeight: 400, lineHeight: '18px', wordWrap: 'break-word' }}>0/120</div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ width: '479px', paddingLeft: '24px', paddingRight: '24px', paddingTop: '16px', paddingBottom: '16px', background: 'white', borderTop: '1px #DFE1E6 solid', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', display: 'inline-flex' }}>
            <div style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '6px', outline: '1px #7AC8FF solid', outlineOffset: '-1px', justifyContent: 'center', alignItems: 'center', gap: '8px', display: 'flex', cursor: 'pointer' }}>
              <div style={{ color: '#006BB6', fontSize: '14px', fontFamily: 'Inter', fontWeight: 600, lineHeight: '22px', wordWrap: 'break-word' }}>Cancel</div>
            </div>
            <div style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: '8px', paddingBottom: '8px', opacity: 0.70, background: '#F1F5F9', borderRadius: '6px', outline: '1px #F1F5F9 solid', outlineOffset: '-1px', justifyContent: 'center', alignItems: 'center', gap: '8px', display: 'flex' }}>
              <div style={{ color: '#475569', fontSize: '14px', fontFamily: 'Inter', fontWeight: 600, lineHeight: '22px', wordWrap: 'break-word' }}>Save</div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
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
    isDragging,
  } = useDraggable({
    id: deal.id,
    disabled: false,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
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
            transform: isDragging ? CSS.Translate.toString(transform) : 'rotate(8deg)',
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
                <button className="cursor-pointer focus:outline-none focus:ring-0 border-0 hover:bg-gray-100 hover:scale-110 transition-all duration-200 rounded p-1">
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
                <DropdownMenuItem onClick={() => onEditCard(deal.id)} className="px-2 py-1 text-xs">
                  <Edit className="mr-2 h-3 w-3" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDeleteCard(deal.id)}
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
            <button className="cursor-pointer focus:outline-none focus:ring-0 border-0 hover:bg-gray-100 hover:scale-110 transition-all duration-200 rounded p-1">
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
            <DropdownMenuItem onClick={() => onEditCard(deal.id)} className="px-2 py-1 text-xs">
              <Edit className="mr-2 h-3 w-3" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDeleteCard(deal.id)}
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
        <div>
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
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {deal.value && <Badge variant="success">{deal.value}</Badge>}
        {deal.squareFootage && <Badge variant="info">{deal.squareFootage}</Badge>}
        <Badge variant="default">{deal.category}</Badge>
      </div>
      
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

const PipelineColumnComponent = ({ column, onCardClick, showIcons, onAddCard, onEditColumn, onDeleteColumn, onEditCard, onDeleteCard }: { 
  column: PipelineColumn, 
  onCardClick?: (id: string) => void, 
  showIcons?: boolean, 
  onAddCard: (columnTitle: string) => void,
  onEditColumn: (columnTitle: string) => void,
  onDeleteColumn: (columnTitle: string) => void,
  onEditCard: (cardId: string) => void,
  onDeleteCard: (cardId: string) => void
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.title,
  });

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
      totalSquareFootage: formatSquareFootage(totalSquareFootage)
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
        <div className="flex-1 flex items-center gap-2">
          <div className="text-base font-semibold text-[#111827] leading-6" data-column-name>{column.title}</div>
          <Badge variant="default">{column.count}</Badge>
        </div>
        <div className="flex items-center gap-4">
          <TaskDrawer>
            <button className="cursor-pointer focus:outline-none focus:ring-0 border-0 hover:bg-gray-100 hover:scale-110 transition-all duration-200 rounded p-1">
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
              <button className="cursor-pointer focus:outline-none focus:ring-0 border-0 hover:bg-gray-100 hover:scale-110 transition-all duration-200 rounded p-1">
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
              <DropdownMenuItem onClick={() => onEditColumn(column.title)} className="px-2 py-1 text-xs">
                <Edit className="mr-2 h-3 w-3" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDeleteColumn(column.title)}
                className="text-red-600 px-2 py-1 text-xs"
              >
                <Trash2 className="mr-2 h-3 w-3" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant="success">{totals.totalValue}</Badge>
        <Badge variant="info">{totals.totalSquareFootage}</Badge>
      </div>
      
      <div className="flex flex-col items-center gap-4 overflow-y-auto no-scrollbar" style={{ width: '100%', maxWidth: '100%' }}>
        {column.deals.map((deal) => (
          <DealCardComponent 
            key={deal.id} 
            deal={deal} 
            onCardClick={onCardClick}
            showIcons={showIcons}
            onEditCard={onEditCard}
            onDeleteCard={onDeleteCard}
          />
        ))}


      </div>
    </div>
  );
};

export default function DealPipeline({ showIcons }: { showIcons?: boolean }) {
  const [pipelineData, setPipelineData] = useState<PipelineColumn[]>([
    {
      title: "Lead",
      count: 5,
      totalValue: "$4.2M",
      totalSquareFootage: "75K SF",
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
      title: "Pitching",
      count: 2,
      totalValue: "$4.2M", 
      totalSquareFootage: "75K SF",
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
      title: "Touring",
      count: 5,
      totalValue: "$12.7M",
      totalSquareFootage: "250K SF", 
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
      title: "Closed",
      count: 5,
      totalValue: "$3.7M",
      totalSquareFootage: "62K SF",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [columnIdCounter, setColumnIdCounter] = useState(5); // Start from 5 since we have 4 initial columns
  const pipelineRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
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
    
    // Automatically angle the card when drag starts
    const cardId = event.active.id as string;
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const draggedCardId = active.id as string;
    const targetColumnTitle = over.id as string;

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

    if (!draggedCard || !draggedCard.isAngled) {
      setActiveId(null);
      return;
    }

    // Find target column
    const targetColumnIndex = pipelineData.findIndex(col => col.title === targetColumnTitle);
    
    if (targetColumnIndex === -1 || sourceColumnIndex === targetColumnIndex) {
      setActiveId(null);
      return;
    }

    // Move the card
    setPipelineData(prevData => {
      const newData = [...prevData];
      
      // Remove from source column
      newData[sourceColumnIndex] = {
        ...newData[sourceColumnIndex],
        deals: newData[sourceColumnIndex].deals.filter(deal => deal.id !== draggedCardId),
        count: newData[sourceColumnIndex].count - 1
      };
      
      // Add to target column (make it normal, not angled)
      const updatedCard = { ...draggedCard, isAngled: false };
      newData[targetColumnIndex] = {
        ...newData[targetColumnIndex],
        deals: [...newData[targetColumnIndex].deals, updatedCard],
        count: newData[targetColumnIndex].count + 1
      };
      
      return newData;
    });

    setActiveId(null);
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
    const newColumn: PipelineColumn = {
      title: `Column ${columnIdCounter}`,
      count: 0,
      totalValue: "$0",
      totalSquareFootage: "0 SF",
      deals: []
    };
    
    setPipelineData(prev => [...prev, newColumn]);
    setColumnIdCounter(prev => prev + 1);
    
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
      }
    }, 50);
  };

  const handleEditColumn = (columnTitle: string) => {
    const newTitle = prompt("Enter new column name:", columnTitle);
    if (newTitle && newTitle.trim() && newTitle !== columnTitle) {
      setPipelineData(prev => prev.map(column => 
        column.title === columnTitle 
          ? { ...column, title: newTitle.trim() }
          : column
      ));
    }
  };

  const handleDeleteColumn = (columnTitle: string) => {
    if (window.confirm(`Are you sure you want to delete the "${columnTitle}" column and all its cards?`)) {
      setPipelineData(prev => prev.filter(column => column.title !== columnTitle));
    }
  };

  const handleEditCard = (cardId: string) => {
    const card = pipelineData
      .flatMap(column => column.deals)
      .find(deal => deal.id === cardId);
    
    if (card) {
      const newTitle = prompt("Enter new card title:", card.title);
      if (newTitle && newTitle.trim() && newTitle !== card.title) {
        setPipelineData(prev => prev.map(column => ({
          ...column,
          deals: column.deals.map(deal => 
            deal.id === cardId 
              ? { ...deal, title: newTitle.trim() }
              : deal
          )
        })));
      }
    }
  };

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      setPipelineData(prev => prev.map(column => ({
        ...column,
        deals: column.deals.filter(deal => deal.id !== cardId),
        count: column.deals.filter(deal => deal.id !== cardId).length
      })));
    }
  };

  const handleAddCard = (columnTitle: string) => {
    const cardId = `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newCard: DealCard = {
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

  // Filter pipeline data based on search query
  const filteredPipelineData = pipelineData.map(column => ({
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
        </div>
      </div>

      {/* Pipeline Columns */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
      <div ref={scrollContainerRef} className="w-full overflow-x-auto overflow-y-visible no-scrollbar">
        <div className="flex items-start gap-6" style={{ width: `${filteredPipelineData.length * 306 + (filteredPipelineData.length - 1) * 24}px`, minWidth: `${4 * 306 + 3 * 24}px` }}>
          {filteredPipelineData.map((column, index) => (
              <PipelineColumnComponent 
                key={`${column.title}-${index}`} 
                column={column} 
                onCardClick={handleCardClick} 
                showIcons={showIcons} 
                onAddCard={handleAddCard}
                onEditColumn={handleEditColumn}
                onDeleteColumn={handleDeleteColumn}
                onEditCard={handleEditCard}
                onDeleteCard={handleDeleteCard}
              />
        ))}
      </div>
      </div>
        
        <DragOverlay>
          {activeId ? (
            <DragCardComponent 
              deal={findActiveCard() || { 
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
    </div>
  );
}
