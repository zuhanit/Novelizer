import { tv, VariantProps } from "tailwind-variants";
import { Slot } from "@radix-ui/react-slot";

export const buttonVariants = tv({
  base: "hover:bg-ui-selection-normal duration-150 inline-flex items-center justify-center",
  variants: {
    size: {
      sm: "p-0.5 text-xs rounded-sm",
      md: "p-1 text-sm rounded-md",
      lg: "p-2 text-base rounded-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  size,
  asChild,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp className={buttonVariants({ size, className })} {...props}>
      {children}
    </Comp>
  );
}
