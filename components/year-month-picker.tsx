"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface YearMonthPickerProps {
    onYearChange: (year: string) => void;
    onMonthChange: (month: string) => void;
    defaultYear: string;
    defaultMonth: string;
}

export function YearMonthPicker({
    onYearChange,
    onMonthChange,
    defaultYear,
    defaultMonth,
}: YearMonthPickerProps) {
    const years = Array.from({ length: 201 }, (_, i) => (1900 + i).toString());

    const months = [
        { value: "01", label: "January" },
        { value: "02", label: "February" },
        { value: "03", label: "March" },
        { value: "04", label: "April" },
        { value: "05", label: "May" },
        { value: "06", label: "June" },
        { value: "07", label: "July" },
        { value: "08", label: "August" },
        { value: "09", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

    return (
        <div className="flex gap-2">
            <Select defaultValue={defaultYear} onValueChange={onYearChange}>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                    {years.map((y) => (
                        <SelectItem key={y} value={y}>
                            {y}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select defaultValue={defaultMonth} onValueChange={onMonthChange}>
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                    {months.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                            {m.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
