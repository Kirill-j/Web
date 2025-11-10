var express = require("express");
var router = express.Router();
var db = require("./database.js");
var uuid = require('uuid');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

// Экспортируем маршрутизатор
module.exports = router;

router.get("/listDisciplines", (req, res) => {
    db.all(`SELECT * FROM discipline`, (err, rows) => {
        if (err) {
            console.error("Ошибка при получении дисциплин:", err.message);
            res.status(500).send("Ошибка базы данных");
            return;
        }
        res.render("discipline/listDisciplines", {
            disciplines: rows,
            title: "Список дисциплин"
        });
    });
});

router.get("/discipline/:id", (req, res) => {
    const discipline_id = req.params.id;
    db.get(`SELECT * FROM discipline WHERE id=?`, [discipline_id], (err, row) => {
        if (err) {
            console.error("Ошибка при выборке дисциплины:", err.message);
            res.status(500).send("Ошибка базы данных");
            return;
        }
        res.render("discipline/discipline", {
            discipline: row,
            title: "Информация о дисциплине"
        });
    });
});

router.route("/addDiscipline")
    .get((req, res) => {
        res.render("discipline/addDiscipline", {
            title: "Добавление дисциплины"
        });
    })
    .post((req, res) => {
        const { name, description } = req.body;
        db.run(
            `INSERT INTO discipline(name, description) VALUES (?, ?)`,
            [name, description],
            (err) => {
                if (err) {
                    console.error("Ошибка при добавлении дисциплины:", err.message);
                    res.status(500).send("Ошибка базы данных");
                    return;
                }
                res.redirect("/listDisciplines");
            }
        );
    });

router.post("/updateDiscipline/:id", (req, res) => {
    const discipline_id = req.params.id;
    const { name, description } = req.body;
    db.run(
        `UPDATE discipline SET name=?, description=? WHERE id=?`,
        [name, description, discipline_id],
        (err) => {
            if (err) {
                console.error("Ошибка при обновлении дисциплины:", err.message);
                res.status(500).send("Ошибка базы данных");
                return;
            }
            res.redirect("/discipline/" + req.params.id);
        }
    );
});

router.post("/deleteDiscipline/:id", (req, res) => {
    const discipline_id = req.params.id;
    db.run(`DELETE FROM discipline WHERE id=?`, [discipline_id], (err) => {
        if (err) {
            console.error("Ошибка при удалении дисциплины:", err.message);
            res.status(500).send("Ошибка базы данных");
            return;
        }
        res.redirect("/listDisciplines");
    });
});

router.post('/uploader', multipartMiddleware, (req, res) => {
    var expansion = req.files.upload.type; // тип файла указывается так: image/png
    expansion = expansion.split('/')[1]; // из "image/png" нам нужно извлечь только png, чтобы добавить к имени файла его расширение
    fs.readFile(req.files.upload.path, (err, data) => {
        var newName = uuid.v4() + "." + expansion; // вызываем функцию v4() для того, чтобы уникальный идентификатор был сгенерирован случайным образом
        var newPath = __dirname + '/../public/uploads/' + newName;
        fs.writeFile(newPath, data, (err) => {
            if (err) {
                throw err;
            }
            else {
                html = "<script type='text/javascript'>" +
                        "var funcNum = " + req.query.CKEditorFuncNum + ";" +
                        "var url     = \"/uploads/" + newName + "\";" +
                        "var message = \"Файл успешно загружен\";" +
                        "window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);" +
                        "</script>";
                res.send(html);
            }
        });
    });
});
