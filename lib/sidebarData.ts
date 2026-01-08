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
  // { path:"/dashboard", id: "dashboard", icon: LayoutDashboard, label: "PeopleHub Home" }, { path:"/directory", id: "directory", icon: Users, label: "Employee Directory" }, { path:"/employee360", id: "employee360", icon: UserCircle, label: "Employee 360" }, { path:"/onboardx", id: "onboardx", icon: UserPlus, label: "OnboardX" }, { path:"/transfers", id: "transfers", icon: ArrowRightLeft, label: "Transfers & Promotions" }, { path:"/exit", id: "exit", icon: LogOut, label: "Exit Horizon" }, { path:"/docs", id: "docs", icon: FileText, label: "Documents" }, { path:"/import", id: "import", icon: UploadCloud, label: "Bulk Import" },
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
    Menu: [
      {
        id: 51,
        icon: "Zap",
        title: "Shifts",
        subMenu: [
          {
            id: 511,
            icon: "Zap",
            title: "Shift Type",
            pathname: "/dashboard/TimeSync/Shifts/ShiftType/list",
          },
          {
            id: 512,
            icon: "Zap",
            title: "Shift Assignment",
            pathname: "/dashboard/TimeSync/Shifts/ShiftAssignment/list",
          },
          {
            id: 513,
            icon: "Zap",
            title: "Shift Assignment Schedule",
            pathname: "/dashboard/TimeSync/Shifts/ShiftAssignmentSchedule/list",
          },
          {
            id: 514,
            icon: "Zap",
            title: "Shift Request",
            pathname: "/dashboard/TimeSync/Shifts/ShiftRequest/list",
          },
          {
            id: 515,
            icon: "Zap",
            title: "Shift Assignment Tool",
            pathname: "/dashboard/TimeSync/Shifts/ShiftAssignmentAction/list",
          },
        ],
      },
      {
        id: 52,
        icon: "Zap",
        title: "Attendance",
        subMenu: [
          {
            id: 521,
            icon: "Zap",
            title: "Attendance",
            pathname: "/dashboard/TimeSync/Attendance/attendance/list",
          },
          {
            id: 522,
            icon: "Zap",
            title: "Attendance Request",
            pathname: "/dashboard/TimeSync/Attendance/AttendanceRequest/list",
          },
          {
            id: 523,
            icon: "Zap",
            title: "Employee Checkin",
            pathname: "/dashboard/TimeSync/Attendance/EmployeeCheckin/list",
          },
          {
            id: 524,
            icon: "Zap",
            title: "Employee Attendance Tool",
            pathname:
              "/dashboard/TimeSync/Attendance/EmployeeAttendanceTool/list",
          },
          {
            id: 525,
            icon: "Zap",
            title: "Upload Attendance",
            pathname: "/dashboard/TimeSync/Attendance/UploadAttendance",
          },
        ],
      },
      {
        id: 53,
        icon: "Zap",
        title: "Time",
        subMenu: [
          {
            id: 531,
            icon: "Zap",
            title: "Timesheet",
            pathname: "/dashboard/TimeSync/Time/Timsheet/list",
          },
          {
            id: 532,
            icon: "Zap",
            title: "Activity Type",
            pathname: "/dashboard/TimeSync/Time/ActivityType/list",
          },
        ],
      },
      {
        id: 54,
        icon: "Zap",
        title: "Reports",
        subMenu: [
          {
            id: 541,
            icon: "Zap",
            title: "Attendance Metrics",
          },
        ],
      },
    ],
    admin: false,
  },
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
        { id: 14103, icon: 'Zap', title: "Cities", pathname: "/dashboard/adminsettings/fleximeta/company/city" },
      ],
    },

    // 2.2 Company Dictionaries (moved from old "Company")
    {
      id: 143,
      icon: 'Zap',
      title: "Company Dictionaries",
      subMenu: [
        { id: 14301, icon: 'Zap', title: "Entity Type", pathname: "/dashboard/adminsettings/fleximeta/company/entitytype" },
        { id: 14302, icon: 'Zap', title: "Location Type", pathname: "/dashboard/adminsettings/fleximeta/company/locationtype" },
        { id: 14303, icon: 'Zap', title: "Business Line", pathname: "/dashboard/adminsettings/fleximeta/company/businessline" },
      ],
    },

    // Keep your existing Employee block intact
    {
      id: 142,
      icon: 'Zap',
      title: "Employee",
      subMenu: [
        { id: 1511, icon: 'Zap', title: "Gender", pathname:"/dashboard/adminsettings/fleximeta/employee/gender" },
        { id: 1512, icon: 'Zap', title: "Salutation", pathname:"/dashboard/adminsettings/fleximeta/employee/salutation" },
        { id: 1513, icon: 'Zap', title: "Status", pathname:"/dashboard/adminsettings/fleximeta/employee/status" },
        { id: 1511, icon: 'Zap', title: "Grade", pathname:"/dashboard/adminsettings/fleximeta/employee/grade" },
        { id: 1512, icon: 'Zap', title: "Employee Type", pathname:"/dashboard/adminsettings/fleximeta/employee/employeetype" },
        { id: 1513, icon: 'Zap', title: "Blood group", pathname:"/dashboard/adminsettings/fleximeta/employee/bloodgroup" },
        { id: 1512, icon: 'Zap', title: "Marital Status", pathname:"/dashboard/adminsettings/fleximeta/employee/maritalstatus" },
        { id: 1513, icon: 'Zap', title: "Health", pathname:"/dashboard/adminsettings/fleximeta/employee/health" },
      ],
    },

    // 2.3 Finance (NEW)
    {
      id: 144,
      icon: 'Zap',
      title: "Finance",
      subMenu: [
        { id: 14401, icon: 'Zap', title: "Currencies", pathname: "/dashboard/adminsettings/fleximeta/Finance/Currencies" },
        { id: 14402, icon: 'Zap', title: "FX Rates", pathname: "/dashboard/adminsettings/fleximeta/Finance/FxRate" },
        { id: 14403, icon: 'Zap', title: "Banks", pathname: "/dashboard/adminsettings/fleximeta/Finance/Bank" },
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
        { id: 14501, icon: 'Zap', title: "Minimum Wages", pathname: "/dashboard/adminsettings/fleximeta/Statutory/MinimumWage" },
        { id: 14502, icon: 'Zap', title: "Statutory Rates", pathname: "/dashboard/adminsettings/fleximeta/Statutory/StatutoryRate" },
      ],
    },

    // 2.5 Calendars (NEW)
    {
      id: 146,
      icon: 'Zap',
      title: "Calendars",
      subMenu: [
        { id: 14601, icon: 'Zap', title: "Public Holiday Templates", pathname: "/dashboard/adminsettings/fleximeta/Calendars/PublicHoliday" },
      ],
    },

   
    {
      id: 147,
      icon: 'Zap',
      title: "Catalogs",
      subMenu: [
        { id: 14701, icon: 'Zap', title: "Salary Components", pathname: "/dashboard/adminsettings/fleximeta/Catalogs/SalaryComponents" },
        { id: 14702, icon: 'Zap', title: "Shift Archetypes", pathname: "/dashboard/adminsettings/fleximeta/Catalogs/shiftarchetypes" },
        { id: 14703, icon: 'Zap', title: "Attendance Device Types", pathname: "/dashboard/adminsettings/fleximeta/Catalogs/attendancedevicetypes" },
        { id: 14704, icon: 'Zap', title: "Document Types", pathname: "/dashboard/adminsettings/fleximeta/Catalogs/documenttypes" },
        { id: 14705, icon: 'Zap', title: "Skills & Trades", pathname: "/dashboard/adminsettings/fleximeta/Catalogs/skillsandtrades" },
        { id: 14706, icon: 'Zap', title: "Grade Templates", pathname: "/dashboard/adminsettings/fleximeta/Catalogs/gradetemplates" },
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
