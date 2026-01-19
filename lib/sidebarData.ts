import { ModuleItem } from "../types/sidebar";

export const modules: ModuleItem[] = [
  {
    id: 1,
    name: "Flexi HQ",
    icon: "Zap",
    Menu: [
      {
        id: 11,
        icon: "Orbit",
        title: "Hr GroundZero",
        subMenu: [
          {
            id: 111,
            icon: "LayoutDashboard",
            title: "Dashboard",
            pathname: "/",
          },
          {
            id: 119,
            icon: "Building2",
            title: "Company",
            pathname: "/companies",
          },
          {
            id: 112,
            icon: "Layers",
            title: "Divisions",
            pathname: "/divisions",
          },
          {
            id: 113,
            icon: "GitFork",
            title: "Departments",
            pathname: "/departments",
          },
          {
            id: 114,
            icon: "BookUser",
            title: "Designations",
            pathname: "/designations",
          },
          {
            id: 115,
            icon: "Users",
            title: "Grades & Bands",
            pathname: "/grades",
          },
          {
            id: 116,
            icon: "MapPin",
            title: "Locations",
            pathname: "/locations",
          },
          {
            id: 117,
            icon: "Wallet",
            title: "Cost Centers",
            pathname: "/cost-centers",
          },
          {
            id: 118,
            icon: "ShieldCheck",
            title: "Audit Log",
            pathname: "/audit",
          },
        ],
      },
    ],
    admin: false,
  },
  
{
  id: 2,
  name: "PeopleHub",
  icon: "Zap",
  Menu: [
    {
      id: 21,
      icon: "Zap",
      title: "PeopleZone",
      subMenu: [
        {
          id: 211,
          icon: "LayoutDashboard",
          title: "PeopleHub Home",
          pathname: "/peoplehub",
        },
        {
          id: 212,
          icon: "Users",
          title: "Employee Directory",
          pathname: "/peoplehub/directory",
        },
        {
          id: 213,
          icon: "UserCircle",
          title: "Employee 360",
          pathname: "/peoplehub/employee360",
        },
        {
          id: 214,
          icon: "UserPlus",
          title: "OnboardX",
          pathname: "/peoplehub/onboardx",
        },
        {
          id: 215,
          icon: "ArrowRightLeft",
          title: "Transfers & Promotions",
          pathname: "/peoplehub/transfers",
        },
        {
          id: 216,
          icon: "LogOut",
          title: "Exit Horizon",
          pathname: "/peoplehub/exit",
        },
        {
          id: 217,
          icon: "FileText",
          title: "Documents",
          pathname: "/peoplehub/docs",
        },
        {
          id: 218,
          icon: "UploadCloud",
          title: "Bulk Import",
          pathname: "/peoplehub/import",
        },
      ],
    },
  ],
  admin: false,
}
,

{
  id: 5,
  name: "TimeSync",
  icon: "Zap",
  admin: false,
  Menu: [
    // Dashboard (root)
    {
      id: 1,
      icon: "LayoutDashboard",
      title: "Dashboard",
      pathname: "/timesync",
    },

    // MY ATTENDANCE
    {
      id: 2,
      icon: "User",
      title: "MY ATTENDANCE",
      subMenu: [
        { id: 21, icon: "Zap", title: "Today's Status", pathname: "/timesync" },
        { id: 22, icon: "Zap", title: "Punch Attendance", pathname: "/timesync/punch" },
        { id: 23, icon: "Zap", title: "My Overtime", pathname: "/timesync/my-ot" },
        { id: 24, icon: "Zap", title: "Regularization Request", pathname: "/timesync/my-regularization" },
        { id: 25, icon: "Zap", title: "My Timeline", pathname: "/timesync/timeline" },
        { id: 26, icon: "Zap", title: "My Calendar", pathname: "/timesync/calendar" },
        { id: 27, icon: "Zap", title: "My Schedule", pathname: "/timesync/schedule" },
      ],
    },

    // TEAM
    {
      id: 3,
      icon: "Users",
      title: "TEAM",
      subMenu: [
        { id: 31, icon: "Zap", title: "Team Dashboard", pathname: "/timesync/team-dashboard" },
        { id: 32, icon: "Zap", title: "Team Calendar", pathname: "/timesync/team-calendar" },
        { id: 33, icon: "Zap", title: "Pending Approvals", pathname: "/timesync/pending-approvals" },
      ],
    },

    // APPROVALS INBOX
    {
      id: 4,
      icon: "Inbox",
      title: "APPROVALS INBOX",
      pathname: "/timesync/approvals-inbox",
    },

    // WORKFLOWS
    {
      id: 5,
      icon: "History",
      title: "WORKFLOWS",
      subMenu: [
        { id: 51, icon: "Zap", title: "Regularizations", pathname: "/timesync/regularizations" },
        { id: 52, icon: "Zap", title: "Regularization Panel", pathname: "/timesync/regularization-panel" },
        { id: 53, icon: "Zap", title: "Manual Punch", pathname: "/timesync/manual-punch" },
        { id: 54, icon: "Zap", title: "OT Approvals", pathname: "/timesync/ot-approvals-admin" },
        { id: 55, icon: "Zap", title: "Shift Swaps", pathname: "/timesync/shift-swaps" },
        { id: 56, icon: "Zap", title: "Live Processes", pathname: "/timesync/workflow-instances" },
        { id: 57, icon: "Zap", title: "Payroll Control", pathname: "/timesync/payroll-periods" },
      ],
    },

    // SHIFT STUDIO
    {
      id: 6,
      icon: "Settings2",
      title: "SHIFT STUDIO",
      subMenu: [
        { id: 61, icon: "Zap", title: "Roster Planner", pathname: "/timesync/roster-planner" },
        { id: 62, icon: "Zap", title: "Roster Templates", pathname: "/timesync/roster-templates" },
        { id: 63, icon: "Zap", title: "AI Optimizer", pathname: "/timesync/roster-optimizer" },
        { id: 64, icon: "Zap", title: "Demand Planning", pathname: "/timesync/demand-grid" },
        { id: 65, icon: "Zap", title: "Open Shifts", pathname: "/timesync/open-shifts" },
        { id: 66, icon: "Zap", title: "Swap Management", pathname: "/timesync/swap-management" },
        { id: 67, icon: "Zap", title: "Shift Templates", pathname: "/timesync/shift-templates" },
        { id: 68, icon: "Zap", title: "Shift Assignment", pathname: "/timesync/shift-assignment" },
        { id: 69, icon: "Zap", title: "Calendar Assignment", pathname: "/timesync/calendar-assignment" },
        { id: 610, icon: "Zap", title: "Flexi Rules", pathname: "/timesync/flexi-rules" },
        { id: 611, icon: "Zap", title: "Break Configs", pathname: "/timesync/break-configs" },
        { id: 612, icon: "Zap", title: "Weekly Off Rules", pathname: "/timesync/weekly-off" },
        { id: 613, icon: "Zap", title: "Alternate Saturdays", pathname: "/timesync/alt-saturdays" },
        { id: 614, icon: "Zap", title: "Holiday Calendars", pathname: "/timesync/holiday-calendars" },
        { id: 615, icon: "Zap", title: "Special Shifts", pathname: "/timesync/special-shifts" },
      ],
    },

    // POLICIES
    {
      id: 7,
      icon: "Briefcase",
      title: "POLICIES",
      subMenu: [
        { id: 71, icon: "Zap", title: "Policy Builder", pathname: "/timesync/policy-builder" },
        { id: 72, icon: "Zap", title: "Punch Methods", pathname: "/timesync/punch-methods" },
        { id: 73, icon: "Zap", title: "Grace & Penalties", pathname: "/timesync/grace-penalties" },
        { id: 74, icon: "Zap", title: "Thresholds", pathname: "/timesync/thresholds" },
        { id: 75, icon: "Zap", title: "Deduction Rules", pathname: "/timesync/deductions" },
        { id: 76, icon: "Zap", title: "Bonus Rules", pathname: "/timesync/bonuses" },
        { id: 77, icon: "Zap", title: "OT Policies", pathname: "/timesync/ot-policies" },
        { id: 78, icon: "Zap", title: "Comp-Off Conversion", pathname: "/timesync/compoff-conversion" },
      ],
    },

    // ANOMALIES
    {
      id: 8,
      icon: "ShieldAlert",
      title: "ANOMALIES",
      subMenu: [
        { id: 81, icon: "Zap", title: "Exceptions Inbox", pathname: "/timesync/exceptions" },
        { id: 82, icon: "Zap", title: "AI Guard", pathname: "/timesync/ai-anomaly" },
        { id: 83, icon: "Zap", title: "Detailed Audit", pathname: "/timesync/anomalies-audit" },
      ],
    },

    // HARDWARE
    {
      id: 9,
      icon: "Database",
      title: "HARDWARE",
      subMenu: [
        { id: 91, icon: "Zap", title: "Devices", pathname: "/timesync/hardware-devices" },
        { id: 92, icon: "Zap", title: "Device Health", pathname: "/timesync/device-health" },
        { id: 93, icon: "Zap", title: "Ingestion Jobs", pathname: "/timesync/ingestion-jobs" },
        { id: 94, icon: "Zap", title: "System Audit Logs", pathname: "/timesync/audit-logs" },
      ],
    },

    // REPORTS
    {
      id: 10,
      icon: "BarChart3",
      title: "REPORTS",
      subMenu: [
        { id: 101, icon: "Zap", title: "Daily Attendance", pathname: "/timesync/daily-report" },
        { id: 102, icon: "Zap", title: "Monthly Summary", pathname: "/timesync/monthly-report" },
        { id: 103, icon: "Zap", title: "OT Analysis", pathname: "/timesync/ot-report" },
        { id: 104, icon: "Zap", title: "OT Forecast", pathname: "/timesync/ot-forecast" },
        { id: 105, icon: "Zap", title: "Punctuality", pathname: "/timesync/late-early-report" },
        { id: 106, icon: "Zap", title: "Anomalies", pathname: "/timesync/anomaly-report" },
        { id: 107, icon: "Zap", title: "Scheduled", pathname: "/timesync/scheduled-reports" },
      ],
    },

    // SYSTEM SETTINGS
    {
      id: 11,
      icon: "Settings",
      title: "SYSTEM SETTINGS",
      subMenu: [
        { id: 111, icon: "Zap", title: "Approvals Designer", pathname: "/timesync/workflow-list" },
        { id: 112, icon: "Zap", title: "Notifications", pathname: "/timesync/notif-templates" },
        { id: 113, icon: "Zap", title: "Delivery Logs", pathname: "/timesync/notif-logs" },
        { id: 114, icon: "Zap", title: "Integrations", pathname: "/timesync/integrations" },
        { id: 115, icon: "Zap", title: "Plan & Entitlements", pathname: "/timesync/entitlements" },
        { id: 116, icon: "Zap", title: "User Access", pathname: "/timesync" },
      ],
    },

    // AI ASSISTANT
    {
      id: 12,
      icon: "Cpu",
      title: "AI ASSISTANT",
      subMenu: [
        { id: 121, icon: "Zap", title: "AI Chat", pathname: "/timesync/ai-chat" },
        { id: 122, icon: "Zap", title: "Policy Copilot", pathname: "/timesync/ai-copilot" },
        { id: 123, icon: "Zap", title: "Policy Simulator", pathname: "/timesync/ai-simulator" },
      ],
    },
  ],
}
,
  {
    id: 6,
    name: "PayEdge",
    icon: "Zap",
    Menu: [
      {
        id: 61,
        icon: "Zap",
        title: "PayMaster",
        subMenu: [
          {
            id: 611,
            icon: "Zap",
            title: "Payroll Grid",
            pathname: "/dashboard/PayMaster/PayrollGrid/list",
          },
          {
            id: 612,
            icon: "Zap",
            title: "Salary Boost",
            pathname: "/dashboard/PayMaster/SalaryBoost/list",
          },
          {
            id: 613,
            icon: "Zap",
            title: "TaxCalc",
            pathname: "/dashboard/PayMaster/TaxCalc/list",
          },
        ],
      },
      {
        id: 62,
        icon: "Zap",
        title: "Reports",
        subMenu: [
          {
            id: 621,
            icon: "Zap",
            title: "Salary Register",
          },
          {
            id: 622,
            icon: "Zap",
            title: "Tax Reports",
          },
        ],
      },
    ],
    admin: false,
  },
  {
    id: 7,
    name: "LeaveEase",
    icon: "Zap",
    Menu: [
      {
        id: 71,
        icon: "Zap",
        title: "Leave GroundZero",
        subMenu: [
          {
            id: 711,
            icon: "Zap",
            title: "Setup",
            subMenu: [
              {
                id: 7111,
                icon: "Zap",
                title: "Holiday List",
                pathname: "/dashboard/LeaveEase/Setup/HolidayList/list",
              },
              {
                id: 7112,
                icon: "Zap",
                title: "Leave Type",
                pathname: "/dashboard/LeaveEase/Setup/LeaveType/list",
              },
              {
                id: 7113,
                icon: "Zap",
                title: "Leave Period",
                pathname: "/dashboard/LeaveEase/Setup/LeavePeriod/list",
              },
              {
                id: 7114,
                icon: "Zap",
                title: "Leave Policy",
                pathname: "/dashboard/LeaveEase/Setup/LeavePolicy/list",
              },
              {
                id: 7115,
                icon: "Zap",
                title: "Leave Block List",
                pathname: "/dashboard/LeaveEase/Setup/LeaveBlockList/list",
              },
            ],
          },
          {
            id: 712,
            icon: "Zap",
            title: "Allocation",
            subMenu: [
              {
                id: 7121,
                icon: "Zap",
                title: "Leave Allocation",
                pathname:
                  "/dashboard/LeaveEase/Allocation/LeaveAllocation/list",
              },
              {
                id: 7122,
                icon: "Zap",
                title: "Leave Policy Assignment",
                pathname:
                  "/dashboard/LeaveEase/Allocation/LeavePolicyAssignment/list",
              },
              {
                id: 7123,
                icon: "Zap",
                title: "Leave Control Panel",
                pathname:
                  "/dashboard/LeaveEase/Allocation/LeaveControlPanel/list",
              },
              {
                id: 7124,
                icon: "Zap",
                title: "Leave Encashment",
                pathname:
                  "/dashboard/LeaveEase/Allocation/LeaveEncashment/list",
              },
            ],
          },
          {
            id: 713,
            icon: "Zap",
            title: "Application",
            subMenu: [
              {
                id: 7131,
                icon: "Zap",
                title: "Leave Application",
                pathname:
                  "/dashboard/LeaveEase/Application/LeaveApplication/list",
              },
              {
                id: 7132,
                icon: "Zap",
                title: "Compensatory Leave Request",
                pathname:
                  "/dashboard/LeaveEase/Application/CompensatoryLeaveRequest/list",
              },
            ],
          },
        ],
      },
      {
        id: 72,
        icon: "Zap",
        title: "Reports",
        subMenu: [
          {
            id: 721,
            icon: "Zap",
            title: "Leave Balance",
          },
        ],
      },
    ],
    admin: false,
  },
  {
    id: 3,
    name: "TalentWorks",
    icon: "Zap",
    Menu: [
      {
        id: 31,
        icon: "Zap",
        title: "TalentTrack",
        subMenu: [
          {
            id: 311,
            icon: "Zap",
            title: "JobWorks",
          },
          {
            id: 312,
            icon: "Zap",
            title: "TalentPool",
          },
          {
            id: 313,
            icon: "Zap",
            title: "OfferZone",
          },
        ],
      },
      {
        id: 32,
        icon: "Zap",
        title: "Reports",
        subMenu: [
          {
            id: 321,
            icon: "Zap",
            title: "Recruitment Metrics",
          },
        ],
      },
      {
        id: 33,
        icon: "Zap",
        title: "SkillForge",
        subMenu: [
          {
            id: 331,
            icon: "Zap",
            title: "TraningPath",
          },
          {
            id: 332,
            icon: "Zap",
            title: "Feedback Loop",
          },
        ],
      },
    ],
    admin: false,
  },
  {
    id: 4,
    name: "PerformPro",
    icon: "Zap",
    Menu: [
      {
        id: 41,
        icon: "Zap",
        title: "Performance Hub",
        subMenu: [
          {
            id: 411,
            icon: "Zap",
            title: "GoalManager",
          },
          {
            id: 412,
            icon: "Zap",
            title: "Appraisal Avenue",
          },
          {
            id: 413,
            icon: "Zap",
            title: "Feedback Focus",
          },
          {
            id: 414,
            icon: "Zap",
            title: "Employee Growth",
          },
        ],
      },
      {
        id: 42,
        icon: "Zap",
        title: "Reports",
        subMenu: [
          {
            id: 421,
            icon: "Zap",
            title: "Appraisal Insights",
          },
        ],
      },
    ],
    admin: false,
  },
  {
    id: 8,
    name: "ExpenseEase",
    icon: "Zap",
    Menu: [
      {
        id: 81,
        icon: "Zap",
        title: "ClaimPro",
        subMenu: [
          {
            id: 811,
            icon: "Zap",
            title: "Expense Tracker",
          },
          {
            id: 812,
            icon: "Zap",
            title: "TravelEase",
          },
          {
            id: 813,
            icon: "Zap",
            title: "AdvancePay",
          },
        ],
      },
      {
        id: 82,
        icon: "Zap",
        title: "Reports",
        subMenu: [
          {
            id: 821,
            icon: "Zap",
            title: "Expense Metrics",
          },
        ],
      },
    ],
    admin: false,
  },
  {
    id: 9,
    name: "ConnectCentral",
    icon: "Zap",
    Menu: [
      {
        id: 91,
        icon: "Zap",
        title: "SecureAccess",
        subMenu: [
          {
            id: 911,
            icon: "Zap",
            title: "AuthKey",
          },
          {
            id: 912,
            icon: "Zap",
            title: "AccessManager",
          },
        ],
      },
      {
        id: 92,
        icon: "Zap",
        title: "FlexiSync",
        subMenu: [
          {
            id: 921,
            icon: "Zap",
            title: "Backup Manager",
          },
          {
            id: 922,
            icon: "Zap",
            title: "Integration Central",
          },
        ],
      },
    ],
    admin: false,
  },
  {
    id: 10,
    name: "Insight360",
    icon: "Zap",
    Menu: [
      {
        id: 101,
        icon: "Zap",
        title: "Flexilnsights",
        subMenu: [
          {
            id: 1011,
            icon: "Zap",
            title: "Employee Metrics",
          },
          {
            id: 1012,
            icon: "Zap",
            title: "Performance Dashboard",
          },
          {
            id: 1013,
            icon: "Zap",
            title: "Payroll & Leave Reports",
          },
        ],
      },
    ],
    admin: false,
  },
  {
    id: 11,
    name: "ProjectEdge",
    icon: "Zap",
    Menu: [
      {
        id: 111,
        icon: "Zap",
        title: "ProjectPlanner",
        subMenu: [
          {
            id: 1111,
            icon: "Zap",
            title: "Project Suite",
          },
          {
            id: 1112,
            icon: "Zap",
            title: "TaskMaster",
          },
        ],
      },
      {
        id: 112,
        icon: "Zap",
        title: "Reports",
        subMenu: [
          {
            id: 1121,
            icon: "Zap",
            title: "Project Profitability",
          },
          {
            id: 1122,
            icon: "Zap",
            title: "Delay Tracker",
          },
        ],
      },
    ],
    admin: false,
  },
  {
    id: 12,
    name: "SystemFlex",
    icon: "Zap",
    Menu: [
      {
        id: 121,
        icon: "Zap",
        title: "CustomizePro",
        subMenu: [
          {
            id: 1211,
            icon: "Zap",
            title: "FormBuilder",
          },
          {
            id: 1212,
            icon: "Zap",
            title: "WorkFlow Designer",
          },
          {
            id: 1213,
            icon: "Zap",
            title: "PrintManager",
          },
        ],
      },
      {
        id: 122,
        icon: "Zap",
        title: "AdminSuite",
        subMenu: [
          {
            id: 1221,
            icon: "Zap",
            title: "System Logs",
          },
          {
            id: 1222,
            icon: "Zap",
            title: "Module Settings",
          },
        ],
      },
    ],
    admin: false,
  },
  {
    id: 13,
    name: "EngageBoard",
    icon: "Zap",
    Menu: [
      {
        id: 131,
        icon: "Zap",
        title: "PulseCheck",
        subMenu: [
          {
            id: 1311,
            icon: "Zap",
            title: "Engage Surveys",
          },
          {
            id: 1312,
            icon: "Zap",
            title: "TeamEvents",
          },
          {
            id: 1313,
            icon: "Zap",
            title: "Rewards & Recognition",
          },
        ],
      },
    ],
    admin: false,
  },
  {
    id: 14,
    name: "Flexi meta",
    icon: "Zap",
    admin: true,
    Menu: [
    // 2.1 Geography (replaces single "Country" item with a group)
    {
      id: 141,
      icon: 'Zap',
      title: "Geography",
      subMenu: [
        { id: 14101, icon: 'Zap', title: "Countries", pathname: "/countries" },
        { id: 14102, icon: 'Zap', title: "States/Provinces", pathname: "/states" },
        { id: 14103, icon: 'Zap', title: "Cities", pathname: "/cities" },
        { id: 14104, icon: 'Zap', title: "Regions", pathname: "/regions" },
      ],
    },

    // 2.2 Company Dictionaries (moved from old "Company")
    {
      id: 143,
      icon: 'Zap',
      title: "Company Dictionaries",
      subMenu: [
        { id: 14301, icon: 'Zap', title: "Entity Type", pathname: "/entity-types" },
        { id: 14302, icon: 'Zap', title: "Location Type", pathname: "/location-types" },
        { id: 14304, icon: 'Zap', title: "Locations", pathname: "/locations-1" },
        { id: 14303, icon: 'Zap', title: "Business Line", pathname: "/business" },
      ],
    },

    // Keep your existing Employee block intact
    {
      id: 142,
      icon: 'Zap',
      title: "Employee",
      subMenu: [
        { id: 1511, icon: 'Zap', title: "Gender", pathname:"/genders" },
        { id: 1512, icon: 'Zap', title: "Salutation", pathname:"/salutation" },
        { id: 1513, icon: 'Zap', title: "Status", pathname:"/employee-status" },
        { id: 1511, icon: 'Zap', title: "Grade", pathname:"/employee-type" },
        { id: 1512, icon: 'Zap', title: "Employee Type", pathname:"/employee-type" },
        { id: 1513, icon: 'Zap', title: "Blood group", pathname:"/blood-group" },
        { id: 1512, icon: 'Zap', title: "Marital Status", pathname:"/marital-status" },
        { id: 1513, icon: 'Zap', title: "Health", pathname:"/health" },
      ],
    },

    // 2.3 Finance (NEW)
    {
      id: 144,
      icon: 'Zap',
      title: "Finance",
      subMenu: [
        { id: 14401, icon: 'Zap', title: "Currencies", pathname: "/currencies" },
        { id: 14402, icon: 'Zap', title: "FX Rates", pathname: "/fx-rates" },
        { id: 14403, icon: 'Zap', title: "Banks", pathname: "/banks" },
        { id: 14404, icon: 'Zap', title: "Bank Branches", pathname: "/dashboard/adminsettings/fleximeta/Finance/BankBranch" },
        { id: 14405, icon: 'Zap', title: "IBAN Formats", pathname: "/dashboard/adminsettings/fleximeta/Finance/IbanFormat" },
      ],
    },

    // 2.4 Statutory Framework (NEW)
    {
      id: 145,
      icon: 'Zap',
      title: "Statutory Framework",
      subMenu: [
        { id: 14501, icon: 'Zap', title: "Minimum Wages", pathname: "/minimum-wage" },
        { id: 14502, icon: 'Zap', title: "Statutory Rates", pathname: "/statutory-rates" },
      ],
    },

    // 2.5 Calendars (NEW)
    {
      id: 146,
      icon: 'Zap',
      title: "Calendars",
      subMenu: [
        { id: 14601, icon: 'Zap', title: "Public Holiday Templates", pathname: "/holidays" },
      ],
    },

   
    {
      id: 147,
      icon: 'Zap',
      title: "Catalogs",
      subMenu: [
        { id: 14701, icon: 'Zap', title: "Salary Components", pathname: "/salary-components" },
        { id: 14702, icon: 'Zap', title: "Shift Archetypes", pathname: "/shift-archectypes" },
        { id: 14703, icon: 'Zap', title: "Attendance Device Types", pathname: "/device-types" },
        { id: 14704, icon: 'Zap', title: "Document Types", pathname: "/document-types" },
        { id: 14705, icon: 'Zap', title: "Skills & Trades", pathname: "/skills-trades" },
        { id: 14706, icon: 'Zap', title: "Grade Templates", pathname: "/grade-templates" },
      ],
    },
  ],
  },
  {
    id: 15,
    name: "Settings",
    icon: "Zap",
    Menu: [
      {
        id: 151,
        icon: "Zap",
        title: "PulseCheck",
        subMenu: [
          {
            id: 1511,
            icon: "Zap",
            title: "Engage Surveys",
          },
          {
            id: 1512,
            icon: "Zap",
            title: "TeamEvents",
          },
          {
            id: 1513,
            icon: "Zap",
            title: "Rewards & Recognition",
          },
        ],
      },
    ],
    admin: true,
  },
  {
    id: 16,
    name: "Users",
    icon: "Zap",
    Menu: [
      {
        id: 161,
        icon: "Zap",
        title: "PulseCheck",
        subMenu: [
          {
            id: 1611,
            icon: "Zap",
            title: "Engage Surveys",
          },
          {
            id: 1612,
            icon: "Zap",
            title: "TeamEvents",
          },
          {
            id: 1613,
            icon: "Zap",
            title: "Rewards & Recognition",
          },
        ],
      },
    ],
    admin: true,
  },
  {
    id: 17,
    name: "Manage Modules",
    icon: "Zap",
    Menu: [
      {
        id: 171,
        icon: "Zap",
        title: "PulseCheck",
        subMenu: [
          {
            id: 1711,
            icon: "Zap",
            title: "Engage Surveys",
          },
          {
            id: 1712,
            icon: "Zap",
            title: "TeamEvents",
          },
          {
            id: 1713,
            icon: "Zap",
            title: "Rewards & Recognition",
          },
        ],
      },
    ],
    admin: true,
  },
  {
    id: 18,
    name: "Permissions",
    icon: "Zap",
    Menu: [
      {
        id: 181,
        icon: "Zap",
        title: "PulseCheck",
        subMenu: [
          {
            id: 1811,
            icon: "Zap",
            title: "Engage Surveys",
          },
          {
            id: 1812,
            icon: "Zap",
            title: "TeamEvents",
          },
          {
            id: 1813,
            icon: "Zap",
            title: "Rewards & Recognition",
          },
        ],
      },
    ],
    admin: true,
  },
  {
    id: 19,
    name: "Billing",
    icon: "Zap",
    Menu: [
      {
        id: 191,
        icon: "Zap",
        title: "PulseCheck",
        subMenu: [
          {
            id: 1911,
            icon: "Zap",
            title: "Engage Surveys",
          },
          {
            id: 1912,
            icon: "Zap",
            title: "TeamEvents",
          },
          {
            id: 1913,
            icon: "Zap",
            title: "Rewards & Recognition",
          },
        ],
      },
    ],
    admin: true,
  },
  {
    id: 20,
    name: "Field Names",
    icon: "Zap",
    Menu: [
      {
        id: 201,
        icon: "Zap",
        title: "PulseCheck",
        subMenu: [
          {
            id: 2011,
            icon: "Zap",
            title: "Engage Surveys",
          },
          {
            id: 2012,
            icon: "Zap",
            title: "TeamEvents",
          },
          {
            id: 2013,
            icon: "Zap",
            title: "Rewards & Recognition",
          },
        ],
      },
    ],
    admin: true,
  },
  {
    id: 21,
    name: "Data",
    icon: "Zap",
    Menu: [
      {
        id: 211,
        icon: "Zap",
        title: "PulseCheck",
        subMenu: [
          {
            id: 2111,
            icon: "Zap",
            title: "Engage Surveys",
          },
          {
            id: 2112,
            icon: "Zap",
            title: "TeamEvents",
          },
          {
            id: 2113,
            icon: "Zap",
            title: "Rewards & Recognition",
          },
        ],
      },
    ],
    admin: true,
  },
];
