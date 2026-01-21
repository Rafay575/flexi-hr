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
  ApprovalStatus,
  PayrollSummary,
  EmployeePayroll,
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
import { PolicySimulator as TimeSyncPolicySimulator } from "./components/PolicySimulator";

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

// -------- LeaveEase Components --------
import { LeaveEaseShell } from "./components/LeaveEaseShell";
import {
  EmployeeView,
  ManagerView,
  HRView,
} from "./components/DashboardSections";
import { MyBalances } from "./components/MyBalances";
import { ApplyLeaveWizard } from "./components/ApplyLeaveWizard";
import { MyRequests } from "./components/MyRequests";
import { MyLeaveCalendar } from "./components/MyLeaveCalendar";
import { BalanceLedger } from "./components/BalanceLedger";
import { TeamCalendar as LeaveEaseTeamCalendar } from "./components/TeamCalendar";
import { TeamBalances } from "./components/TeamBalances";
import { PolicySimulator as LeaveEasePolicySimulator } from "./components/PolicySimulator";
import { PendingApprovals } from "./components/PendingApprovals";
import { HolidayCalendarReference } from "./components/HolidayCalendarReference";
import { LeaveTypesList } from "./components/LeaveTypesList";
import { AccrualRulesList } from "./components/AccrualRulesList";
import { AccrualJobs } from "./components/AccrualJobs";
import { CarryForwardRules } from "./components/CarryForwardRules";
import { BlackoutPeriods } from "./components/BlackoutPeriods";
import { RejectionReasonCategories } from "./components/RejectionReasonCategories";
import { MyCompOffCredits } from "./components/MyCompOffCredits";
import { CompOffAllCredits } from "./components/CompOffAllCredits";
import { CompOffApprovalPanel } from "./components/CompOffApprovalPanel";
import { EncashmentRequest } from "./components/EncashmentRequest";
import { EncashmentRequestsList } from "./components/EncashmentRequestsList";
import { EncashmentApprovalPanel } from "./components/EncashmentApprovalPanel";
import { MyODTravelRequests } from "./components/MyODTravelRequests";
import { ODTravelAllRequests } from "./components/ODTravelAllRequests";
import { ODTravelApprovalPanel } from "./components/ODTravelApprovalPanel";
import { IncentiveRulesList } from "./components/IncentiveRulesList";
import { IncentiveRuleForm } from "./components/IncentiveRuleForm";
import { IncentiveAwardRuns } from "./components/IncentiveAwardRuns";
import { MyEarnedRewards } from "./components/MyEarnedRewards";
import { BalanceAdjustmentsList } from "./components/BalanceAdjustmentsList";
import { AdjustmentApprovalPanel } from "./components/AdjustmentApprovalPanel";
import { OpeningBalancesImport } from "./components/OpeningBalancesImport";
import { YearEndProcessing } from "./components/YearEndProcessing";
import { YearEndJobsHistory } from "./components/YearEndJobsHistory";
import { EmployeeLeaveAssignments } from "./components/EmployeeLeaveAssignments";
import { LeaveReportGenerator } from "./components/LeaveReportGenerator";
import { ScheduledReportsList as LeaveScheduledReportsList } from "./components/ScheduledReportsList";
import { LeaveAnalytics } from "./components/LeaveAnalytics";
import { LeaveAuditLogs } from "./components/LeaveAuditLogs";
import { LeaveAIChat } from "./components/LeaveAIChat";
import { CoverageRiskPanel } from "./components/CoverageRiskPanel";
import { LeaveForecast } from "./components/LeaveForecast";
import { LeaveAnomalyDetection } from "./components/LeaveAnomalyDetection";
import { PolicyCopilot } from "./components/PolicyCopilot";
import { LeaveNotificationTemplates } from "./components/LeaveNotificationTemplates";
import { NotificationDeliveryLogs as LeaveNotificationDeliveryLogs } from "./components/NotificationDeliveryLogs";
import { LeaveWorkflowsList } from "./components/LeaveWorkflowsList";
import { LeaveWorkflowBuilder } from "./components/LeaveWorkflowBuilder";
import { WorkflowInstancesList } from "./components/WorkflowInstancesList";
import { LeaveIntegrations } from "./components/LeaveIntegrations";
import { LeaveEntitlements } from "./components/LeaveEntitlements";
import { PayrollPeriodsList } from "./components/PayrollPeriodsList";
import { OrgLeaveCalendar } from "./components/OrgLeaveCalendar";
import { SLAMonitorDashboard } from "./components/SLAMonitorDashboard";
import { ApprovalsInbox as LeaveApprovalsInbox } from "./components/ApprovalsInbox";
import { DelegationSettings } from "./components/DelegationSettings";
import { EligibilityGroupForm } from "./components/EligibilityGroupForm";

