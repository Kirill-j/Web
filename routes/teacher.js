var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();

// Глобальный массив преподавателей
var teachers = [
    { 
        id: 1,
        firstname: "Oleg",
        secondname: "Dmitrievich",
        lastname: "Pupkov",
        course: "Artifical Intelegence"
    },
    {
        id: 2,
        firstname: "Igor",
        secondname: "Vladimirovich",
        lastname: "Glupkov",
        course: "Modern technologies"
    },
    {
        id: 3,
        firstname: "Yuriy",
        secondname: "Ivanovich",
        lastname: "Hubabuba ",
        course: "Operating systems"
    }
];

// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;

router.get("/listTeachers", function(req, res)  {
    res.render("listTeachers", {
        teachers: teachers,
        title: "Список преподавателей"
    });
});
    
router.get("/teacher/:id", function(req, res)  {
    // получение id преподавателя из параметров запроса
    var teacher_id = req.params.id;

    // Поиск преподавателя в массиве.
    var teacher = teachers.find(item => item.id == teacher_id);

    res.render("teacher", {teacher: teacher});
});

router.post("/teacher/:id", function(req, res)  {
    // отображение данных в терминале, которые были отправлены из формы 
    console.log(req.body)
    // переход по адресу localhost:3000/listTeachers
    res.redirect("/listTeachers");
});