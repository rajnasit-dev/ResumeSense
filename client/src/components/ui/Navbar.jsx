import Button from "./Button"
import { cn } from "./utils"

export default function Navbar({ brand = "InterviewOS", subtitle, userLabel, onLogout, actions, className }) {
    return (
        <header className={cn("sticky top-4 z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-[1.75rem] border border-white/70 bg-white/75 p-3 shadow-soft backdrop-blur-xl", className)}>
            <div className="flex min-w-0 items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white shadow-lg shadow-slate-950/20">AI</span>
                <div className="min-w-0">
                    <strong className="block truncate text-sm font-black text-slate-950">{brand}</strong>
                    {subtitle && <span className="block truncate text-xs font-medium text-slate-500">{subtitle}</span>}
                </div>
            </div>
            <nav className="flex items-center gap-2" aria-label="Primary navigation">
                {userLabel && <span className="hidden rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-extrabold text-slate-600 sm:inline-flex">{userLabel}</span>}
                {actions}
                {onLogout && <Button variant="ghost" onClick={onLogout}>Sign out</Button>}
            </nav>
        </header>
    )
}
