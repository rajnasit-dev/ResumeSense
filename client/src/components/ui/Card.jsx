import { cn } from "./utils"

export function Card({ className, children, interactive = false, ...props }) {
    return (
        <section
            className={cn(
                "rounded-[1.75rem] border border-white/70 bg-white/80 shadow-soft backdrop-blur-xl transition-all duration-200",
                interactive && "hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-floating",
                className
            )}
            {...props}
        >
            {children}
        </section>
    )
}

export function CardHeader({ className, children, ...props }) {
    return <div className={cn("border-b border-slate-200/80 px-6 py-5", className)} {...props}>{children}</div>
}

export function CardContent({ className, children, ...props }) {
    return <div className={cn("px-6 py-6", className)} {...props}>{children}</div>
}

export function CardFooter({ className, children, ...props }) {
    return <div className={cn("border-t border-slate-200/80 bg-slate-50/70 px-6 py-5", className)} {...props}>{children}</div>
}
