// import React, { useMemo, useState } from "react"
// import { CT_CLASSES, SORT_OPTIONS } from "../assets/dummy"
// import { CheckCircle2, Filter } from "lucide-react"
// import { useOutletContext } from "react-router-dom"

// import TaskItem from "../components/Taskitem"

// const CompletePage = () => {
//   const { tasks = [], refreshTasks } = useOutletContext()

//   const [sortBy, setSortBy] = useState("newest")

//   // ================= FILTER + SORT =================
//   const sortedCompletedTasks = useMemo(() => {
//     return tasks
//       .filter((task) =>
//         [true, 1, "yes"].includes(
//           typeof task.completed === "string"
//             ? task.completed.toLowerCase()
//             : task.completed
//         )
//       )
//       .sort((a, b) => {
//         switch (sortBy) {
//           case "newest":
//             return new Date(b.createdAt) - new Date(a.createdAt)

//           case "oldest":
//             return new Date(a.createdAt) - new Date(b.createdAt)

//           case "priority": {
//             const order = { high: 3, medium: 2, low: 1 }
//             return (
//               order[b.priority?.toLowerCase()] -
//               order[a.priority?.toLowerCase()]
//             )
//           }

//           default:
//             return 0
//         }
//       })
//   }, [tasks, sortBy])

//   // ================= UI =================
//   return (
//     <div className={CT_CLASSES.page}>
      
//       {/* HEADER */}
//       <div className={CT_CLASSES.header}>
//         <div className={CT_CLASSES.titleWrapper}>
//           <h1 className={CT_CLASSES.title}>
//             <CheckCircle2 className="text-purple-500 w-5 h-5 md:w-6 md:h-6" />
//             <span className="truncate">Completed Tasks</span>
//           </h1>

//           <p className={CT_CLASSES.subtitle}>
//             {sortedCompletedTasks.length} task
//             {sortedCompletedTasks.length !== 1 && "s"}{" "}
//             marked as complete
//           </p>
//         </div>
//       </div>

//       {/* SORT CONTROLS */}
//       <div className={CT_CLASSES.sortContainer}>
//         <div className={CT_CLASSES.sortBox}>
          
//           {/* LABEL */}
//           <div className={CT_CLASSES.filterLabel}>
//             <Filter className="w-4 h-4 text-purple-500" />
//             <span>Sort by:</span>
//           </div>

//           {/* MOBILE DROPDOWN */}
//           <select
//             value={sortBy}
//             onChange={(e) => setSortBy(e.target.value)}
//             className={CT_CLASSES.select}
//           >
//             {SORT_OPTIONS.map((opt) => (
//               <option key={opt.id} value={opt.id}>
//                 {opt.label}
//                 {opt.id === "newest" ? " First" : ""}
//               </option>
//             ))}
//           </select>

//           {/* DESKTOP BUTTONS */}
//           <div className={CT_CLASSES.btnGroup}>
//             {SORT_OPTIONS.map((opt) => (
//               <button
//                 key={opt.id}
//                 onClick={() => setSortBy(opt.id)}
//                 className={[
//                   CT_CLASSES.btnBase,
//                   sortBy === opt.id
//                     ? CT_CLASSES.btnActive
//                     : CT_CLASSES.btnInactive,
//                 ].join(" ")}
//               >
//                 {opt.icon}
//                 {opt.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* TASK LIST */}
//       <div className={CT_CLASSES.list}>
//         {sortedCompletedTasks.length === 0 ? (
//           <div className={CT_CLASSES.emptyState}>
            
//             <div className={CT_CLASSES.emptyIconWrapper}>
//               <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
//             </div>

//             <h3 className={CT_CLASSES.emptyTitle}>
//               No completed tasks yet!
//             </h3>

//             <p className={CT_CLASSES.emptyText}>
//               Complete some tasks and they'll appear here
//             </p>
//           </div>
//         ) : (
//           sortedCompletedTasks.map((task) => (
//             <TaskItem
//               key={task._id || task.id}
//               task={task}
//               onRefresh={refreshTasks}
//               showCompleteCheckbox={false}
//               className="opacity-90 hover:opacity-100 transition-opacity text-sm md:text-base"
//             />
//           ))
//         )}
//       </div>
//     </div>
//   )
// }

