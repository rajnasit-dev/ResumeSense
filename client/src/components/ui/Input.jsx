import { cn } from "./utils"

export function Field({ label, htmlFor, hint, error, children, className }) {
    return (
        <div className={cn("grid gap-2", className)}>
            {label && <label htmlFor={htmlFor} className="text-sm font-bold tracking-tight text-slate-950">{label}</label>}
            {children}
            {error && <p className="text-sm font-medium text-red-600">{error}</p>}
            {!error && hint && <p className="text-sm text-slate-500">{hint}</p>}
        </div>
    )
}

export function Input({ className, error, ...props }) {
    return (
        <input
            className={cn(
                "h-12 w-full rounded-2xl border bg-white/90 px-4 text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] outline-none transition duration-200 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10",
                error ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : "border-slate-200/80",
                className
            )}
            {...props}
        />
    )
}

export function Textarea({ className, error, ...props }) {
    return (
        <textarea
            className={cn(
                "min-h-32 w-full resize-y rounded-2xl border bg-slate-50/90 px-4 py-4 leading-7 text-slate-950 shadow-inner outline-none transition duration-200 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10",
                error ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : "border-slate-200/80",
                className
            )}
            {...props}
        />
    )
}
