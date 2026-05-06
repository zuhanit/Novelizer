import * as TogglePrimitive from "@radix-ui/react-toggle";
import { tv, type VariantProps } from "tailwind-variants";

export const toggleVariants = tv({
  base: [
    "flex items-center justify-center",
    "transition-colors duration-150",
    "border-transparent",
    "data-[state=on]:border-accent-enabled",
  ],
  variants: {
    size: {
      sm: "p-0.5 text-xs rounded-xs",
      md: "p-1 text-sm rounded-xs",
      lg: "p-2 text-base rounded-md",
    },
    direction: {
      left: "border-l",
      right: "border-r",
      top: "border-t",
      bottom: "border-b",
    },
  },
  defaultVariants: {
    size: "md",
    direction: "bottom",
  },
});

/**
 * A toggle button component built on Radix UI primitives with tailwind-variants.
 * Supports both controlled and uncontrolled usage with full accessibility.
 *
 * @example
 * <Toggle size="md" variant="outline" pressed={isPressed} onPressedChange={setIsPressed}>
 *   <PanelLeft />
 * </Toggle>
 */
export function Toggle({
  className,
  size,
  direction,
  ...props
}: TogglePrimitive.ToggleProps & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      className={toggleVariants({ size, direction, className })}
      {...props}
    />
  );
}
