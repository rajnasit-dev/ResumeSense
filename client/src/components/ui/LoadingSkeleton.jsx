import { cn } from "./utils"

export function Skeleton({ className }) {
    return <span className={cn("block rounded-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-shimmer", className)} />
}

export default function LoadingSkeleton({ label = "Loading", className }) {
    return (
        <main className={cn("grid min-h-screen place-items-center p-6", className)}>
            <div className="w-full max-w-md rounded-[1.75rem] border border-white/70 bg-white/80 p-8 shadow-soft backdrop-blur-xl" aria-label={label}>
                <div className="grid gap-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
        </main>
    )
}
