
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const timeframes = [
  { value: "12M", label: "12 Months" },
  { value: "6M", label: "6 Months" },
  { value: "12W", label: "12 Weeks" },
  { value: "6W", label: "6 Weeks" },
  { value: "30D", label: "30 Days" },
  { value: "10D", label: "10 Days" },
] as const;

interface TimeframeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const TimeframeSelect = ({ value, onValueChange }: TimeframeSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select timeframe" />
      </SelectTrigger>
      <SelectContent>
        {timeframes.map((timeframe) => (
          <SelectItem key={timeframe.value} value={timeframe.value}>
            {timeframe.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
