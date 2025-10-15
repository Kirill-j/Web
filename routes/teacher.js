var express = require("express");
var router = express.Router();
var db = require("./database.js");

module.exports = router;

router.get("/listTeachers", (req, res) => {
    db.all(`SELECT * FROM teacher`, (err, rows) => {
        if (err) {
            console.error("Ошибка при получении преподавателей:", err.message);
            res.status(500).send("Ошибка базы данных");
            return;
        }
        res.render("teacher/listTeachers", {
            teachers: rows,
            title: "Список преподавателей"
        });
    });
});

router.get("/teacher/:id", (req, res) => {
    const teacher_id = req.params.id;
    db.get(`SELECT * FROM teacher WHERE id=?`, [teacher_id], (err, row) => {
        if (err) {
            console.error("Ошибка при выборке преподавателя:", err.message);
            res.status(500).send("Ошибка базы данных");
            return;
        }
        res.render("teacher/teacher", {
            teacher: row,
            title: "Информация о преподавателе"
        });
    });
});

router.route("/addTeacher")
    .get((req, res) => {
        res.render("teacher/addTeacher", {
            title: "Добавление преподавателя"
        });
    })
    .post((req, res) => {
        const { name } = req.body;
        db.run(
            `INSERT INTO teacher(name) VALUES (?)`,
            [name],
            (err) => {
                if (err) {
                    console.error("Ошибка при добавлении преподавателя:", err.message);
                    res.status(500).send("Ошибка базы данных");
                    return;
                }
                res.redirect("/listTeachers");
            }
        );
    });

router.post("/updateTeacher/:id", (req, res) => {
    const teacher_id = req.params.id;
    const { name } = req.body;
    db.run(
        `UPDATE teacher SET name=? WHERE id=?`,
        [name, teacher_id],
        (err) => {
            if (err) {
                console.error("Ошибка при обновлении преподавателя:", err.message);
                res.status(500).send("Ошибка базы данных");
                return;
            }
            res.redirect("/listTeachers");
        }
    );
});

router.post("/deleteTeacher/:id", (req, res) => {
    const teacher_id = req.params.id;
    db.run(`DELETE FROM teacher WHERE id=?`, [teacher_id], (err) => {
        if (err) {
            console.error("Ошибка при удалении преподавателя:", err.message);
            res.status(500).send("Ошибка базы данных");
            return;
        }
        res.redirect("/listTeachers");
    });
});

router.get("/listDisciplineTeacher", (req, res) => {
    db.all(
        `SELECT discipline.id as discipline_id, discipline.name as discipline_name, teacher.id as teacher_id, teacher.name as teacher_name 
            FROM discipline_teacher
	        INNER JOIN discipline ON discipline.id=discipline_teacher.discipline_id 
	        INNER JOIN teacher ON teacher.id=discipline_teacher.teacher_id`,
        (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("teacher/listDisciplineTeacher", {
            disciplineTeacher: rows,
            title: "Назначение преподавателям учебных дисциплин"
        });
    });
});

router.route("/addDisciplineTeacher")
    .get((req, res) => {
        db.all(`SELECT * FROM teacher`, (err, rows) => {
            if (err) {
                throw err;
            }
            var teachers = rows;
            db.all(`SELECT * FROM discipline`, (err, rows) => {
                if (err) {
                    throw err;
                }
                var disciplines = rows;
                res.render("teacher/addDisciplineTeacher", {
                    teachers: teachers,
                    disciplines: disciplines,
                    title: "Назначение преподавателям учебных дисциплин"
                });
            });
        });
    })
    .post((req, res) => {
        db.run(`INSERT INTO discipline_teacher(discipline_id, teacher_id) VALUES (?, ?)`, [req.body.discipline_id, req.body.teacher_id],
            (err) => {
                if (err) {
                    throw err;
                }
                res.redirect('/listDisciplineTeacher');
            }
        );
    });

    router.post("/deleteDisciplineTeacher/disciplineId=:discipline_id/teacherId=:teacher_id", (req, res) => {
    db.run(`DELETE FROM discipline_teacher WHERE discipline_id=? AND teacher_id=? `, [req.params.discipline_id, req.params.teacher_id],
        (err) => {
            if (err) {
                throw err;
            }
            res.redirect('/listDisciplineTeacher');
        }
    );
});