import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ChevronDown, ChevronLeft, Code2, Download, Map, MessageSquareText, Sparkles } from 'lucide-react'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton'
import SectionHeader from '../../../components/ui/SectionHeader'
import Sidebar from '../../../components/ui/Sidebar'
import { cn } from '../../../components/ui/utils'
import { useInterview } from '../hooks/useInterview.js'

const NAV_ITEMS = [
    { id: 'technical', label: 'Technical Questions', icon: <Code2 className="size-4" aria-hidden="true" /> },
    { id: 'behavioral', label: 'Behavioral Questions', icon: <MessageSquareText className="size-4" aria-hidden="true" /> },
    { id: 'roadmap', label: 'Road Map', icon: <Map className="size-4" aria-hidden="true" /> },
]

const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)

    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-soft">
            <button className="flex w-full items-start gap-3 p-4 text-left" onClick={() => setOpen(o => !o)} aria-expanded={open}>
                <span className="shrink-0 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-black text-brand-700">Q{index + 1}</span>
                <p className="flex-1 font-bold leading-6 text-slate-950">{item.question}</p>
                <ChevronDown className={cn("size-4 shrink-0 text-slate-400 transition duration-200", open && "rotate-180 text-brand-600")} aria-hidden="true" />
            </button>
            {open && (
                <div className="grid gap-4 border-t border-slate-200 px-4 pb-4 pt-4 md:pl-16">
                    <div className="grid gap-2">
                        <Badge variant="purple">Intention</Badge>
                        <p className="text-sm leading-6 text-slate-600">{item.intention}</p>
                    </div>
                    <div className="grid gap-2">
                        <Badge variant="success">Model Answer</Badge>
                        <p className="text-sm leading-6 text-slate-600">{item.answer}</p>
                    </div>
                </div>
            )}
        </article>
    )
}

const RoadMapDay = ({ day }) => (
    <article className="relative ml-10 grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm before:absolute before:-left-8 before:top-7 before:size-3 before:rounded-full before:bg-brand-600 before:ring-4 before:ring-brand-100">
        <div className="flex flex-wrap items-center gap-3">
            <Badge variant="brand">Day {day.day}</Badge>
            <h3 className="font-black tracking-tight text-slate-950">{day.focus}</h3>
        </div>
        <ul className="grid gap-2">
            {day.tasks.map((task, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-6 text-slate-600">
                    <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-600" />
                    {task}
                </li>
            ))}
        </ul>
    </article>
)

const scoreVariant = (score) => score >= 80 ? "success" : score >= 60 ? "warning" : "danger"
const scoreRingClasses = (score) => score >= 80 ? "border-emerald-500 text-emerald-700" : score >= 60 ? "border-amber-500 text-amber-700" : "border-red-500 text-red-700"

const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    const { report, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    if (loading || !report) {
        return <LoadingSkeleton label="Loading interview plan" />
    }

    return (
        <div className="min-h-screen p-4 md:p-5">
            <header className="sticky top-4 z-20 mx-auto grid w-full max-w-7xl grid-cols-1 gap-3 rounded-[1.75rem] border border-white/70 bg-white/75 p-3 shadow-soft backdrop-blur-xl md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
                <Button as={Link} variant="outline" to="/">
                    <ChevronLeft className="size-4" aria-hidden="true" />
                    Back
                </Button>
                <div className="min-w-0 md:text-center">
                    <p className="text-xs font-black uppercase tracking-[0.08em] text-brand-600">Interview plan</p>
                    <h1 className="truncate text-xl font-black tracking-[-0.04em] text-slate-950">{report.title || 'Untitled Position'}</h1>
                </div>
                <Button onClick={() => getResumePdf(interviewId)}>
                    <Download className="size-4" aria-hidden="true" />
                    Download resume
                </Button>
            </header>

            <Card className="mx-auto mt-5 grid w-full max-w-7xl overflow-hidden lg:grid-cols-[15rem_minmax(0,1fr)_17rem]">
                <Sidebar items={NAV_ITEMS} activeId={activeNav} onSelect={setActiveNav} />

                <main className="min-w-0 p-5 md:p-6">
                    {activeNav === 'technical' && (
                        <section>
                            <SectionHeader eyebrow="Question bank" title="Technical Questions" action={<Badge>{report.technicalQuestions.length} questions</Badge>} />
                            <div className="mt-5 grid gap-3">
                                {report.technicalQuestions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <SectionHeader eyebrow="Answer strategy" title="Behavioral Questions" action={<Badge>{report.behavioralQuestions.length} questions</Badge>} />
                            <div className="mt-5 grid gap-3">
                                {report.behavioralQuestions.map((q, i) => <QuestionCard key={i} item={q} index={i} />)}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <SectionHeader eyebrow="Execution plan" title="Preparation Road Map" action={<Badge>{report.preparationPlan.length}-day plan</Badge>} />
                            <div className="relative mt-5 grid gap-4 before:absolute before:left-[1.1rem] before:top-2 before:bottom-2 before:w-0.5 before:rounded-full before:bg-gradient-to-b before:from-brand-600 before:to-brand-100">
                                {report.preparationPlan.map((day) => <RoadMapDay key={day.day} day={day} />)}
                            </div>
                        </section>
                    )}
                </main>

                <aside className="grid content-start gap-5 border-t border-slate-200/80 bg-slate-50/70 p-5 lg:border-l lg:border-t-0">
                    <div className="grid justify-items-center gap-4">
                        <p className="justify-self-start text-xs font-black uppercase tracking-[0.09em] text-slate-500">Match Score</p>
                        <div className={cn("grid size-32 place-items-center rounded-full border-8 bg-white", scoreRingClasses(report.matchScore))}>
                            <div className="text-center">
                                <span className="block text-3xl font-black tracking-[-0.05em]">{report.matchScore}</span>
                                <span className="text-xs font-black text-slate-500">%</span>
                            </div>
                        </div>
                        <Badge variant={scoreVariant(report.matchScore)}>
                            <Sparkles className="mr-1 size-3" aria-hidden="true" />
                            Readiness estimate
                        </Badge>
                        <p className="text-center text-sm leading-6 text-slate-600">Based on the supplied role and profile.</p>
                    </div>

                    <div className="h-px bg-slate-200" />

                    <div className="grid gap-3">
                        <p className="text-xs font-black uppercase tracking-[0.09em] text-slate-500">Skill Gaps</p>
                        <div className="flex flex-wrap gap-2">
                            {report.skillGaps.map((gap, i) => (
                                <Badge key={i} variant={scoreVariant(gap.severity === "high" ? 0 : gap.severity === "medium" ? 65 : 90)}>
                                    {gap.skill}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </aside>
            </Card>
        </div>
    )
}

export default Interview
