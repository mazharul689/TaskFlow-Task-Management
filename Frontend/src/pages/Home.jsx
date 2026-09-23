import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = "http://localhost:4000/api";
const emptyForm = { name: "", isComplete: "no" };

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState("all");


    useEffect(() => {
        const fetchTasks = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/all-task`);
            setTasks(data.tasks || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to load tasks");
        }
        };
        fetchTasks();
    }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!form.name.trim()) {
            toast.error("Task title cannot be empty.");
            return;
        }

        setLoading(true);

        try {
            if (editingId) {
                const { data } = await axios.put(`${API_URL}/update-task/${editingId}`, {
                    name: form.name.trim(),
                    isComplete: form.isComplete,
                });

                setTasks((currentTasks) =>
                    currentTasks.map((task) => (task._id === editingId ? data.task : task))
                );
                toast.success("Task updated successfully.");
            } else {
                const { data } = await axios.post(`${API_URL}/add-task`, {
                    name: form.name.trim(),
                });

                setTasks((currentTasks) => [data.newTask, ...currentTasks]);
                toast.success("Task created.");
            }

            resetForm();
        } catch (error) {
            toast.error(error.response?.data?.message || "Action failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (task) => {
        setForm({
            name: task.name,
            isComplete: task.isComplete,
        });
        setEditingId(task._id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (taskId) => {
        try {
            await axios.delete(`${API_URL}/delete-task/${taskId}`);
            setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId));

            if (editingId === taskId) {
                resetForm();
            }

            toast.success("Task removed.");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete task.");
        }
    };

    const handleToggleStatus = async (task) => {
        const nextStatus = task.isComplete === "yes" ? "no" : "yes";

        try {
            const { data } = await axios.put(`${API_URL}/update-task/${task._id}`, {
                name: task.name,
                isComplete: nextStatus,
            });

            setTasks((currentTasks) =>
                currentTasks.map((item) => (item._id === task._id ? data.task : item))
            );
        } catch (error) {
            toast.error(error.response?.data?.message || "Status update failed.");
        }
    };

    const completedCount = useMemo(
        () => tasks.filter((t) => t.isComplete === "yes").length,
        [tasks]
    );
    const pendingCount = tasks.length - completedCount;
    const completionPercent = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

    const filteredTasks = useMemo(() => {
        if (filter === "completed") return tasks.filter((t) => t.isComplete === "yes");
        if (filter === "pending") return tasks.filter((t) => t.isComplete !== "yes");
        return tasks;
    }, [tasks, filter]);

    return (
        <main className="min-h-screen bg-[#444d68] text-slate-100 selection:bg-indigo-500 selection:text-white antialiased">
            <div className="relative mx-auto max-w-4xl px-4 py-12 md:py-16">
                
                <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-full -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-600/20 via-sky-500/10 to-transparent blur-3xl" />

                
                <header className="mb-8 flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
                        Workspace
                    </span>
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                        Task Dashboard
                    </h1>
                </header>

                
                <section className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md">
                        <p className="text-xs font-medium text-slate-400">Total Tasks</p>
                        <p className="mt-1 text-2xl font-bold text-slate-100">{tasks.length}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md">
                        <p className="text-xs font-medium text-amber-400/90">Pending</p>
                        <p className="mt-1 text-2xl font-bold text-amber-300">{pendingCount}</p>
                    </div>
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-emerald-400/90">Completed</p>
                            <span className="text-xs font-semibold text-emerald-400">{completionPercent}%</span>
                        </div>
                        <p className="mt-1 text-2xl font-bold text-emerald-300">{completedCount}</p>
                    </div>
                </section>

                
                <form
                    onSubmit={handleSubmit}
                    className="mb-8 rounded-2xl border border-slate-800/90 bg-slate-900/80 p-3 shadow-2xl backdrop-blur-xl transition focus-within:border-indigo-500/60"
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder={editingId ? "Update task description..." : "What needs to be done?"}
                            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none"
                        />

                        {editingId && (
                            <select
                                value={form.isComplete}
                                onChange={(e) => setForm({ ...form, isComplete: e.target.value })}
                                className="rounded-xl border border-slate-700/60 bg-slate-800/80 px-3 py-2 text-xs font-medium text-slate-300 outline-none hover:border-slate-600"
                            >
                                <option value="no">Pending</option>
                                <option value="yes">Completed</option>
                            </select>
                        )}

                        <div className="flex items-center gap-2">
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="rounded-xl border border-slate-700/60 px-4 py-2 text-xs font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
                                >
                                    Cancel
                                </button>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 disabled:opacity-50 sm:flex-initial"
                            >
                                {loading ? (
                                    <span>Processing...</span>
                                ) : editingId ? (
                                    <span>Save Changes</span>
                                ) : (
                                    <>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Add Task</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                
                <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex gap-1 rounded-xl bg-slate-900/60 p-1 border border-slate-800/60">
                        {["all", "pending", "completed"].map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setFilter(tab)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                                    filter === tab
                                        ? "bg-indigo-600 text-white shadow"
                                        : "text-slate-400 hover:text-slate-200"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <span className="text-xs text-slate-500">
                        Showing {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
                    </span>
                </div>

                
                <div className="space-y-2.5">
                    {filteredTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/20 py-16 text-center">
                            <svg className="mb-3 h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-sm font-medium text-slate-400">No tasks in this view</p>
                            <p className="text-xs text-slate-600">Items you create will show up here</p>
                        </div>
                    ) : (
                        filteredTasks.map((task) => {
                            const isDone = task.isComplete === "yes";
                            return (
                                <div
                                    key={task._id}
                                    className={`group flex items-center justify-between gap-3 rounded-2xl border p-4 transition-all duration-150 ${
                                        isDone
                                            ? "border-slate-800/40 bg-slate-900/30 opacity-75"
                                            : "border-slate-800/80 bg-slate-900/60 hover:border-slate-700/80 hover:bg-slate-900/80"
                                    }`}
                                >
                                    <div className="flex min-w-0 items-center gap-3.5">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleStatus(task)}
                                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
                                                isDone
                                                    ? "border-emerald-500 bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30"
                                                    : "border-slate-700 hover:border-indigo-400 bg-slate-800/50"
                                            }`}
                                            aria-label={`Toggle task ${task.name}`}
                                        >
                                            {isDone && (
                                                <svg className="h-3.5 w-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>

                                        <p
                                            className={`truncate text-sm font-medium ${
                                                isDone ? "text-slate-500 line-through" : "text-slate-200"
                                            }`}
                                        >
                                            {task.name}
                                        </p>
                                    </div>

                                    
                                    <div className="flex shrink-0 items-center gap-1 opacity-90 transition sm:opacity-0 sm:group-hover:opacity-100">
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(task)}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                            title="Edit Task"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(task._id)}
                                            className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
                                            title="Delete Task"
                                        >
                                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <ToastContainer position="bottom-right" theme="dark" autoClose={2000} hideProgressBar />
        </main>
    );
};

export default Home;