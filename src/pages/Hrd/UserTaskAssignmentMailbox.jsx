import React from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import TaskAssignmentMailbox from "../../components/TaskAssignmentMailbox";

const UserTaskAssignmentMailbox = () => {
  return (
    <DashboardLayout activeMenu="Task Mailbox">
      <div className="card my-5">
        <TaskAssignmentMailbox />
      </div>
    </DashboardLayout>
  );
};

export default UserTaskAssignmentMailbox;
