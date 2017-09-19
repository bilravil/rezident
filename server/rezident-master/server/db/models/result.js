module.exports = function(engine, api) {
    var Sequelize = require('sequelize');
    var db = api.GetDB();

    var Result = engine.define('result', {
        id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV1 },
        result: { type: Sequelize.JSON },
    }, {
        freezeTableName: true,
        tableName: 'result',
        classMethods: {
            FindAllSend: function(query) {
                return new Promise( (resolve,reject) =>{
                    Result.findAndCountAll(query).then( result => {
                        if (result != null) resolve({ rows: result.rows, all: result.count });
                        else resolve([]);
                    });
                });             
            },

            Create: function(param) {
                return new Promise( (resolve,reject) =>{
                    Result.create(param).then( result=> { resolve(result); })
                      .catch(function (error){ reject(error); });
                })
            },

            Update: function(param) {
                return new Promise( (resolve,reject) =>{
                    Result.findOne({ where : { id : param.id}}).then(result=> {
                        if(result !== null){
                            result.update(param).
                            then(function () { resolve(result.get()); }).
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
                        Result.findOne({ where: { id: param.id } }).then( result => { 
                            resolve(result ? result.get() : {});
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

                return Result.FindAllSend(query);

            }
        }
    });   
    
    return Result;
}