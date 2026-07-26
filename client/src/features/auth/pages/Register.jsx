import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Sparkles } from 'lucide-react'
import Button from '../../../components/ui/Button'
import { Card, CardContent } from '../../../components/ui/Card'
import { Field, Input } from '../../../components/ui/Input'
import LoadingSkeleton from '../../../components/ui/LoadingSkeleton'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister({ username, email, password })
        navigate("/")
    }

    if (loading) {
        return <LoadingSkeleton label="Loading registration" />
    }

    return (
        <main className="grid min-h-screen gap-6 p-4 md:grid-cols-[minmax(20rem,0.95fr)_minmax(22rem,1fr)] md:p-6">
            <section className="relative hidden overflow-hidden rounded-[2rem] border border-slate-950/10 bg-slate-950 p-8 text-white shadow-floating md:flex md:flex-col md:justify-between">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,118,110,0.28),transparent_32%),linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:auto,32px_32px,32px_32px] opacity-80" />
                <div className="relative flex items-center gap-3 font-black tracking-tight">
                    <span className="grid size-10 place-items-center rounded-2xl bg-white text-brand-700">AI</span>
                    InterviewOS
                </div>
                <Card className="relative mx-auto w-full max-w-md border-white/15 bg-white/10 text-white shadow-floating backdrop-blur">
                    <CardContent className="space-y-5">
                        <div className="rounded-2xl bg-white/10 p-5">
                            <p className="text-sm text-white/70">Prep Plan</p>
                            <strong className="text-6xl font-black tracking-[-0.06em]">7 days</strong>
                        </div>
                        <div className="grid gap-3">
                            <span className="h-3 rounded-full bg-white/20" />
                            <span className="h-3 w-4/5 rounded-full bg-white/20" />
                            <span className="h-3 w-1/2 rounded-full bg-white/20" />
                        </div>
                    </CardContent>
                </Card>
                <div className="relative max-w-xl">
                    <h2 className="text-5xl font-black leading-none tracking-[-0.06em]">Turn a job post into a practical interview system.</h2>
                    <p className="mt-4 leading-7 text-white/70">Upload your resume, add the role, and get focused questions, answer guidance, and a readiness roadmap.</p>
                </div>
            </section>

            <section className="grid place-items-center">
                <Card className="w-full max-w-lg animate-fade-up">
                    <CardContent className="space-y-6 p-6 sm:p-10">
                        <div className="space-y-2">
                            <p className="text-xs font-black uppercase tracking-[0.08em] text-brand-600">Start preparing</p>
                            <h1 className="text-4xl font-black tracking-[-0.05em] text-slate-950">Create your account</h1>
                            <p className="text-sm leading-6 text-slate-600">Build a private workspace for your interview plans.</p>
                        </div>
                        <form className="grid gap-4" onSubmit={handleSubmit}>
                            <Field label="Username" htmlFor="username">
                                <Input onChange={(e) => setUsername(e.target.value)} type="text" id="username" name="username" placeholder="Your name" autoComplete="name" required />
                            </Field>
                            <Field label="Email" htmlFor="email">
                                <Input onChange={(e) => setEmail(e.target.value)} type="email" id="email" name="email" placeholder="you@example.com" autoComplete="email" required />
                            </Field>
                            <Field label="Password" htmlFor="password">
                                <Input onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" placeholder="Create a secure password" autoComplete="new-password" required />
                            </Field>
                            <Button type="submit" className="w-full">
                                <Sparkles className="size-4" aria-hidden="true" />
                                Create account
                            </Button>
                        </form>
                        <p className="text-center text-sm text-slate-600">Already have an account? <Link className="font-black text-brand-600 hover:text-brand-700" to="/login">Sign in</Link></p>
                    </CardContent>
                </Card>
            </section>
        </main>
    )
}

export default Register
