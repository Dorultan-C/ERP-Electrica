"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumbs } from "./Breadcrumbs";
import { DrawerStackItem } from "@/shared/contexts/DrawerContext";

interface RightDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stack: DrawerStackItem[];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onNavigateBack: () => void;
  onNavigateToIndex: (index: number) => void;
  children: React.ReactNode;
  direction: number; // 1 = forward, -1 = back
}

export function RightDrawer({
  isOpen,
  onClose,
  stack,
  isExpanded,
  onToggleExpand,
  onNavigateBack,
  onNavigateToIndex,
  children,
  direction,
}: RightDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const showBackButton = stack.length > 1;
  const currentTitle =
    stack.length > 0
      ? (stack[stack.length - 1]?.title ?? "Details")
      : "Details";

  const drawerContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <React.Fragment key="drawer">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className={`fixed top-0 right-0 h-full bg-white dark:bg-gray-900 shadow-xl z-50 flex flex-col ${
              isExpanded
                ? "w-full"
                : "w-full sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-2/5 max-w-[50rem]"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex-shrink-0">
              {/* Left side - Back and Expand buttons */}
              <div className="flex items-center space-x-1">
                {/* Back button */}
                {showBackButton && (
                  <button
                    onClick={onNavigateBack}
                    className="flex items-center justify-center px-3 py-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
                    title="Go back"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}

                {/* Expand button (hidden on mobile) */}
                <button
                  onClick={onToggleExpand}
                  className="hidden sm:flex items-center justify-center px-3 py-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20,7 L17,7 L17,4 C17,3.44772 16.5523,3 16,3 C15.4477,3 15,3.44772 15,4 L15,7 C15,8.10457 15.8954,9 17,9 L20,9 C20.5523,9 21,8.55229 21,8 C21,7.44772 20.5523,7 20,7 Z M7,9 C8.10457,9 9,8.10457 9,7 L9,4 C9,3.44772 8.55229,3 8,3 C7.44772,3 7,3.44772 7,4 L7,7 L4,7 C3.44772,7 3,7.44771 3,8 C3,8.55228 3.44772,9 4,9 L7,9 Z M7,17 L4,17 C3.44772,17 3,16.5523 3,16 C3,15.4477 3.44772,15 4,15 L7,15 C8.10457,15 9,15.8954 9,17 L9,20 C9,20.5523 8.55228,21 8,21 C7.44771,21 7,20.5523 7,20 L7,17 Z M17,15 C15.8954,15 15,15.8954 15,17 L15,20 C15,20.5523 15.4477,21 16,21 C16.5523,21 17,20.5523 17,20 L17,17 L20,17 C20.5523,17 21,16.5523 21,16 C21,15.4477 20.5523,15 20,15 L17,15 Z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4,15 C4.55228,15 5,15.4477 5,16 L5,19 L8,19 C8.55228,19 9,19.4477 9,20 C9,20.5523 8.55228,21 8,21 L5,21 C3.89543,21 3,20.1046 3,19 L3,16 C3,15.4477 3.44772,15 4,15 Z M20,15 C20.51285,15 20.9355092,15.386027 20.9932725,15.8833761 L21,16 L21,19 C21,20.0543909 20.18415,20.9181678 19.1492661,20.9945144 L19,21 L16,21 C15.4477,21 15,20.5523 15,20 C15,19.48715 15.386027,19.0644908 15.8833761,19.0067275 L16,19 L19,19 L19,16 C19,15.4477 19.4477,15 20,15 Z M19,3 C20.0543909,3 20.9181678,3.81587733 20.9945144,4.85073759 L21,5 L21,8 C21,8.55228 20.5523,9 20,9 C19.48715,9 19.0644908,8.61395571 19.0067275,8.11662025 L19,8 L19,5 L16,5 C15.4477,5 15,4.55228 15,4 C15,3.48716857 15.386027,3.06449347 15.8833761,3.0067278 L16,3 L19,3 Z M8,3 C8.55228,3 9,3.44772 9,4 C9,4.51283143 8.61395571,4.93550653 8.11662025,4.9932722 L8,5 L5,5 L5,8 C5,8.55228 4.55228,9 4,9 C3.48716857,9 3.06449347,8.61395571 3.0067278,8.11662025 L3,8 L3,5 C3,3.94563773 3.81587733,3.08183483 4.85073759,3.00548573 L5,3 L8,3 Z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Center - Breadcrumbs */}
              <div className="flex-1 px-2 overflow-hidden">
                <Breadcrumbs
                  stack={stack}
                  onNavigateToIndex={onNavigateToIndex}
                />
              </div>

              {/* Right side - Close button */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={onClose}
                  className="px-3 py-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 cursor-pointer"
                  title="Close"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content with slide animations */}
            <div className="flex-1 overflow-hidden relative">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentTitle}
                  custom={direction}
                  variants={{
                    enter: (direction: number) => ({
                      x: direction > 0 ? "100%" : "-100%",
                    }),
                    center: {
                      x: 0,
                    },
                    exit: (direction: number) => ({
                      x: direction > 0 ? "-100%" : "100%",
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    type: "tween",
                    duration: 0.3,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-transparent dark:[&::-webkit-scrollbar-thumb]:bg-gray-600 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 dark:hover:[&::-webkit-scrollbar-thumb]:bg-gray-500"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerContent, document.body);
}
