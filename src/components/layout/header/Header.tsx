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
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/Popover";
import { Input } from "../../ui/Input";

export function Header() {
  const { openFiles, activeTab } = useEditorStore();
  const renameDocument = useProjectStore((s) => s.renameDocument);
  const buildPath = useProjectStore((s) => s.buildPath);

  const activeFile = openFiles.find((file) => file.id === activeTab);
  const path = activeFile ? buildPath(activeFile.id) : [];

  const handleRenameSubmit = async (newName: string) => {
    if (!activeFile) return;
    await renameDocument(activeFile.id, newName);
    // Update the local file tab's fileName and path
    useEditorStore.setState((state) => ({
      openFiles: state.openFiles.map((f) =>
        f.id === activeFile.id
          ? {
              ...f,
              fileName: newName,
              path: useProjectStore.getState().buildPath(f.id),
            }
          : f
      ),
    }));
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
            <Title title={activeFile?.fileName} />
            <Breadcrumb>
              <BreadcrumbList>
                {path.map((segment, idx) =>
                  idx < path.length - 1 ? (
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
