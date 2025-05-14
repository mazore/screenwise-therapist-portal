
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Minus } from "lucide-react";

export interface Graph {
  id: string;
  name: string;
  visible: boolean;
}

interface GraphManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  graphs: Graph[];
  onSave: (graphs: Graph[]) => void;
}

export function GraphManagerDialog({
  open,
  onOpenChange,
  graphs,
  onSave,
}: GraphManagerDialogProps) {
  const hiddenGraphs = graphs.filter((g) => !g.visible);
  const visibleGraphs = graphs.filter((g) => g.visible);

  const toggleGraphVisibility = (graphId: string) => {
    const updatedGraphs = graphs.map((g) =>
      g.id === graphId ? { ...g, visible: !g.visible } : g
    );
    onSave(updatedGraphs);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add/Remove Graphs</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">Available Graphs</h3>
            {hiddenGraphs.map((graph) => (
              <div
                key={graph.id}
                className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg"
              >
                <span>{graph.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleGraphVisibility(graph.id)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="font-medium">Visible Graphs</h3>
            {visibleGraphs.map((graph) => (
              <div
                key={graph.id}
                className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg"
              >
                <span>{graph.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleGraphVisibility(graph.id)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
