import * as SliderPrimitive from "@radix-ui/react-slider";
import { tv, type VariantProps } from "tailwind-variants";

export const sliderVariants = tv({
  slots: {
    root: "relative flex items-center select-none touch-none",
    track: "relative grow rounded-full bg-ui-line",
    range: "absolute rounded-full bg-accent-enabled",
    thumb:
      "block rounded-full bg-ui-panel-background border-2 border-ui-foreground focus:outline-none",
  },
  variants: {
    orientation: {
      horizontal: {
        root: "w-full h-5",
        track: "h-1 w-full",
        range: "h-full",
        thumb: "w-3 h-3",
      },
      vertical: {
        root: "flex-col w-5 h-full",
        track: "w-1 h-full",
        range: "w-full",
        thumb: "w-3 h-3",
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});

interface SliderProps
  extends SliderPrimitive.SliderProps,
    VariantProps<typeof sliderVariants> {}

export function Slider({ orientation = "horizontal", ...props }: SliderProps) {
  const { root, track, range, thumb } = sliderVariants({ orientation });

  return (
    <SliderPrimitive.Root
      className={root()}
      orientation={orientation}
      {...props}
    >
      <SliderPrimitive.Track className={track()}>
        <SliderPrimitive.Range className={range()} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className={thumb()} />
    </SliderPrimitive.Root>
  );
}
