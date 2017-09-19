module.exports = function(engine, api) {
    var Sequelize = require('sequelize');
    var db = api.GetDB();

    var Research = engine.define('research', {
        id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV1 },   
        state: { type: Sequelize.ENUM('deleted','appointed','performed')},
        date: { type: Sequelize.DATE },
        extra: { type: Sequelize.JSON }
    }, {
        freezeTableName: true,
        tableName: 'research',
        classMethods: {
            FindAllSend: function(query) {
                return new Promise( (resolve,reject) =>{
                    Research.findAndCountAll(query).then( result => {
                        if (result != null) resolve({ rows: result.rows, all: result.count });
                        else resolve([]);
                    });
                });             
            },

            Create: function(param) {
                return new Promise( (resolve,reject) =>{
                    Research.create(param).then( research=> { resolve(research); })
                      .catch(function (error){ reject(error); });
                })
            },

            Update: function(param) {
                return new Promise( (resolve,reject) =>{
                    Research.findOne({ where : { id : param.id}}).then(research=> {
                        if(research !== null){
                            research.update(param).
                            then(function () { resolve(research.get()); }).
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
                    Research.findOne({ where : { id : param.id}}).then( research=> {
                        if(research !== null){
                            param.state = 'deleted';
                            research.update(param).
                            then(function () { resolve(research.get()); }).
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
                        Research.findOne({ where: { id: param.id } }).then( research => { 
                            resolve(research ? research.get() : {});
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

                if (param.state != undefined && Array.isArray(param.state)) {
                    query.where = query.where || {};
                    query.where.$and = query.where.$and || [];
                    query.where.$and.push({ state: { $in: param.state } });
                }

                return Research.FindAllSend(query);

            }
        }
    });   
    Research.belongsTo(db.patient, { foreignKey: 'idPatient' });
    Research.belongsTo(db.result, { foreignKey: 'idResearch' });
    Research.belongsTo(db.service, { foreignKey: 'idService' });

    return Research;
}