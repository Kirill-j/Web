var express = require("express");
var router = express.Router();
var db = require("./database.js");

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
        const { name } = req.body;
        db.run(
            `INSERT INTO discipline(name) VALUES (?)`,
            [name],
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
    const { name } = req.body;
    db.run(
        `UPDATE discipline SET name=? WHERE id=?`,
        [name, discipline_id],
        (err) => {
            if (err) {
                console.error("Ошибка при обновлении дисциплины:", err.message);
                res.status(500).send("Ошибка базы данных");
                return;
            }
            res.redirect("/listDisciplines");
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
