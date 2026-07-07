import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000";

export default function App() {
  const emptyHabit = {
    title: "",
    description: "",
    frequency: "Daily",
  };

  const [habit, setHabit] = useState(emptyHabit);
  const [habits, setHabits] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const limit = 5;

  const [totalPages, setTotalPages] = useState(1);

  const [darkMode, setDarkMode] = useState(false);

  const [lastUpdated, setLastUpdated] = useState("");

  const [summary, setSummary] = useState({
    totalHabits: 0,
    completedHabits: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    fetchHabits();
    fetchSummary();
  }, [page, search]);

  async function fetchSummary() {
    try {
      const res = await fetch(`${API}/summary`);
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchHabits() {
    setLoading(true);

    try {
      const res = await fetch(
        `${API}/habits?page=${page}&limit=${limit}&search=${search}`
      );

      const data = await res.json();

      setHabits(data.data);
      setTotalPages(data.totalPages || 1);

      setLastUpdated(new Date().toLocaleTimeString());

    } catch (err) {
      setError("Unable to fetch habits.");
    }

    setLoading(false);
  }

  function handleChange(e) {
    setHabit({
      ...habit,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!habit.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (editingId) {
      await fetch(`${API}/habits/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(habit),
      });

      setEditingId(null);

    } else {
      await fetch(`${API}/habits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(habit),
      });
    }

    setHabit(emptyHabit);

    fetchHabits();
    fetchSummary();
  }

  function editHabit(item) {
    setHabit({
      title: item.title,
      description: item.description,
      frequency: item.frequency,
    });

    setEditingId(item.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteHabit(id) {
    if (!window.confirm("Delete this habit?")) return;

    await fetch(`${API}/habits/${id}`, {
      method: "DELETE",
    });

    fetchHabits();
    fetchSummary();
  }

  async function completeHabit(id) {
    await fetch(`${API}/habits/${id}/complete`, {
      method: "PATCH",
    });

    fetchHabits();
    fetchSummary();
  }
    return (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="container">

        <h1>Habit Tracker</h1>

        <button
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        <div className="summary">

          <div className="card">
            <h3>Total Habits</h3>
            <p>{summary.totalHabits}</p>
          </div>

          <div className="card">
            <h3>Completed</h3>
            <p>{summary.completedHabits}</p>
          </div>

          <div className="card">
            <h3>Longest Streak</h3>
            <p>{summary.longestStreak}</p>
          </div>

        </div>

        <form onSubmit={handleSubmit} className="form">

          <input
            type="text"
            name="title"
            placeholder="Habit Title"
            maxLength={40}
            value={habit.title}
            onChange={handleChange}
          />

          <small>{habit.title.length}/40</small>

          <textarea
            name="description"
            placeholder="Description"
            value={habit.description}
            onChange={handleChange}
          />

          <select
            name="frequency"
            value={habit.frequency}
            onChange={handleChange}
          >
            <option>Daily</option>
            <option>Weekly</option>
            <option>Monthly</option>
          </select>

          <button type="submit">
            {editingId ? "Update Habit" : "Add Habit"}
          </button>

        </form>

        {error && <p className="error">{error}</p>}

        <div className="search">

          <input
            type="text"
            placeholder="Search habits..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

        </div>

        {loading ? (
          <p>Loading habits...</p>
        ) : (
          <div className="habit-list">

            {habits.length === 0 ? (
              <p>No habits found.</p>
            ) : (
              habits.map((item) => (
                <div className="habit-card" key={item.id}>

                  <div className="habit-info">

                    <div className="avatar">
                      {item.title.charAt(0).toUpperCase()}
                    </div>

                    <div>

                      <h2>{item.title}</h2>

                      <p>{item.description}</p>

                      <p>
                        <strong>Frequency:</strong> {item.frequency}
                      </p>

                      <p>
                        <strong>Streak:</strong> 🔥 {item.streak}
                      </p>

                      <p>
                        <strong>Status:</strong>{" "}
                        {item.completed
                          ? "✅ Completed"
                          : "❌ Pending"}
                      </p>

                    </div>

                  </div>

                  <div className="buttons">

                    <button
                      onClick={() => completeHabit(item.id)}
                    >
                      Complete
                    </button>

                    <button
                      onClick={() => editHabit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete"
                      onClick={() => deleteHabit(item.id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))
            )}
                      </div>
        )}

        <div className="pagination">

          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>

        </div>

        <p className="updated">
          Last Updated: {lastUpdated}
        </p>

      </div>
    </div>
  );
}