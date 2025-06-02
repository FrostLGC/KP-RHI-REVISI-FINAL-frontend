import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";
import SideMenuSortTask from "../SideMenuSortTask";

const DashboardLayout = ({
  children,
  activeMenu,
  onUserSelect,
  onStatusSelect,
  onSortChange,
  onSearchChange,
  selectedUserId,
  selectedStatus,
  sortOption,
  activeStatusTab,
}) => {
  const { user } = useContext(UserContext);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar activeMenu={activeMenu} />
      <div className="flex flex-1">
        {/* Sidebar Desktop */}
        <div className="max-[1080px]:hidden">
          <SideMenu activeMenu={activeMenu} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Task Filter Sidebar */}
          {(activeMenu === "Manage Tasks" || activeMenu === "My Tasks") && (
            <div className="max-[1080px]:hidden">
              <SideMenuSortTask
                isAdmin={user?.role === "admin"}
                isSuperadmin={user?.role === "superadmin"}
                isHrd={user?.role === "hrd"}
                isMyTaskPage={activeMenu === "My Tasks"}
                onUserSelect={onUserSelect}
                onStatusSelect={onStatusSelect}
                onSortChange={onSortChange}
                onSearchChange={onSearchChange}
                selectedUserId={selectedUserId}
                selectedStatus={selectedStatus}
                sortOption={sortOption}
                activeStatusTab={activeStatusTab}
              />
            </div>
          )}

          {/* Content */}
          <div className="grow mx-5">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
