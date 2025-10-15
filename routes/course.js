var express = require("express");
var router = express.Router();
var db = require("./database.js");

// Экспорт маршрутизатора
module.exports = router;

/* ============================================================
   Список курсов (дисциплин)
============================================================ */
router.get("/listCourses", function(req, res) {
    db.all(`SELECT * FROM discipline`, (err, rows) => {
        if (err) {
            console.error("Ошибка при получении дисциплин:", err.message);
            res.status(500).send("Ошибка базы данных");
            return;
        }
        res.render("listCourses", {
            courses: rows,
            title: "Список дисциплин"
        });
    });
});

/* ============================================================
   Просмотр информации об одном курсе
============================================================ */
router.get("/course/:id", function(req, res) {
    var course_id = req.params.id;

    db.get(`SELECT * FROM discipline WHERE id = ?`, [course_id], (err, row) => {
        if (err) {
            console.error("Ошибка при выборке дисциплины:", err.message);
            res.status(500).send("Ошибка базы данных");
            return;
        }
        res.render("course", {
            course: row
        });
    });
});

/* ============================================================
   Обновление информации о курсе
============================================================ */
router.post("/course/:id", function(req, res) {
    const course_id = req.params.id;
    const { name } = req.body;

    db.run(
        `UPDATE discipline SET name = ? WHERE id = ?`,
        [name, course_id],
        function(err) {
            if (err) {
                console.error("Ошибка при обновлении курса:", err.message);
                res.status(500).send("Ошибка базы данных");
                return;
            }
            console.log(`✅ Обновлён курс ID=${course_id}`);
            res.redirect("/listCourses");
        }
    );
});