// Import types and constants
import { LeaveBalance, LeaveRequest, LeaveStatus } from "./types";
import { INITIAL_BALANCES, MOCK_HISTORY } from "./constants";
import { ChevronRight, Plus } from "lucide-react";

// -------- PayEdge Components --------
// Import PayEdge components from your PayEdge project
import { RBACProvider } from "./hooks/useRBAC";

import { MyPayslips } from "./components/MyPayslips";
import { PayslipExplainer } from "./components/PayslipExplainer";
import { MySalaryHistory } from "./components/MySalaryHistory";
import { MyLoans } from "./components/MyLoans";
import { MyEOBIStatement } from "./components/MyEOBIStatement";
import { MyPFStatement } from "./components/MyPFStatement";
import { PayComponentsList } from "./components/PayComponentsList";
import { SalaryTemplatesList } from "./components/SalaryTemplatesList";
import { PayEdgeWorkflowConfig } from "./components/PayEdgeWorkflowConfig";
import { PayEdgeIntegrationSettings } from "./components/PayEdgeIntegrationSettings";
import { PakistanBankLibrary } from "./components/PakistanBankLibrary";
import { BankFormatsConfig } from "./components/BankFormatsConfig";
import { PayslipTemplateDesigner } from "./components/PayslipTemplateDesigner";

import { PayrollCalendar } from "./components/PayrollCalendar";
import { ExceptionCenter } from "./components/ExceptionCenter";
import { PayrollGroupsList } from "./components/PayrollGroupsList";
import { LoansList } from "./components/LoansList";
import { RecoverySchedule } from "./components/RecoverySchedule";
import { AdjustmentsList } from "./components/AdjustmentsList";
import { AdjustmentApproval } from "./components/AdjustmentApproval";
import { ArrearsProcessing } from "./components/ArrearsProcessing";
import { IncrementProcessing } from "./components/IncrementProcessing";
import { EOSSettlementsList } from "./components/EOSSettlementsList";
import { GratuityCalculator } from "./components/GratuityCalculator";
import { PayslipViewer } from "./components/PayslipViewer";
import { PayrollRegisters } from "./components/PayrollRegisters";
import { BankAdviceGenerator } from "./components/BankAdviceGenerator";
import { BankExportHistory } from "./components/BankExportHistory";
import { JVExport } from "./components/JVExport";
import { CostAnalysisReport } from "./components/CostAnalysisReport";
import { GratuityProvisionReport } from "./components/GratuityProvisionReport";
import { PayrollReportsDashboard } from "./components/PayrollReportsDashboard";
import { ReconciliationAssistant } from "./components/ReconciliationAssistant";
import { PayrollAnomalyDetection } from "./components/PayrollAnomalyDetection";
import { PayrollAuditLogs } from "./components/PayrollAuditLogs";
import { ScheduledReports } from "./components/ScheduledReports";
import { PayEdgeAIChat } from "./components/PayEdgeAIChat";
import { PolicyCopilot as PayEdgePolicyCopilot } from "./components/PolicyCopilot";
import { CurrencyFXRates } from "./components/CurrencyFXRates";
import { PayEdgeNotificationsConfig } from "./components/PayEdgeNotificationsConfig";
import { PayEdgeEntitlements } from "./components/PayEdgeEntitlements";
import { EmployeePayProfilesList } from "./components/EmployeePayProfilesList";
import { AdvanceRequestESS } from "./components/AdvanceRequestESS";
import { TaxConfiguration } from "./components/TaxConfiguration";
import { TaxCalculationEngine } from "./components/TaxCalculationEngine";
import { EOBIConfiguration } from "./components/EOBIConfiguration";
import { SocialSecurityConfiguration } from "./components/SocialSecurityConfiguration";
import { ProvidentFundConfiguration } from "./components/ProvidentFundConfiguration";
import { MyTaxCertificate } from "./components/MyTaxCertificate";
import { StatutoryReturnsDashboard } from "./components/StatutoryReturnsDashboard";
import { ChallanGenerator } from "./components/ChallanGenerator";
import { BonusProcessing } from "./components/BonusProcessing";
import { PromotionProcessing } from "./components/PromotionProcessing";
import { IncrementLetterGenerator } from "./components/IncrementLetterGenerator";
import { EOSSettlementWizard } from "./components/EOSSettlementWizard";
import { VarianceReport } from "./components/VarianceReport";
import DashboardRouter from "./components/DashboardRouter";
import { PayrollRunsList } from "./components/PayrollRunsList";

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

