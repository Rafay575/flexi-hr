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
import CityListing from "./components/fleximeta/geography/cities";
import EntityListing from "./components/fleximeta/company_dictionaries/entities";
import LocationTypeListing from "./components/fleximeta/company_dictionaries/locations-types";
import LocationListing from "./components/fleximeta/company_dictionaries/location";
import BusinessListing from "./components/fleximeta/company_dictionaries/business";
import RegionsListing from "./components/fleximeta/geography/region";
import GenderListing from "./components/fleximeta/employee/gender";
import SalutationListing from "./components/fleximeta/employee/salutation";
import EmployeeStatusListing from "./components/fleximeta/employee/status";
import EmployeeTypeListing from "./components/fleximeta/employee/employee-type";
import BloodGroupsListing from "./components/fleximeta/employee/blood-groups";
import MaritalStatusListing from "./components/fleximeta/employee/marital-status";
import HealthListing from "./components/fleximeta/employee/health";
import CurrencyListing from "./components/fleximeta/finance/currencies";
import BankListing from "./components/fleximeta/finance/banks";
import FxRateListing from "./components/fleximeta/finance/fx-rates";
import HolidayListing from "./components/fleximeta/calander/holidays";
import MinimumWageListing from "./components/fleximeta/statutory/minimum-wages";
import StatutoryRatesListing from "./components/fleximeta/statutory/statutory-rates";
import SalaryComponentsListing from "./components/fleximeta/catalogs/salary-components";
import ShiftArchetypesListing from "./components/fleximeta/catalogs/shift-archetypes";
import DeviceTypesListing from "./components/fleximeta/catalogs/device-type";
import DocumentTypesListing from "./components/fleximeta/catalogs/document-type";
import TradeListing from "./components/fleximeta/catalogs/trades";
import GradeTemplateListing from "./components/fleximeta/catalogs/grade-templates";
// -------- TimeSync (merged) pages --------
import { TodaysStatus } from "./components/TodaysStatus";
import { PunchAttendance } from "./components/PunchAttendance";
import { MyAttendanceTimeline } from "./components/MyAttendanceTimeline";
import { MyAttendanceCalendar } from "./components/MyAttendanceCalendar";
import { MySchedule } from "./components/MySchedule";

import { TeamDashboard } from "./components/TeamDashboard";
import { TeamCalendar } from "./components/TeamCalendar";
import { ManagerPendingApprovals } from "./components/ManagerPendingApprovals";

import { ApprovalsInbox } from "./components/ApprovalsInbox";
import { RegularizationRequestsList } from "./components/RegularizationRequestsList";
import { RegularizationPanel } from "./components/RegularizationPanel";
import { RegularizationRequest } from "./components/RegularizationRequest";
import { ManualPunchPanel } from "./components/ManualPunchPanel";

import { OTRequests } from "./components/OTRequests";
import { OTApprovalsManager } from "./components/OTApprovalsManager";
import { OTApprovalsList } from "./components/OTApprovalsList";

import { ShiftSwapRequestsList } from "./components/ShiftSwapRequestsList";

import { ShiftTemplatesList } from "./components/ShiftTemplatesList";
import { ShiftTemplateForm } from "./components/ShiftTemplateForm";

import { ShiftAssignment } from "./components/ShiftAssignment";
import { CalendarAssignment } from "./components/CalendarAssignment";
import { FlexiShiftRules } from "./components/FlexiShiftRules";
import { BreakConfigurationsList } from "./components/BreakConfigurationsList";
import { WeeklyOffRules } from "./components/WeeklyOffRules";
import { AlternateSaturdayRules } from "./components/AlternateSaturdayRules";
import { HolidayCalendarList } from "./components/HolidayCalendarList";
import { SpecialShifts } from "./components/SpecialShifts";

import { RosterPlanner } from "./components/RosterPlanner";
import { RosterTemplates } from "./components/RosterTemplates";
import { RosterOptimizer } from "./components/RosterOptimizer";
import { OpenShifts } from "./components/OpenShifts";
import { DemandGrid } from "./components/DemandGrid";
import { SwapManagement } from "./components/SwapManagement";

import { AttendancePolicyList } from "./components/AttendancePolicyList";
import { AttendancePolicyBuilder } from "./components/AttendancePolicyBuilder";
import { PunchMethodsConfig } from "./components/PunchMethodsConfig";
import { GracePenaltiesConfig } from "./components/GracePenaltiesConfig";
import { ThresholdSettings } from "./components/ThresholdSettings";
import { DeductionRulesConfig } from "./components/DeductionRulesConfig";
import { AttendanceBonusRules } from "./components/AttendanceBonusRules";
import { OTPolicySetup } from "./components/OTPolicySetup";
import { CompOffConversion } from "./components/CompOffConversion";
import { PolicySimulator } from "./components/PolicySimulator";

