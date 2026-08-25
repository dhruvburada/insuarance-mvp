"use client";

import * as React from "react";
import { format, parseISO, isValid, getYear, getMonth, setYear, setMonth } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface DatePickerProps {
  value?: string; // YYYY-MM-DD
  onChange?: (dateString: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  minYear?: number;
  maxYear?: number;
  className?: string;
  id?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
  error = false,
  minYear = 1924,
  maxYear = new Date().getFullYear() - 18, // default 18 yrs ago for DOB
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Parse existing date or default to max eligible DOB
  const parsedDate = React.useMemo(() => {
    if (!value) return undefined;
    const d = parseISO(value);
    return isValid(d) ? d : undefined;
  }, [value]);

  // Current view state inside calendar
  const [viewDate, setViewDate] = React.useState<Date>(() => {
    if (parsedDate) return parsedDate;
    const defaultDate = new Date();
    defaultDate.setFullYear(maxYear);
    return defaultDate;
  });

  // Keep viewDate synchronized when value changes
  React.useEffect(() => {
    if (parsedDate) {
      setViewDate(parsedDate);
    }
  }, [parsedDate]);

  const currentYear = getYear(viewDate);
  const currentMonth = getMonth(viewDate);

  // Generate Year options (Descending from maxYear down to minYear)
  const years = React.useMemo(() => {
    const list: number[] = [];
    for (let y = maxYear; y >= minYear; y--) {
      list.push(y);
    }
    return list;
  }, [minYear, maxYear]);

  // Generate days in month grid
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday

  const handleYearChange = (newYearStr: string) => {
    const y = parseInt(newYearStr, 10);
    const updated = setYear(viewDate, y);
    setViewDate(updated);
  };

  const handleMonthChange = (newMonthStr: string) => {
    const m = parseInt(newMonthStr, 10);
    const updated = setMonth(viewDate, m);
    setViewDate(updated);
  };

  const handlePrevMonth = () => {
    const prev = new Date(currentYear, currentMonth - 1, 1);
    if (getYear(prev) >= minYear) {
      setViewDate(prev);
    }
  };

  const handleNextMonth = () => {
    const next = new Date(currentYear, currentMonth + 1, 1);
    if (getYear(next) <= maxYear) {
      setViewDate(next);
    }
  };

  const handleDaySelect = (day: number) => {
    const selected = new Date(currentYear, currentMonth, day);
    const formatted = format(selected, "yyyy-MM-dd");
    onChange?.(formatted);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm flex items-center justify-start text-left font-normal hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-lime-400/50",
            !value && "text-slate-400",
            error && "border-rose-400 focus-visible:ring-rose-200",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 text-pine-950/70 mr-2.5 shrink-0" />
          <span className="truncate font-medium text-slate-900">
            {parsedDate ? format(parsedDate, "dd MMM yyyy") : placeholder}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[320px] p-3 rounded-2xl border-2 border-pine-950/10 shadow-2xl bg-white" align="start">
        {/* YEAR & MONTH SELECTORS */}
        <div className="flex items-center justify-between gap-1.5 pb-3 border-b border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handlePrevMonth}
            className="h-8 w-8 p-0 rounded-lg text-slate-600 hover:text-pine-950 hover:bg-slate-100"
            disabled={currentYear <= minYear && currentMonth === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5 flex-1 justify-center">
            {/* MONTH SELECT */}
            <Select value={String(currentMonth)} onValueChange={handleMonthChange}>
              <SelectTrigger className="h-8 text-xs font-bold border-slate-200 bg-slate-50 px-2 rounded-lg w-[110px]">
                <SelectValue>{MONTHS[currentMonth]}</SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {MONTHS.map((m, idx) => (
                  <SelectItem key={m} value={String(idx)} className="text-xs">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* YEAR SELECT */}
            <Select value={String(currentYear)} onValueChange={handleYearChange}>
              <SelectTrigger className="h-8 text-xs font-bold border-slate-200 bg-slate-50 px-2 rounded-lg w-[85px] font-mono">
                <SelectValue>{currentYear}</SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-56">
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)} className="text-xs font-mono">
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
            className="h-8 w-8 p-0 rounded-lg text-slate-600 hover:text-pine-950 hover:bg-slate-100"
            disabled={currentYear >= maxYear && currentMonth >= 11}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* WEEKDAYS HEADER */}
        <div className="grid grid-cols-7 gap-1 pt-2 pb-1 text-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        {/* DAYS GRID */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Empty spacer cells for first day of month */}
          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
            <div key={`empty-${idx}`} className="h-8 w-8" />
          ))}

          {/* Month days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const isSelected =
              parsedDate &&
              getYear(parsedDate) === currentYear &&
              getMonth(parsedDate) === currentMonth &&
              parsedDate.getDate() === dayNum;

            return (
              <Button
                key={dayNum}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleDaySelect(dayNum)}
                className={cn(
                  "h-8 w-8 p-0 text-xs font-medium rounded-lg transition-all",
                  isSelected
                    ? "bg-lime-400 text-pine-950 font-extrabold hover:bg-lime-300 shadow-sm border border-lime-500/30"
                    : "text-slate-700 hover:bg-slate-100 hover:text-pine-950"
                )}
              >
                {dayNum}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
