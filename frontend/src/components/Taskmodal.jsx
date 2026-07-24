
import React, { useEffect, useState, useCallback } from "react";
import {
  PlusCircle,
  Save,
  X,
  AlignLeft,
  Flag,
  Calendar,
  CheckCircle,
  Sparkles,
} from "lucide-react";

import {
  DEFAULT_TASK,
  baseControlClasses,
  priorityStyles,
} from "../assets/dummy";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/tasks`;

const TaskModal = ({ isOpen, onClose, taskToEdit, onSave, onLogout }) => {
  const [taskData, setTaskData] = useState(DEFAULT_TASK);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  // Populate form when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (taskToEdit) {
      const normalized =
        taskToEdit.completed === "Yes" || taskToEdit.completed === true
          ? "Yes"
          : "No";

      setTaskData({
        ...DEFAULT_TASK,
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        priority: taskToEdit.priority || "Low",
        dueDate: taskToEdit.dueDate?.split("T")[0] || "",
        completed: normalized,
        id: taskToEdit._id,
      });
    } else {
      setTaskData(DEFAULT_TASK);
    }

    setError(null);
  }, [isOpen, taskToEdit]);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Get auth headers
  const getHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No auth token found");

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, []);



  // Handle AI Suggestion
  const handleAiSuggest = async () => {
    if (!taskData.title.trim()) {
      setError("Please enter a Task Title first to get AI suggestions.");
      return;
    }

    setAiLoading(true);
    setError(null);

    try {
      const resp = await fetch(`${API_BASE}/ai-suggest`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ 
          title: taskData.title,
          description: taskData.description,
          priority: taskData.priority,   
        dateTime: taskData.dateTime 
        }),
      });

      if (!resp.ok) {
        if (resp.status === 401) return onLogout?.();
        throw new Error("Failed to fetch AI suggestions");
      }

      const data = await resp.json();
      
      // setTaskData((prev) => ({
      //   ...prev,
      //   description: data.description || prev.description,
      //   priority: data.priority || prev.priority,
      // }));


      setTaskData((prev) => ({

      ...prev,
      
      // AI generated title update
      title:
        data.title || prev.title,

      // AI generated description update
      description:
        data.description || prev.description,

      // AI priority update
      priority:
        data.priority || prev.priority,

    }));

    } catch (err) {
      console.error(err);
      setError("AI Suggestion failed. Please try again or write manually.");
    } finally {
      setAiLoading(false);
    }
  };

  // Submit form
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (taskData.dueDate < today) {
        setError("Due date cannot be in the past.");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const isEdit = Boolean(taskData.id);

        const url = isEdit
          ? `${API_BASE}/${taskData.id}/gp`
          : `${API_BASE}/gp`;

        const resp = await fetch(url, {
          method: isEdit ? "PUT" : "POST",
          headers: getHeaders(),
          body: JSON.stringify(taskData),
        });

        if (!resp.ok) {
          if (resp.status === 401) return onLogout?.();

          const err = await resp.json();
          throw new Error(err.message || "Failed to save task");
        }

        const saved = await resp.json();
        onSave?.(saved);
        onClose();
      } catch (err) {
        console.error(err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    [taskData, today, getHeaders, onLogout, onSave, onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 dark:bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 border border-purple-100 dark:border-gray-800 rounded-xl max-w-md w-full shadow-lg relative p-6 animate-fadeIn transition-colors duration-300">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2 transition-colors">
            {taskData.id ? (
              <Save className="text-purple-500 dark:text-purple-400 w-5 h-5" />
            ) : (
              <PlusCircle className="text-purple-500 dark:text-purple-400 w-5 h-5" />
            )}
            {taskData.id ? "Edit Task" : "Create New Task"}
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* ERROR */}
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/50">
              {error}
            </div>
          )}

          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">
              Task Title
            </label>
            <div className="flex items-center border border-purple-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-purple-500 transition-colors">
              <input
                type="text"
                name="title"
                required
                value={taskData.title}
                onChange={handleChange}
                className="w-full text-sm bg-transparent outline-none text-gray-900 dark:text-gray-100 dark:placeholder-gray-500"
                placeholder="Enter task title"
              />
            </div>
          </div>

          {/* DESCRIPTION WITH AI SUGGEST */}
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">
              <AlignLeft className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              Description
            </label>
            <div className="relative">
              <textarea
                name="description"
                rows="3"
                value={taskData.description}
                onChange={handleChange}
                // Appended dark classes to existing base control classes
                className={`${baseControlClasses} pb-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-500 transition-colors`} 
                placeholder="Add details about your task"
              />
              <button
                type="button"
                onClick={handleAiSuggest}
                disabled={aiLoading || !taskData.title}
                className="absolute bottom-2 right-2 flex items-center gap-1 bg-fuchsia-100 dark:bg-fuchsia-900/30 hover:bg-fuchsia-200 dark:hover:bg-fuchsia-900/50 text-purple-700 dark:text-purple-400 text-xs font-medium py-1.5 px-2.5 rounded transition-colors disabled:opacity-50 border border-fuchsia-200 dark:border-fuchsia-900/50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {aiLoading ? "Thinking..." : "AI Suggest"}
              </button>
            </div>
          </div>

          {/* PRIORITY + DATE */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* PRIORITY */}
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">
                <Flag className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                Priority
              </label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                // priorityStyles are dynamic based on state, so we just add the standard dark overrides on top
                className={`${baseControlClasses} ${priorityStyles[taskData.priority]} dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 transition-colors`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* DUE DATE */}
            <div>
              <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">
                <Calendar className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                required
                min={today}
                value={taskData.dueDate}
                onChange={handleChange}
                // Dark mode overrides added to base controls
                className={`${baseControlClasses} dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 transition-colors`}
              />
            </div>
          </div>

          {/* STATUS */}
          <div>
            <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 transition-colors">
              <CheckCircle className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              Status
            </label>

            <div className="flex gap-4">
              {[
                { val: "Yes", label: "Completed" },
                { val: "No", label: "In Progress" },
              ].map(({ val, label }) => (
                <label key={val} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="completed"
                    value={val}
                    checked={taskData.completed === val}
                    onChange={handleChange}
                    className="h-4 w-4 text-purple-600 dark:text-purple-500 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 transition-colors">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-md transition-all duration-200 mt-2"
          >
            {loading ? (
              "Saving..."
            ) : taskData.id ? (
              <>
                <Save className="w-4 h-4" />
                Update Task
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                Create Task
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;