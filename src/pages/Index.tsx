import { useState } from "react";
import DealPipeline from "@/components/DealPipeline";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showIcons, setShowIcons] = useState(false);

  return (
    <div className="relative min-h-screen bg-background p-8 overflow-x-auto">
      {/* Toggle Button pinned to left/top */}
      <Button
        variant="default"
        size="sm"
        className="absolute left-8 top-8 px-5 py-2 rounded-md shadow-md bg-blue-500 text-white hover:bg-blue-600 shrink-0"
        onClick={() => setShowIcons(!showIcons)}
      >
        {showIcons ? 'Hide Card Icons' : 'Show Card Icons'}
      </Button>

      {/* Centered Kanban Board */}
      <div className="flex justify-center">
        <DealPipeline showIcons={showIcons} />
      </div>
    </div>
  );
};

export default Index;