// ---------- LeaveEase Wrapper Component ----------
const LeaveEaseApp: React.FC = () => {
  const [balances, setBalances] = useState<LeaveBalance[]>(INITIAL_BALANCES);
  const [history, setHistory] = useState<LeaveRequest[]>(MOCK_HISTORY);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isIncentiveFormOpen, setIsIncentiveFormOpen] = useState(false);
  const navigate = useNavigate();

  const handleWizardSubmit = (data: any) => {
    const newRequest: LeaveRequest = {
      id: `LV-2025-${Math.floor(1000 + Math.random() * 9000)}`,
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      days: 3,
      reason: data.reason,
      status: ApprovalStatus.PENDING,
      appliedDate: new Date().toISOString().split("T")[0],
    };

    setHistory([newRequest, ...history]);
    setIsWizardOpen(false);
    navigate("/leaveease/my-requests");
  };

  const getStatusStyle = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.APPROVED:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case LeaveStatus.PENDING:
        return "bg-amber-100 text-amber-700 border-amber-200";
      case LeaveStatus.REJECTED:
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  const handleNavigate = (id: string) => {
    if (id === "apply-leave") {
      setIsWizardOpen(true);
    } else {
      navigate(`/leaveease/${id}`);
    }
  };

  return (
    <div className="font-['League_Spartan']">
      <LeaveEaseShell
        activeId={window.location.pathname.split("/").pop() || "dashboard"}
        onNavigate={handleNavigate}
      >
        <Outlet />
        <ApplyLeaveWizard
          isOpen={isWizardOpen}
          onClose={() => setIsWizardOpen(false)}
          onSubmit={handleWizardSubmit}
        />
        <IncentiveRuleForm
          isOpen={isIncentiveFormOpen}
          onClose={() => setIsIncentiveFormOpen(false)}
        />
      </LeaveEaseShell>
    </div>
  );
};