import { ExceptionsInbox } from "./components/ExceptionsInbox";
import { AIAnomalyDetection } from "./components/AIAnomalyDetection";
import { AnomaliesList } from "./components/AnomaliesList";

import { DeviceManagementList } from "./components/DeviceManagementList";
import { DeviceHealthDashboard } from "./components/DeviceHealthDashboard";
import { IngestionJobs } from "./components/IngestionJobs";
import { TimeSyncAuditLogs } from "./components/TimeSyncAuditLogs";

import { DailyAttendanceReport } from "./components/DailyAttendanceReport";
import { MonthlySummaryReport } from "./components/MonthlySummaryReport";
import { OTReport } from "./components/OTReport";
import { OTForecast } from "./components/OTForecast";
import { LateEarlyReport } from "./components/LateEarlyReport";
import { AnomalyReport } from "./components/AnomalyReport";
import { ScheduledReportsList } from "./components/ScheduledReportsList";

import { TimeSyncAIChat } from "./components/TimeSyncAIChat";
import { AIPolicyCopilot } from "./components/AIPolicyCopilot";

import { TimeSyncNotificationTemplates } from "./components/TimeSyncNotificationTemplates";
import { NotificationDeliveryLogs } from "./components/NotificationDeliveryLogs";

import { TimeSyncWorkflowsList } from "./components/TimeSyncWorkflowsList";
import { TimeSyncWorkflowBuilder } from "./components/TimeSyncWorkflowBuilder";
import { WorkflowInstances } from "./components/WorkflowInstances";

import { TimeSyncIntegrations } from "./components/TimeSyncIntegrations";
import { TimeSyncEntitlements } from "./components/TimeSyncEntitlements";
import { PayrollPeriods } from "./components/PayrollPeriods";

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
              <Route path="/cities" element={<CityListing />} />
              <Route path="/regions" element={<RegionsListing />} />
              <Route path="/entity-types" element={<EntityListing />} />
              <Route path="/location-types" element={<LocationTypeListing />} />
              <Route path="/locations-1" element={<LocationListing />} />
              <Route path="/business" element={<BusinessListing />} />
              <Route path="/genders" element={<GenderListing />} />
              <Route path="/salutation" element={<SalutationListing />} />
              <Route path="/employee-status" element={<EmployeeStatusListing />} />
              <Route path="/employee-type" element={<EmployeeTypeListing />} />
              <Route path="/blood-group" element={<BloodGroupsListing />} />
              <Route path="/marital-status" element={<MaritalStatusListing />} />
              <Route path="/health" element={<HealthListing />} />
              <Route path="/currencies" element={<CurrencyListing />} />
              <Route path="/fx-rates" element={<FxRateListing />} />
              <Route path="/banks" element={<BankListing />} />
              <Route path="/holidays" element={<HolidayListing />} />
              <Route path="/minimum-wage" element={<MinimumWageListing />} />
              <Route path="/statutory-rates" element={<StatutoryRatesListing />} />
              <Route path="/salary-components" element={<SalaryComponentsListing />} />
              <Route path="/shift-archectypes" element={<ShiftArchetypesListing />} />
              <Route path="/device-types" element={<DeviceTypesListing />} />
              <Route path="/document-types" element={<DocumentTypesListing />} />
              <Route path="/skills-trades" element={<TradeListing />} />
              <Route path="/grade-templates" element={<GradeTemplateListing />} />
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
{/* ---------------- TimeSync routes ---------------- */}
<Route path="/timesync" element={<TodaysStatus />} />

{/* My Attendance */}
<Route path="/timesync/punch" element={<PunchAttendance />} />
<Route path="/timesync/my-ot" element={<OTRequests />} />
<Route path="/timesync/my-regularization" element={<RegularizationRequest />} />
<Route path="/timesync/timeline" element={<MyAttendanceTimeline />} />
<Route path="/timesync/calendar" element={<MyAttendanceCalendar />} />
<Route path="/timesync/schedule" element={<MySchedule />} />

{/* Team */}
<Route path="/timesync/team-dashboard" element={<TeamDashboard />} />
<Route path="/timesync/team-calendar" element={<TeamCalendar />} />
<Route path="/timesync/pending-approvals" element={<ManagerPendingApprovals />} />

{/* Approvals Inbox */}
<Route path="/timesync/approvals-inbox" element={<ApprovalsInbox />} />

