import React, { useMemo, useState } from "react"
import { layoutClasses, SORT_OPTIONS } from "../assets/dummy"
import { Clock, Filter, ListChecks, Plus } from "lucide-react"
import { useOutletContext } from "react-router-dom"

import TaskItem from "../components/Taskitem"
import TaskModal from "../components/Taskmodal"

const PendingPage = () => {
  const { tasks = [], refreshTasks } = useOutletContext()

  const [sortBy, setSortBy] = useState("newest")
  const [selectedTask, setSelectedTask] = useState(null)
  const [showModal, setShowModal] = useState(false)

  // ================= FILTER + SORT =================
  const sortedPendingTasks = useMemo(() => {
    const filtered = tasks.filter(
      (t) =>
        !t.completed ||
        (typeof t.completed === "string" &&
          t.completed.toLowerCase() === "no")
    )

    return filtered.sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt)

      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt)

      if (sortBy === "priority") {
        const order = { high: 3, medium: 2, low: 1 }
        return (
          order[b.priority?.toLowerCase()] -
          order[a.priority?.toLowerCase()]
        )
      }

      return 0
    })
  }, [tasks, sortBy])

  // ================= UI =================
  return (
    <div className={layoutClasses.container}>
      
      {/* HEADER */}
      <div className={layoutClasses.headerWrapper}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ListChecks className="text-purple-500" />
            Pending Tasks
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {sortedPendingTasks.length} task
            {sortedPendingTasks.length !== 1 && "s"} needing your attention
          </p>
        </div>

        {/* SORT */}
        <div className={layoutClasses.sortBox}>
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Filter className="w-4 h-4 text-purple-500" />
            <span>Sort by:</span>
          </div>

          {/* MOBILE */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={layoutClasses.select}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="priority">By Priority</option>
          </select>

          {/* DESKTOP */}
          <div className={layoutClasses.tabWrapper}>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={layoutClasses.tabButton(
                  sortBy === opt.id
                )}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ADD TASK BOX */}
      <div
        className={layoutClasses.addBox}
        onClick={() => setShowModal(true)}
      >
        <div className="flex items-center justify-center gap-3 text-gray-600 group-hover:text-purple-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
            <Plus className="text-purple-500" size={18} />
          </div>
          <span className="font-medium">Add New Task</span>
        </div>
      </div>

      {/* TASK LIST */}
      <div className="space-y-4">
        {sortedPendingTasks.length === 0 ? (
          <div className={layoutClasses.emptyState}>
            <div className={layoutClasses.emptyIconBg}>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              All caught up!
            </h3>

            <p className="text-sm text-gray-500">
              No pending tasks - great work!
            </p>
          </div>
        ) : (
          sortedPendingTasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              showCompleteCheckbox
              onRefresh={refreshTasks}
              onEdit={() => {
                setSelectedTask(task)
                setShowModal(true)
              }}
            />
          ))
        )}
      </div>

      {/* MODAL */}
      <TaskModal
        isOpen={showModal || !!selectedTask}
        onClose={() => {
          setShowModal(false)
          setSelectedTask(null)
          refreshTasks()
        }}
        taskToEdit={selectedTask}
      />
    </div>
  )
}

export default PendingPage