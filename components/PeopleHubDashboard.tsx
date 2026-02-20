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
  isLoading?: boolean; // optional for loading states
};

export const PeopleHubDashboard: React.FC<PeopleHubDashboardProps> = ({
  stats,
  activities,
  isLoading = false,
}) => {
  const navigate = useNavigate();

  // Loading skeletons (optional – you can replace with your own)
  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-muted/20 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <div className="h-48 bg-neutral-muted/20 rounded-xl" />
            <div className="h-64 bg-neutral-muted/20 rounded-xl" />
          </div>
          <div className="h-96 bg-neutral-muted/20 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 mb-8">
      {/* Page Header (optional) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary  flex items-center justify-center shadow-md">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-primary">
              People Hub
            </h1>
            <p className="text-sm text-neutral-secondary">
              Manage your team and HR operations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-card border border-neutral-border rounded-lg shadow-sm">
            <Calendar className="h-4 w-4 text-flexi-primary" />
            <span className="text-sm font-medium text-neutral-primary">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
          <button className="p-2 rounded-lg bg-primary text-white hover:bg-flexi-primary/90 transition-colors shadow-sm">
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.id} metric={stat} />
        ))}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
          {/* Quick Actions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-primary">
                Quick Actions
              </h2>
              <button
                onClick={() => navigate("/peoplehub/all-actions")}
                className="text-sm text-primary hover:underline"
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
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-primary">
                Recent Activity
              </h2>
              <button
                onClick={() => navigate("/peoplehub/activity")}
                className="text-sm text-primary hover:underline"
              >
                View all
              </button>
            </div>
            <RecentActivity activities={activities} />
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8 ">
          <UpcomingEvents events={INITIAL_UPCOMING_EVENTS} />

          {/* Promotional Banner */}
          <div className="relative overflow-hidden border rounded-xl bg-gradient-to-br from-primary to-secondary p-6 text-white shadow-lg">
            {/* Decorative blurs */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

            <div className="relative text-gray-700 z-10">
              <h3 className="text-lg font-bold">Annual Review Cycle</h3>
              <p className="mt-2 text-sm ">
                The 2024 performance review period begins in 5 days. Prepare
                your team's documents.
              </p>
              <button
                onClick={() => navigate("/peoplehub/guidelines")}
                className="mt-4 inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition-all hover:bg-blue-50 hover:shadow"
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

          {/* Optional: Quick Stats or Reminders */}
        </div>
      </div>
    </div>
  );
};
