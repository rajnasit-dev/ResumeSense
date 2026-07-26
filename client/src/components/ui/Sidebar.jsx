import { cn } from "./utils"

export default function Sidebar({ label = "Sections", items, activeId, onSelect, className }) {
    return (
        <nav className={cn("flex gap-2 overflow-x-auto border-b border-slate-200/80 bg-white/70 p-4 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:p-5", className)} aria-label={label}>
            <p className="hidden text-xs font-black uppercase tracking-[0.09em] text-slate-500 lg:block">{label}</p>
            {items.map((item) => (
                <button
                    key={item.id}
                    className={cn(
                        "flex w-max items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-bold text-slate-600 transition duration-200 hover:bg-slate-100 hover:text-slate-950 lg:w-full",
                        activeId === item.id && "bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-500/10"
                    )}
                    onClick={() => onSelect(item.id)}
                    aria-pressed={activeId === item.id}
                >
                    {item.icon && <span className="shrink-0">{item.icon}</span>}
                    {item.label}
                </button>
            ))}
        </nav>
    )
}
