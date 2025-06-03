import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/SignUp";
import ManageTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import TaskAssignmentMailboxAdmin from "./pages/Admin/TaskAssignmentMailbox";
import ViewTaskDetailAdmin from "./pages/Admin/ViewTaskDetail";
import AdminMyTask from "./pages/Admin/MyTask";

import UserDashboard from "./pages/User/UserDashboard";
import MyTask from "./pages/User/MyTask";
import ViewTaskDetails from "./pages/User/ViewTaskDetail";
import UserTaskAssignmentMailbox from "./pages/User/UserTaskAssignmentMailbox";

import SuperadminDashboard from "./pages/Superadmin/Dashboard";
import SuperadminManageTasks from "./pages/Superadmin/ManageTasks";
import SuperadminCreateTask from "./pages/Superadmin/CreateTask";
import SuperadminManageUsers from "./pages/Superadmin/ManageUsers";
import SuperadminTaskAssignmentMailbox from "./pages/Superadmin/TaskAssignmentMailbox";
import ViewTaskDetailSuperadmin from "./pages/Superadmin/ViewTaskDetail";
import SuperadminMyTask from "./pages/Superadmin/MyTask";

import HrdUserDashboard from "./pages/Hrd/UserDashboard";
import HrdMyTask from "./pages/Hrd/MyTask";
import HrdUserTaskAssignmentMailbox from "./pages/Hrd/UserTaskAssignmentMailbox";
import HrdViewTaskDetail from "./pages/Hrd/ViewTaskDetail";
import HrdManageUsers from "./pages/Hrd/ManageUsers";

import PrivateRoute from "./routes/PrivateRoute";
import UserProvider, { UserContext } from "./context/userContext";
import { Toaster } from "react-hot-toast";


const App = () => {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Superadmin Routes */}
            <Route element={<PrivateRoute allowedRoles={["superadmin"]} />}>
              <Route
                path="/superadmin/dashboard"
                element={<SuperadminDashboard />}
              />
              <Route
                path="/superadmin/tasks"
                element={<SuperadminManageTasks />}
              />
              <Route
                path="/superadmin/my-tasks"
                element={<SuperadminMyTask />}
              />
              <Route
                path="/superadmin/create-task"
                element={<SuperadminCreateTask />}
              />
              <Route
                path="/superadmin/users"
                element={<SuperadminManageUsers />}
              />
              <Route
                path="/superadmin/task-assignment-mailbox"
                element={<SuperadminTaskAssignmentMailbox />}
              />
              <Route
                path="/superadmin/view-task-detail/:id"
                element={<ViewTaskDetailSuperadmin />}
              />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/tasks" element={<ManageTasks />} />
              <Route path="/admin/my-tasks" element={<AdminMyTask />} />
              <Route path="/admin/create-task" element={<CreateTask />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route
                path="/admin/task-assignment-mailbox"
                element={<TaskAssignmentMailboxAdmin />}
              />
              <Route
                path="/admin/view-task-detail/:id"
                element={<ViewTaskDetailAdmin />}
              />
            </Route>

            {/* Protected HRD Routes */}
            <Route element={<PrivateRoute allowedRoles={["hrd"]} />}>
              <Route path="/hrd/dashboard" element={<HrdUserDashboard />} />
              <Route path="/hrd/tasks" element={<HrdMyTask />} />
              <Route
                path="/hrd/tasks-details/:id"
                element={<HrdViewTaskDetail />}
              />
              <Route path="/hrd/users" element={<HrdManageUsers />} />
              <Route
                path="/hrd/task-assignment-mailbox"
                element={<HrdUserTaskAssignmentMailbox />}
              />
              <Route
                path="/hrd/manage-tasks"
                element={React.createElement(
                  React.lazy(() => import("./pages/Hrd/ManageTasks"))
                )}
              />
            </Route>

            {/* Protected User Routes */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/tasks" element={<MyTask />} />
              <Route
                path="/user/tasks-details/:id"
                element={<ViewTaskDetails />}
              />
              <Route
                path="/user/task-assignment-mailbox"
                element={<UserTaskAssignmentMailbox />}
              />
            </Route>

            {/* Default Route*/}
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
};

function Root() {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" />;
  }

  switch (user.role) {
    case "superadmin":
      return <Navigate to="/superadmin/dashboard" />;
    case "admin":
      return <Navigate to="/admin/dashboard" />;
    case "hrd":
      return <Navigate to="/hrd/dashboard" />;
    case "user":
      return <Navigate to="/user/dashboard" />;
    default:
      return <Navigate to="/login" />;
  }
}

export default App;
