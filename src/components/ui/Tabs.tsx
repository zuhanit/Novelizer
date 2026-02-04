import * as TabsPrimitive from "@radix-ui/react-tabs";
import { tv, type VariantProps } from "tailwind-variants";

export const tabsVariants = tv({
  slots: {
    root: "flex flex-col",
    list: "flex",
    trigger: [
      "flex items-center justify-center px-3 py-1.5",
      "text-xs text-muted-foreground",
      "border-transparent transition-colors duration-150",
      "hover:text-foreground",
      "data-[state=active]:text-foreground",
      "data-[state=active]:border-accent-enabled",
    ],
    content: "flex-1 outline-none",
  },
  variants: {
    direction: {
      top: {
        trigger: "border-b",
      },
      bottom: {
        root: "flex-col-reverse",
        trigger: "border-t",
      },
      left: {
        root: "flex-row",
        list: "flex-col",
        trigger: "border-l",
      },
      right: {
        root: "flex-row-reverse",
        list: "flex-col",
        trigger: "border-r",
      },
    },
  },
  defaultVariants: {
    direction: "top",
  },
});

type TabsVariants = VariantProps<typeof tabsVariants>;

interface TabsProps
  extends TabsPrimitive.TabsProps,
    TabsVariants {}

interface TabsTriggerProps
  extends TabsPrimitive.TabsTriggerProps,
    TabsVariants {}

export function Tabs({ className, direction, ...props }: TabsProps) {
  const { root } = tabsVariants({ direction });
  return <TabsPrimitive.Root className={root({ className })} {...props} />;
}

export function TabsList({
  className,
  direction,
  ...props
}: TabsPrimitive.TabsListProps & TabsVariants) {
  const { list } = tabsVariants({ direction });
  return <TabsPrimitive.List className={list({ className })} {...props} />;
}

export function TabsTrigger({ className, direction, ...props }: TabsTriggerProps) {
  const { trigger } = tabsVariants({ direction });
  return <TabsPrimitive.Trigger className={trigger({ className })} {...props} />;
}

export function TabsContent({
  className,
  ...props
}: TabsPrimitive.TabsContentProps) {
  const { content } = tabsVariants();
  return <TabsPrimitive.Content className={content({ className })} {...props} />;
}
