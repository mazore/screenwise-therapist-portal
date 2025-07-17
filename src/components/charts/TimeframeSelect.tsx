import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const timeframes = [
    { label: '12M', resolution: 'month', amount: 12, getLabel: (d) => d.format('MMM') },
    { label: '6M',  resolution: 'month', amount: 6,  getLabel: (d) => d.format('MMM') },
    { label: '12W', resolution: 'week',  amount: 12, getLabel: (d) => d.format('M/D') },
    { label: '6W',  resolution: 'week',  amount: 6,  getLabel: (d) => d.format('MMM D') },
    { label: '30D', resolution: 'day',   amount: 30, getLabel: (d) => d.format('MMM D')},
    { label: '10D', resolution: 'day',   amount: 10, getLabel: (d) => d.format('M/D') },
];

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
          <SelectItem key={timeframe.label} value={timeframe.label}>
            {timeframe.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

