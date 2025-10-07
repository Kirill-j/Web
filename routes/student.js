var express = require("express");
// Вызываем функцию Router(), чтобы создать новый объект маршрутизации. Основной уже располагается в app.js
var router = express.Router();

// Глобальный массив студентов
var students = [
    { 
        id: 1,
        firstname: "Kirill",
        secondname: "Pavlovich",
        lastname: "Lapshakov",
        birth: "22.01.2004",
        number: "+7(942)111-80-45"
    },
    {
        id: 2,
        firstname: "Sergey",
        secondname: "Fedorovich",
        lastname: "Petrov",
        birth: "03.03.2005",
        number: "+7(912)164-07-65"
    },
    {
        id: 3,
        firstname: "Ivan",
        secondname: "Romanovich",
        lastname: "Ivanov",
        birth: "05.07.2004",
        number: "+7(231)512-52-52"
    }
];

// Указание, что модуль является экспортируемым (теперь его можно подключать в другие модули)
module.exports = router;

router.get("/listStudents", function(req, res)  {
    res.render("listStudents", { students: students});
});
    
router.get("/student/:id", function(req, res)  {
    // получение id студента из параметров запроса
    var student_id = req.params.id;

    // Поиск студента в массиве.
    var student = students.find(item => item.id == student_id);

    res.render("student", {student: student});
});

router.post("/student/:id", function(req, res)  {
    // отображение данных в терминале, которые были отправлены из формы 
    console.log(req.body)
    // переход по адресу localhost:3000/listStudents
    res.redirect("/listStudents");
});