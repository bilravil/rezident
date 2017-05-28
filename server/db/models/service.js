module.exports = function(engine, api) {
    var Sequelize = require('sequelize');
    var db = api.GetDB();

    var Service = engine.define('service', {
        id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV1 },
        code: { type: Sequelize.STRING(50) },
        fullname: { type: Sequelize.STRING(255) },
        shortname: { type: Sequelize.STRING(100) },
        cost: { type: Sequelize.STRING(50) },
        child: { type: Sequelize.BOOLEAN },
        idParent: { type: Sequelize.UUID },
        state: { type: Sequelize.INTEGER,defaultValue : 0 },
    }, {
        freezeTableName: true,
        tableName: 'service',
        classMethods: {
            FindAllSend: function(query) {
                return new Promise( (resolve,reject) =>{
                    Service.findAndCountAll(query).then( result => {
                        if (result != null) resolve({ rows: result.rows, all: result.count });
                        else resolve([]);
                    });
                });             
            },

            Create: function(param) {
                return new Promise( (resolve,reject) =>{
                    Service.create(param).then( service=> { resolve(service); })
                      .catch(function (error){ reject(error); });
                })
            },

            Update: function(param) {
                return new Promise( (resolve,reject) =>{
                    Service.findOne({ where : { id : param.id}}).then(service=> {
                        if(service !== null){
                            service.update(param).
                            then(function () { resolve(service.get()); }).
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
                    Service.findOne({ where : { id : param.id}}).then( service=> {
                        if(service !== null){
                            param.state = 1;
                            service.update(param).
                            then(function () { resolve(service.get()); }).
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
                        Service.findOne({ where: { id: param.id } }).then( service => { 
                            resolve(service ? service.get() : {});
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

                if (param.idParent != undefined) {
                    query.where = query.where || {};
                    query.where.$and = query.where.$and || [];
                    query.where.$and.push({ idParent: { $eq: param.idParent } });
                }

                if (param.code != undefined) {
                    query.where = query.where || {};
                    query.where.$and = query.where.$and || [];
                    query.where.$and.push({ code: { $iLike: "%" + param.code + "%" }});
                }

                if (param.cost != undefined) {
                    query.where = query.where || {};
                    query.where.$and = query.where.$and || [];
                    query.where.$and.push({ cost: { $eq: param.cost }});
                }

                if (param.shortname != undefined) {
                    query.where = query.where || {};
                    query.where.$and = query.where.$and || [];
                    query.where.$and.push({ shortname: { $iLike: "%" + param.shortname + "%" }});
                }


                return Service.FindAllSend(query);

            }
        }
    });   
    
    return Service;
}