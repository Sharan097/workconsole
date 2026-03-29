import React, { useCallback, useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { Circle, Zap, TrendingUp, Clock } from "lucide-react";

const Layout = ({ onLogout, user }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);




  const fetchTasks = useCallback(async () => {
  setLoading(true);
  setError(null);

  try {
    const token = localStorage.getItem("token");

    // STRICT TOKEN CHECK
    if (!token || token === "undefined" || token === "null") {
      console.warn("Invalid token in storage");
      setTasks([]);
      setLoading(false);
      return;
    }

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/tasks/gp`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const arr = Array.isArray(data)
      ? data
      : Array.isArray(data?.tasks)
      ? data.tasks
      : Array.isArray(data?.data)
      ? data.data
      : [];

    setTasks(arr);

  } catch (err) {
    console.error("Fetch error:", err);

    setTasks([]);

    if (err.response?.status === 401) {
      onLogout();
    }
  } finally {
    setLoading(false);
  }
}, [onLogout]);


  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // TASK STATS
  const stats = useMemo(() => {
    const completedTasks = tasks.filter(
      (t) =>
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === "string" &&
          t.completed.toLowerCase() === "yes")
    ).length;

    const totalCount = tasks.length;
    const pendingCount = totalCount - completedTasks;

    const completionPercentage = totalCount
      ? Math.round((completedTasks / totalCount) * 100)
      : 0;

    return {
      totalCount,
      completedTasks,
      pendingCount,
      completionPercentage,
    };
  }, [tasks]);

  // STAT CARD
  const StatCard = ({ title, value, icon }) => (
    <div className="p-3 rounded-xl bg-white shadow-sm border border-purple-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-gradient-to-br from-fuchsia-500/10 to-purple-500/10 group-hover:from-fuchsia-500/20 group-hover:to-purple-500/20">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-lg sm:text-xl font-bold bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
            {value}
          </p>
          <p className="text-xs text-gray-500 font-medium">{title}</p>
        </div>
      </div>
    </div>
  );

  // LOADING
  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );

  // ERROR
  if (error)
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 max-w-md">
          <p className="font-medium mb-2">Error loading tasks</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchTasks}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks} />

      <div className="ml-0 xl:ml-64 lg:ml-64 md:ml-16 pt-16 p-4 transition-all duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          
          {/* MAIN CONTENT */}
          <div className="xl:col-span-2 space-y-4">
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>

          {/* SIDEBAR STATS */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-purple-100">
              <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                Task Statistics
              </h3>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                <StatCard title="Total Tasks" value={stats.totalCount} icon={<Circle className="w-4 h-4 text-purple-500" />} />
                <StatCard title="Completed" value={stats.completedTasks} icon={<Circle className="w-4 h-4 text-green-500" />} />
                <StatCard title="Pending" value={stats.pendingCount} icon={<Circle className="w-4 h-4 text-fuchsia-500" />} />
                <StatCard title="Completion Rate" value={`${stats.completionPercentage}%`} icon={<Zap className="w-4 h-4 text-purple-500" />} />
              </div>

              <hr className="my-3 border-purple-100" />

              {/* PROGRESS */}
              <div>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>Task Progress</span>
                  <span>
                    {stats.completedTasks}/{stats.totalCount}
                  </span>
                </div>

                <div className="w-full h-3 bg-purple-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${stats.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-purple-100">
              <h3 className="text-base sm:text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
                <Clock className="w-5 h-5 text-purple-500" />
                Recent Activity
              </h3>

              <div className="space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task._id || task.id}
                    className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {task.createdAt
                          ? new Date(task.createdAt).toLocaleDateString()
                          : "No date"}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        task.completed
                          ? "bg-green-100 text-green-700"
                          : "bg-fuchsia-100 text-fuchsia-700"
                      }`}
                    >
                      {task.completed ? "Done" : "Pending"}
                    </span>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                      No recent activity
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Layout;