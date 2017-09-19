var Sequelize = require('sequelize');

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json()

var db = {};

exports.db = db;

function Init(connection, callback) {
    var engine = new Sequelize(connection, { logging: false });

    db.patient = require('./models/patient.js')(engine);

    engine.sync().then(callback);
}

exports.Run = function(connection) {

    Init(connection, function() {
        console.log(`Db service started`);
    });


}