import { useRef, useState } from 'react'
import { BriefcaseBusiness, CloudUpload, FileText, Sparkles, UserRound } from 'lucide-react'
import Alert from '../../../components/ui/Alert'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader } from '../../../components/ui/Card'
import EmptyState from '../../../components/ui/EmptyState'
import { Field, Textarea } from '../../../components/ui/Input'
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton'
import Navbar from '../../../components/ui/Navbar'
import SectionHeader from '../../../components/ui/SectionHeader'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {
    const { loading, generateReport, reports } = useInterview()
    const { user, handleLogout } = useAuth()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ resumeFile, setResumeFile ] = useState(null)
    const resumeInputRef = useRef()
    const navigate = useNavigate()

    const hasJobDescription = jobDescription.trim().length > 0
    const hasProfileInput = Boolean(resumeFile) || selfDescription.trim().length > 0
    const canGenerateReport = hasJobDescription && hasProfileInput && !loading
    const completedInputs = [ hasJobDescription, hasProfileInput ].filter(Boolean).length

    const handleGenerateReport = async () => {
        if (!canGenerateReport) {
            return
        }

        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        if (data?._id) {
            navigate(`/interview/${data._id}`)
        }
    }

    if (loading) {
        return <LoadingSkeleton label="Loading interview plans" />
    }

    return (
        <div className="min-h-screen p-4 md:p-5">
            <Navbar
                subtitle="Candidate strategy workspace"
                userLabel={user?.username || user?.email || "Workspace"}
                onLogout={handleLogout}
            />

            <main className="mx-auto w-full max-w-6xl py-10 md:py-12">
                <section className="grid items-end gap-6 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.58fr)]">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.08em] text-brand-600">AI preparation studio</p>
                        <h1 className="mt-2 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.07em] text-slate-950 md:text-7xl">
                            Create a custom <span className="text-brand-600">interview plan</span>
                        </h1>
                    </div>
                    <p className="text-base leading-7 text-slate-600">Analyze the role, map your strengths, and generate questions, model answers, skill gaps, and a practical prep roadmap.</p>
                </section>

                <section className="mt-6 grid gap-4 md:grid-cols-3" aria-label="Workspace summary">
                    {[
                        [ "Inputs ready", `${completedInputs}/2` ],
                        [ "Saved plans", reports.length ],
                        [ "Output", "30s" ],
                    ].map(([ label, value ]) => (
                        <Card key={label} className="p-5 shadow-sm">
                            <p className="text-sm font-bold text-slate-500">{label}</p>
                            <strong className="mt-3 block text-3xl font-black tracking-[-0.05em] text-slate-950">{value}</strong>
                        </Card>
                    ))}
                </section>

                <Card className="mt-6 animate-fade-up overflow-hidden" aria-labelledby="generator-title">
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <SectionHeader eyebrow="New strategy" title="Generate an interview plan" className="sm:items-start" />
                        <Badge>Private analysis</Badge>
                    </CardHeader>

                    <CardContent className="grid gap-0 p-0 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)]">
                        <div className="grid gap-4 p-5 md:p-6">
                            <div className="flex items-center gap-3">
                                <span className="grid size-9 place-items-center rounded-xl bg-brand-100 text-brand-700"><BriefcaseBusiness className="size-4" /></span>
                                <h2 className="flex-1 font-black text-slate-950">Target Job Description</h2>
                                <Badge variant="brand">Required</Badge>
                            </div>
                            <Field htmlFor="jobDescription">
                                <Textarea
                                    id="jobDescription"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    className="min-h-96"
                                    placeholder={`Paste the full job description here...\ne.g. Senior Frontend Engineer requiring React, TypeScript, accessibility, and production ownership.`}
                                    maxLength={5000}
                                />
                            </Field>
                            <p className="text-right text-xs font-medium text-slate-500">{jobDescription.length} / 5000 chars</p>
                        </div>

                        <div className="hidden bg-slate-200 lg:block" />

                        <div className="grid gap-4 border-t border-slate-200 p-5 md:p-6 lg:border-t-0">
                            <div className="flex items-center gap-3">
                                <span className="grid size-9 place-items-center rounded-xl bg-brand-100 text-brand-700"><UserRound className="size-4" /></span>
                                <h2 className="font-black text-slate-950">Your Profile</h2>
                            </div>

                            <div>
                                <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-950">
                                    Upload Resume <Badge variant="brand">Best results</Badge>
                                </div>
                                <label className="grid min-h-40 cursor-pointer place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center transition duration-200 hover:-translate-y-0.5 hover:border-brand-500 hover:bg-white hover:shadow-sm" htmlFor="resume">
                                    <CloudUpload className="mb-2 size-8 text-brand-600" aria-hidden="true" />
                                    <p className="max-w-full overflow-hidden text-ellipsis text-sm font-black text-slate-950">{resumeFile ? resumeFile.name : "Click to upload a resume"}</p>
                                    <p className="mt-1 text-xs text-slate-500">PDF only, recommended for best results</p>
                                    <input ref={resumeInputRef} hidden type="file" id="resume" name="resume" accept=".pdf" onChange={(e) => setResumeFile(e.target.files?.[ 0 ] ?? null)} />
                                </label>
                            </div>

                            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.08em] text-slate-400">
                                <span className="h-px flex-1 bg-slate-200" />
                                OR
                                <span className="h-px flex-1 bg-slate-200" />
                            </div>

                            <Field label="Quick Self-Description" htmlFor="selfDescription">
                                <Textarea
                                    id="selfDescription"
                                    name="selfDescription"
                                    value={selfDescription}
                                    onChange={(e) => setSelfDescription(e.target.value)}
                                    className="min-h-32"
                                    placeholder="Briefly describe your experience, key skills, projects, and years of experience if you don't have a resume handy."
                                />
                            </Field>

                            <Alert>
                                Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.
                            </Alert>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-sm text-slate-500">AI-powered strategy generation &bull; approx 30 seconds</span>
                        <Button onClick={handleGenerateReport} disabled={!canGenerateReport}>
                            <Sparkles className="size-4" aria-hidden="true" />
                            Generate strategy
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="mt-6 p-5 md:p-6">
                    <SectionHeader eyebrow="History" title="Recent interview plans" action={<span className="text-sm font-black text-slate-500">{reports.length} total</span>} />
                    {reports.length > 0 ? (
                        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {reports.map((report) => (
                                <li
                                    key={report._id}
                                    className="grid min-h-40 cursor-pointer gap-2 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-500/40 hover:shadow-soft"
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                    tabIndex="0"
                                    onKeyDown={(event) => { if (event.key === 'Enter') navigate(`/interview/${report._id}`) }}
                                >
                                    <FileText className="size-5 text-brand-600" aria-hidden="true" />
                                    <h3 className="font-black leading-6 text-slate-950">{report.title || 'Untitled Position'}</h3>
                                    <p className="text-sm text-slate-500">Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                    <Badge variant={report.matchScore >= 80 ? "success" : report.matchScore >= 60 ? "warning" : "danger"}>{report.matchScore}% match</Badge>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <EmptyState className="mt-5" title="No plans yet" description="Your generated interview strategies will appear here for quick review." />
                    )}
                </Card>
            </main>
        </div>
    )
}

export default Home
