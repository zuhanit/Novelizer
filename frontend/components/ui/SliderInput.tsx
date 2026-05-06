import { Slider } from "./Slider";
import { Input } from "./Input";

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
}

export function SliderInput({
  label,
  value,
  onChange,
  min = 0,
  max = 200,
  step = 1,
  unit = "%",
}: SliderInputProps) {
  const handleSliderChange = (values: number[]) => {
    onChange(values[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(Math.min(max, Math.max(min, newValue)));
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs text-muted-foreground">{label}</label>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            className="w-14 text-right"
            inputSize="sm"
          />
          <span className="text-xs text-muted-foreground">{unit}</span>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}
