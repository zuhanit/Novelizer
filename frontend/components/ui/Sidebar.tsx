import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { cn } from "tailwind-variants";

interface SidebarState {
  open: boolean;
  openMobile: boolean;
}

interface SidebarContextProps {
  sidebars: Record<string, SidebarState>;
  toggleSidebar: (id: string) => void;
  setOpen: (id: string, open: boolean) => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextProps | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}

interface SidebarProviderProps {
  children: ReactNode;
  defaultSidebars?: Record<string, { open?: boolean; openMobile?: boolean }>;
}

export function SidebarProvider({
  children,
  defaultSidebars = {},
}: SidebarProviderProps) {
  const [sidebars, setSidebars] = useState<Record<string, SidebarState>>(() => {
    const initial: Record<string, SidebarState> = {};
    Object.entries(defaultSidebars).forEach(([id, config]) => {
      initial[id] = {
        open: config.open ?? true,
        openMobile: config.openMobile ?? false,
      };
    });
    return initial;
  });

  // TODO: Implement mobile detection
  const isMobile = false;

  const toggleSidebar = useCallback(
    (id: string) => {
      setSidebars((prev) => {
        const current = prev[id] || { open: true, openMobile: false };
        return {
          ...prev,
          [id]: {
            ...current,
            open: isMobile ? current.open : !current.open,
            openMobile: isMobile ? !current.openMobile : current.openMobile,
          },
        };
      });
    },
    [isMobile]
  );

  const setOpen = useCallback((id: string, open: boolean) => {
    setSidebars((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { open: false, openMobile: false }),
        open,
      },
    }));
  }, []);

  return (
    <SidebarContext.Provider
      value={{ sidebars, toggleSidebar, setOpen, isMobile }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function Sidebar({ id, children, className }: SidebarProps) {
  const { sidebars, isMobile } = useSidebar();
  const sidebar = sidebars[id] || { open: false, openMobile: false };
  const isOpen = isMobile ? sidebar.openMobile : sidebar.open;

  return (
    <aside
      className={cn(
        "bg-ui-background border-r border-editor-gutter-normal transition-all duration-200",
        isOpen ? "w-64" : "w-0",
        className
      )}
    >
      {isOpen && children}
    </aside>
  );
}

interface SidebarTriggerProps {
  id: string;
  children?: ReactNode;
  className?: string;
}

export function SidebarTrigger({
  id,
  children,
  className,
}: SidebarTriggerProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={() => toggleSidebar(id)}
      className={cn("p-2 hover:bg-ui-hover transition-colors", className)}
      aria-label="Toggle sidebar"
    >
      {children}
    </button>
  );
}
