import { cn } from "./utils"

export function Table({ columns, rows, rowKey = "id", onRowClick, empty, className }) {
    return (
        <div className={cn("overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm", className)}>
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="sticky top-0 bg-slate-50 text-xs font-black uppercase tracking-[0.08em] text-slate-500">
                    <tr>
                        {columns.map((column) => (
                            <th key={column.key} scope="col" className={cn("px-4 py-3", column.className)}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {rows.length > 0 ? rows.map((row, index) => (
                        <tr
                            key={typeof rowKey === "function" ? rowKey(row) : row[ rowKey ] ?? index}
                            className={cn("transition duration-150 hover:bg-slate-50", onRowClick && "cursor-pointer")}
                            onClick={onRowClick ? () => onRowClick(row) : undefined}
                        >
                            {columns.map((column) => (
                                <td key={column.key} className="px-4 py-3 text-slate-700">
                                    {column.render ? column.render(row) : row[ column.key ]}
                                </td>
                            ))}
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-8 text-center text-slate-500">{empty || "No data available"}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}
