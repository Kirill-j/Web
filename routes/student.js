var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();

var db = require("./database.js");

// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;

router.get("/listStudents", (req, res) => {
    db.all(
        `SELECT student.*, student_group.name as student_group_name FROM student
        INNER JOIN student_group ON student_group.id=student.student_group_id`,
        (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("student/listStudents", {
            students: rows,
            title: "Список студентов"
        });
    });
});
    
router.get("/student/:id", (req, res) => {
    db.get(
        `SELECT student.*, student_group.name as student_group_name FROM student
        INNER JOIN student_group ON student_group.id=student.student_group_id 
        WHERE student.id=?`,
        [req.params.id], (err, rows) => {
        if (err) {
            throw err;
        }
        var student = rows;
        // получаем все группы для вывода в выпадающий список
        db.all(`SELECT * FROM student_group`, (err, rows) => {
            if (err) {
                throw err;
            }
            res.render("student/student", {
                student: student,
                studentGroups: rows,
                title: "Студент"
            });
        });
    });
});

router.post("/student/:id", function(req, res) {
    const student_id = req.params.id;
    const { firstname, secondname, lastname, birth, number } = req.body;

    db.run(
        `UPDATE student 
         SET firstname = ?, secondname = ?, lastname = ?, birth = ?, number = ? 
         WHERE id = ?`,
        [firstname, secondname, lastname, birth, number, student_id],
        function(err) {
            if (err) {
                console.error("Ошибка при обновлении данных:", err.message);
                res.status(500).send("Ошибка базы данных");
                return;
            }
            console.log(`Обновлён студент ID=${student_id}`);
            res.redirect("/listStudents");
        }
    );
});

router.route("/addStudent")
    .get((req, res) => {
        // получаем все группы для вывода в выпадающий список
        db.all(`SELECT * FROM student_group`, (err, rows) => {
            if (err) {
                throw err;
            }
            res.render("student/addStudent", {
                studentGroups: rows,
                title: "Добавление студента"
            });
        });
    })
    .post((req, res) => {
        db.run(
            `INSERT INTO student(name, student_group_id) VALUES (?, ?)`,
            [req.body.name, req.body.student_group_id],
            (err) => {
                if (err) {
                    throw err;
                }
                res.redirect('/listStudents');
            }
        );
    });

    router.post("/updateStudent/:id", (req, res) => {
    db.run(
        `UPDATE student SET name=?, student_group_id=? WHERE id=?`,
        [req.body.name, req.body.student_group_id, req.params.id],
        (err) => {
            if (err) {
                throw err;
            }
            res.redirect('/listStudents');
        }
    );
});

router.post("/deleteStudent/:id", (req, res) => {
    db.run('DELETE FROM student WHERE id=?', [req.params.id],
        (err) => {
            if (err) {
                throw err;
            }
            res.redirect('/listStudents');
        }
    );
});