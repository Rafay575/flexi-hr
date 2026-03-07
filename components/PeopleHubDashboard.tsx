import { useNavigate } from "react-router-dom";
import StatCard from "./StatCard";
import QuickAction from "./QuickAction";
import RecentActivity from "./RecentActivity";
import UpcomingEvents from "./UpcomingEvents";
import { StatMetric, ActivityItem } from "@/types";
import { INITIAL_UPCOMING_EVENTS } from "./mockData";
import { Calendar, RefreshCcw, User } from "lucide-react";

type PeopleHubDashboardProps = {
  stats: StatMetric[];
  activities: ActivityItem[];
  isLoading?: boolean;
};

export const PeopleHubDashboard: React.FC<PeopleHubDashboardProps> = ({
  stats,
  activities,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-gradient-to-br from-[#F7E1D3] via-[#E9E4F4] to-white"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="h-48 rounded-2xl bg-gradient-to-br from-[#F7E1D3] via-white to-[#E9E4F4]" />
            <div className="h-64 rounded-2xl bg-gradient-to-br from-[#E9E4F4] via-white to-[#F7E1D3]" />
          </div>
          <div className="h-96 rounded-2xl bg-gradient-to-br from-[#1C1B57] via-[#2B266F] to-[#3A337F]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 mb-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-[#2C276F] bg-gradient-to-r from-[#1C1B57] via-[#26205F] to-[#31286B] p-6 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(247,225,211,0.20),transparent_30%)]" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#F7E1D3]/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/5 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7C9A8] shadow-lg">
              <User className="h-7 w-7 text-[#1C1B57]" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-white">People Hub</h1>
              <p className="text-sm text-[#D8D4EC]">
                Manage your team and HR operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md shadow-md">
              <Calendar className="h-4 w-4 text-[#F7C9A8]" />
              <span className="text-sm font-medium text-white">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <button className="group rounded-xl bg-[#F7C9A8] p-2.5 text-[#1C1B57] shadow-md transition-all hover:scale-105 hover:bg-[#F5D3BB]">
              <RefreshCcw className="h-4 w-4 transition-transform group-hover:rotate-90" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="rounded-2xl bg-gradient-to-br from-[#F7E1D3] via-white to-[#EEE9F8] p-[1px] shadow-md"
          >
            <div className="rounded-2xl bg-white">
              <StatCard metric={stat} />
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Left */}
        <div className="xl:col-span-2 space-y-8">
          {/* Quick Actions */}
          <section className="rounded-3xl border border-[#E7D7CB] bg-gradient-to-br from-[#FFF8F4] via-white to-[#F4F0FA] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-[#1C1B57]">
                  Quick Actions
                </h2>
                <p className="text-sm text-[#6E6A8A]">
                  Common HR tasks at your fingertips
                </p>
              </div>

              <button
                onClick={() => navigate("/peoplehub/all-actions")}
                className="rounded-lg bg-[#F7E1D3] px-3 py-1.5 text-sm font-medium text-[#1C1B57] transition hover:bg-[#F3D5C0]"
              >
                View all
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <QuickAction
                type="add"
                onClick={() => navigate("/peoplehub/onboardx")}
              />
              <QuickAction
                type="directory"
                onClick={() => navigate("/peoplehub/directory")}
              />
              <QuickAction
                type="transfer"
                onClick={() => navigate("/peoplehub/transfers")}
              />
              <QuickAction
                type="exit"
                onClick={() => navigate("/peoplehub/exit")}
              />
              <QuickAction
                type="upload"
                onClick={() => navigate("/peoplehub/import")}
              />
            </div>
          </section>

          {/* Recent Activity */}
          <section className="rounded-3xl border border-[#E8E3F4] bg-gradient-to-br from-[#F7F5FC] via-white to-[#FFF8F4] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-[#1C1B57]">
                  Recent Activity
                </h2>
                <p className="text-sm text-[#6E6A8A]">
                  Latest updates from your workspace
                </p>
              </div>

              <button
                onClick={() => navigate("/peoplehub/activity")}
                className="rounded-lg bg-[#ECE7F7] px-3 py-1.5 text-sm font-medium text-[#1C1B57] transition hover:bg-[#E2DAF3]"
              >
                View all
              </button>
            </div>

            <RecentActivity activities={activities} />
          </section>
        </div>

        {/* Right */}
        <div className="space-y-8">
          <div className="rounded-3xl border border-[#E8E3F4] bg-gradient-to-br from-white via-[#FAF8FD] to-[#FFF8F4] p-4 shadow-sm">
            <UpcomingEvents events={INITIAL_UPCOMING_EVENTS} />
          </div>

          {/* Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C1B57] via-[#2B266F] to-[#3A337F] p-6 text-white shadow-xl">
            <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#F7C9A8]/15 blur-3xl" />
            <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,201,168,0.18),transparent_35%)]" />

            <div className="relative z-10">
              <div className="inline-flex rounded-full bg-[#F7C9A8]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#F7E1D3] backdrop-blur-md">
                Reminder
              </div>

              <h3 className="mt-4 text-xl font-bold text-white">
                Annual Review Cycle
              </h3>

              <p className="mt-2 max-w-sm text-sm text-[#DDD8F0]">
                The 2024 performance review period begins in 5 days. Prepare
                your team&apos;s documents.
              </p>

              <button
                onClick={() => navigate("/peoplehub/guidelines")}
                className="mt-5 inline-flex items-center rounded-xl bg-[#F7C9A8] px-4 py-2.5 text-sm font-semibold text-[#1C1B57] shadow-md transition-all hover:scale-[1.02] hover:bg-[#F5D3BB]"
              >
                View Guidelines
                <svg
                  className="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-[#F0DED2] bg-gradient-to-br from-[#FFF8F4] via-white to-[#F8F4FC] p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-[#1C1B57]">
              Team Reminder
            </h4>
            <p className="mt-2 text-sm text-[#6E6A8A]">
              Keep onboarding, transfers, and employee records up to date for a
              smoother HR workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};