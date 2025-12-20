// components/FiscalYearCalendar.tsx

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FiscalYearCalendarProps {
  selectedDate: string | null; // Date in YYYY-MM format
  onDateChange: (date: string) => void; // Function to handle date change
  showOutsideDays?: boolean; // Option to show days outside the current month
}

const FiscalYearCalendar: React.FC<FiscalYearCalendarProps> = ({
  selectedDate,
  onDateChange,
  showOutsideDays = true,
}) => {
  return (
    <DayPicker
      selected={selectedDate ? new Date(selectedDate) : undefined} // Single date selection
      onDayClick={(day) => onDateChange(day.toISOString().slice(0, 7))} // Update date in YYYY-MM format
      showOutsideDays={showOutsideDays}
      captionLayout="label"
      className={cn("bg-background p-3")}
      components={{
        Chevron: ({ orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className="size-4" {...props} />;
          }
          if (orientation === "right") {
            return <ChevronRightIcon className="size-4" {...props} />;
          }
          return <ChevronDownIcon className="size-4" {...props} />;
        },
      }}
    />
  );
};

export default FiscalYearCalendar;
