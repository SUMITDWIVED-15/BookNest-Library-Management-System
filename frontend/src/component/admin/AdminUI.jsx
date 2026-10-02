import { useEffect } from "react";
import { X, Search, ChevronLeft, ChevronRight } from "lucide-react";

export function AdminPage({ title, subtitle, action, children }) {
    const words = String(title ?? "").trim().split(/\s+/);
    const lead = words.shift() || "";
    const accent = words.join(" \u0020");

    return (
        <div className="admin-page min-h-full bg-[#f7f8fc] p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 className="admin-page-title text-[28px] font-bold tracking-tight leading-tight">
                        <span className="admin-title-lead">{lead}</span>
                        {accent && <span className="admin-title-accent"> {accent}</span>}
                    </h1>

                    {subtitle && (
                        <p className="mt-1 text-[14px] text-gray-500">
                            {subtitle}
                        </p>
                    )}
                </div>

                {action}
            </div>

            {children}
        </div>
    );
}

const tones = {
    purple: "bg-purple-50 text-purple-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-red-600",
    cyan: "bg-cyan-50 text-cyan-600",
};

export function StatCard({
    label,
    value,
    icon: Icon,
    tone = "purple",
    subtext,
    gradient = true,
}) {
    const gradientStyles = {
        purple: "bg-gradient-to-r from-[#7b57d8] to-[#b24fd1] text-white",
        green: "bg-gradient-to-r from-[#54bd7c] to-[#6bd06f] text-white",
        blue: "bg-gradient-to-r from-[#4b82e6] to-[#48a6e9] text-white",
        orange: "bg-gradient-to-r from-[#f7a91b] to-[#f6b12f] text-white",
        red: "bg-gradient-to-r from-[#f55f72] to-[#f26f95] text-white",
        cyan: "bg-gradient-to-r from-[#31bfe8] to-[#24d0d5] text-white",
        pink: "bg-gradient-to-r from-[#ee5da4] to-[#ef74c4] text-white",
    };

    const autoTone = (() => {
        const text = String(label ?? "").toLowerCase();

        if (text.includes("book") || text.includes("loan")) return "purple";
        if (text.includes("user") || text.includes("member")) return "green";
        if (text.includes("fine") || text.includes("payment") || text.includes("amount")) return "orange";
        if (text.includes("reservation") || text.includes("subscription")) return "blue";
        if (text.includes("genre") || text.includes("category")) return "cyan";
        if (text.includes("active") || text.includes("available")) return "green";

        return "purple";
    })();

    const resolvedTone = tone === "purple" ? autoTone : tone;

    return (
        <div className={`admin-stat-card ${gradient ? (gradientStyles[resolvedTone] || gradientStyles.purple) : "bg-white border border-[#e4e7ec] text-gray-900"} rounded-xl p-5 min-h-[132px] shadow-[0_2px_8px_rgba(15,23,42,0.06)]`}>

            <div className="flex items-start justify-between gap-3">

                <div>
                    <p className={`text-[13px] font-medium ${gradient ? "text-white/90" : "text-gray-500"}`}>
                        {label}
                    </p>

                    <h3 className={`mt-2 text-[28px] font-bold ${gradient ? "text-white" : "text-gray-900"}`}>
                        {value}
                    </h3>

                    {subtext && (
                        <p className={`mt-1 text-[11px] ${gradient ? "text-white/80" : "text-gray-400"}`}>
                            {subtext}
                        </p>
                    )}
                </div>

                {Icon && (
                    <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center ${
                            (gradient ? "bg-white/20 text-white" : tones[resolvedTone] || tones.purple)
                        }`}
                    >
                        <Icon size={18} />
                    </div>
                )}

            </div>
        </div>
    );
}

export function AdminCard({ children, className = "" }) {
    return (
        <div
            className={`bg-white border border-[#e4e7ec] rounded-[4px] shadow-[0_1px_3px_rgba(15,23,42,0.05)] ${className}`}
        >
            {children}
        </div>
    );
}

export function SearchBar({
    value,
    onChange,
    placeholder = "Search...",
}) {
    return (
        <div className="relative w-full md:w-80">

            <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-11 pl-10 pr-3 border border-[#dfe3e8] rounded-lg text-sm outline-none focus:border-[#a78bfa] bg-white"
            />

        </div>
    );
}

export function StatusBadge({ value }) {
    const v = String(value ?? "").toUpperCase();

    let cls = "bg-[#eef0f3] text-gray-600";

    if (
        [
            "ACTIVE",
            "AVAILABLE",
            "PAID",
            "RETURNED",
            "FULFILLED",
            "SUCCESS",
        ].includes(v)
    ) {
        cls = "bg-[#ddf8e9] text-[#1c9b58]";
    } else if (
        [
            "PENDING",
            "CHECKED_OUT",
            "PARTIALLY_PAID",
        ].includes(v)
    ) {
        cls = "bg-[#fff0c9] text-[#c78600]";
    } else if (
        [
            "OVERDUE",
            "FAILED",
            "CANCELLED",
            "EXPIRED",
            "WAIVED",
            "INACTIVE",
            "LOST",
            "DAMAGED",
        ].includes(v)
    ) {
        cls = "bg-[#ffe4e9] text-[#e34f68]";
    } else if (["AVAILABLE"].includes(v)) {
        cls = "bg-[#e4f3ff] text-[#2686c9]";
    }

    return (
        <span
            className={`inline-flex px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${cls}`}
        >
            {value || "—"}
        </span>
    );
}

export function Button({
    children,
    onClick,
    type = "button",
    variant = "primary",
    disabled = false,
    className = "",
}) {
    const styles = {
        primary:
            "bg-[#6f42d9] text-white hover:bg-[#5d35bf]",
        secondary:
            "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
        danger:
            "bg-red-500 text-white hover:bg-red-600",
        success:
            "bg-green-600 text-white hover:bg-green-700",
        warning:
            "bg-orange-500 text-white hover:bg-orange-600",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`min-h-10 px-4 rounded-lg text-[13px] font-semibold transition disabled:opacity-50 ${styles[variant]} ${className}`}
        >
            {children}
        </button>
    );
}

export function Modal({
    open,
    title,
    onClose,
    children,
    width = "max-w-2xl",
}) {
    useEffect(() => {
        const fn = (e) =>
            e.key === "Escape" && onClose?.();

        if (open) {
            window.addEventListener("keydown", fn);
        }

        return () =>
            window.removeEventListener("keydown", fn);
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4"
            onMouseDown={(e) =>
                e.target === e.currentTarget && onClose?.()
            }
        >
            <div
                className={`w-full ${width} max-h-[90vh] overflow-y-auto bg-white rounded-[4px] shadow-2xl`}
            >

                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">

                    <h2 className="text-[18px] font-bold text-gray-900">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700"
                    >
                        <X size={18} />
                    </button>

                </div>

                <div className="p-4">
                    {children}
                </div>

            </div>
        </div>
    );
}

export function Field({
    label,
    value,
    onChange,
    type = "text",
    required = false,
    placeholder = "",
    children,
}) {
    return (
        <label className="block">

            <span className="block text-[13px] font-semibold text-gray-700 mb-2">
                {label}

                {required && (
                    <span className="text-red-500">
                        {" "}*
                    </span>
                )}
            </span>

            {children || (
                <input
                    type={type}
                    value={value ?? ""}
                    onChange={(e) =>
                        onChange?.(e.target.value)
                    }
                    placeholder={placeholder}
                    className="w-full h-11 px-3 border border-[#dfe3e8] rounded-lg text-sm outline-none focus:border-[#a78bfa]"
                />
            )}

        </label>
    );
}

export function SelectField({
    label,
    value,
    onChange,
    options,
    required = false,
}) {
    return (
        <Field
            label={label}
            required={required}
            value={value}
            onChange={onChange}
        >
            <select
                value={value ?? ""}
                onChange={(e) =>
                    onChange?.(e.target.value)
                }
                className="w-full h-11 px-3 border border-[#dfe3e8] rounded-lg text-sm bg-white outline-none focus:border-[#a78bfa]"
            >
                <option value="">
                    Select...
                </option>

                {options.map((o) => (
                    <option
                        key={o.value}
                        value={o.value}
                    >
                        {o.label}
                    </option>
                ))}
            </select>
        </Field>
    );
}

export function Pagination({
    page,
    totalPages,
    onChange,
}) {
    const total = Number(totalPages || 0);

    if (total <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-end gap-1.5 px-4 py-2 border-t border-gray-100">

            <button
                type="button"
                disabled={page <= 0}
                onClick={() => onChange(page - 1)}
                className="w-7 h-7 rounded-[3px] border border-gray-200 flex items-center justify-center disabled:opacity-40"
            >
                <ChevronLeft size={14} />
            </button>

            <span className="text-[13px] text-gray-500">
                Page {page + 1} of {total}
            </span>

            <button
                type="button"
                disabled={page >= total - 1}
                onClick={() => onChange(page + 1)}
                className="w-7 h-7 rounded-[3px] border border-gray-200 flex items-center justify-center disabled:opacity-40"
            >
                <ChevronRight size={14} />
            </button>

        </div>
    );
}

export function EmptyState({
    text = "No records found.",
}) {
    return (
        <div className="py-12 text-center text-xs text-gray-400">
            {text}
        </div>
    );
}

export function LoadingState() {
    return (
        <div className="py-12 text-center text-xs text-gray-400">
            Loading...
        </div>
    );
}

export function ErrorState({ message }) {
    return (
        <div className="p-4 rounded-lg bg-red-50 text-red-600 text-xs">
            {message || "Something went wrong."}
        </div>
    );
}

export function Table({
    columns,
    rows = [],
    rowKey,
    emptyText = "No records found.",
}) {
    return (
        <div className="overflow-x-auto">

            <table className="w-full min-w-[900px] text-left">

                <thead>
                    <tr className="bg-[#f0f0ff] border-b border-[#dfe1ef]">

                        {columns.map((c) => (
                            <th
                                key={c.key}
                                className="px-4 py-3 text-[11px] uppercase tracking-wide text-gray-500 font-semibold"
                            >
                                {c.label}
                            </th>
                        ))}

                    </tr>
                </thead>

                <tbody>

                    {rows.length ? (
                        rows.map((row, i) => (
                            <tr
                                key={
                                    rowKey
                                        ? rowKey(row, i)
                                        : row.id ?? i
                                }
                                className="border-b border-gray-100 hover:bg-[#fafafa]"
                            >

                                {columns.map((c) => (
                                    <td
                                        key={c.key}
                                        className="px-4 py-3.5 text-[13px] text-gray-700 align-middle"
                                    >
                                        {c.render
                                            ? c.render(row, i)
                                            : row[c.key] ?? "—"}
                                    </td>
                                ))}

                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length}>
                                <EmptyState text={emptyText} />
                            </td>
                        </tr>
                    )}

                </tbody>

            </table>

        </div>
    );
}

export function TextAreaField({
    label,
    value,
    onChange,
    rows = 3,
    placeholder = "",
}) {
    return (
        <Field
            label={label}
            value={value}
            onChange={onChange}
        >
            <textarea
                rows={rows}
                value={value ?? ""}
                onChange={(e) =>
                    onChange?.(e.target.value)
                }
                placeholder={placeholder}
                className="w-full border border-[#dfe3e8] rounded-lg p-3 text-sm outline-none focus:border-[#a78bfa]"
            />
        </Field>
    );
}