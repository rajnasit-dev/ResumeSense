import { X } from "lucide-react"
import Button from "./Button"
import { cn } from "./utils"

export default function Modal({ open, title, description, children, onClose, footer, className }) {
    if (!open) {
        return null
    }

    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className={cn("w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-floating", className)}>
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
                    <div>
                        <h2 id="modal-title" className="text-lg font-black tracking-tight text-slate-950">{title}</h2>
                        {description && <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
                        <X className="size-4" aria-hidden="true" />
                    </Button>
                </div>
                <div className="px-6 py-5">{children}</div>
                {footer && <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">{footer}</div>}
            </div>
        </div>
    )
}
