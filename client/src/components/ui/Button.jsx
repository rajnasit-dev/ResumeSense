import { Loader2 } from "lucide-react"
import { cn } from "./utils"

const variants = {
    primary: "bg-gradient-to-b from-brand-500 to-brand-700 text-white shadow-[0_14px_32px_rgba(15,118,110,0.28)] hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(15,118,110,0.34)]",
    secondary: "border border-slate-200/80 bg-white/80 text-slate-950 shadow-sm hover:-translate-y-0.5 hover:border-brand-500/30 hover:bg-white",
    outline: "border border-slate-300 bg-transparent text-slate-950 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100/80 hover:text-slate-950",
    danger: "bg-red-50 text-red-700 hover:bg-red-100",
}

const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base",
    icon: "size-10 p-0",
}

export default function Button({
    as: Component = "button",
    variant = "primary",
    size = "md",
    loading = false,
    disabled,
    className,
    children,
    ...props
}) {
    return (
        <Component
            className={cn(
                "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-bold leading-none transition-all duration-200 active:translate-y-px disabled:pointer-events-none disabled:opacity-55",
                variants[ variant ],
                sizes[ size ],
                className
            )}
            disabled={Component === "button" ? disabled || loading : undefined}
            aria-disabled={disabled || loading || undefined}
            {...props}
        >
            {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {children}
        </Component>
    )
}
