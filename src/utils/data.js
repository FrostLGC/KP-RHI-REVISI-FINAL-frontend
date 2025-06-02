import {
  LuLayoutDashboard,
  LuUsers,
  LuClipboardCheck,
  LuSquarePlus,
  LuLogOut,
  LuMail,
} from "react-icons/lu";

export const SIDE_MENU_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    id: "02",
    label: "Manage Tasks",
    icon: LuClipboardCheck,
    path: "/admin/tasks",
  },
  {
    id: "03",
    label: "My Tasks",
    icon: LuClipboardCheck,
    path: "/admin/my-tasks",
  },
  {
    id: "04",
    label: "Create Tasks",
    icon: LuSquarePlus,
    path: "/admin/create-task",
  },
  {
    id: "05",
    label: "Team Members",
    icon: LuUsers,
    path: "/admin/users",
  },
  {
    id: "06",
    label: "Task Mailbox",
    icon: LuMail,
    path: "/admin/task-assignment-mailbox",
  },
  {
    id: "07",
    label: "logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const SIDE_MENU_SUPERADMIN_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/superadmin/dashboard",
  },
  {
    id: "02",
    label: "Manage Tasks",
    icon: LuClipboardCheck,
    path: "/superadmin/tasks",
  },
  // {
  //   id: "03",
  //   label: "My Tasks",
  //   icon: LuClipboardCheck,
  //   path: "/superadmin/my-tasks",
  // },
  {
    id: "04",
    label: "Create Tasks",
    icon: LuSquarePlus,
    path: "/superadmin/create-task",
  },
  {
    id: "05",
    label: "Team Members",
    icon: LuUsers,
    path: "/superadmin/users",
  },
  {
    id: "06",
    label: "Task Mailbox",
    icon: LuMail,
    path: "/superadmin/task-assignment-mailbox",
  },
  {
    id: "07",
    label: "logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const SIDE_MENU_USER_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/user/dashboard",
  },
  {
    id: "02",
    label: "My Tasks",
    icon: LuClipboardCheck,
    path: "/user/tasks",
  },
  {
    id: "03",
    label: "Task Mailbox",
    icon: LuMail,
    path: "/user/task-assignment-mailbox",
  },
  {
    id: "05",
    label: "logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const SIDE_MENU_HRD_DATA = [
  {
    id: "01",
    label: "Dashboard",
    icon: LuLayoutDashboard,
    path: "/hrd/dashboard",
  },
  {
    id: "02",
    label: "Manage Tasks",
    icon: LuClipboardCheck,
    path: "/hrd/manage-tasks",
  },
  {
    id: "03",
    label: "My Tasks",
    icon: LuClipboardCheck,
    path: "/hrd/tasks",
  },    
  {
    id: "04",
    label: "Team Members",
    icon: LuUsers,
    path: "/hrd/users",
  },
  {
    id: "05",
    label: "Task Mailbox",
    icon: LuMail,
    path: "/hrd/task-assignment-mailbox",
  },
  {
    id: "06",
    label: "logout",
    icon: LuLogOut,
    path: "logout",
  },
];

export const PRIORITY_DATA = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];

export const STATUS_DATA = [
  { label: "Pending", value: "Pending" },
  { label: "In Progress", value: "In Progress" },
  { label: "Completed", value: "Completed" },
];
