module.exports = function(engine, url, api, jsonParser) {
    var Sequelize = require('sequelize');
    var db = api.GetDB();

    var Patient = engine.define('patient', {
        id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV1 },
        last: { type: Sequelize.STRING(255), validate : { is: ["^[a-z]+$",'i'] } },
        first: { type: Sequelize.STRING(255), validate : { is: ["^[a-z]+$",'i'] } },
        middle: { type: Sequelize.STRING(255), validate : { is: ["^[a-z]+$",'i'] } },     
        sex: { type: Sequelize.INTEGER },
        birthday: { type: Sequelize.DATEONLY },
        policy : { type: Sequelize.STRING(20) },
        snils : { type: Sequelize.STRING(20) },
        extra: { type: Sequelize.JSON }
    }, {
        freezeTableName: true,
        tableName: 'patient',
        classMethods: {
            FindAllSend: function(query, success, error) {
                success = success || function() {};
                error = error || function() {};
                Patient.findAndCountAll(query).then(function(result) {
                    if (result != null) success({ rows: result.rows, all: result.count });
                    else success([]);
                });
            },

            Put: function(param, success, error) {

            },


            Delete: function(param, success, error) {


            },
            Get: function(param, success, error) {
                success = success || function() {};
                error = error || function() {};

                if (param.uuid != undefined && !Array.isArray(param.uuid)) {
                    Patient.findOne({ where: { uuid: param.uuid } }).then(function(patient) { success(patient ? patient.get() : {}); });
                    return;
                }

                if (param.externalId != undefined) {
                    Patient.findOne({ where: { externalId: param.externalId } }).then(function(patient) {
                        success(patient != null ? patient.get() : null);
                    });
                    return;
                }

                var query = { raw: true, order: [["first", "ASC"]] };
                if (param.paging != undefined) { query.offset = param.paging.current;
                    query.limit = param.paging.show; }

                if (param.uuid != undefined && Array.isArray(param.uuid)) {
                    query.where = query.where || {};
                    query.where.$and = query.where.$and || [];
                    query.where.$and.push({ uuid: { $in: param.uuid } });
                }

                if (param.first != undefined) {
                    query.where = query.where || {};
                    query.where.$and = query.where.$and || [];
                    query.where.$and.push({ $or: [{ first: { $eq: null } }, { first: { $iLike: "%" + param.first + "%" } }] });
                    query.where.$and.push({ $or: [{ middle: { $eq: null } }, { middle: { $iLike: "%" + param.middle + "%" } }] });
                    query.where.$and.push({ $or: [{ last: { $eq: null } }, { last: { $iLike: "%" + param.last + "%" } }] });

                }

                if (param.updatedAt && param.updatedAt != 0) {
                    query.where = query.where || {};
                    query.where.$and = query.where.$and || [];
                    query.where.$and.push({ updatedAt: { $gte: param.updatedAt } });
                }

                if (param.ibak && param.ibak.length > 0) {
                    query.where = query.where || {};
                    query.where.$and = query.where.$and || [];
                    query.where.$and.push({ $or: [{ ambCard: { $iLike: "%" + param.ibak + "%" } }, { caseNumber: { $iLike: "%" + param.ibak + "%" } }] });
                }


                return Patient.FindAllSend(query, success, error);

            }
        }
    });
    api.GetExpress().post(url + '/Patient/Put', jsonParser, function(req, res) {
        if (!req.body) return res.send({ success: false, message: "Invalid arguments" });
        Patient.Put(req.body, function(result) { res.send(result) }, function(result) { res.send({ success: false, message: result.message }) });
    });
    api.GetExpress().post(url + '/Patient/Get', jsonParser, function(req, res) {
        if (!req.body) return res.send({ success: false, message: "Invalid arguments" });

        Patient.Get(req.body, function(result) { res.send(result) }, function(result) { res.send({ success: false, message: result.message }) });
    });
    api.GetExpress().post(url + '/Patient/Delete', jsonParser, function(req, res) {
        if (!req.body) return res.send({ success: false, message: "Invalid arguments" });
        Patient.Delete(req.body, function(result) { res.send(result) }, function(result) { res.send({ success: false, message: result.message }) });
    });
    api.GetExpress().post(url + '/Patient/ChangePassword', jsonParser, function(req, res) {
        if (!req.body) return res.send({ success: false, message: "Invalid arguments" });
        Patient.ChangePassword(req.body, function(result) { res.send(result) }, function(result) { res.send({ success: false, message: result.message }) });
    });
    api.GetExpress().post(url + '/Patient/GetAuth', jsonParser, function(req, res) {
        if (!req.body) return res.send({ success: false, message: "Invalid arguments" });
        db.auth.Get(req.body, function(result) { res.send(result) }, function(result) { res.send({ success: false, message: result.message }) });
    });
    Patient.promise = {};
    Patient.promise.Get = function (param) {
        return new Promise(function (resolve, reject) {
            Patient.Get(param,
                function (result) { resolve(result) },
                function (result) { reject({ success: false, message: result.message }) });
        });
    }


    return Patient;
}