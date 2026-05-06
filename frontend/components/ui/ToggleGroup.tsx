import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { tv, type VariantProps } from "tailwind-variants";
import { toggleVariants } from "./Toggle";

const toggleGroupVariants = tv({
  base: "flex",
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

type ToggleGroupProps = (
  | ToggleGroupPrimitive.ToggleGroupSingleProps
  | ToggleGroupPrimitive.ToggleGroupMultipleProps
) &
  VariantProps<typeof toggleGroupVariants>;

interface ToggleGroupItemProps
  extends ToggleGroupPrimitive.ToggleGroupItemProps,
    VariantProps<typeof toggleVariants> {}

/**
 * A toggle group component built on Radix UI primitives with tailwind-variants.
 * Groups multiple toggle buttons together with single or multiple selection.
 *
 * @example
 * // Single selection
 * <ToggleGroup type="single" defaultValue="center">
 *   <ToggleGroupItem value="left" size="md">
 *     <AlignLeft />
 *   </ToggleGroupItem>
 *   <ToggleGroupItem value="center" size="md">
 *     <AlignCenter />
 *   </ToggleGroupItem>
 *   <ToggleGroupItem value="right" size="md">
 *     <AlignRight />
 *   </ToggleGroupItem>
 * </ToggleGroup>
 *
 * // Multiple selection
 * <ToggleGroup type="multiple" defaultValue={["bold", "italic"]}>
 *   <ToggleGroupItem value="bold" size="sm"><b>B</b></ToggleGroupItem>
 *   <ToggleGroupItem value="italic" size="sm"><i>I</i></ToggleGroupItem>
 *   <ToggleGroupItem value="underline" size="sm"><u>U</u></ToggleGroupItem>
 * </ToggleGroup>
 */
export function ToggleGroup({
  className,
  orientation,
  ...props
}: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      className={toggleGroupVariants({ orientation, className })}
      {...props}
    />
  );
}

export function ToggleGroupItem({
  className,
  size,
  direction,
  ...props
}: ToggleGroupItemProps) {
  return (
    <ToggleGroupPrimitive.Item
      className={toggleVariants({ size, direction, className })}
      {...props}
    />
  );
}
