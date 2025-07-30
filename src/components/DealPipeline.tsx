import { Search, Plus, MoreHorizontal, Edit, Mail, Phone, Clock, X, User, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
  hasActions?: boolean;
  isTemplate?: boolean;
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

const DealCardComponent = ({ deal }: { deal: DealCard }) => {
  if (deal.isTemplate) {
    return (
      <div 
        className="p-4 bg-white rounded-[8px] flex flex-col gap-3"
        style={{
          width: '270px',
          height: '160px',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
          outline: '1px #DFE7EF solid',
          outlineOffset: '-1px'
        }}
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
          <Badge variant="success">{deal.value || "New"}</Badge>
          <Badge variant="info">{deal.squareFootage || "75K SF"}</Badge>
          <Badge variant="default">{deal.category}</Badge>
        </div>
        
        {deal.description && (
          <div className="text-xs text-surface-900 leading-[18px]">
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
        
        {deal.hasActions && (
          <div className="pt-2 px-6 relative flex items-center justify-between">
            <Mail size={16} className="text-[#111827]" />
            <Phone size={16} className="text-[#111827]" />
            <Edit size={16} className="text-[#111827]" />
            <div className="absolute right-0 top-1.5 w-1 h-1 bg-[#026BB6] rounded-full"></div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div 
      className="p-4 bg-white rounded-[8px] flex flex-col gap-3"
      style={{
        width: '270px',
        height: '160px',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
        outline: '1px #DFE7EF solid',
        outlineOffset: '-1px'
      }}
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
    </div>
  );
};

const AngledCard = () => {
  return (
    <div 
      className="p-4 bg-white rounded-[8px] flex flex-col gap-3"
      style={{
        width: '289.64px',
        transform: 'rotate(8deg)',
        transformOrigin: 'top left',
        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
        outline: '1px #DFE7EF solid',
        outlineOffset: '-1px'
      }}
    >
      <div className="flex items-center gap-2">
        <div className="flex-1 text-[14px] font-semibold text-[#111827]">Altair Renewal</div>
        <div className="w-[13.55px] h-[13.55px]"></div>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge variant="default">Technology</Badge>
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
            <div className="w-[13.55px] h-[13.55px] bg-[#9CA3AF] rounded-full"></div>
            <div className="text-[10.5px] text-[#111827] leading-[15.75px]">Raj Patel</div>
          </div>
          <div className="text-[10.5px] text-[#6B7280] leading-[15.75px]">2 weeks ago</div>
        </div>
        <div className="pt-3 pb-2 px-2 bg-[#F9FAFB] rounded-b-[6px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-[13.55px] h-[13.55px]"></div>
            <div className="text-[10.5px] text-[#111827] leading-[15.75px]">Review options</div>
          </div>
          <div className="text-[10.5px] text-[#6B7280] leading-[15.75px]">in 1 week</div>
        </div>
      </div>
    </div>
  );
};

const PipelineColumnComponent = ({ column }: { column: PipelineColumn }) => {
  return (
    <div 
      className="h-[932px] pt-4 px-4 bg-surface-50 rounded-2xl border border-surface-200 flex flex-col gap-4"
      style={{ width: '302px' }}
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
      
      <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden no-scrollbar">
        {column.deals.map((deal) => (
          <DealCardComponent key={deal.id} deal={deal} />
        ))}
        {column.title === "Pitching" && <AngledCard />}
        {column.title === "Pitching" && (
          <div className="h-40 px-4 py-3 bg-surface-200 rounded-lg"></div>
        )}
      </div>
    </div>
  );
};

export default function DealPipeline() {
  const pipelineData: PipelineColumn[] = [
    {
      title: "Lead",
      count: 11,
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
        },
        {
          id: "6",
          title: "Title",
          value: "New",
          squareFootage: "75K SF", 
          category: "Technology",
          description: "Short description text",
          contact: { name: "John Smith", timestamp: "3 mo" },
          activity: { task: "Series C funding", dueDate: "yesterday" },
          hasActions: true,
          isTemplate: true
        },
        {
          id: "7",
          title: "Title",
          value: "New",
          squareFootage: "75K SF",
          category: "Technology", 
          description: "Short description text",
          contact: { name: "John Smith", timestamp: "3 mo" },
          activity: { task: "Series C funding", dueDate: "yesterday" },
          hasActions: true,
          isTemplate: true
        },
        {
          id: "8",
          title: "Title",
          value: "New", 
          squareFootage: "75K SF",
          category: "Technology",
          description: "Short description text",
          contact: { name: "John Smith", timestamp: "3 mo" },
          activity: { task: "Series C funding", dueDate: "yesterday" },
          hasActions: true,
          isTemplate: true
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
        },
        {
          id: "16",
          title: "Title",
          value: "New",
          squareFootage: "75K SF",
          category: "Technology",
          description: "Short description text", 
          contact: { name: "John Smith", timestamp: "3 mo" },
          activity: { task: "Series C funding", dueDate: "yesterday" },
          hasActions: true,
          isTemplate: true
        },
        {
          id: "17",
          title: "Title",
          value: "New",
          squareFootage: "75K SF",
          category: "Technology",
          description: "Short description text",
          contact: { name: "John Smith", timestamp: "3 mo" },
          activity: { task: "Series C funding", dueDate: "yesterday" },
          hasActions: true,
          isTemplate: true
        },
        {
          id: "18",
          title: "Title",
          value: "New", 
          squareFootage: "75K SF",
          category: "Technology",
          description: "Short description text",
          contact: { name: "John Smith", timestamp: "3 mo" },
          activity: { task: "Series C funding", dueDate: "yesterday" },
          hasActions: true,
          isTemplate: true
        }
      ]
    },
    {
      title: "Closed",
      count: 6,
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
        },
        {
          id: "24",
          title: "Title",
          value: "New",
          squareFootage: "75K SF",
          category: "Technology", 
          description: "Short description text",
          contact: { name: "John Smith", timestamp: "3 mo" },
          activity: { task: "Series C funding", dueDate: "yesterday" },
          hasActions: true,
          isTemplate: true
        },
        {
          id: "25",
          title: "Title",
          value: "New",
          squareFootage: "75K SF",
          category: "Technology",
          description: "Short description text",
          contact: { name: "John Smith", timestamp: "3 mo" },
          activity: { task: "Series C funding", dueDate: "yesterday" },
          hasActions: true,
          isTemplate: true
        },
        {
          id: "26",
          title: "Title",
          value: "New",
          squareFootage: "75K SF", 
          category: "Technology",
          description: "Short description text",
          contact: { name: "John Smith", timestamp: "3 mo" },
          activity: { task: "Series C funding", dueDate: "yesterday" },
          hasActions: true,
          isTemplate: true
        }
      ]
    }
  ];

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
      <div className="flex items-start gap-6">
        {pipelineData.map((column) => (
          <PipelineColumnComponent key={column.title} column={column} />
        ))}
      </div>
    </div>
  );
}
