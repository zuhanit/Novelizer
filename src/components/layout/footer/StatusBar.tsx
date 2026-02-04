import { useState } from "react";
import { tv } from "tailwind-variants";
import { Button } from "../../ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/Popover";
import { SliderInput } from "../../ui/SliderInput";

const statusbar = tv({
  slots: {
    base: "flex w-full text-foreground bg-ui-background border-t border-t-editor-gutter-normal",
    left: "flex-1",
    right: "flex gap-2.5",
  },
});

export function StatusBar() {
  const { base, left, right } = statusbar();
  const [letterSpacing, setLetterSpacing] = useState(100);
  const [lineHeight, setLineHeight] = useState(100);

  return (
    <div className={base()}>
      <section className={left()}>
        <Button>글자수 123</Button>
      </section>
      <section className={right()}>
        <Popover>
          <PopoverTrigger>글자수 1800자</PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-4 p-2">
              <section>공백 제외 1800자</section>
              <section>공백 포함 23000자</section>
              <section>6100바이트</section>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>
            자간 {letterSpacing}% 행간 {lineHeight}%
          </PopoverTrigger>
          <PopoverContent sideOffset={6}>
            <div className="flex flex-col gap-2 p-2 w-48">
              <p className="text-md text-muted-foreground font-bold">
                자간 및 행간
              </p>
              <SliderInput
                label="자간"
                value={letterSpacing}
                onChange={setLetterSpacing}
                min={50}
                max={200}
              />
              <SliderInput
                label="행간"
                value={lineHeight}
                onChange={setLineHeight}
                min={50}
                max={300}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger>버전 3</PopoverTrigger>
          <PopoverContent sideOffset={4}>3</PopoverContent>
        </Popover>
      </section>
    </div>
  );
}
