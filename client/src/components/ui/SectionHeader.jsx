import { cn } from "./utils"

export default function SectionHeader({ eyebrow, title, description, action, className }) {
    return (
        <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
            <div className="min-w-0">
                {eyebrow && <p className="text-xs font-black uppercase tracking-[0.08em] text-brand-600">{eyebrow}</p>}
                <h2 className="mt-1 text-2xl font-black tracking-[-0.05em] text-slate-950 sm:text-3xl">{title}</h2>
                {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    )
}
