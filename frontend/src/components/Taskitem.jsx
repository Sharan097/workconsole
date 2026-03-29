import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  CheckCircle2,
  MoreVertical,
  Calendar,
  Clock,
} from "lucide-react";
import { format, isToday } from "date-fns";

import TaskModal from "./Taskmodal";

import {
  TI_CLASSES,
  MENU_OPTIONS,
  getPriorityColor,
  getPriorityBadgeColor,
} from "../assets/dummy";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/tasks`;

const TaskItem = ({
  task,
  onRefresh,
  onLogout,
  showCompleteCheckbox = true,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);

  const [isCompleted, setIsCompleted] = useState(
    [true, 1, "yes"].includes(
      typeof task.completed === "string"
        ? task.completed.toLowerCase()
        : task.completed
    )
  );

  // Sync completion state
  useEffect(() => {
    setIsCompleted(
      [true, 1, "yes"].includes(
        typeof task.completed === "string"
          ? task.completed.toLowerCase()
          : task.completed
      )
    );
  }, [task.completed]);

  // Auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    return {
      Authorization: `Bearer ${token}`,
    };
  };

  // Toggle complete
  const handleComplete = async () => {
    const newStatus = isCompleted ? "No" : "Yes";

    try {
      await axios.put(
        `${API_BASE}/${task._id}/gp`,
        { completed: newStatus },
        { headers: getAuthHeaders() }
      );

      setIsCompleted(!isCompleted);
      onRefresh?.();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) onLogout?.();
    }
  };

  // Delete task
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/${task._id}/gp`, {
        headers: getAuthHeaders(),
      });
      onRefresh?.();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) onLogout?.();
    }
  };

  // Menu actions
  const handleAction = (action) => {
    setShowMenu(false);
    if (action === "edit") setShowEditModal(true);
    if (action === "delete") handleDelete();
  };

  // Save after edit
  const handleSave = async () => {
    setShowEditModal(false);
    onRefresh?.();
  };

  // Styles
  const borderColor = isCompleted
    ? "border-green-500"
    : getPriorityColor(task.priority).split(" ")[0];

  const progress = subtasks.length
    ? (subtasks.filter((st) => st.completed).length / subtasks.length) * 100
    : 0;

  return (
    <>
      <div className={`${TI_CLASSES.wrapper} ${borderColor}`}>
        
        {/* LEFT */}
        <div className={TI_CLASSES.leftContainer}>
          
          {/* COMPLETE BUTTON */}
          {showCompleteCheckbox && (
            <button
              onClick={handleComplete}
              className={`${TI_CLASSES.completeBtn} ${
                isCompleted ? "text-green-500" : "text-gray-300"
              }`}
            >
              <CheckCircle2
                className={`${TI_CLASSES.checkboxIconBase} ${
                  isCompleted ? "fill-green-500" : ""
                }`}
              />
            </button>
          )}

          {/* CONTENT */}
          <div className="flex-1 min-w-0">
            
            {/* TITLE + PRIORITY */}
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <h3
                className={`${TI_CLASSES.titleBase} ${
                  isCompleted
                    ? "text-gray-400 line-through"
                    : "text-gray-800"
                }`}
              >
                {task.title}
              </h3>

              <span
                className={`${TI_CLASSES.priorityBadge} ${getPriorityBadgeColor(
                  task.priority
                )}`}
              >
                {task.priority}
              </span>
            </div>

            {/* DESCRIPTION */}
            {task.description && (
              <p className={TI_CLASSES.description}>
                {task.description}
              </p>
            )}

            {/* SUBTASK PROGRESS */}
            {subtasks.length > 0 && (
              <div className={TI_CLASSES.subtasksContainer}>
                <div className={TI_CLASSES.progressBarBg}>
                  <div
                    className={TI_CLASSES.progressBarFg}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className={TI_CLASSES.rightContainer}>
          
          {/* MENU */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={TI_CLASSES.menuButton}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className={TI_CLASSES.menuDropdown}>
                {MENU_OPTIONS.map((opt) => (
                  <button
                    key={opt.action}
                    onClick={() => handleAction(opt.action)}
                    className="w-full px-3 sm:px-4 py-2 text-left text-xs sm:text-sm hover:bg-purple-50 flex items-center gap-2"
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DATES */}
          <div>
            {/* DUE DATE */}
            <div
              className={`${TI_CLASSES.dateRow} ${
                task.dueDate && isToday(new Date(task.dueDate))
                  ? "text-fuchsia-600"
                  : "text-gray-500"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              {task.dueDate
                ? isToday(new Date(task.dueDate))
                  ? "Today"
                  : format(new Date(task.dueDate), "MMM dd")
                : "--"}
            </div>

            {/* CREATED */}
            <div className={TI_CLASSES.createdRow}>
              <Clock className="w-3.5 h-3.5" />
              {task.createdAt
                ? `Created ${format(
                    new Date(task.createdAt),
                    "MMM dd"
                  )}`
                : "No date"}
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      <TaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        taskToEdit={task}
        onSave={handleSave}
        onLogout={onLogout}
      />
    </>
  );
};

export default TaskItem;