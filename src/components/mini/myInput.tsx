import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { ReactNode } from "react";

export function MyInput(
    {
        title,
        type = "text",
        error,
        value,
        onChange,
        placeholder,
        icon
    }: {
        icon?: ReactNode
        title: string;
        type: "number" | "text";
        error?: string;
        value: number | string;
        onChange: (value: string) => void;
        placeholder?: string;
    }) {
    return (
        <div className="flex flex-col gap-1">
            <Label>{ title }</Label>
            <div className=" flex items-center gap-1 border border-input rounded-lg px-3">
                { icon }
                <Input
                    type={ type }
                    onChange={ (e) => onChange(e.target.value) }
                    value={ value }
                    placeholder={ placeholder }
                    className="w-full ml-2 border-white"
                />
            </div>
            { error && <p className="text-red-500 text-xs">Error: { error }</p> }
        </div>
    );
}