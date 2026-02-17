import { Fragment, useState } from "react";
import { LayoutButtons } from "./LayoutButtons";
import { Title } from "./Title";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../../ui/Breadcrumb";
import { useEditorStore } from "../../../stores/useEditorStore";
import { useProjectStore } from "../../../stores/useProjectStore";
import { commands } from "../../../types/rust/bindings";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/Popover";
import { Input } from "../../ui/Input";

export function Header() {
  const { openFiles, activeTab, filePaths } = useEditorStore();
  const buildPath = useProjectStore((s) => s.buildPath);

  const activeFile = openFiles.find((file) => file.id === activeTab);
  const activePath = activeFile ? filePaths[activeFile.id] : undefined;
  const breadcrumbs = activePath ? buildPath(activePath) : [];

  const handleRenameSubmit = async (newName: string) => {
    if (!activeFile || !activePath) return;
    await commands.renameDocument(activePath, newName);
  };

  return (
    <header
      className="title w-full grid grid-cols-3 items-center px-2 py-1 bg-ui-background"
      data-tauri-drag-region
    >
      {/* Left: macOS traffic lights space */}
      <div className="w-20" />
      {/* Center: Title and Breadcrumbs */}
      <div className="flex items-center flex-col justify-self-center">
        {activeFile && (
          <>
            <Title title={activeFile?.name} />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((segment, idx) =>
                  idx < breadcrumbs.length - 1 ? (
                    <Fragment key={idx}>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="">{segment}</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </Fragment>
                  ) : (
                    <BreadcrumbItem key={idx}>
                      <RenamableSegment
                        value={segment}
                        onRename={handleRenameSubmit}
                      />
                    </BreadcrumbItem>
                  )
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </>
        )}
      </div>

      {/* Right: Layout Buttons */}
      <div className="flex justify-end">
        <LayoutButtons />
      </div>
    </header>
  );
}

function RenamableSegment({
  value,
  onRename,
}: {
  value: string;
  onRename: (newName: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  const handleSubmit = () => {
    if (draft.trim()) {
      onRename(draft);
    }
  };

  return (
    <Popover>
      <PopoverTrigger>{value}</PopoverTrigger>
      <PopoverContent>
        <Input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          onBlur={handleSubmit}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  );
}
