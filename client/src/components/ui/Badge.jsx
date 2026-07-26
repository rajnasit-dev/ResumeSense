import { cn } from "./utils"

const variants = {
    default: "border-slate-200 bg-white/80 text-slate-600",
    brand: "border-brand-500/20 bg-brand-50 text-brand-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-red-200 bg-red-50 text-red-700",
    purple: "border-violet-200 bg-violet-50 text-violet-700",
}

export default function Badge({ variant = "default", className, children, ...props }) {
    return (
        <span className={cn("inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-extrabold tracking-wide", variants[ variant ], className)} {...props}>
            {children}
        </span>
    )
}
