import { Search, Plus, MoreHorizontal, Edit, Mail, Phone, Clock, X, User, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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

const DealCardComponent = ({ deal, onCardClick, showIcons }: { deal: DealCard, onCardClick?: (id: string) => void, showIcons?: boolean }) => {
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

  // Render shadow placeholder when card is angled
  if (deal.isAngled) {
    return (
      <div 
        style={{
          width: '270px',
          height: showIcons ? '226px' : '160px',
          position: 'relative',
        }}
      >
        {/* Shadow placeholder - takes up space in layout */}
        <div 
          style={{
            width: '270px',
            height: showIcons ? '226px' : '160px',
            borderRadius: '8px',
          }}
          className="bg-surface-200"
        >
        </div>
        
        {/* Actual tilted card - absolutely positioned so it doesn't affect layout */}
        <div 
          ref={setNodeRef}
          style={{
            width: '270px',
            height: showIcons ? '226px' : '160px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
            outline: '1px #DFE7EF solid',
            outlineOffset: '-1px',
            transform: isDragging ? CSS.Translate.toString(transform) : 'rotate(8deg)',
            transformOrigin: 'top left',
            opacity: isDragging ? 0 : 1,
            cursor: 'grab',
            zIndex: 1000,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          className="p-4 bg-white rounded-[8px] flex flex-col gap-3"
          onClick={() => onCardClick?.(deal.id)}
          {...listeners}
          {...attributes}
        >
        <div className="flex items-center gap-2">
            <div className="flex-1 text-[14px] font-semibold text-[#111827]">{deal.title}</div>
            <TaskDrawer>
              <button className="cursor-pointer">
                <MoreHorizontal size={12} className="text-[#111827]" />
              </button>
            </TaskDrawer>
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
            <Mail size={16} className="text-[#111827]" />
            <Phone size={16} className="text-[#111827]" />
            <Edit size={16} className="text-[#111827]" />
            <div className="absolute right-0 top-1.5 w-1 h-1 bg-[#026BB6] rounded-full"></div>
          </div>
        )}
        </div>
      </div>
    );
  }


  
  return (
    <div 
      ref={setNodeRef}
      style={{
        width: '270px',
        height: showIcons ? '226px' : '160px',
        minHeight: showIcons ? '226px' : '160px',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
        outline: '1px #DFE7EF solid',
        outlineOffset: '-1px',
        transform: isDragging ? CSS.Translate.toString(transform) : (deal.isAngled ? 'rotate(8deg)' : 'none'),
        transformOrigin: 'top left',
        opacity: isDragging ? 0 : 1,
        cursor: 'grab',
      }}
      className="p-4 bg-white rounded-[8px] flex flex-col gap-3"
      onClick={() => onCardClick?.(deal.id)}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-center gap-2">
        <div className="flex-1 text-[14px] font-semibold text-[#111827]">{deal.title}</div>
        <TaskDrawer>
          <button className="cursor-pointer">
        <MoreHorizontal size={12} className="text-[#111827]" />
          </button>
        </TaskDrawer>
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
          <Mail size={16} className="text-[#111827]" />
          <Phone size={16} className="text-[#111827]" />
          <Edit size={16} className="text-[#111827]" />
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
        height: showIcons ? '226px' : '160px',
        minHeight: showIcons ? '226px' : '160px',
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
        <TaskDrawer>
          <button className="cursor-pointer">
            <MoreHorizontal size={12} className="text-[#111827]" />
          </button>
        </TaskDrawer>
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
          <Mail size={16} className="text-[#111827]" />
          <Phone size={16} className="text-[#111827]" />
          <Edit size={16} className="text-[#111827]" />
          <div className="absolute right-0 top-1.5 w-1 h-1 bg-[#026BB6] rounded-full"></div>
        </div>
      )}
    </div>
  );
};

const PipelineColumnComponent = ({ column, onCardClick, showIcons }: { column: PipelineColumn, onCardClick?: (id: string) => void, showIcons?: boolean }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.title,
  });

  return (
    <div 
      ref={setNodeRef}
      className="h-[932px] pt-4 px-4 bg-surface-50 rounded-2xl border border-surface-200 flex flex-col gap-4"
      style={{ 
        width: '306px',
        backgroundColor: isOver ? '#f0f9ff' : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 flex items-center gap-2">
          <div className="text-base font-semibold text-[#111827] leading-6">{column.title}</div>
          <Badge variant="default">{column.count}</Badge>
        </div>
        <div className="flex items-center justify-end gap-4">
          <MoreHorizontal size={12} className="text-[#111827]" />
          <div className="w-3 h-3"></div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant="success">{column.totalValue}</Badge>
        <Badge variant="info">{column.totalSquareFootage}</Badge>
      </div>
      
      <div className="flex flex-col items-center gap-4 overflow-y-auto no-scrollbar">
        {column.deals.map((deal) => (
          <DealCardComponent 
            key={deal.id} 
            deal={deal} 
            onCardClick={onCardClick}
            showIcons={showIcons}
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

  return (
    <div className="w-[1280px] flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold text-surface-900 leading-[30px]">Deal Pipeline</div>
        <div className="w-[628px] flex items-center justify-end gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <div className="px-2 py-1 h-9 bg-inputtext-background shadow-sm border border-inputtext-border rounded-md flex items-center gap-2">
              <Search size={14} className="text-iconfield-icon" />
              <Input 
                placeholder="Search board"
                className="flex-1 border-0 p-0 text-sm bg-transparent placeholder:text-inputtext-placeholder focus-visible:ring-0"
              />
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            className="px-2 py-1 rounded-md border-button-outlined-primary text-primary-color hover:bg-primary-color/10"
          >
            <Plus size={14} />
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
      <div className="flex items-start gap-6">
        {pipelineData.map((column) => (
            <PipelineColumnComponent key={column.title} column={column} onCardClick={handleCardClick} showIcons={showIcons} />
        ))}
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
