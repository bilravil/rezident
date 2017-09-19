const router = require("express").Router();
var patient = require('./patient.js');

exports.Run = function() {
    global.app.use("/api/patient", patient);
}