{/* Workflows */}
<Route path="/timesync/regularizations" element={<RegularizationRequestsList />} />
<Route path="/timesync/regularization-panel" element={<RegularizationPanel />} />
<Route path="/timesync/manual-punch" element={<ManualPunchPanel />} />
<Route path="/timesync/ot-approvals-admin" element={<OTApprovalsManager />} />
<Route path="/timesync/ot-approvals" element={<OTApprovalsList />} />
<Route path="/timesync/shift-swaps" element={<ShiftSwapRequestsList />} />
<Route path="/timesync/workflow-instances" element={<WorkflowInstances />} />
<Route path="/timesync/payroll-periods" element={<PayrollPeriods />} />

{/* Shift Studio */}
<Route path="/timesync/roster-planner" element={<RosterPlanner />} />
<Route path="/timesync/roster-templates" element={<RosterTemplates />} />
<Route path="/timesync/roster-optimizer" element={<RosterOptimizer />} />
<Route path="/timesync/demand-grid" element={<DemandGrid />} />
<Route path="/timesync/open-shifts" element={<OpenShifts />} />
<Route
  path="/timesync/swap-management"
  element={<SwapManagement userRole={"MANAGER"} />}
/>
<Route path="/timesync/shift-templates" element={<ShiftTemplatesList onCreateNew={() => {}} />} />
<Route path="/timesync/shift-templates/new" element={<ShiftTemplateForm onClose={() => {}} />} />
<Route path="/timesync/shift-assignment" element={<ShiftAssignment />} />
<Route path="/timesync/calendar-assignment" element={<CalendarAssignment />} />
<Route path="/timesync/flexi-rules" element={<FlexiShiftRules />} />
<Route path="/timesync/break-configs" element={<BreakConfigurationsList />} />
<Route path="/timesync/weekly-off" element={<WeeklyOffRules />} />
<Route path="/timesync/alt-saturdays" element={<AlternateSaturdayRules />} />
<Route path="/timesync/holiday-calendars" element={<HolidayCalendarList />} />
<Route path="/timesync/special-shifts" element={<SpecialShifts />} />

{/* Policies */}
<Route path="/timesync/policy-builder" element={<AttendancePolicyList onCreateNew={() => {}} />} />
<Route path="/timesync/policy-builder/new" element={<AttendancePolicyBuilder onClose={() => {}} />} />
<Route path="/timesync/punch-methods" element={<PunchMethodsConfig />} />
<Route path="/timesync/grace-penalties" element={<GracePenaltiesConfig />} />
<Route path="/timesync/thresholds" element={<ThresholdSettings />} />
<Route path="/timesync/deductions" element={<DeductionRulesConfig />} />
<Route path="/timesync/bonuses" element={<AttendanceBonusRules />} />
<Route path="/timesync/ot-policies" element={<OTPolicySetup />} />
<Route path="/timesync/compoff-conversion" element={<CompOffConversion />} />
<Route path="/timesync/ai-simulator" element={<PolicySimulator />} />

{/* Anomalies */}
<Route path="/timesync/exceptions" element={<ExceptionsInbox />} />
<Route path="/timesync/ai-anomaly" element={<AIAnomalyDetection />} />
<Route path="/timesync/anomalies-audit" element={<AnomaliesList />} />

{/* Hardware */}
<Route path="/timesync/hardware-devices" element={<DeviceManagementList />} />
<Route path="/timesync/device-health" element={<DeviceHealthDashboard />} />
<Route path="/timesync/ingestion-jobs" element={<IngestionJobs />} />
<Route path="/timesync/audit-logs" element={<TimeSyncAuditLogs />} />

{/* Reports */}
<Route path="/timesync/daily-report" element={<DailyAttendanceReport />} />
<Route path="/timesync/monthly-report" element={<MonthlySummaryReport />} />
<Route path="/timesync/ot-report" element={<OTReport />} />
<Route path="/timesync/ot-forecast" element={<OTForecast />} />
<Route path="/timesync/late-early-report" element={<LateEarlyReport />} />
<Route path="/timesync/anomaly-report" element={<AnomalyReport />} />
<Route path="/timesync/scheduled-reports" element={<ScheduledReportsList />} />

{/* System Settings */}
<Route path="/timesync/notif-templates" element={<TimeSyncNotificationTemplates />} />
<Route path="/timesync/notif-logs" element={<NotificationDeliveryLogs />} />
<Route path="/timesync/integrations" element={<TimeSyncIntegrations />} />
<Route path="/timesync/entitlements" element={<TimeSyncEntitlements />} />

{/* Workflow Designer + Create New (full-screen) */}
<Route path="/timesync/workflow-list" element={<TimeSyncWorkflowsList onCreateNew={() => {}} />} />
<Route path="/timesync/workflows/new" element={<TimeSyncWorkflowBuilder onClose={() => {}} />} />

{/* AI Assistant */}
<Route path="/timesync/ai-chat" element={<TimeSyncAIChat />} />
<Route path="/timesync/ai-copilot" element={<AIPolicyCopilot />} />

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
