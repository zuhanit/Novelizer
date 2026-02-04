import { Editor } from "./components/layout/body/editor/Editor";
import { LeftSidebar } from "./components/layout/body/sidebar/LeftSidebar";
import { Panel } from "./components/layout/footer/Panel";
import { StatusBar } from "./components/layout/footer/StatusBar";
import { Header } from "./components/layout/header/Header";
import { SidebarProvider } from "./components/ui/Sidebar";

function App() {
  return (
    <>
      <SidebarProvider>
        <Header />
        <main className="flex-1 min-h-0 flex">
          <LeftSidebar />
          <Editor />
        </main>
      </SidebarProvider>
      <footer>
        <Panel />
        <StatusBar />
      </footer>
    </>
  );
}

export default App;
