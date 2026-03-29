import React, { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  Menu,
  X,
  Sparkles,
  Lightbulb,
} from "lucide-react"

import { SIDEBAR_CLASSES, LINK_CLASSES } from "../assets/dummy"

const Sidebar = ({ user, tasks = [] }) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length

  const productivity =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0

  const username = user?.name || "User"
  const initial = username.charAt(0).toUpperCase()

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto"
    return () => (document.body.style.overflow = "auto")
  }, [mobileOpen])

  const menuItems = [
    { text: "Dashboard", path: "/", icon: <LayoutDashboard /> },
    { text: "Pending Tasks", path: "/pending", icon: <Clock /> },
    { text: "Completed Tasks", path: "/completed", icon: <CheckSquare /> },
  ]

  const renderMenuItems = (isMobile = false) => (
  <ul className="space-y-2">
    {menuItems.map(({ text, path, icon }) => (
      <li key={text}>
        <NavLink
          to={path}
          className={({ isActive }) =>
            [
              LINK_CLASSES.base,
              isActive
                ? LINK_CLASSES.active
                : LINK_CLASSES.inactive,
              isMobile ? "justify-start" : "lg:justify-start",
            ].join(" ")
          }
          onClick={() => setMobileOpen(false)}
        >
          {/* ICON */}
          <span className={LINK_CLASSES.icon}>
            {icon}
          </span>

          {/* TEXT */}
          <span
            className={`${
              isMobile ? "block" : "hidden lg:block"
            } ${LINK_CLASSES.text}`}
          >
            {text}
          </span>
        </NavLink>
      </li>
    ))}
  </ul>
)

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <div
        className={`${SIDEBAR_CLASSES.desktop} flex flex-col h-screen overflow-hidden`}
      >
        {/* USER */}
        <div className="p-5 border-b border-purple-100 hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {initial}
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Hey, {username}
              </h2>
              <p className="text-sm text-purple-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Let’s crush some tasks!
              </p>
            </div>
          </div>
        </div>

        {/* SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* MENU */}
          {renderMenuItems()}

          {/* PRODUCTIVITY */}
          <div className="bg-white border border-purple-100 rounded-xl p-3 shadow-sm">
            
            {/* 🔹 FULL VIEW (lg screens) */}
            <div className="hidden lg:block">
              <div className="flex justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">
                  PRODUCTIVITY
                </h3>
                <span className="text-xs text-purple-600 font-medium">
                  {productivity}%
                </span>
              </div>

              <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all"
                  style={{ width: `${productivity}%` }}
                />
              </div>
            </div>

            {/* 🔹 COMPACT VIEW (tablet / collapsed sidebar) */}
            <div className="flex lg:hidden flex-col items-center justify-center gap-2">
              <div className="text-xs font-semibold text-gray-500">
                PROD
              </div>

              <div className="w-8 h-2 bg-purple-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600"
                  style={{ width: `${productivity}%` }}
                />
              </div>

              <span className="text-[10px] text-purple-600 font-medium">
                {productivity}%
              </span>
            </div>
          </div>



          {/* PRO TIP */}
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">

            {/* 🔹 FULL VIEW */}
            <div className="hidden lg:block">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-purple-600" />
                <h3 className="text-sm font-semibold">Pro Tip</h3>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed">
                Use keyboard shortcuts to boost productivity!
              </p>

              <a
                href="https://portfolio-gamma-sable-ibduuuxr70.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="block mt-2 text-xs text-purple-600 hover:underline"
              >
                Visit PORTFOLIO for more tips!
              </a>
            </div>

            {/* 🔹 COMPACT VIEW */}
            <div className="flex lg:hidden flex-col items-center justify-center gap-2 text-center">
              <Lightbulb className="w-4 h-4 text-purple-600" />
              <span className="text-[10px] font-medium text-gray-600">
                Tip
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE BUTTON ================= */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className={SIDEBAR_CLASSES.mobileButton}
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className={SIDEBAR_CLASSES.mobileDrawerBackdrop}
            onClick={() => setMobileOpen(false)}
          />

          <div
            className={`${SIDEBAR_CLASSES.mobileDrawer} flex flex-col h-full`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-bold text-purple-600">Menu</h2>
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SCROLL AREA */}
            <div className="flex-1 overflow-y-auto space-y-6">
              {/* USER */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {initial}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    Hey, {username}
                  </h2>
                  <p className="text-sm text-purple-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Let’s crush some tasks!
                  </p>
                </div>
              </div>

              {/* MENU */}
              {renderMenuItems(true)}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar