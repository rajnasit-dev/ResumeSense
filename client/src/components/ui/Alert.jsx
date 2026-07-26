import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react"
import { cn } from "./utils"

const variants = {
    info: { classes: "border-brand-500/20 bg-brand-50/90 text-slate-900", Icon: Info },
    success: { classes: "border-emerald-200 bg-emerald-50 text-emerald-900", Icon: CheckCircle2 },
    warning: { classes: "border-amber-200 bg-amber-50 text-amber-900", Icon: TriangleAlert },
    danger: { classes: "border-red-200 bg-red-50 text-red-900", Icon: AlertCircle },
}

export default function Alert({ variant = "info", title, children, className }) {
    const { classes, Icon } = variants[ variant ]

    return (
        <div className={cn("flex gap-3 rounded-2xl border p-4 shadow-sm", classes, className)} role={variant === "danger" ? "alert" : "status"}>
            <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div className="space-y-1 text-sm leading-6">
                {title && <p className="font-extrabold">{title}</p>}
                <div>{children}</div>
            </div>
        </div>
    )
}
