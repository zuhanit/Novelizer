import { tv } from "tailwind-variants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/Tabs";

const panelVariants = tv({
  slots: {
    base: "flex flex-col w-full bg-ui-background border-t border-editor-gutter-normal",
    content: "h-full p-2",
  },
});

export function Panel() {
  const { base, content } = panelVariants();
  return (
    <Tabs defaultValue="memo" className={base()}>
      <TabsList>
        <TabsTrigger value="memo">MEMO</TabsTrigger>
        <TabsTrigger value="graph">GRAPH</TabsTrigger>
        <TabsTrigger value="version">VERSION</TabsTrigger>
      </TabsList>
      <TabsContent value="memo" className={content()}>
        메모 내용
      </TabsContent>
      <TabsContent value="graph" className={content()}>
        그래프 내용
      </TabsContent>
      <TabsContent value="version" className={content()}>
        버전 내용
      </TabsContent>
    </Tabs>
  );
}
