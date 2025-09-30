"use client";

import React, { useEffect } from "react";
import { useNavigation } from "@/shared/contexts";
import { AttendanceTracker } from "../components/AttendanceTracker";
import { AttendanceList } from "../components/AttendanceList";
import { TimesheetDetailsDrawer } from "../drawers/TimesheetDetailsDrawer";

export default function HRAttendanceSection() {
  const { setSelectedModule, setSelectedSection } = useNavigation();

  useEffect(() => {
    setSelectedModule("hr");
    setSelectedSection("attendance");
  }, [setSelectedModule, setSelectedSection]);

  return (
    <div className="space-y-6">
      {/* Attendance Tracker */}
      <AttendanceTracker />

      {/* Attendance List */}
      <AttendanceList />

      {/* Progress Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 sm:p-4">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          🚀 Phase 4.2.2+ Complete - Advanced Attendance Management
        </h3>
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          Attendance section now includes real-time attendance tracking,
          comprehensive user selection, flexible date range filtering, and
          intelligent status detection based on schedules, vacations, and
          holidays.
        </p>
      </div>

      {/* Timesheet Details Drawer */}
      <TimesheetDetailsDrawer />
    </div>
  );
}
