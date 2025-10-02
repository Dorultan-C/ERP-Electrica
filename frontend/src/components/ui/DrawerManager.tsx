"use client";

import React, { useState, useEffect, useRef } from "react";
import { RightDrawer } from "./RightDrawer";
import { useDrawer } from "@/shared/contexts/DrawerContext";
import { drawerRegistry } from "@/shared/drawer/drawerRegistry";

/**
 * DrawerManager - Central manager for all right drawer content
 * Manages drawer state, navigation, and animations
 */
export function DrawerManager() {
  const {
    isOpen,
    isExpanded,
    stack,
    current,
    direction,
    close,
    toggleExpand,
    navigateBack,
    navigateToIndex,
  } = useDrawer();

  const [lastValidCurrent, setLastValidCurrent] = useState(current);

  // Keep track of last valid current for closing animation
  useEffect(() => {
    if (current) {
      setLastValidCurrent(current);
    }
  }, [current]);

  // Use current or last valid current for rendering during close animation
  const drawerCurrent = current || lastValidCurrent;

  if (!drawerCurrent) {
    return null;
  }

  // Get the component for the current drawer type
  const DrawerContent = drawerRegistry[drawerCurrent.type]?.component;

  if (!DrawerContent) {
    return null;
  }

  return (
    <RightDrawer
      isOpen={isOpen}
      onClose={close}
      stack={stack.length > 0 ? stack : [drawerCurrent]}
      isExpanded={isExpanded}
      onToggleExpand={toggleExpand}
      onNavigateBack={navigateBack}
      onNavigateToIndex={navigateToIndex}
      direction={direction}
    >
      <DrawerContent key={`${drawerCurrent.type}-${drawerCurrent.id}`} id={drawerCurrent.id} />
    </RightDrawer>
  );
}