// ---------- LeaveEase Dashboard Component ----------
const LeaveEaseDashboard: React.FC = () => {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const navigate = useNavigate();
  const [history] = useState<LeaveRequest[]>(MOCK_HISTORY);

  const getStatusStyle = (status: LeaveStatus) => {
    switch (status) {
      case LeaveStatus.APPROVED:
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case LeaveStatus.PENDING:
        return "bg-amber-100 text-amber-700 border-amber-200";
      case LeaveStatus.REJECTED:
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-500 border-gray-200";
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Welcome Banner */}
      <section className="bg-primary-gradient rounded-2xl p-6 lg:p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#E8D5A3] text-[#3E3B6F] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                Active Period: 2025
              </span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2">
              Welcome back, John! 👋
            </h2>
            <p className="text-white/80 max-w-md text-lg">
              You have <span className="text-[#E8D5A3] font-bold">16 days</span>{" "}
              of Annual Leave remaining. Ready for a break?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 min-w-[200px]">
              <p className="text-xs uppercase tracking-widest text-white/60 mb-2">
                Upcoming Leave
              </p>
              <div className="flex items-center gap-4">
                <div className="text-center px-4 py-2 bg-accent-cream rounded-lg text-[#3E3B6F]">
                  <p className="text-[10px] font-bold leading-none">FEB</p>
                  <p className="text-xl font-bold">10</p>
                </div>
                <div>
                  <p className="font-bold text-sm">Annual Leave</p>
                  <p className="text-xs text-white/70">3 Days Pending</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 flex flex-col justify-center">
              <button
                onClick={() => setIsWizardOpen(true)}
                className="bg-[#E8D5A3] text-[#3E3B6F] px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-all shadow-xl active:scale-95 whitespace-nowrap"
              >
                <Plus size={18} />
                New Application
              </button>
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#E8B4A0]/10 rounded-full blur-2xl"></div>
      </section>

      <EmployeeView onApply={() => setIsWizardOpen(true)} />
      <ManagerView />
      <HRView />

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-12">
        <div className="px-6 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Recent Leave Activity
            </h3>
            <p className="text-sm text-gray-500">
              A quick glance at your latest requests.
            </p>
          </div>
          <button
            onClick={() => navigate("/leaveease/my-requests")}
            className="text-sm font-bold text-[#3E3B6F] hover:underline"
          >
            View All Requests
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                  Ref ID
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                  Type
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                  Duration
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                  Status
                </th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {history.slice(0, 4).map((request) => (
                <tr
                  key={request.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-5 font-mono text-xs text-gray-400">
                    {request.id}
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-800 text-sm">
                    {request.type}
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-[#3E3B6F]">
                    {request.days} Days
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider `}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => navigate("/leaveease/my-requests")}
                      className="text-gray-400 hover:text-[#3E3B6F] transition-colors p-2 rounded-lg hover:bg-white shadow-sm border border-transparent hover:border-gray-100"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <footer className="py-10 text-center space-y-2 border-t border-gray-100">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Powered by Flexi HRMS Engine
        </p>
      </footer>
      <ApplyLeaveWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmit={() => {}}
      />
    </div>
  );
};

// ---------- PayEdge Wrapper Component ----------

// ---------- PayEdge with Shell Component ----------
const PayEdgeWithShell: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigate = (id: string) => {
    navigate(`/payedge/${id}`);
  };

  return (
    <div>
      <Outlet />
    </div>
  );
};

// ---------- PeopleHub Dashboard page ----------
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
    generateEmployees(142),
  );
  const [employeesP, setEmployeesP] = useState<EmployeePayroll[]>([]);
  const [summary, setSummary] = useState<PayrollSummary | null>(null);
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
      }),
    );
  };

  return (
    <CompanyProvider>
      <EnrollmentProvider>
        <RBACProvider>
          <QueryClientProvider client={queryClient}>
            <Router>
              <Routes>
                {/* Auth routes (no main layout) */}
                <Route path="/auth/login" element={<LoginPage />} />

                {/* Protected / main app routes with Layout */}
                <Route element={<Layout />}>
                  {/* Dashboard: both / and /dashboard work */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* Geography routes */}
                  <Route path="/countries" element={<CountryListing />} />
                  <Route path="/states" element={<StateListing />} />
                  <Route path="/cities" element={<CityListing />} />
                  <Route path="/regions" element={<RegionsListing />} />

                  {/* Company Dictionary routes */}
                  <Route path="/entity-types" element={<EntityListing />} />
                  <Route
                    path="/location-types"
                    element={<LocationTypeListing />}
                  />
                  <Route path="/locations-1" element={<LocationListing />} />
                  <Route path="/business" element={<BusinessListing />} />

                  {/* Employee Meta routes */}
                  <Route path="/genders" element={<GenderListing />} />
                  <Route path="/salutation" element={<SalutationListing />} />
                  <Route
                    path="/employee-status"
                    element={<EmployeeStatusListing />}
                  />
                  <Route
                    path="/employee-type"
                    element={<EmployeeTypeListing />}
                  />
                  <Route path="/blood-group" element={<BloodGroupsListing />} />
                  <Route
                    path="/marital-status"
                    element={<MaritalStatusListing />}
                  />
                  <Route path="/health" element={<HealthListing />} />

                  {/* Finance routes */}
                  <Route path="/currencies" element={<CurrencyListing />} />
                  <Route path="/fx-rates" element={<FxRateListing />} />
                  <Route path="/banks" element={<BankListing />} />

                  {/* Calendar & Statutory routes */}
                  <Route path="/holidays" element={<HolidayListing />} />
                  <Route
                    path="/minimum-wage"
                    element={<MinimumWageListing />}
                  />
                  <Route
                    path="/statutory-rates"
                    element={<StatutoryRatesListing />}
                  />

                  {/* Catalog routes */}
                  <Route
                    path="/salary-components"
                    element={<SalaryComponentsListing />}
                  />
                  <Route
                    path="/shift-archectypes"
                    element={<ShiftArchetypesListing />}
                  />
                  <Route
                    path="/device-types"
                    element={<DeviceTypesListing />}
                  />
                  <Route
                    path="/document-types"
                    element={<DocumentTypesListing />}
                  />
                  <Route path="/skills-trades" element={<TradeListing />} />
                  <Route
                    path="/grade-templates"
                    element={<GradeTemplateListing />}
                  />

                  {/* Flexi HQ routes */}
                  <Route path="/companies" element={<CompaniesPage />} />
                  <Route
                    path="/companies/:id/summary"
                    element={<CompanySummaryPage />}
                  />
                  <Route path="/company-create" element={<CompanyStepper />} />
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
                      <PeopleHubDashboard
                        stats={stats}
                        activities={activities}
                      />
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
                  <Route
                    path="/peoplehub/transfers-wizard"
                    element={<TransferWizard />}
                  />
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

                  {/* TimeSync routes */}
                  <Route path="/timesync" element={<TodaysStatus />} />
                  <Route path="/timesync/punch" element={<PunchAttendance />} />
                  <Route path="/timesync/my-ot" element={<OTRequests />} />
                  <Route
                    path="/timesync/my-regularization"
                    element={<RegularizationRequest />}
                  />
                  <Route
                    path="/timesync/timeline"
                    element={<MyAttendanceTimeline />}
                  />
                  <Route
                    path="/timesync/calendar"
                    element={<MyAttendanceCalendar />}
                  />
                  <Route path="/timesync/schedule" element={<MySchedule />} />
                  <Route
                    path="/timesync/team-dashboard"
                    element={<TeamDashboard />}
                  />
                  <Route
                    path="/timesync/team-calendar"
                    element={<TeamCalendar />}
                  />
                  <Route
                    path="/timesync/pending-approvals"
                    element={<ManagerPendingApprovals />}
                  />
                  <Route
                    path="/timesync/approvals-inbox"
                    element={<ApprovalsInbox />}
                  />
                  <Route
                    path="/timesync/regularizations"
                    element={<RegularizationRequestsList />}
                  />
                  <Route
                    path="/timesync/regularization-panel"
                    element={<RegularizationPanel />}
                  />
                  <Route
                    path="/timesync/manual-punch"
                    element={<ManualPunchPanel />}
                  />
                  <Route
                    path="/timesync/ot-approvals-admin"
                    element={<OTApprovalsManager />}
                  />
                  <Route
                    path="/timesync/ot-approvals"
                    element={<OTApprovalsList />}
                  />
                  <Route
                    path="/timesync/shift-swaps"
                    element={<ShiftSwapRequestsList />}
                  />
                  <Route
                    path="/timesync/workflow-instances"
                    element={<WorkflowInstances />}
                  />
                  <Route
                    path="/timesync/payroll-periods"
                    element={<PayrollPeriods />}
                  />
                  <Route
                    path="/timesync/roster-planner"
                    element={<RosterPlanner />}
                  />
                  <Route
                    path="/timesync/roster-templates"
                    element={<RosterTemplates />}
                  />
                  <Route
                    path="/timesync/roster-optimizer"
                    element={<RosterOptimizer />}
                  />
                  <Route
                    path="/timesync/demand-grid"
                    element={<DemandGrid />}
                  />
                  <Route
                    path="/timesync/open-shifts"
                    element={<OpenShifts />}
                  />
                  <Route
                    path="/timesync/swap-management"
                    element={<SwapManagement userRole={"MANAGER"} />}
                  />
                  <Route
                    path="/timesync/shift-templates"
                    element={<ShiftTemplatesList onCreateNew={() => {}} />}
                  />
                  <Route
                    path="/timesync/shift-templates/new"
                    element={<ShiftTemplateForm onClose={() => {}} />}
                  />
                  <Route
                    path="/timesync/shift-assignment"
                    element={<ShiftAssignment />}
                  />
                  <Route
                    path="/timesync/calendar-assignment"
                    element={<CalendarAssignment />}
                  />
                  <Route
                    path="/timesync/flexi-rules"
                    element={<FlexiShiftRules />}
                  />
                  <Route
                    path="/timesync/break-configs"
                    element={<BreakConfigurationsList />}
                  />
                  <Route
                    path="/timesync/weekly-off"
                    element={<WeeklyOffRules />}
                  />
                  <Route
                    path="/timesync/alt-saturdays"
                    element={<AlternateSaturdayRules />}
                  />
                  <Route
                    path="/timesync/holiday-calendars"
                    element={<HolidayCalendarList />}
                  />
                  <Route
                    path="/timesync/special-shifts"
                    element={<SpecialShifts />}
                  />
                  <Route
                    path="/timesync/policy-builder"
                    element={<AttendancePolicyList onCreateNew={() => {}} />}
                  />
                  <Route
                    path="/timesync/policy-builder/new"
                    element={<AttendancePolicyBuilder onClose={() => {}} />}
                  />
                  <Route
                    path="/timesync/punch-methods"
                    element={<PunchMethodsConfig />}
                  />
                  <Route
                    path="/timesync/grace-penalties"
                    element={<GracePenaltiesConfig />}
                  />
                  <Route
                    path="/timesync/thresholds"
                    element={<ThresholdSettings />}
                  />
                  <Route
                    path="/timesync/deductions"
                    element={<DeductionRulesConfig />}
                  />
                  <Route
                    path="/timesync/bonuses"
                    element={<AttendanceBonusRules />}
                  />
                  <Route
                    path="/timesync/ot-policies"
                    element={<OTPolicySetup />}
                  />
                  <Route
                    path="/timesync/compoff-conversion"
                    element={<CompOffConversion />}
                  />
                  <Route
                    path="/timesync/ai-simulator"
                    element={<TimeSyncPolicySimulator />}
                  />
                  <Route
                    path="/timesync/exceptions"
                    element={<ExceptionsInbox />}
                  />
                  <Route
                    path="/timesync/ai-anomaly"
                    element={<AIAnomalyDetection />}
                  />
                  <Route
                    path="/timesync/anomalies-audit"
                    element={<AnomaliesList />}
                  />
                  <Route
                    path="/timesync/hardware-devices"
                    element={<DeviceManagementList />}
                  />
                  <Route
                    path="/timesync/device-health"
                    element={<DeviceHealthDashboard />}
                  />
                  <Route
                    path="/timesync/ingestion-jobs"
                    element={<IngestionJobs />}
                  />
                  <Route
                    path="/timesync/audit-logs"
                    element={<TimeSyncAuditLogs />}
                  />
                  <Route
                    path="/timesync/daily-report"
                    element={<DailyAttendanceReport />}
                  />
                  <Route
                    path="/timesync/monthly-report"
                    element={<MonthlySummaryReport />}
                  />
                  <Route path="/timesync/ot-report" element={<OTReport />} />
                  <Route
                    path="/timesync/ot-forecast"
                    element={<OTForecast />}
                  />
                  <Route
                    path="/timesync/late-early-report"
                    element={<LateEarlyReport />}
                  />
                  <Route
                    path="/timesync/anomaly-report"
                    element={<AnomalyReport />}
                  />
                  <Route
                    path="/timesync/scheduled-reports"
                    element={<ScheduledReportsList />}
                  />
                  <Route
                    path="/timesync/notif-templates"
                    element={<TimeSyncNotificationTemplates />}
                  />
                  <Route
                    path="/timesync/notif-logs"
                    element={<NotificationDeliveryLogs />}
                  />
                  <Route
                    path="/timesync/integrations"
                    element={<TimeSyncIntegrations />}
                  />
                  <Route
                    path="/timesync/entitlements"
                    element={<TimeSyncEntitlements />}
                  />
                  <Route
                    path="/timesync/workflow-list"
                    element={<TimeSyncWorkflowsList onCreateNew={() => {}} />}
                  />
                  <Route
                    path="/timesync/workflows/new"
                    element={<TimeSyncWorkflowBuilder onClose={() => {}} />}
                  />
                  <Route
                    path="/timesync/ai-chat"
                    element={<TimeSyncAIChat />}
                  />
                  <Route
                    path="/timesync/ai-copilot"
                    element={<AIPolicyCopilot />}
                  />

                  {/* LeaveEase Routes */}
                  <Route path="/leaveease" >
                    <Route index element={<LeaveEaseDashboard />} />
                    {/* My Leave Section */}
                    <Route path="dashboard" element={<LeaveEaseDashboard />} />
                    <Route
                      path="my-balances"
                      element={
                        <MyBalances
                          onApply={() =>
                            (window.location.href = "/leaveease/apply-leave")
                          }
                        />
                      }
                    />
                    <Route
                      path="apply-leave"
                      element={
                        <MyBalances
                          onApply={() =>
                            (window.location.href = "/leaveease/apply-leave")
                          }
                        />
                      }
                    />
                    <Route
                      path="my-requests"
                      element={
                        <MyRequests
                          onApply={() =>
                            (window.location.href = "/leaveease/apply-leave")
                          }
                        />
                      }
                    />
                    <Route path="my-calendar" element={<MyLeaveCalendar />} />
                    <Route path="balance-ledger" element={<BalanceLedger />} />
                    <Route
                      path="my-earned-rewards"
                      element={<MyEarnedRewards />}
                    />
                    {/* Team Section */}
                    <Route
                      path="team-calendar"
                      element={<LeaveEaseTeamCalendar />}
                    />
                    <Route path="team-balances" element={<TeamBalances />} />
                    <Route
                      path="pending-approvals"
                      element={<PendingApprovals />}
                    />
                    {/* Approvals Section */}
                    <Route
                      path="approvals-inbox"
                      element={<LeaveApprovalsInbox />}
                    />
                    <Route
                      path="delegations"
                      element={<DelegationSettings />}
                    />
                    {/* Policy Studio Section */}
                    <Route
                      path="holiday-calendar"
                      element={<HolidayCalendarReference />}
                    />
                    <Route path="leave-types" element={<LeaveTypesList />} />
                    <Route
                      path="eligibility"
                      element={
                        <EligibilityGroupForm
                          isOpen={true}
                          onClose={() => {}}
                        />
                      }
                    />
                    <Route
                      path="employee-assignments"
                      element={<EmployeeLeaveAssignments />}
                    />
                    <Route path="accrual" element={<AccrualRulesList />} />
                    <Route path="accrual-jobs" element={<AccrualJobs />} />
                    <Route
                      path="carry-forward-rules"
                      element={<CarryForwardRules />}
                    />
                    <Route path="year-end" element={<YearEndProcessing />} />
                    <Route
                      path="year-end-history"
                      element={<YearEndJobsHistory />}
                    />
                    <Route path="blackout" element={<BlackoutPeriods />} />
                    <Route
                      path="incentive-rules"
                      element={<IncentiveRulesList />}
                    />
                    <Route
                      path="incentive-runs"
                      element={<IncentiveAwardRuns />}
                    />
                    <Route
                      path="balance-adjustments"
                      element={<BalanceAdjustmentsList />}
                    />
                    <Route
                      path="adjustment-approvals"
                      element={<AdjustmentApprovalPanel />}
                    />
                    <Route
                      path="opening-balances"
                      element={<OpeningBalancesImport />}
                    />
                    <Route
                      path="rejection-reasons"
                      element={<RejectionReasonCategories />}
                    />
                    <Route path="audit-logs" element={<LeaveAuditLogs />} />
                    <Route
                      path="sla-monitor"
                      element={<SLAMonitorDashboard />}
                    />
                    <Route
                      path="simulator"
                      element={<LeaveEasePolicySimulator />}
                    />
                    {/* Comp-Off Section */}
                    <Route
                      path="co-credits"
                      element={
                        <MyCompOffCredits
                          onApply={() =>
                            (window.location.href = "/leaveease/apply-leave")
                          }
                        />
                      }
                    />
                    <Route
                      path="co-approvals"
                      element={<CompOffApprovalPanel />}
                    />
                    <Route path="co-all" element={<CompOffAllCredits />} />
                    {/* Official Duty Section */}
                    <Route path="od-travel" element={<MyODTravelRequests />} />
                    <Route
                      path="od-approvals"
                      element={<ODTravelApprovalPanel />}
                    />
                    <Route
                      path="od-reports"
                      element={<ODTravelAllRequests />}
                    />
                    {/* AI Assistant Section */}
                    <Route path="ai-copilot" element={<PolicyCopilot />} />
                    <Route path="ai-risk" element={<CoverageRiskPanel />} />
                    <Route
                      path="ai-anomalies"
                      element={<LeaveAnomalyDetection />}
                    />
                    {/* Payroll Liquidation Section */}
                    <Route path="encashment" element={<EncashmentRequest />} />
                    <Route
                      path="encashment-list"
                      element={<EncashmentRequestsList />}
                    />
                    <Route
                      path="encashment-approvals"
                      element={<EncashmentApprovalPanel />}
                    />
                    <Route
                      path="payroll-periods"
                      element={<PayrollPeriodsList />}
                    />
                    {/* Reports Section */}
                    <Route path="reports" element={<LeaveReportGenerator />} />
                    <Route
                      path="scheduled-reports"
                      element={<LeaveScheduledReportsList />}
                    />
                    <Route path="analytics" element={<LeaveAnalytics />} />
                    <Route path="forecast" element={<LeaveForecast />} />
                    {/* Settings Section */}
                    <Route
                      path="notifications"
                      element={<LeaveEaseDashboard />}
                    />{" "}
                    {/* Placeholder */}
                    <Route
                      path="notification-templates"
                      element={<LeaveNotificationTemplates />}
                    />
                    <Route
                      path="notification-logs"
                      element={<LeaveNotificationDeliveryLogs />}
                    />
                    <Route path="workflows" element={<LeaveWorkflowsList />} />
                    <Route
                      path="workflow-builder"
                      element={<LeaveWorkflowBuilder />}
                    />
                    <Route
                      path="workflow-instances"
                      element={<WorkflowInstancesList />}
                    />
                    <Route
                      path="integrations"
                      element={<LeaveIntegrations />}
                    />
                    <Route
                      path="entitlements"
                      element={<LeaveEntitlements />}
                    />
                  </Route>

                  {/* PayEdge Routes */}

                  <Route path="/payedge" element={<PayEdgeWithShell />}>
                    <Route
                      index
                      element={
                        <DashboardRouter
                          summary={summary}
                          employees={employeesP}
                        />
                      }
                    />

                    {/* Main Section */}
                    <Route
                      path="dashboard"
                      element={
                        <DashboardRouter
                          summary={summary}
                          employees={employeesP}
                        />
                      }
                    />
                    <Route path="my-payroll" element={<MyPayslips />} />
                    <Route
                      path="payslip-explainer"
                      element={<PayslipExplainer />}
                    />
                    <Route
                      path="salary-history"
                      element={<MySalaryHistory />}
                    />
                    <Route
                      path="payroll-processing"
                      element={<PayrollRunsList />}
                    />
                    <Route path="my-loans" element={<MyLoans />} />
                    <Route
                      path="eobi-statement"
                      element={<MyEOBIStatement />}
                    />
                    <Route path="pf-statement" element={<MyPFStatement />} />
                    <Route
                      path="team-payroll"
                      element={<EmployeePayProfilesList />}
                    />
                    <Route
                      path="request-advance"
                      element={<AdvanceRequestESS />}
                    />

                    {/* Configuration Section */}
                    <Route
                      path="pay-components"
                      element={<PayComponentsList />}
                    />
                    <Route
                      path="salary-structures"
                      element={<SalaryTemplatesList />}
                    />
                    <Route
                      path="workflow-config"
                      element={<PayEdgeWorkflowConfig />}
                    />
                    <Route
                      path="integration-hub"
                      element={<PayEdgeIntegrationSettings />}
                    />
                    <Route
                      path="bank-library"
                      element={<PakistanBankLibrary />}
                    />
                    <Route
                      path="bank-formats"
                      element={<BankFormatsConfig />}
                    />
                    <Route
                      path="payslip-designer"
                      element={<PayslipTemplateDesigner />}
                    />

                    {/* Operations Section */}

                    <Route
                      path="payroll-calendar"
                      element={<PayrollCalendar />}
                    />
                    <Route
                      path="exception-center"
                      element={<ExceptionCenter />}
                    />
                    <Route
                      path="payroll-periods"
                      element={<PayrollPeriodsList />}
                    />
                    <Route
                      path="payroll-groups"
                      element={<PayrollGroupsList />}
                    />
                    <Route path="loans-advances" element={<LoansList />} />
                    <Route
                      path="recovery-schedule"
                      element={<RecoverySchedule />}
                    />
                    <Route path="adjustments" element={<AdjustmentsList />} />
                    <Route
                      path="adj-approvals"
                      element={<AdjustmentApproval />}
                    />
                    <Route
                      path="arrears-processing"
                      element={<ArrearsProcessing />}
                    />
                    <Route
                      path="increments-bonus"
                      element={<IncrementProcessing />}
                    />
                    <Route
                      path="final-settlement"
                      element={<EOSSettlementsList onCreateNew={() => {}} />}
                    />
                    <Route
                      path="gratuity-calc"
                      element={<GratuityCalculator />}
                    />

                    {/* Outputs Section */}
                    <Route path="payslip-viewer" element={<PayslipViewer />} />
                    <Route
                      path="payroll-registers"
                      element={<PayrollRegisters />}
                    />
                    <Route
                      path="bank-advice"
                      element={<BankAdviceGenerator />}
                    />
                    <Route
                      path="export-history"
                      element={<BankExportHistory />}
                    />
                    <Route path="jv-export" element={<JVExport />} />
                    <Route
                      path="revision-letters"
                      element={<IncrementLetterGenerator />}
                    />
                    <Route
                      path="cost-analysis"
                      element={<CostAnalysisReport />}
                    />
                    <Route
                      path="gratuity-provisions"
                      element={<GratuityProvisionReport />}
                    />
                    <Route
                      path="pakistan-compliance"
                      element={
                        <>
                          <StatutoryReturnsDashboard />
                          <ChallanGenerator />
                          <TaxConfiguration />
                          <TaxCalculationEngine />
                          <EOBIConfiguration />
                          <SocialSecurityConfiguration />
                          <ProvidentFundConfiguration />
                        </>
                      }
                    />
                    <Route
                      path="reports"
                      element={<PayrollReportsDashboard />}
                    />
                    <Route
                      path="variance-analysis"
                      element={<VarianceReport />}
                    />
                    <Route
                      path="reconciliation"
                      element={<ReconciliationAssistant />}
                    />
                    <Route
                      path="anomaly-detection"
                      element={<PayrollAnomalyDetection />}
                    />
                    <Route path="audit-logs" element={<PayrollAuditLogs />} />
                    <Route
                      path="scheduled-reports"
                      element={<ScheduledReports />}
                    />

                    {/* Advanced Section */}
                    <Route path="ai-assistant" element={<PayEdgeAIChat />} />
                    <Route
                      path="policy-copilot"
                      element={<PayEdgePolicyCopilot />}
                    />
                    <Route path="fx-rates" element={<CurrencyFXRates />} />
                    <Route
                      path="alert-config"
                      element={<PayEdgeNotificationsConfig />}
                    />
                    <Route
                      path="entitlements"
                      element={<PayEdgeEntitlements />}
                    />
                    <Route
                      path="settings"
                      element={
                        <div className="p-8 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
                          <div className="p-6 bg-gray-50 rounded-full text-gray-400 mb-4 animate-bounce">
                            <span className="text-4xl">⚙️</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">
                            Settings Dashboard
                          </h3>
                          <p className="text-gray-500 mt-2">
                            Configure your PayEdge settings here.
                          </p>
                        </div>
                      }
                    />
                  </Route>
                  {/* Alternative: Full PayEdge App with own layout (if needed) */}

                  {/* Fallback (inside layout) */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </Router>
          </QueryClientProvider>
        </RBACProvider>
      </EnrollmentProvider>
    </CompanyProvider>
  );
};

export default App;
