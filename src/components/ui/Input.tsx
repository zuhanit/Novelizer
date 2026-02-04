import { InputHTMLAttributes } from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const inputVariants = tv({
  base: "bg-transparent border border-editor-line rounded-sm text-muted-foreground text-xs px-2 py-1 outline-none focus:border-accent-enabled transition-colors",
  variants: {
    inputSize: {
      sm: "h-6 px-1.5",
      md: "h-7 px-2",
      lg: "h-8 px-2.5",
    },
  },
  defaultVariants: {
    inputSize: "md",
  },
});

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export function Input({ className, inputSize, ...props }: InputProps) {
  return (
    <input className={inputVariants({ inputSize, className })} {...props} />
  );
}
