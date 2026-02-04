import { useState } from "react";
import { LayoutButtons } from "./LayoutButtons";
import { Title } from "./Title";
import { Breadcrumb, type BreadcrumbItem } from "../../ui/Breadcrumb";

const MockTitle = "사건 (01)";

export function Header() {
  const [isRenaming, setIsRenaming] = useState(false);
  const [documentName, setDocumentName] = useState(MockTitle);

  const handleNavigate = (path: string) => {
    console.log("Navigating to:", path);
    // TODO: Implement actual navigation logic with router or state management
  };

  const handleRename = () => {
    setIsRenaming(true);
  };

  const handleRenameSubmit = (newName: string) => {
    setDocumentName(newName);
    setIsRenaming(false);
    console.log("Document renamed to:", newName);
    // TODO: Implement actual rename logic with backend
  };

  const MockBreadcrumbs: BreadcrumbItem[] = [
    {
      label: "늦은 밤 이야기",
      onClick: () => handleNavigate("/"),
    },
    {
      label: "전개",
      onClick: () => handleNavigate("/chapter"),
    },
    {
      label: "발단",
      onClick: () => handleNavigate("/scene"),
    },
    {
      label: documentName,
      onClick: handleRename,
    },
  ];

  return (
    <header
      className="title w-full grid grid-cols-3 items-center px-2 py-1 bg-ui-background"
      data-tauri-drag-region
    >
      {/* Left: macOS traffic lights space */}
      <div className="w-20" />
      {/* Center: Title and Breadcrumbs */}
      <div className="flex items-center flex-col justify-self-center">
        {isRenaming ? (
          <RenameInput
            initialValue={documentName}
            onSubmit={handleRenameSubmit}
            onCancel={() => setIsRenaming(false)}
          />
        ) : (
          <Title title={documentName} />
        )}
        <Breadcrumb items={MockBreadcrumbs} separator="/" />
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
