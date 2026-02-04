import { LayoutButtons } from "./LayoutButtons";
import { Title } from "./Title";
import { Breadcrumb, type BreadcrumbItem } from "../../ui/Breadcrumb";

const MockTitle = "사건 (01)";
const MockBreadcrumbs: BreadcrumbItem[] = [
  { label: "늦은 밤 이야기", href: "/" },
  { label: "전개", href: "/chapter" },
  { label: "발단", href: "/scene" },
  { label: "사건 (01)" }, // 마지막 항목은 href 없음
  {
    label: "asdf",
    onClick: () => {
      console.log("HiHi!");
    },
  },
];

export function Header() {
  return (
    <header
      className="title w-full grid grid-cols-3 items-center px-2 py-1 bg-ui-background"
      data-tauri-drag-region
    >
      {/* Left: macOS traffic lights space */}
      <div className="w-20" />
      {/* Center: Title and Breadcrumbs */}
      <div className="flex items-center flex-col justify-self-center">
        <Title title={MockTitle} />
        <Breadcrumb items={MockBreadcrumbs} separator="/" />
      </div>

      {/* Right: Layout Buttons */}
      <div className="flex justify-end">
        <LayoutButtons />
      </div>
    </header>
  );
}
