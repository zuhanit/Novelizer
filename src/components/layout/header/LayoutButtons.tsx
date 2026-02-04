import { PanelLeft, PanelBottom } from "lucide-react";
import { SidebarTrigger } from "../../ui/Sidebar";

export function LayoutButtons() {
  return (
    <div className="flex gap-1">
      <SidebarTrigger id="left">
        <PanelLeft fill="#fff555" size={16} />
      </SidebarTrigger>
      <SidebarTrigger id="panel">
        <PanelBottom size={16} />
      </SidebarTrigger>
    </div>
  );
}
