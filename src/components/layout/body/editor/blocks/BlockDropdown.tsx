import {
  AlignLeft,
  ChevronRight,
  Ellipsis,
  MessageSquare,
  Plus,
  RefreshCw,
  StickyNote,
  Trash2,
} from "lucide-react";
import { BlockKind } from "../../../../../stores/useEditorStore";
import { Button } from "../../../../ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../../../ui/DropdownMenu";

interface BlockDropdownProps {
  kind?: BlockKind;
  onConvert: (kind: BlockKind) => void;
  onAdd: () => void;
  onDelete: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BlockDropdown({
  kind,
  onConvert,
  onAdd,
  onDelete,
  open,
  onOpenChange,
}: BlockDropdownProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Block options">
          <Ellipsis size={16} className="text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-foreground">
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <RefreshCw size={16} /> 전환
              <ChevronRight size={16} className="ml-auto" />
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent sideOffset={4} alignOffset={-5}>
              <DropdownMenuItem
                disabled={kind === "memo"}
                onClick={() => onConvert("memo")}
              >
                <StickyNote size={16} />
                메모
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={kind === "content"}
                onClick={() => onConvert("content")}
              >
                <AlignLeft size={16} />
                본문
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onAdd}>
            <Plus size={16} /> 추가
            <DropdownMenuShortcut>↵</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete}>
            <Trash2 size={16} />
            삭제
            <DropdownMenuShortcut>Del</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onAdd}>
            <MessageSquare size={16} /> 블록 메모
            <DropdownMenuShortcut>Add</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
