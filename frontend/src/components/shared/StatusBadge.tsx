"use client";

import React from "react";
import {
  ATTENDANCE_STATUS_CONFIG,
  TIMESHEET_STATUS_CONFIG,
} from "@/shared/constants/attendance";
import type {
  AttendanceStatus,
  TimesheetStatus,
} from "@/shared/constants/attendance";
import { USER_STATUS_CONFIG } from "@/shared/utils/ui";
import type { UserStatus } from "@/shared/types";

interface StatusBadgeProps {
  status: AttendanceStatus | TimesheetStatus | UserStatus;
  label?: string | undefined;
  type?: "attendance" | "timesheet" | "user";
  className?: string;
}

export function StatusBadge({
  status,
  label,
  type = "attendance",
  className = "",
}: StatusBadgeProps) {
  let config: { label: string; color?: string; bgColor?: string; textColor?: string } | undefined;

  if (type === "user") {
    const userConfig = USER_STATUS_CONFIG[status as UserStatus];
    config = userConfig ? {
      label: userConfig.label,
      color: userConfig.textColor,
      bgColor: userConfig.bgColor,
    } : undefined;
  } else {
    config = type === "attendance"
      ? ATTENDANCE_STATUS_CONFIG[status as AttendanceStatus]
      : TIMESHEET_STATUS_CONFIG[status as TimesheetStatus];
  }

  if (!config) {
    return null;
  }

  const displayLabel = label || config.label;

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${config.color} ${config.bgColor} ${className}`}
    >
      {displayLabel}
    </span>
  );
}

interface DualStatusBadgeProps {
  primaryStatus: AttendanceStatus | TimesheetStatus;
  secondaryStatus?: AttendanceStatus;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryType?: "attendance" | "timesheet";
  layout?: "horizontal" | "vertical";
  className?: string;
}

export function DualStatusBadge({
  primaryStatus,
  secondaryStatus,
  primaryLabel,
  secondaryLabel,
  primaryType = "timesheet",
  layout = "horizontal",
  className = "",
}: DualStatusBadgeProps) {
  const containerClass =
    layout === "horizontal"
      ? "flex xl:flex-row flex-col xl:items-center items-center xl:space-x-2 space-y-1 xl:space-y-0"
      : "flex flex-col items-center space-y-1";

  return (
    <div className={`${containerClass} ${className}`}>
      {secondaryStatus && (
        <StatusBadge
          status={secondaryStatus}
          label={secondaryLabel}
          type="attendance"
        />
      )}
      <StatusBadge
        status={primaryStatus}
        label={primaryLabel}
        type={primaryType}
      />
    </div>
  );
}
