import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Zap,
  Target,
  BarChart3,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: LayoutDashboard,
    title: "Kanban Board",
    description: "Visualize your workflow with drag-and-drop task management.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together with your team in real-time.",
  },
  {
    icon: CheckSquare,
    title: "Smart Task Management",
    description: "Create, assign, and track tasks efficiently.",
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    description: "Get AI-powered suggestions and summaries.",
  },
];

const steps = [
  {
    icon: Target,
    title: "Create a Project",
    description: "Set up your workspace and define project goals in seconds.",
  },
  {
    icon: Users,
    title: "Add Tasks & Team Members",
    description: "Invite your team and break work into manageable tasks.",
  },
  {
    icon: BarChart3,
    title: "Track Progress with Kanban",
    description: "Visualize progress and keep everyone aligned in real-time.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-lg"
            >
              <Image
                src="/favicon.svg"
                alt="CollabTasky logo"
                width={28}
                height={28}
                className="rounded-md"
              />
              <span className="text-primary">CollabTasky</span>
            </Link>

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
              <Link
                href="#features"
                className="hover:text-foreground transition-colors"
              >
                Features
              </Link>
              {/* <Link
                href="#pricing"
                className="hover:text-foreground transition-colors"
              >
                Pricing
              </Link> */}
              <Link
                href="#about"
                className="hover:text-foreground transition-colors"
              >
                About
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Start Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        {/* Ambient glow */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[420px] w-[700px] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
            <Zap className="size-3" />
            AI-Powered Project Management
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            The Smarter Way to Manage
            <br className="hidden sm:block" />
            <span className="text-primary"> Projects & Teams 🚀</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed">
            Plan, track, and collaborate with your team using powerful Kanban
            boards, real-time updates, and AI-driven insights — all in one
            place.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" asChild className="px-8">
              <Link href="/signup">
                Get Started <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8">
              <Link href="#preview">View Demo</Link>
            </Button>
          </div>

          {/* Dashboard preview */}
          <div className="mx-auto max-w-3xl">
            <Image
              src="/dashboard.png"
              alt="Dashboard Preview"
              width={1000}
              height={600}
              className="rounded-xl border shadow-2xl shadow-black/40 hover:scale-[1.02] transition duration-300"
            />
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 sm:py-24 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything your team needs
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Powerful features to keep your projects moving forward.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="bg-card border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group"
              >
                <CardHeader className="pb-3">
                  <div className="size-10 rounded-lg bg-primary/15 flex items-center justify-center mb-3 group-hover:bg-primary/25 transition-colors">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-base font-semibold">
                    {title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Product Preview ── */}
      <section
        id="preview"
        className="py-20 sm:py-24 scroll-mt-16 border-y border-border bg-card/30"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Everything you need to manage
              <br className="hidden sm:block" /> projects in one place
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              A unified workspace for tasks, teams, and real-time collaboration.
            </p>
          </div>

          {/* App frame */}
          <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-3 sm:p-4 shadow-2xl shadow-black/50">
            <Image
              src="/kanban.png"
              alt="Kanban Preview"
              width={1000}
              height={600}
              className="rounded-xl border shadow-2xl shadow-black/50"
            />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              How it works
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              Get your team productive in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 relative">
            {/* Connector line */}
            <div
              aria-hidden
              className="hidden sm:block absolute top-8 left-[20%] right-[20%] h-px bg-border"
            />

            {steps.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 size-16 rounded-2xl border border-primary/30 bg-primary/10 flex items-center justify-center mb-5">
                  <Icon className="size-7 text-primary" />
                  <span className="absolute -top-2 -right-2 size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-base font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 sm:py-24 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 px-8 py-16 text-center">
            {/* Glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 rounded-full bg-primary/10 blur-3xl" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Start managing your team today 🚀
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto mb-8">
              Join thousands of teams already using CollabTasky to ship faster
              and smarter.
            </p>
            <Button size="lg" asChild className="px-10">
              <Link href="/signup">
                Start Free Today <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-base"
            >
              <Image
                src="/favicon.svg"
                alt="CollabTasky logo"
                width={24}
                height={24}
                className="rounded-md"
              />
              <span className="text-primary">CollabTasky</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link
                href="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} CollabTasky. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
