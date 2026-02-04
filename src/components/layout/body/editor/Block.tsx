import { tv, VariantProps } from "tailwind-variants";
import {
  EditorProvider,
  useCurrentEditor,
  useEditorState,
} from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
} from "lucide-react";
import { Button } from "../../../ui/Button";

const extensions = [StarterKit, Underline];

const block = tv({
  slots: {
    base: "group flex items-center justify-center gap-2.5 w-full",
    vcs: "w-1 h-4 rounded-xs",
    lineno:
      "text-muted-foreground w-10 flex items-end justify-end group-focus-within:justify-center",
    contents:
      "group-focus-within:bg-ui-line text-foreground w-full p-2 rounded-sm",
    menu: "flex items-center gap-2.5 bg-ui-panel-background border-ui-border rounded-sm shadow-popup p-1",
  },
  variants: {
    kind: {
      content: {},
      memo: {
        lineno: "hidden",
        contents: "border border-ui-selection-active",
      },
    },
    vcsState: {
      default: {
        vcs: "invisible",
      },
      added: { vcs: "bg-vcs-added" },
      modified: { vcs: "bg-vcs-modified" },
      removed: { vcs: "bg-vcs-removed" },
    },
  },
  defaultVariants: {
    kind: "content",
  },
});

function BlockBubbleMenu({ className }: { className: string }) {
  const { editor } = useCurrentEditor();
  if (!editor) return null;

  const { isBold, isItalic, isStrikethrough, isUnderline } = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isStrikethrough: ctx.editor.isActive("strike"),
      isUnderline: ctx.editor.isActive("underline"),
    }),
  });

  return (
    <BubbleMenu
      className={className}
      options={{ placement: "top", offset: 16, flip: true }}
    >
      <Button
        size="md"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={16} className={isBold ? "text-accent-enabled" : ""} />
      </Button>
      <Button
        size="md"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={16} className={isItalic ? "text-accent-enabled" : ""} />
      </Button>
      <Button
        size="md"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon
          size={16}
          className={isUnderline ? "text-accent-enabled" : ""}
        />
      </Button>
      <Button
        size="md"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough
          size={16}
          className={isStrikethrough ? "text-accent-enabled" : ""}
        />
      </Button>
    </BubbleMenu>
  );
}

interface BlockProps extends VariantProps<typeof block> {
  lineno: number;
  content: string;
}

export function Block({ kind, vcsState, lineno, content }: BlockProps) {
  const {
    base,
    vcs,
    lineno: linestyle,
    contents,
    menu,
  } = block({ kind, vcsState });

  return (
    <section className={base()}>
      <span className={vcs()} />
      <span className={linestyle()}>{lineno}</span>
      <div className={contents()}>
        <EditorProvider
          extensions={extensions}
          content={content}
          editorProps={{ attributes: { class: "outline-none" } }}
        >
          <BlockBubbleMenu className={menu()} />
        </EditorProvider>
      </div>
    </section>
  );
}
