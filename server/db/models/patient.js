module.exports = function(engine, api) {
    var Sequelize = require('sequelize');
    var db = api.GetDB();

    var Patient = engine.define('patient', {
        id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV1 },
        last: { type: Sequelize.STRING(255), validate : { is: ["^[a-z]+$",'i'] } },
        first: { type: Sequelize.STRING(255), validate : { is: ["^[a-z]+$",'i'] } },
        middle: { type: Sequelize.STRING(255), validate : { is: ["^[a-z]+$",'i'] } },     
        sex: { type: Sequelize.INTEGER },
        birthday: { type: Sequelize.DATEONLY },
        state : { type: Sequelize.INTEGER,defaultValue : 0 },
        policy : { type: Sequelize.STRING(20) },
        snils : { type: Sequelize.STRING(20) },
        extra: { type: Sequelize.JSON }
    }, {
        freezeTableName: true,
        tableName: 'patient',
        classMethods: {
            FindAllSend: function(query) {
                return new Promise( (resolve,reject) =>{
                    Patient.findAndCountAll(query).then( result => {
                        if (result != null) resolve({ rows: result.rows, all: result.count });
                        else resolve([]);
                    });
                });             
            },

            Create: function(param) {
                return new Promise( (resolve,reject) =>{
                    Patient.create(param).then( patient=> { resolve(patient); })
                      .catch(function (error){ reject(error); });
                })
            },

            Update: function(param) {
                return new Promise( (resolve,reject) =>{
                    Patient.findOne({ where : { id : param.id}}).then(patient=> {
                        if(patient !== null){
                            patient.update(param).
                            then(function () { resolve(patient.get()); }).
                            error(function (error) { reject(error); });
                        }else  reject( { code : 404 , msg : "" });                      
                      })
                      .catch(function (error){
                        reject({ code : 500 , msg : error });
                      });
                })
            },

            Delete: function(param) {
                return new Promise( (resolve,reject) =>{
                    Patient.findOne({ where : { id : param.id}}).then( patient=> {
                        if(patient !== null){
                            param.state = 1;
                            patient.update(param).
                            then(function () { resolve(patient.get()); }).
                            error(function (error) { reject(error); });
                        }else  reject( { code : 404 , msg : "" });                      
                      })
                      .catch(function (error){
                        reject({ code : 500 , msg : error });
                      });
                })
            },

            Get: function(param) {

                if (param.id != undefined && !Array.isArray(param.id)) {
                    return new Promise( (resolve,reject) =>{
                        Patient.findOne({ where: { id: param.id } }).then( patient => { 
                            resolve(patient ? patient.get() : {});
                            return;
                        })              
                    });
                }

                var query = { raw: true, order: [["first", "ASC"]] };
                if (param.paging != undefined) { query.offset = param.paging.current;
                    query.limit = param.paging.show; }

                if (param.id != undefined && Array.isArray(param.id)) {
                    query.where = query.where || {};
                    query.where.$and = query.where.$and || [];
                    query.where.$and.push({ id: { $in: param.id } });
                }

                if (param.sex != undefined) {
                    query.where = query.where || {};
                    query.where.$and = query.where.$and || [];
                    query.where.$and.push({ sex: { $eq: param.sex } });
                }

                if (param.policy != undefined) {
                    query.where = query.where || {};
                    query.where.$and = query.where.$and || [];
                    query.where.$and.push({ policy: { $eq: param.policy } });
                }

                if (param.snils != undefined) {
                    query.where = query.where || {};
                    query.where.$and = query.where.$and || [];
                    query.where.$and.push({ snils: { $eq: param.snils } });
                }

                if (param.last != undefined) {
                    query.where = query.where || {};
                    query.where.$and = query.where.$and || [];
                    query.where.$and.push({ $or: [{ first: { $eq: null } }, { first: { $iLike: "%" + param.first + "%" } }] });
                    query.where.$and.push({ $or: [{ middle: { $eq: null } }, { middle: { $iLike: "%" + param.middle + "%" } }] });
                    query.where.$and.push({ $or: [{ last: { $eq: null } }, { last: { $iLike: "%" + param.last + "%" } }] });

                }

                return Patient.FindAllSend(query);

            }
        }
    });   

    return Patient;
}