// export default CompletePage





















import React, { useMemo, useState } from "react"
import { CT_CLASSES, SORT_OPTIONS } from "../assets/dummy"
import { CheckCircle2, Filter } from "lucide-react"
import { useOutletContext } from "react-router-dom"

import TaskItem from "../components/Taskitem"

const CompletePage = () => {
  const { tasks = [], refreshTasks } = useOutletContext()

  const [sortBy, setSortBy] = useState("newest")

  // ================= FILTER + SORT =================
  const sortedCompletedTasks = useMemo(() => {
    return tasks
      .filter((task) =>
        [true, 1, "yes"].includes(
          typeof task.completed === "string"
            ? task.completed.toLowerCase()
            : task.completed
        )
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.createdAt) - new Date(a.createdAt)

          case "oldest":
            return new Date(a.createdAt) - new Date(b.createdAt)

          case "priority": {
            const order = { high: 3, medium: 2, low: 1 }
            return (
              order[b.priority?.toLowerCase()] -
              order[a.priority?.toLowerCase()]
            )
          }

          default:
            return 0
        }
      })
  }, [tasks, sortBy])

  // ================= UI =================
  return (
    <div className={`${CT_CLASSES.page} transition-colors duration-300`}>
      
      {/* HEADER */}
      <div className={CT_CLASSES.header}>
        <div className={CT_CLASSES.titleWrapper}>
          <h1 className={`${CT_CLASSES.title} dark:text-gray-100 transition-colors`}>
            <CheckCircle2 className="text-purple-500 w-5 h-5 md:w-6 md:h-6" />
            <span className="truncate">Completed Tasks</span>
          </h1>

          <p className={`${CT_CLASSES.subtitle} dark:text-gray-400 transition-colors`}>
            {sortedCompletedTasks.length} task
            {sortedCompletedTasks.length !== 1 && "s"}{" "}
            marked as complete
          </p>
        </div>
      </div>

      {/* SORT CONTROLS */}
      <div className={`${CT_CLASSES.sortContainer} dark:bg-gray-900 dark:border-gray-800 rounded-xl border p-4 transition-colors duration-300`}>
        <div className={CT_CLASSES.sortBox}>
          
          {/* LABEL */}
          <div className={`${CT_CLASSES.filterLabel} dark:text-gray-300 transition-colors`}>
            <Filter className="w-4 h-4 text-purple-500" />
            <span>Sort by:</span>
          </div>

          {/* MOBILE DROPDOWN */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`${CT_CLASSES.select} dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 transition-colors`}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} className="dark:bg-gray-900">
                {opt.label}
                {opt.id === "newest" ? " First" : ""}
              </option>
            ))}
          </select>

          {/* DESKTOP BUTTONS */}
          <div className={`${CT_CLASSES.btnGroup} dark:bg-gray-800/50 p-1 rounded-lg transition-colors`}>
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={[
                  CT_CLASSES.btnBase,
                  sortBy === opt.id
                    ? `${CT_CLASSES.btnActive} dark:bg-gray-700 dark:text-white`
                    : `${CT_CLASSES.btnInactive} dark:text-gray-400 dark:hover:text-gray-200`,
                ].join(" ")}
              >
                {opt.icon}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TASK LIST */}
      <div className={CT_CLASSES.list}>
        {sortedCompletedTasks.length === 0 ? (
          <div className={`${CT_CLASSES.emptyState} dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300`}>
            
            <div className={CT_CLASSES.emptyIconWrapper}>
              <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />
            </div>

            <h3 className={`${CT_CLASSES.emptyTitle} dark:text-gray-100 transition-colors`}>
              No completed tasks yet!
            </h3>

            <p className={`${CT_CLASSES.emptyText} dark:text-gray-400 transition-colors`}>
              Complete some tasks and they'll appear here
            </p>
          </div>
        ) : (
          sortedCompletedTasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox={false}
              className="opacity-90 hover:opacity-100 transition-opacity text-sm md:text-base"
            />
          ))
        )}
      </div>
    </div>
  )
}

export default CompletePage