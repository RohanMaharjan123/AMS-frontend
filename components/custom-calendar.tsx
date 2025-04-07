"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { YearMonthPicker } from "@/components/year-month-picker";

interface CustomCalendarProps {
    selectedDate?: Date;
    onDateChange?: (date: Date | undefined) => void;
    className?: string;
}

export function CustomCalendar({ selectedDate, onDateChange, className }: CustomCalendarProps) {
    const [date, setDate] = useState<Date | undefined>(selectedDate || new Date());
    const [currentMonth, setCurrentMonth] = useState<number>(date?.getMonth() || new Date().getMonth());
    const [currentYear, setCurrentYear] = useState<number>(date?.getFullYear() || new Date().getFullYear());

    const handleDateChange = (newDate: Date | undefined) => {
        setDate(newDate);
        if (onDateChange) {
            onDateChange(newDate);
        }
    };

    const handleYearChange = (year: string) => {
        const newYear = parseInt(year, 10);
        setCurrentYear(newYear);
        updateCalendarView(newYear, currentMonth);
    };

    const handleMonthChange = (month: string) => {
        const newMonth = parseInt(month, 10) - 1; // Convert to 0-based index
        setCurrentMonth(newMonth);
        updateCalendarView(currentYear, newMonth);
    };

    const updateCalendarView = (year: number, month: number) => {
        const newDate = new Date(year, month, 1);
        setDate(newDate); // Update the calendar's displayed month
    };

    return (
        <div className={className}>
            {/* <h1 className="text-2xl font-bold mb-4">Calendar with Year/Month Picker</h1> */}
            <YearMonthPicker
                onYearChange={handleYearChange}
                onMonthChange={handleMonthChange}
                defaultYear={currentYear.toString()}
                defaultMonth={(currentMonth + 1).toString().padStart(2, "0")}
            />
            <div className="mt-4">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    month={new Date(currentYear, currentMonth)} // Control the displayed month
                    onMonthChange={(newMonth) => {
                        setCurrentMonth(newMonth.getMonth());
                        setCurrentYear(newMonth.getFullYear());
                    }}
                    initialFocus
                />
            </div>
        </div>
    );
}