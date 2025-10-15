var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();

var db = require("./database.js");

// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;

router.get("/listStudents", function(req, res)  {
    db.all(`SELECT * FROM student`, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("listStudents", {
            students: rows,
            title: "Список студентов"
        });
    });
});
    
router.get("/student/:id", function(req, res)  {
   // получение id студента из параметров запроса
    var student_id = req.params.id;

    db.get(`SELECT * FROM student WHERE id=?`, [student_id], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("student", {
            student: rows
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