import { Search, Plus, MoreHorizontal, Edit, Mail, Phone, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    default: 'bg-badge-default-bg text-badge-default-text'
  };
  
  return (
    <div className={`px-[5.6px] py-[3.5px] rounded-md text-[10.5px] font-semibold leading-[15.75px] ${variants[variant]}`}>
      {children}
    </div>
  );
};

const DealCardComponent = ({ deal }: { deal: DealCard }) => {
  if (deal.isTemplate) {
    return (
      <div className="p-4 bg-white shadow-sm rounded-lg border border-[#DFE7EF] flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 text-sm font-semibold text-[#111827]">{deal.title}</div>
          <MoreHorizontal size={12} className="text-[#111827]" />
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
          <div className="p-2 bg-white border border-[#DFE7EF] rounded-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#9CA3AF] rounded-full"></div>
              <div className="text-[10.5px] text-[#111827] leading-[15.75px]">{deal.contact.name}</div>
            </div>
            <div className="text-[10.5px] text-[#6B7280] leading-[15.75px]">{deal.contact.timestamp}</div>
          </div>
          <div className="px-2 py-3 bg-[#F9FAFB] rounded-b-md flex items-center justify-between">
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
    <div className="p-4 bg-white shadow-sm rounded-lg border border-[#DFE7EF] flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 text-sm font-semibold text-[#111827]">{deal.title}</div>
        <MoreHorizontal size={12} className="text-[#111827]" />
      </div>
      
      <div className="flex items-center gap-2">
        {deal.value && <Badge variant="success">{deal.value}</Badge>}
        {deal.squareFootage && <Badge variant="info">{deal.squareFootage}</Badge>}
        <Badge variant="default">{deal.category}</Badge>
      </div>
      
      <div className="flex flex-col">
        <div className="p-2 bg-white border border-[#DFE7EF] rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#9CA3AF] rounded-full"></div>
            <div className="text-[10.5px] text-[#111827] leading-[15.75px]">{deal.contact.name}</div>
          </div>
          <div className="text-[10.5px] text-[#6B7280] leading-[15.75px]">{deal.contact.timestamp}</div>
        </div>
        <div className="px-2 py-3 bg-[#F9FAFB] rounded-b-md flex items-center justify-between">
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

const PipelineColumnComponent = ({ column }: { column: PipelineColumn }) => {
  return (
    <div className="flex-1 h-[932px] pt-4 px-4 bg-surface-50 rounded-2xl border border-surface-200 flex flex-col gap-4 overflow-hidden">
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
      
      <div className="flex flex-col gap-4 overflow-y-auto no-scrollbar">
        {column.deals.map((deal) => (
          <DealCardComponent key={deal.id} deal={deal} />
        ))}
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