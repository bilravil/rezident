const db = require('../db/index.js').db;
const router = require("express").Router();

function create(req, res) {
    db.patient.Create(req.body).then(
        result => res.status(200).json(result),
        error => res.status(500).json(error)
    )
}

function get(req, res) {
    db.patient.Get(req.query).then(
        result => res.status(200).json(result),
        error => res.status(500).json(error))
}

function getById(req, res) {
    db.patient.Get(req.params).then(
        result => res.status(200).json(result),
        error => res.status(500).json(error))
}

function update(req, res) {
    req.body.id = req.params.id;
    db.patient.Update(req.body).then(
        result => res.status(200).json(result),
        error => res.status(error.code).json(error))
}

function remove(req, res) {
    db.patient.Delete(req.params).then(
        result => res.status(200).json(result),
        error => res.status(error.code).json(error))
}

router.post("/", create);
router.get("/", get);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", remove);

module.exports = router;