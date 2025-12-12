import React, { ReactNode } from "react";
import { cn } from "@/lib/utils"; // keep if you already use this helper
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "react-router-dom";

type AuthLayoutProps = {
  children: ReactNode;
  className?: string;
};

const pageVariants = {
  initial: { x: 300, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -300, opacity: 0 },
};

export function AuthLayout({ children, className }: AuthLayoutProps) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundFX />

      <header className="relative z-20">
        <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-5 xl:px-16 xl:max-w-[1440px] 2xl:max-w-[1920px]">
          {/* Left: Brand */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-tight text-slate-900/80">
              <img src="/logo.png" alt="Flexi" className="h-[30px] w-auto" />
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="#" className="text-sm text-slate-600 hover:text-slate-900">
              Help
            </Link>
            <Link to="#" className="text-sm text-slate-600 hover:text-slate-900">
              Privacy
            </Link>
            <div className="flex items-center">
            </div>
          </div>
        </div>
      </header>

      <div className="h-6" />
   
      <div className={cn("relative z-10 flex items-center mx-auto gap-6 lg:px-10 xl:px-32 xl:max-w-[1440px] 2xl:max-w-[1920px] h-[calc(90vh-3.5rem-1.5rem)]",className)}>
    
        <div className="hidden lg:flex flex-1 h-full">
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative flex flex-col justify-between overflow-hidden rounded-xl bg-slate-900 text-white p-10 w-full h-full"
            aria-label="Product highlights"
          >
            {/* soft blur blobs */}
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Trusted by factories & enterprises
                </p>
                <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight">
                  Welcome to <span className="text-indigo-300">Flexi</span> —
                  your HR Ground Zero
                </h1>
                <p className="mt-3 text-sm text-slate-200/90 max-w-md">
                  Fast, secure access to TimeSync, LeaveEase, PayEdge and more.
                  Built for high-volume HR ops with granular policies.
                </p>
              </div>

              <ul className="mt-8 grid grid-cols-2 gap-4 text-sm max-w-2xl">
                {[
                  {
                    title: "Face & geo-attendance",
                    desc: "Secure device integrations",
                  },
                  {
                    title: "Shift & Overtime",
                    desc: "Pakistan labor-law aware",
                  },
                  {
                    title: "Tickets & Approvals",
                    desc: "Smart escalations & SLAs",
                  },
                  { title: "Insight360", desc: "AI dashboards & anomalies" },
                ].map((f) => (
                  <li
                    key={f.title}
                    className="rounded-2xl bg-white/5 p-4 backdrop-blur"
                  >
                    <h3 className="font-medium">{f.title}</h3>
                    <p className="text-slate-300 text-xs mt-1">{f.desc}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-center gap-3 text-xs text-slate-300">
                <AvatarRow />
                <span>99.95% uptime • ISO-27001 ready</span>
              </div>
            </div>
          </motion.section>
        </div>

        {/* RIGHT: Form (animated) */}
        <div className="flex flex-1 h-full items-center justify-center px-4 lg:px-0">
          <AnimatePresence mode="wait" initial={true}>
            <motion.div
              key={pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "tween", duration: 0.4 }}
              className="w-full max-w-lg h-full rounded-xl bg-white pl-8 pr-8 py-10 shadow-sm flex flex-col"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}


function BackgroundFX() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {/* strong gradient base */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,#dbeafe_0%,#f0f9ff_40%,#fff_70%)]" />

      {/* animated orbs with more punch */}
      <motion.div
        className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/40 blur-2xl"
        initial={{ opacity: 0.4, scale: 0.9 }}
        animate={{ opacity: 0.7, scale: 1.1 }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
      />

      <motion.div
        className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-cyan-400/35 blur-2xl"
        initial={{ opacity: 0.35, scale: 0.95 }}
        animate={{ opacity: 0.6, scale: 1.15 }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
      />

      <motion.div
        className="absolute -bottom-28 left-1/4 h-80 w-80 rounded-full bg-fuchsia-400/30 blur-2xl"
        initial={{ opacity: 0.3, scale: 0.9 }}
        animate={{ opacity: 0.55, scale: 1.1 }}
        transition={{ duration: 7, repeat: Infinity, repeatType: "mirror" }}
      />

      {/* sweeping light ray */}
      <motion.div
        className="absolute inset-x-0 top-24 h-72 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-3xl"
        initial={{ x: "-25%" }}
        animate={{ x: "25%" }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      {/* grid */}
      <div
        className="
          absolute inset-0
          [background-image:linear-gradient(to_right,rgba(30,41,59,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(30,41,59,0.12)_1px,transparent_1px)]
          [background-size:28px_28px]
          [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_85%)]
        "
      />

      {/* film grain */}
      <div className="absolute inset-0 opacity-[0.06] [background:repeating-linear-gradient(0deg,rgba(0,0,0,0)_0_2px,rgba(0,0,0,0.6)_2px_3px)] mix-blend-overlay" />
    </div>
  );
}


function AvatarRow() {
  const srcs = [
    "/avatars/a1.jpeg",
    "/avatars/a2.jpeg",
    "/avatars/a3.jpeg",
    "/avatars/a4.jpeg",
  ];
  return (
    <div className="flex -space-x-3">
      {srcs.map((s, i) => (
        <span
          key={s}
          className="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full ring-2 ring-slate-900"
          title={`User ${i + 1}`}
        >
          <img src={s} alt="" className="h-full w-full object-cover" />
        </span>
      ))}
    </div>
  );
}
