import { Plus } from "lucide-react";
import { Button } from "../../../ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../../../ui/Popover";
import { BlockKind } from "../../../../stores/useEditorStore";

interface AddBlockButtonProps {
  onAddBlock: (kind: BlockKind) => void;
}

export function AddBlockButton({ onAddBlock }: AddBlockButtonProps) {
  return (
    <div className="relative group/add-block h-0">
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/add-block:opacity-100 transition-opacity z-10">
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm" className="bg-ui-panel-background border border-ui-border rounded-full shadow-sm">
              <Plus size={16} className="text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-1 bg-ui-panel-background border border-ui-border rounded-sm shadow-popup">
            <div className="flex flex-col gap-0.5">
              <Button
                size="md"
                onClick={() => onAddBlock("content")}
                className="justify-start px-2 py-1.5 text-sm text-foreground hover:bg-ui-selection-normal rounded-sm"
              >
                Content Block
              </Button>
              <Button
                size="md"
                onClick={() => onAddBlock("memo")}
                className="justify-start px-2 py-1.5 text-sm text-foreground hover:bg-ui-selection-normal rounded-sm"
              >
                Memo Block
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="w-full h-4 hover:bg-ui-selection-normal/30 transition-colors" />
    </div>
  );
}
