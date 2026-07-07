const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = new Database("data.db");

db.prepare(`
CREATE TABLE IF NOT EXISTS habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    frequency TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    streak INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`).run();


// Create Habit
app.post("/habits", (req, res) => {
    const { title, description, frequency } = req.body;

    if (!title || !frequency) {
        return res.status(400).json({
            message: "Title and Frequency are required"
        });
    }

    const stmt = db.prepare(`
        INSERT INTO habits(title,description,frequency)
        VALUES(?,?,?)
    `);

    const result = stmt.run(title, description || "", frequency);

    const habit = db
        .prepare("SELECT * FROM habits WHERE id=?")
        .get(result.lastInsertRowid);

    res.status(201).json(habit);
});


// Get Habits
app.get("/habits", (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    const total = db.prepare(`
        SELECT COUNT(*) as count
        FROM habits
        WHERE title LIKE ?
    `).get(`%${search}%`).count;

    const habits = db.prepare(`
        SELECT *
        FROM habits
        WHERE title LIKE ?
        ORDER BY id DESC
        LIMIT ?
        OFFSET ?
    `).all(`%${search}%`, limit, offset);

    res.json({
        data: habits,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
    });
});


// Get Habit By Id
app.get("/habits/:id", (req, res) => {

    const habit = db
        .prepare("SELECT * FROM habits WHERE id=?")
        .get(req.params.id);

    if (!habit) {
        return res.status(404).json({
            message: "Habit not found"
        });
    }

    res.json(habit);
});


// Update Habit
app.put("/habits/:id", (req, res) => {

    const oldHabit = db
        .prepare("SELECT * FROM habits WHERE id=?")
        .get(req.params.id);

    if (!oldHabit) {
        return res.status(404).json({
            message: "Habit not found"
        });
    }

    const {
        title,
        description,
        frequency,
        completed,
        streak
    } = req.body;

    db.prepare(`
        UPDATE habits
        SET
        title=?,
        description=?,
        frequency=?,
        completed=?,
        streak=?
        WHERE id=?
    `).run(
        title ?? oldHabit.title,
        description ?? oldHabit.description,
        frequency ?? oldHabit.frequency,
        completed ?? oldHabit.completed,
        streak ?? oldHabit.streak,
        req.params.id
    );

    const updated = db
        .prepare("SELECT * FROM habits WHERE id=?")
        .get(req.params.id);

    res.json(updated);
});


// Mark Complete
app.patch("/habits/:id/complete", (req, res) => {

    const habit = db
        .prepare("SELECT * FROM habits WHERE id=?")
        .get(req.params.id);

    if (!habit) {
        return res.status(404).json({
            message: "Habit not found"
        });
    }

    const completed = habit.completed ? 0 : 1;
    const streak = completed ? habit.streak + 1 : habit.streak;

    db.prepare(`
        UPDATE habits
        SET completed=?, streak=?
        WHERE id=?
    `).run(completed, streak, req.params.id);

    const updated = db
        .prepare("SELECT * FROM habits WHERE id=?")
        .get(req.params.id);

    res.json(updated);
});


// Delete Habit
app.delete("/habits/:id", (req, res) => {

    const result = db
        .prepare("DELETE FROM habits WHERE id=?")
        .run(req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({
            message: "Habit not found"
        });
    }

    res.json({
        message: "Habit deleted successfully"
    });
});


// Summary
app.get("/summary", (req, res) => {

    const total = db
        .prepare("SELECT COUNT(*) as total FROM habits")
        .get().total;

    const completed = db
        .prepare("SELECT COUNT(*) as total FROM habits WHERE completed=1")
        .get().total;

    const longest = db
        .prepare("SELECT MAX(streak) as streak FROM habits")
        .get().streak || 0;

    res.json({
        totalHabits: total,
        completedHabits: completed,
        longestStreak: longest
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});