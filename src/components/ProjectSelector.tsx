import { FolderOpen, Plus } from "lucide-react";
import { useProjectStore } from "../stores/useProjectStore";
import { Button } from "./ui/Button";

export function ProjectSelector() {
  const openProject = useProjectStore((s) => s.openProject);
  const createProject = useProjectStore((s) => s.createProject);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-ui-background gap-6">
      <h1 className="text-2xl font-semibold text-foreground">Novelizer</h1>
      <p className="text-sm text-muted-foreground">
        프로젝트를 열거나 새로 만드세요.
      </p>
      <div className="flex gap-3">
        <Button
          className="flex items-center gap-2 px-4 py-2 text-sm bg-ui-selection-normal hover:bg-ui-selection-active text-foreground rounded-md"
          onClick={openProject}
        >
          <FolderOpen size={16} />
          프로젝트 열기
        </Button>
        <Button
          className="flex items-center gap-2 px-4 py-2 text-sm bg-ui-selection-normal hover:bg-ui-selection-active text-foreground rounded-md"
          onClick={createProject}
        >
          <Plus size={16} />
          새 프로젝트
        </Button>
      </div>
    </div>
  );
}
