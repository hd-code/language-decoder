import * as React from "react";

interface SelectProps<T> {
    onChange: (value: T) => void;
    options: {
        label: string;
        value: T;
    }[];
    selected?: T;
    className?: string;
}

export function Select<T>({
    className = "",
    onChange,
    options,
    selected,
}: SelectProps<T>): JSX.Element {
    const selectedI = options.findIndex((opt) => opt.value === selected);
    return (
        <select
            className={className}
            value={selectedI}
            onChange={(ev) =>
                onChange(options[parseInt(ev.target.value)].value)
            }
        >
            {options.map((opt, i) => (
                <option key={i} value={i}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}
