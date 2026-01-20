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
  },

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
          {
            id: 21,
            icon: "Zap",
            title: "Today's Status",
            pathname: "/timesync",
          },
          {
            id: 22,
            icon: "Zap",
            title: "Punch Attendance",
            pathname: "/timesync/punch",
          },
          {
            id: 23,
            icon: "Zap",
            title: "My Overtime",
            pathname: "/timesync/my-ot",
          },
          {
            id: 24,
            icon: "Zap",
            title: "Regularization Request",
            pathname: "/timesync/my-regularization",
          },
          {
            id: 25,
            icon: "Zap",
            title: "My Timeline",
            pathname: "/timesync/timeline",
          },
          {
            id: 26,
            icon: "Zap",
            title: "My Calendar",
            pathname: "/timesync/calendar",
          },
          {
            id: 27,
            icon: "Zap",
            title: "My Schedule",
            pathname: "/timesync/schedule",
          },
        ],
      },

      // TEAM
      {
        id: 3,
        icon: "Users",
        title: "TEAM",
        subMenu: [
          {
            id: 31,
            icon: "Zap",
            title: "Team Dashboard",
            pathname: "/timesync/team-dashboard",
          },
          {
            id: 32,
            icon: "Zap",
            title: "Team Calendar",
            pathname: "/timesync/team-calendar",
          },
          {
            id: 33,
            icon: "Zap",
            title: "Pending Approvals",
            pathname: "/timesync/pending-approvals",
          },
        ],
      },

      // APPROVALS INBOX
      {
        id: 4,
        icon: "Inbox",
        title: "APPROVALS INBOX",
        pathname: "/timesync/approvals-inbox",
      },

      {
        id: 5,
        icon: "History",
        title: "WORKFLOWS",
        subMenu: [
          {
            id: 51,
            icon: "Zap",
            title: "Regularizations",
            pathname: "/timesync/regularizations",
          },
          {
            id: 52,
            icon: "Zap",
            title: "Regularization Panel",
            pathname: "/timesync/regularization-panel",
          },
          {
            id: 53,
            icon: "Zap",
            title: "Manual Punch",
            pathname: "/timesync/manual-punch",
          },
          {
            id: 54,
            icon: "Zap",
            title: "OT Approvals",
            pathname: "/timesync/ot-approvals-admin",
          },
          {
            id: 55,
            icon: "Zap",
            title: "Shift Swaps",
            pathname: "/timesync/shift-swaps",
          },
          {
            id: 56,
            icon: "Zap",
            title: "Live Processes",
            pathname: "/timesync/workflow-instances",
          },
          {
            id: 57,
            icon: "Zap",
            title: "Payroll Control",
            pathname: "/timesync/payroll-periods",
          },
        ],
      },

      // SHIFT STUDIO
      {
        id: 6,
        icon: "Settings2",
        title: "SHIFT STUDIO",
        subMenu: [
          {
            id: 61,
            icon: "Zap",
            title: "Roster Planner",
            pathname: "/timesync/roster-planner",
          },
          {
            id: 62,
            icon: "Zap",
            title: "Roster Templates",
            pathname: "/timesync/roster-templates",
          },
          {
            id: 63,
            icon: "Zap",
            title: "AI Optimizer",
            pathname: "/timesync/roster-optimizer",
          },
          {
            id: 64,
            icon: "Zap",
            title: "Demand Planning",
            pathname: "/timesync/demand-grid",
          },
          {
            id: 65,
            icon: "Zap",
            title: "Open Shifts",
            pathname: "/timesync/open-shifts",
          },
          {
            id: 66,
            icon: "Zap",
            title: "Swap Management",
            pathname: "/timesync/swap-management",
          },
          {
            id: 67,
            icon: "Zap",
            title: "Shift Templates",
            pathname: "/timesync/shift-templates",
          },
          {
            id: 68,
            icon: "Zap",
            title: "Shift Assignment",
            pathname: "/timesync/shift-assignment",
          },
          {
            id: 69,
            icon: "Zap",
            title: "Calendar Assignment",
            pathname: "/timesync/calendar-assignment",
          },
          {
            id: 610,
            icon: "Zap",
            title: "Flexi Rules",
            pathname: "/timesync/flexi-rules",
          },
          {
            id: 611,
            icon: "Zap",
            title: "Break Configs",
            pathname: "/timesync/break-configs",
          },
          {
            id: 612,
            icon: "Zap",
            title: "Weekly Off Rules",
            pathname: "/timesync/weekly-off",
          },
          {
            id: 613,
            icon: "Zap",
            title: "Alternate Saturdays",
            pathname: "/timesync/alt-saturdays",
          },
          {
            id: 614,
            icon: "Zap",
            title: "Holiday Calendars",
            pathname: "/timesync/holiday-calendars",
          },
          {
            id: 615,
            icon: "Zap",
            title: "Special Shifts",
            pathname: "/timesync/special-shifts",
          },
        ],
      },

      // POLICIES
      {
        id: 7,
        icon: "Briefcase",
        title: "POLICIES",
        subMenu: [
          {
            id: 71,
            icon: "Zap",
            title: "Policy Builder",
            pathname: "/timesync/policy-builder",
          },
          {
            id: 72,
            icon: "Zap",
            title: "Punch Methods",
            pathname: "/timesync/punch-methods",
          },
          {
            id: 73,
            icon: "Zap",
            title: "Grace & Penalties",
            pathname: "/timesync/grace-penalties",
          },
          {
            id: 74,
            icon: "Zap",
            title: "Thresholds",
            pathname: "/timesync/thresholds",
          },
          {
            id: 75,
            icon: "Zap",
            title: "Deduction Rules",
            pathname: "/timesync/deductions",
          },
          {
            id: 76,
            icon: "Zap",
            title: "Bonus Rules",
            pathname: "/timesync/bonuses",
          },
          {
            id: 77,
            icon: "Zap",
            title: "OT Policies",
            pathname: "/timesync/ot-policies",
          },
          {
            id: 78,
            icon: "Zap",
            title: "Comp-Off Conversion",
            pathname: "/timesync/compoff-conversion",
          },
        ],
      },

      // ANOMALIES
      {
        id: 8,
        icon: "ShieldAlert",
        title: "ANOMALIES",
        subMenu: [
          {
            id: 81,
            icon: "Zap",
            title: "Exceptions Inbox",
            pathname: "/timesync/exceptions",
          },
          {
            id: 82,
            icon: "Zap",
            title: "AI Guard",
            pathname: "/timesync/ai-anomaly",
          },
          {
            id: 83,
            icon: "Zap",
            title: "Detailed Audit",
            pathname: "/timesync/anomalies-audit",
          },
        ],
      },

      // HARDWARE
      {
        id: 9,
        icon: "Database",
        title: "HARDWARE",
        subMenu: [
          {
            id: 91,
            icon: "Zap",
            title: "Devices",
            pathname: "/timesync/hardware-devices",
          },
          {
            id: 92,
            icon: "Zap",
            title: "Device Health",
            pathname: "/timesync/device-health",
          },
          {
            id: 93,
            icon: "Zap",
            title: "Ingestion Jobs",
            pathname: "/timesync/ingestion-jobs",
          },
          {
            id: 94,
            icon: "Zap",
            title: "System Audit Logs",
            pathname: "/timesync/audit-logs",
          },
        ],
      },

      // REPORTS
      {
        id: 10,
        icon: "BarChart3",
        title: "REPORTS",
        subMenu: [
          {
            id: 101,
            icon: "Zap",
            title: "Daily Attendance",
            pathname: "/timesync/daily-report",
          },
          {
            id: 102,
            icon: "Zap",
            title: "Monthly Summary",
            pathname: "/timesync/monthly-report",
          },
          {
            id: 103,
            icon: "Zap",
            title: "OT Analysis",
            pathname: "/timesync/ot-report",
          },
          {
            id: 104,
            icon: "Zap",
            title: "OT Forecast",
            pathname: "/timesync/ot-forecast",
          },
          {
            id: 105,
            icon: "Zap",
            title: "Punctuality",
            pathname: "/timesync/late-early-report",
          },
          {
            id: 106,
            icon: "Zap",
            title: "Anomalies",
            pathname: "/timesync/anomaly-report",
          },
          {
            id: 107,
            icon: "Zap",
            title: "Scheduled",
            pathname: "/timesync/scheduled-reports",
          },
        ],
      },

      // SYSTEM SETTINGS
      {
        id: 11,
        icon: "Settings",
        title: "SYSTEM SETTINGS",
        subMenu: [
          {
            id: 111,
            icon: "Zap",
            title: "Approvals Designer",
            pathname: "/timesync/workflow-list",
          },
          {
            id: 112,
            icon: "Zap",
            title: "Notifications",
            pathname: "/timesync/notif-templates",
          },
          {
            id: 113,
            icon: "Zap",
            title: "Delivery Logs",
            pathname: "/timesync/notif-logs",
          },
          {
            id: 114,
            icon: "Zap",
            title: "Integrations",
            pathname: "/timesync/integrations",
          },
          {
            id: 115,
            icon: "Zap",
            title: "Plan & Entitlements",
            pathname: "/timesync/entitlements",
          },
          { id: 116, icon: "Zap", title: "User Access", pathname: "/timesync" },
        ],
      },

      // AI ASSISTANT
      {
        id: 12,
        icon: "Cpu",
        title: "AI ASSISTANT",
        subMenu: [
          {
            id: 121,
            icon: "Zap",
            title: "AI Chat",
            pathname: "/timesync/ai-chat",
          },
          {
            id: 122,
            icon: "Zap",
            title: "Policy Copilot",
            pathname: "/timesync/ai-copilot",
          },
          {
            id: 123,
            icon: "Zap",
            title: "Policy Simulator",
            pathname: "/timesync/ai-simulator",
          },
        ],
      },
    ],
  },
 {
  id: 6,
  name: "PayEdge",
  icon: "Zap",
  admin: false, // Default, can be overridden based on user
  Menu: [
    {
      id: 1,
      icon: "LayoutDashboard",
      title: "Main",
      subMenu: [
        {
          id: 101,
          icon: "LayoutDashboard",
          title: "Dashboard",
          pathname: "/payedge/dashboard",
          
        },
        {
          id: 102,
          icon: "UserCircle",
          title: "My Payroll",
          pathname: "/payedge/my-payroll",
        
        },
        {
          id: 103,
          icon: "Sparkles",
          title: "Payslip Explainer",
          pathname: "/payedge/payslip-explainer",
         
        },
        {
          id: 104,
          icon: "History",
          title: "Salary History",
          pathname: "/payedge/salary-history",
       
        },
        {
          id: 105,
          icon: "HandCoins",
          title: "My Loans",
          pathname: "/payedge/my-loans",
          
        },
        {
          id: 106,
          icon: "ShieldCheck",
          title: "EOBI Statement",
          pathname: "/payedge/eobi-statement",
        
        },
        {
          id: 107,
          icon: "Landmark",
          title: "PF Statement",
          pathname: "/payedge/pf-statement",
        
        },
        {
          id: 108,
          icon: "Users",
          title: "Team Payroll",
          pathname: "/payedge/team-payroll",
          
        },
        {
          id: 109,
          icon: "HandCoins",
          title: "Request Advance",
          pathname: "/payedge/request-advance",
        
        }
      ]
    },
    {
      id: 2,
      icon: "Settings",
      title: "Configuration",
     
      subMenu: [
        {
          id: 201,
          icon: "Layers",
          title: "Pay Components",
          pathname: "/payedge/pay-components",
        
        },
        {
          id: 202,
          icon: "Briefcase",
          title: "Salary Structures",
          pathname: "/payedge/salary-structures",
        
        },
        {
          id: 203,
          icon: "GitBranch",
          title: "Workflow Config",
          pathname: "/payedge/workflow-config",
         
        },
        {
          id: 204,
          icon: "Link2",
          title: "Integration Hub",
          pathname: "/payedge/integration-hub",
         
        },
        {
          id: 205,
          icon: "BookOpen",
          title: "Bank Library [PK]",
          pathname: "/payedge/bank-library",
       
        },
        {
          id: 206,
          icon: "Landmark",
          title: "Bank Formats",
          pathname: "/payedge/bank-formats",
        
        },
        {
          id: 207,
          icon: "LayoutDashboard",
          title: "Payslip Designer",
          pathname: "/payedge/payslip-designer",
         
        }
      ]
    },
    {
      id: 3,
      icon: "Calculator",
      title: "Operations",
   
      subMenu: [
        {
          id: 301,
          icon: "Calculator",
          title: "Payroll Processing",
          pathname: "/payedge/payroll-processing"
         
          
        },
        {
          id: 302,
          icon: "Calendar",
          title: "Payroll Calendar",
          pathname: "/payedge/payroll-calendar",
         
        },
        {
          id: 303,
          icon: "AlertCircle",
          title: "Exception Center",
          pathname: "/payedge/exception-center",
     
        },
        {
          id: 304,
          icon: "CalendarRange",
          title: "Payroll Periods",
          pathname: "/payedge/payroll-periods",
         
        },
        {
          id: 305,
          icon: "Boxes",
          title: "Payroll Groups",
          pathname: "/payedge/payroll-groups",
      
        },
        {
          id: 306,
          icon: "HandCoins",
          title: "Loans & Advances",
          pathname: "/payedge/loans-advances",
         
        },
        {
          id: 307,
          icon: "Repeat",
          title: "Recovery Schedule",
          pathname: "/payedge/recovery-schedule",
          
        },
        {
          id: 308,
          icon: "Percent",
          title: "Adjustments",
          pathname: "/payedge/adjustments",
         
        },
        {
          id: 309,
          icon: "ClipboardCheck",
          title: "Adj. Approvals",
          pathname: "/payedge/adj-approvals",
        
        },
        {
          id: 310,
          icon: "History",
          title: "Arrears Processing",
          pathname: "/payedge/arrears-processing",
        
        },
        {
          id: 311,
          icon: "TrendingUp",
          title: "Increments & Bonus",
          pathname: "/payedge/increments-bonus",
       
        },
        {
          id: 312,
          icon: "Ban",
          title: "Final Settlement",
          pathname: "/payedge/final-settlement",
         
        },
        {
          id: 313,
          icon: "CalcIcon", // Note: You may need to import this or use a different icon
          title: "Gratuity Calc",
          pathname: "/payedge/gratuity-calc",
         
        }
      ]
    },
    {
      id: 4,
      icon: "FileText",
      title: "Outputs",
      subMenu: [
        {
          id: 401,
          icon: "FileText",
          title: "Payslip Viewer",
          pathname: "/payedge/payslip-viewer",
        
        },
        {
          id: 402,
          icon: "LayoutList",
          title: "Payroll Registers",
          pathname: "/payedge/payroll-registers",
          
        },
        {
          id: 403,
          icon: "Landmark",
          title: "Bank Advice",
          pathname: "/payedge/bank-advice",
         
        },
        {
          id: 404,
          icon: "History",
          title: "Export History",
          pathname: "/payedge/export-history",
         
        },
        {
          id: 405,
          icon: "Database",
          title: "JV Export",
          pathname: "/payedge/jv-export",
          
        },
        {
          id: 406,
          icon: "FileText",
          title: "Revision Letters",
          pathname: "/payedge/revision-letters",
         
        },
        {
          id: 407,
          icon: "Database",
          title: "Cost Analysis",
          pathname: "/payedge/cost-analysis",
         
        },
        {
          id: 408,
          icon: "BarChart3",
          title: "Gratuity Provisions",
          pathname: "/payedge/gratuity-provisions",
         
        },
        {
          id: 409,
          icon: "ShieldCheck",
          title: "Pakistan Compliance",
          pathname: "/payedge/pakistan-compliance",
         
        },
        {
          id: 410,
          icon: "BarChart3",
          title: "Reports",
          pathname: "/payedge/reports",
        
        },
        {
          id: 411,
          icon: "RefreshCw",
          title: "Reconciliation",
          pathname: "/payedge/reconciliation",
        
        },
        {
          id: 412,
          icon: "ShieldAlert",
          title: "Anomaly Detection",
          pathname: "/payedge/anomaly-detection",
         
        },
        {
          id: 413,
          icon: "ShieldCheck",
          title: "Audit Logs",
          pathname: "/payedge/audit-logs",
         
        },
        {
          id: 414,
          icon: "Clock",
          title: "Scheduled",
          pathname: "/payedge/scheduled-reports",
         
        }
      ]
    },
    {
      id: 5,
      icon: "Zap",
      title: "Advanced",
      subMenu: [
        {
          id: 501,
          icon: "Bot",
          title: "AI Assistant",
          pathname: "/payedge/ai-assistant"
        
        },
        {
          id: 502,
          icon: "Zap",
          title: "Policy Copilot",
          pathname: "/payedge/policy-copilot"
       
        },
        {
          id: 503,
          icon: "Globe",
          title: "FX Rates",
          pathname: "/payedge/fx-rates",
         
        },
        {
          id: 504,
          icon: "Bell",
          title: "Alert Config",
          pathname: "/payedge/alert-config"
        
        },
        {
          id: 505,
          icon: "Gem",
          title: "Entitlements",
          pathname: "/payedge/entitlements"
        
        },
        {
          id: 506,
          icon: "Settings",
          title: "Settings",
          pathname: "/payedge/settings"
       
        }
      ]
    }
  ]
},
  {
    id: 7,
    name: "LeaveEase",
    icon: "Zap",
    admin: false, // Default, can be overridden based on user
    Menu: [
      {
        id: 701,
        icon: "LayoutDashboard",
        title: "Dashboard",
        pathname: "/leaveease/dashboard",
      },
      {
        id: 2,
        icon: "Calendar",
        title: "MY LEAVE",
        subMenu: [
          {
            id: 201,
            icon: "Database",
            title: "My Balances",
            pathname: "/leaveease/my-balances",
          },
          {
            id: 202,
            icon: "Zap",
            title: "Apply Leave",
            pathname: "/leaveease/apply-leave",
          },
          {
            id: 203,
            icon: "Trophy",
            title: "My Rewards",
            pathname: "/leaveease/my-earned-rewards",
          },
          {
            id: 204,
            icon: "Wallet",
            title: "Encashment",
            pathname: "/leaveease/encashment",
          },
          {
            id: 205,
            icon: "List",
            title: "My Requests",
            pathname: "/leaveease/my-requests",
          },
          {
            id: 206,
            icon: "Calendar",
            title: "My Calendar",
            pathname: "/leaveease/my-calendar",
          },
          {
            id: 207,
            icon: "FileText",
            title: "Balance Ledger",
            pathname: "/leaveease/balance-ledger",
          },
        ],
      },
      {
        id: 3,
        icon: "Users",
        title: "TEAM",

        subMenu: [
          {
            id: 301,
            icon: "Calendar",
            title: "Team Calendar",
            pathname: "/leaveease/team-calendar",
          },
          {
            id: 302,
            icon: "Users",
            title: "Team Balances",
            pathname: "/leaveease/team-balances",
          },
          {
            id: 303,
            icon: "CheckSquare",
            title: "Pending Approvals",
            pathname: "/leaveease/pending-approvals",
          },
        ],
      },
      {
        id: 4,
        icon: "CheckSquare",
        title: "APPROVALS",
        subMenu: [
          {
            id: 401,
            icon: "CheckSquare",
            title: "Approvals Inbox",
            pathname: "/leaveease/approvals-inbox",
          },
          {
            id: 402,
            icon: "UserPlus",
            title: "Delegations",
            pathname: "/leaveease/delegations",
          },
        ],
      },
      {
        id: 5,
        icon: "Settings",
        title: "POLICY STUDIO",

        subMenu: [
          {
            id: 501,
            icon: "Calendar",
            title: "Holiday Calendar",
            pathname: "/leaveease/holiday-calendar",
          },
          {
            id: 502,
            icon: "List",
            title: "Leave Types",
            pathname: "/leaveease/leave-types",
          },
          {
            id: 503,
            icon: "Users",
            title: "Eligibility Groups",
            pathname: "/leaveease/eligibility",
          },
          {
            id: 504,
            icon: "UserCheck",
            title: "Leave Assignments",
            pathname: "/leaveease/employee-assignments",
          },
          {
            id: 505,
            icon: "Clock",
            title: "Accrual Rules",
            pathname: "/leaveease/accrual",
          },
          {
            id: 506,
            icon: "Activity",
            title: "Accrual Jobs",
            pathname: "/leaveease/accrual-jobs",
          },
          {
            id: 507,
            icon: "Zap",
            title: "Carry Forward",
            pathname: "/leaveease/carry-forward-rules",
          },
          {
            id: 508,
            icon: "RefreshCw",
            title: "Year-End Process",
            pathname: "/leaveease/year-end",
          },
          {
            id: 509,
            icon: "History",
            title: "Year-End History",
            pathname: "/leaveease/year-end-history",
          },
          {
            id: 510,
            icon: "ShieldAlert",
            title: "Blackout Periods",
            pathname: "/leaveease/blackout",
          },
          {
            id: 511,
            icon: "Gift",
            title: "Incentive Rules",
            pathname: "/leaveease/incentive-rules",
          },
          {
            id: 512,
            icon: "Play",
            title: "Incentive Runs",
            pathname: "/leaveease/incentive-runs",
          },
          {
            id: 513,
            icon: "Sliders",
            title: "Balance Adjustments",
            pathname: "/leaveease/balance-adjustments",
          },
          {
            id: 514,
            icon: "Shield",
            title: "Adjustment Approvals",
            pathname: "/leaveease/adjustment-approvals",
          },
          {
            id: 515,
            icon: "ClipboardList",
            title: "Opening Balances",
            pathname: "/leaveease/opening-balances",
          },
          {
            id: 516,
            icon: "XCircle",
            title: "Rejection Reasons",
            pathname: "/leaveease/rejection-reasons",
          },
          {
            id: 517,
            icon: "ShieldCheck",
            title: "Audit Logs",
            pathname: "/leaveease/audit-logs",
          },
          {
            id: 518,
            icon: "BarChart3",
            title: "SLA Monitor",
            pathname: "/leaveease/sla-monitor",
          },
          {
            id: 519,
            icon: "Zap",
            title: "Simulator",
            pathname: "/leaveease/simulator",
          },
        ],
      },
      {
        id: 6,
        icon: "Zap",
        title: "COMP-OFF",
        subMenu: [
          {
            id: 601,
            icon: "Zap",
            title: "My Credits",
            pathname: "/leaveease/co-credits",
          },
          {
            id: 602,
            icon: "CheckSquare",
            title: "Credit Approvals",
            pathname: "/leaveease/co-approvals",
          },
          {
            id: 603,
            icon: "Users",
            title: "All Credits",
            pathname: "/leaveease/co-all",
          },
        ],
      },
      {
        id: 7,
        icon: "Briefcase",
        title: "OFFICIAL DUTY",
        subMenu: [
          {
            id: 701,
            icon: "Briefcase",
            title: "My OD/Travel",
            pathname: "/leaveease/od-travel",
          },
          {
            id: 702,
            icon: "CheckSquare",
            title: "OD Approvals",
            pathname: "/leaveease/od-approvals",
          },
          {
            id: 703,
            icon: "BarChart3",
            title: "Travel Analytics",
            pathname: "/leaveease/od-reports",
          },
        ],
      },
      {
        id: 8,
        icon: "Bot",
        title: "AI ASSISTANT",

        subMenu: [
          {
            id: 801,
            icon: "Bot",
            title: "Policy Copilot",
            pathname: "/leaveease/ai-copilot",
          },
          {
            id: 802,
            icon: "Sparkles",
            title: "Coverage Risk",
            pathname: "/leaveease/ai-risk",
          },
          {
            id: 803,
            icon: "Fingerprint",
            title: "Anomaly Detection",
            pathname: "/leaveease/ai-anomalies",
          },
        ],
      },
      {
        id: 9,
        icon: "DollarSign",
        title: "PAYROLL LIQUIDATION",

        subMenu: [
          {
            id: 901,
            icon: "DollarSign",
            title: "Encashment Approvals",
            pathname: "/leaveease/encashment-approvals",
          },
          {
            id: 902,
            icon: "CreditCard",
            title: "Encashment Requests",
            pathname: "/leaveease/encashment-list",
          },
          {
            id: 903,
            icon: "Coins",
            title: "Payroll Periods",
            pathname: "/leaveease/payroll-periods",
          },
        ],
      },
      {
        id: 10,
        icon: "PieChart",
        title: "REPORTS",
        subMenu: [
          {
            id: 1001,
            icon: "PieChart",
            title: "Report Generator",
            pathname: "/leaveease/reports",
          },
          {
            id: 1002,
            icon: "Clock",
            title: "Scheduled Reports",
            pathname: "/leaveease/scheduled-reports",
          },
          {
            id: 1003,
            icon: "BarChart3",
            title: "Analytics",
            pathname: "/leaveease/analytics",
          },
          {
            id: 1004,
            icon: "TrendingUp",
            title: "Forecast",
            pathname: "/leaveease/forecast",
          },
        ],
      },
      {
        id: 11,
        icon: "Settings",
        title: "SETTINGS",
        subMenu: [
          {
            id: 1101,
            icon: "Bell",
            title: "Notification Settings",
            pathname: "/leaveease/notifications",
          },
          {
            id: 1102,
            icon: "FileText",
            title: "Notification Templates",
            pathname: "/leaveease/notification-templates",
          },
          {
            id: 1103,
            icon: "Activity",
            title: "Delivery Logs",
            pathname: "/leaveease/notification-logs",
          },
          {
            id: 1104,
            icon: "GitMerge",
            title: "Workflows",
            pathname: "/leaveease/workflows",
          },
          {
            id: 1105,
            icon: "Sliders",
            title: "Workflow Builder",
            pathname: "/leaveease/workflow-builder",
          },
          {
            id: 1106,
            icon: "ListTree",
            title: "Workflow Instances",
            pathname: "/leaveease/workflow-instances",
          },
          {
            id: 1107,
            icon: "Link2",
            title: "Integrations",
            pathname: "/leaveease/integrations",
          },
          {
            id: 1108,
            icon: "ShieldCheck",
            title: "Plan & Entitlements",
            pathname: "/leaveease/entitlements",
          },
        ],
      },
    ],
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
        icon: "Zap",
        title: "Geography",
        subMenu: [
          {
            id: 14101,
            icon: "Zap",
            title: "Countries",
            pathname: "/countries",
          },
          {
            id: 14102,
            icon: "Zap",
            title: "States/Provinces",
            pathname: "/states",
          },
          { id: 14103, icon: "Zap", title: "Cities", pathname: "/cities" },
          { id: 14104, icon: "Zap", title: "Regions", pathname: "/regions" },
        ],
      },

      // 2.2 Company Dictionaries (moved from old "Company")
      {
        id: 143,
        icon: "Zap",
        title: "Company Dictionaries",
        subMenu: [
          {
            id: 14301,
            icon: "Zap",
            title: "Entity Type",
            pathname: "/entity-types",
          },
          {
            id: 14302,
            icon: "Zap",
            title: "Location Type",
            pathname: "/location-types",
          },
          {
            id: 14304,
            icon: "Zap",
            title: "Locations",
            pathname: "/locations-1",
          },
          {
            id: 14303,
            icon: "Zap",
            title: "Business Line",
            pathname: "/business",
          },
        ],
      },

      // Keep your existing Employee block intact
      {
        id: 142,
        icon: "Zap",
        title: "Employee",
        subMenu: [
          { id: 1511, icon: "Zap", title: "Gender", pathname: "/genders" },
          {
            id: 1512,
            icon: "Zap",
            title: "Salutation",
            pathname: "/salutation",
          },
          {
            id: 1513,
            icon: "Zap",
            title: "Status",
            pathname: "/employee-status",
          },
          { id: 1511, icon: "Zap", title: "Grade", pathname: "/employee-type" },
          {
            id: 1512,
            icon: "Zap",
            title: "Employee Type",
            pathname: "/employee-type",
          },
          {
            id: 1513,
            icon: "Zap",
            title: "Blood group",
            pathname: "/blood-group",
          },
          {
            id: 1512,
            icon: "Zap",
            title: "Marital Status",
            pathname: "/marital-status",
          },
          { id: 1513, icon: "Zap", title: "Health", pathname: "/health" },
        ],
      },

      // 2.3 Finance (NEW)
      {
        id: 144,
        icon: "Zap",
        title: "Finance",
        subMenu: [
          {
            id: 14401,
            icon: "Zap",
            title: "Currencies",
            pathname: "/currencies",
          },
          { id: 14402, icon: "Zap", title: "FX Rates", pathname: "/fx-rates" },
          { id: 14403, icon: "Zap", title: "Banks", pathname: "/banks" },
          {
            id: 14404,
            icon: "Zap",
            title: "Bank Branches",
            pathname: "/dashboard/adminsettings/fleximeta/Finance/BankBranch",
          },
          {
            id: 14405,
            icon: "Zap",
            title: "IBAN Formats",
            pathname: "/dashboard/adminsettings/fleximeta/Finance/IbanFormat",
          },
        ],
      },

      // 2.4 Statutory Framework (NEW)
      {
        id: 145,
        icon: "Zap",
        title: "Statutory Framework",
        subMenu: [
          {
            id: 14501,
            icon: "Zap",
            title: "Minimum Wages",
            pathname: "/minimum-wage",
          },
          {
            id: 14502,
            icon: "Zap",
            title: "Statutory Rates",
            pathname: "/statutory-rates",
          },
        ],
      },

      // 2.5 Calendars (NEW)
      {
        id: 146,
        icon: "Zap",
        title: "Calendars",
        subMenu: [
          {
            id: 14601,
            icon: "Zap",
            title: "Public Holiday Templates",
            pathname: "/holidays",
          },
        ],
      },

      {
        id: 147,
        icon: "Zap",
        title: "Catalogs",
        subMenu: [
          {
            id: 14701,
            icon: "Zap",
            title: "Salary Components",
            pathname: "/salary-components",
          },
          {
            id: 14702,
            icon: "Zap",
            title: "Shift Archetypes",
            pathname: "/shift-archectypes",
          },
          {
            id: 14703,
            icon: "Zap",
            title: "Attendance Device Types",
            pathname: "/device-types",
          },
          {
            id: 14704,
            icon: "Zap",
            title: "Document Types",
            pathname: "/document-types",
          },
          {
            id: 14705,
            icon: "Zap",
            title: "Skills & Trades",
            pathname: "/skills-trades",
          },
          {
            id: 14706,
            icon: "Zap",
            title: "Grade Templates",
            pathname: "/grade-templates",
          },
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
