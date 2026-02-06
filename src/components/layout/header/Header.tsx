import { useState } from "react";
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

const MockTitle = "사건 (01)";

export function Header() {
  const [documentName, setDocumentName] = useState(MockTitle);
  const { openFiles, activeTab } = useEditorStore();

  const handleRenameSubmit = (newName: string) => {
    setDocumentName(newName);
    console.log("Document renamed to:", newName);
    // TODO: Implement actual rename logic with backend
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
        <Title title={documentName} />
        <Breadcrumb>
          <BreadcrumbList>
            {activeTab &&
              openFiles
                .find((file) => file.id === activeTab)
                ?.path.map((segment, idx, arr) =>
                  idx + 1 !== arr.length ? (
                    <>
                      <BreadcrumbLink href="">{segment}</BreadcrumbLink>
                      <BreadcrumbSeparator />
                    </>
                  ) : (
                    <BreadcrumbItem
                      onClick={() => {
                        console.log("Renaming...");
                      }}
                    >
                      {segment}
                    </BreadcrumbItem>
                  )
                )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right: Layout Buttons */}
      <div className="flex justify-end">
        <LayoutButtons />
      </div>
    </header>
  );
}

interface RenameInputProps {
  initialValue: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

function RenameInput({ initialValue, onSubmit, onCancel }: RenameInputProps) {
  const [value, setValue] = useState(initialValue);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit(value);
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={() => onSubmit(value)}
      autoFocus
      className="text-center bg-transparent border-b border-foreground outline-none px-2 py-1"
    />
  );
}
