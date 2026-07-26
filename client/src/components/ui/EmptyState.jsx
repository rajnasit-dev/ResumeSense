import { FileText } from "lucide-react"
import Button from "./Button"
import { cn } from "./utils"

export default function EmptyState({ icon: Icon = FileText, title, description, action, className }) {
    return (
        <div className={cn("grid min-h-48 place-items-center rounded-[1.75rem] border border-dashed border-slate-300/80 bg-white/70 p-8 text-center shadow-sm", className)}>
            <div className="max-w-md space-y-3">
                <div className="mx-auto grid size-11 place-items-center rounded-2xl bg-brand-50 text-brand-700 shadow-sm">
                    <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-extrabold tracking-tight text-slate-950">{title}</h3>
                {description && <p className="text-sm leading-6 text-slate-600">{description}</p>}
                {action && <Button {...action}>{action.children}</Button>}
            </div>
        </div>
    )
}
