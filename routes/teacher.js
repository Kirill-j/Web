var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();

var db = require("./database.js");

// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;

router.get("/listTeachers", function(req, res)  {
    db.all(`SELECT * FROM teacher`, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("listTeachers", {
            teachers: rows,
            title: "Список преподавателей"
        });
    });
});

router.get("/teacher/:id", function(req, res)  {
   // получение id студента из параметров запроса
    var teacher_id = req.params.id;

    db.get(`SELECT * FROM teacher WHERE id=?`, [teacher_id], (err, rows) => {
        if (err) {
            throw err;
        }
        res.render("teacher", {
            teacher: rows
        });
    });
});

router.post("/teacher/:id", function(req, res)  {
    // отображение данных в терминале, которые были отправлены из формы 
    console.log(req.body)
    // переход по адресу localhost:3000/listTeachers
    res.redirect("/listTeachers");
});