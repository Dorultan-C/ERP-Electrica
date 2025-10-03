"use client";

import React, { useEffect } from "react";
import { useNavigation, useDrawer } from "@/shared/contexts";
import { DataList, Cell } from "@/components/ui/datalist";
import type { DataListColumn } from "@/components/ui/datalist";
import { dummyUsers } from "@/data/dummy/users";
import type { User } from "@/shared/types";
import { getUserStatusColorMap } from "@/shared/utils";

export default function HRUsersSection() {
  const { setSelectedModule, setSelectedSection } = useNavigation();
  const { open: openDrawer } = useDrawer();

  useEffect(() => {
    setSelectedModule("hr");
    setSelectedSection("users");
  }, [setSelectedModule, setSelectedSection]);

  const handleUserClick = (user: User) => {
    openDrawer(user.id, "users");
  };

  const handleEditUser = (user: User) => {
    console.log("Edit user:", user);
    // TODO: Open edit form/modal (Phase 4.1.3+)
  };

  const columns: DataListColumn<User>[] = [
    {
      id: "avatar",
      header: "Profile",
      cell: ({ data }) => (
        <>
          <Cell.Avatar
            src={data?.profileImage}
            name={
              data
                ? `${data.firstName || ""} ${data.lastName || ""}`.trim()
                : "?"
            }
            size="small"
            className="sm:hidden"
          />
          <Cell.Avatar
            src={data?.profileImage}
            name={
              data
                ? `${data.firstName || ""} ${data.lastName || ""}`.trim()
                : "?"
            }
            size="medium"
            className="hidden sm:block"
          />
        </>
      ),
    },
    {
      id: "name",
      header: "Name",
      accessor: (user) =>
        user
          ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
          : "Unknown User",
      sortable: true,
      searchable: true,
      cell: ({ value, data }) => (
        <Cell.Stack>
          <Cell.Text value={value} className="font-medium" />
          <Cell.Subtitle value={data?.username ? `@${data.username}` : ""} />
        </Cell.Stack>
      ),
    },
    {
      id: "email",
      header: "Email",
      accessor: "workEmail",
      sortable: true,
      searchable: true,
      cell: ({ value }) => <Cell.Text value={value} />,
    },
    {
      id: "status",
      header: "Status",
      accessor: "status",
      sortable: true,
      filterable: {
        type: "select",
        options: [
          { value: "active", label: "Active" },
          { value: "probation", label: "Probation" },
          { value: "inactive", label: "Inactive" },
        ],
      },
      width: "120px",
      cell: ({ value }) => (
        <Cell.Badge value={value} colorMap={getUserStatusColorMap()} />
      ),
    },
    {
      id: "vacation",
      header: "Vacation Days",
      accessor: "yearlyVacationDays",
      sortable: true,
      width: "140px",
      cell: ({ value, data }) => (
        <Cell.Stack>
          <Cell.Text value={value} className="font-medium" />
          <Cell.Subtitle value={data?.vacationDaysType || ""} />
        </Cell.Stack>
      ),
    },
    {
      id: "joinDate",
      header: "Join Date",
      accessor: "createdAt",
      sortable: true,
      width: "120px",
      cell: ({ value }) => (
        <Cell.Text value={new Date(value).toLocaleDateString()} />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Users
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage users and employee information
        </p>
      </div>

      <DataList
        data={dummyUsers}
        columns={columns}
        onRowClick={handleUserClick}
        pageSize={10}
      />

      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 sm:p-4">
        <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
          ✅ Mobile Responsive HR Module Complete (Phase 4.1.4)
        </h3>
        <p className="text-green-800 dark:text-green-200 text-sm">
          HR module now includes full mobile responsiveness with touch-friendly
          drawers, adaptive layouts, and optimized spacing for small screens.
          Drawers are full-width on mobile and properly sized on larger screens.
        </p>
      </div>
    </div>
  );
}
