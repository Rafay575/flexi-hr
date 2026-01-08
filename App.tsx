import React, { useState } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Sidebar } from "./components/Sidebar";

// ---------- Flexi HQ pages ----------
import { Dashboard } from "./pages/Dashboard";
import CompaniesPage from "./pages/CompanyManagement";

import DepartmentTree from "./pages/DepartmentTree";
import DesignationDirectory from "./pages/DesignationDirectory";
import DivisionsPage from "./pages/Divisions";
import Grades from "./pages/Grades";
import Locations from "./pages/Locations";
import CostCenters from "./pages/CostCenters";
import { AuditLog } from "./pages/AuditLog";

import DashboardHeader from "./components/DashboardHeader";
import StatCard from "./components/StatCard";
import QuickAction from "./components/QuickAction";
import RecentActivity from "./components/RecentActivity";
import UpcomingEvents from "./components/UpcomingEvents";
import Directory from "./components/employee/listing";
import Employee360 from "./components/Employee360";
import OnboardX from "./components/employee";
import Transfers from "./components/employee-transfer/Transfers";
import ExitHorizon from "./components/ExitHorizon";
import Documents from "./components/Documents";
import BulkImport from "./components/BulkImport";

import {
  StatMetric,
  ActivityItem,
  Employee,
  Transfer,
  ExitRequest,
} from "./types";

import {
  generateEmployees,
  generateTransfers,
  INITIAL_STATS,
  INITIAL_ACTIVITIES,
  INITIAL_UPCOMING_EVENTS,
} from "./mockData";

import LoginPage from "./pages/Login";
import CompanyStepper from "./pages/Create";
import CompanySummaryPage from "./pages/CompanySummaryPage";
import { CompanyProvider } from "./context/CompanyContext";
import { EnrollmentProvider } from "./context/EnrollmentContext";
import TransferWizard from "./components/employee-transfer/TransferWizard";
import CountryListing from "./components/fleximeta/geography/countries";
import StateListing from "./components/fleximeta/geography/states";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

// ---------- Shared layout for all protected routes (HQ + PeopleHub) ----------
const Layout: React.FC = () => (
  <div className="flex min-h-screen bg-white font-sans text-slate-900">
    <Sidebar />
    <main className="flex-1 ml-64 overflow-x-hidden">
      <DashboardHeader userName="Alexandra" onMenuClick={() => {}} />
      <div className="max-w-7xl mx-auto px-6 py-5">
        <Outlet /> {/* All nested routes render here */}
      </div>
    </main>
  </div>
);

// ---------- PeopleHub Dashboard page built from your first App ----------
type PeopleHubDashboardProps = {
  stats: StatMetric[];
  activities: ActivityItem[];
};

const PeopleHubDashboard: React.FC<PeopleHubDashboardProps> = ({
  stats,
  activities,
}) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        {stats.map((stat) => (
          <StatCard key={stat.id} metric={stat} />
        ))}
      </section>

      {/* Main Grid: Actions + Activity vs Upcoming */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          {/* Quick Actions */}
          <section className="animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-neutral-primary">
                Quick Actions
              </h2>
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
          <section className="flex-1 animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
            <RecentActivity activities={activities} />
          </section>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-1 animate-in fade-in slide-in-from-right-4 duration-500 delay-300">
          <UpcomingEvents events={INITIAL_UPCOMING_EVENTS} />

          {/* Banner / Promotion Placeholder */}
          <div className="mt-8 bg-gradient-to-r from-flexi-primary to-flexi-secondary rounded-xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl" />
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full blur-3xl" />
            <h3 className="text-lg font-bold relative z-10">
              Annual Review Cycle
            </h3>
            <p className="text-sm text-blue-100 mt-2 relative z-10 font-light">
              The 2024 performance review period begins in 5 days. Prepare your
              team's documents.
            </p>
            <button className="mt-4 px-4 py-3 bg-white text-flexi-primary text-sm font-bold rounded-lg shadow-sm hover:bg-blue-50 transition-colors relative z-10">
              View Guidelines
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const App: React.FC = () => {
  // ---------- PeopleHub state ----------
  const [employees, setEmployees] = useState<Employee[]>(() =>
    generateEmployees(142)
  );
 
  const [activities, setActivities] =
    useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [stats, setStats] = useState<StatMetric[]>(INITIAL_STATS);

  // Handlers reused from original PeopleHub App:

  const handleExitCreate = (newExit: ExitRequest) => {
    const newActivity: ActivityItem = {
      id: `act-ex-${Date.now()}`,
      user: "Alexandra M.",
      action: "initiated exit for",
      target: newExit.name,
      time: "Just now",
      avatarUrl:
        "https://ui-avatars.com/api/?name=Alexandra+M&background=0A3AA9&color=fff",
      type: "exit",
    };

    setActivities((prev) => [newActivity, ...prev]);
    setStats((prev) =>
      prev.map((stat) => {
        if (stat.id === "exits") {
          const val = parseInt(stat.value.toString());
          return { ...stat, value: (val + 1).toString() };
        }
        return stat;
      })
    );
  };

  return (
    <CompanyProvider>
      <EnrollmentProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              {/* Auth routes (no main layout) */}
              <Route path="/auth/login" element={<LoginPage />} />
              {/* You can later add /auth/forgot, /auth/reset, etc. */}

              {/* Protected / main app routes with Layout */}
              <Route element={<Layout />}>
                {/* Dashboard: both / and /dashboard work */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/countries" element={<CountryListing />} />
              <Route path="/states" element={<StateListing />} />
                {/* Flexi HQ routes */}
                <Route path="/companies" element={<CompaniesPage />} />
                <Route
                  path="/companies/:id/summary"
                  element={<CompanySummaryPage />}
                />
                <Route path="/company-create" element={<CompanyStepper />} />
                {/* <Route path="/companies/:id" element={<CompanyDetails />} /> */}
                <Route path="/divisions" element={<DivisionsPage />} />
                <Route path="/departments" element={<DepartmentTree />} />
                <Route
                  path="/designations"
                  element={<DesignationDirectory />}
                />
                <Route path="/grades" element={<Grades />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/cost-centers" element={<CostCenters />} />
                <Route path="/audit" element={<AuditLog />} />

                {/* PeopleHub routes */}
                <Route
                  path="/peoplehub"
                  element={
                    <PeopleHubDashboard stats={stats} activities={activities} />
                  }
                />
                <Route
                  path="/peoplehub/directory"
                  element={<Directory companyId={1} />}
                />
                <Route
                  path="/peoplehub/employee360"
                  element={<Employee360 />}
                />
                <Route path="/peoplehub/onboardx" element={<OnboardX />} />
                <Route path="/peoplehub/transfers" element={<Transfers />} />
                <Route path="/peoplehub/transfers-wizard" element={<TransferWizard />} />
                <Route
                  path="/peoplehub/exit"
                  element={
                    <ExitHorizon
                      employees={employees}
                      onExitCreate={handleExitCreate}
                    />
                  }
                />
                <Route path="/peoplehub/docs" element={<Documents />} />
                <Route path="/peoplehub/import" element={<BulkImport />} />

                {/* Fallback (inside layout) */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Router>
        </QueryClientProvider>
      </EnrollmentProvider>
    </CompanyProvider>
  );
};

export default App;
