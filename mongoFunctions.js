"use strict";
const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;
const CONNECTIONSTRING="mongodb+srv://Cavallero:ciao1234@cluster0.j90jx.mongodb.net/?retryWrites=true&w=majority";
const CONNECTIONOPTIONS = { useNewUrlParser: true };
var mongoFunctions = function() {}

function setConnection(nomeDb, col, callback){
  mongoClient.connect(CONNECTIONSTRING, CONNECTIONOPTIONS, function(err, conn) {
    let errConn;
    let collection=null;
    if(!err){
      let db=conn.db(nomeDb);
      collection=db.collection(col);
      errConn={codeErr:-1, message:""};
    }
    else
      errConn={codeErr:503, message:"Errore di connessione al DB Mongo"};
    callback(errConn,collection,conn);
  });
}

mongoFunctions.prototype.getId = function (nomeDb,collection,callback){
  setConnection(nomeDb, collection, function (errConn,collection,conn){
    if(errConn.codeErr==-1){
      collection.find({},{_id:1}).sort({_id:-1}).limit(1).toArray(function(errQ,data) {
        conn.close();
        let errQuery = {codeErr: -1, message: ""};
        if(!errQ)
          callback(errQuery,data);
        else {
          errQuery = {codeErr: 500, message: "Errore durante l'esecuzione della query"};
          callback(errQuery,{});
        }
      });
    }
    else
      callback(errConn,{});
  });
}

mongoFunctions.prototype.insertOne = function (nomeDb, collection, query, callback){
  setConnection(nomeDb, collection, function (errConn,collection,conn){
    if(errConn.codeErr==-1){
      collection.insertOne(query, function(errQ,data) {
        let errQuery;
        if(!errQ){
          errQuery={codeErr:-1, message:""};
        }else
          errQuery={codeErr:500, message:"Errore durante l'esecuzione della query"};
        conn.close();
        callback(errQuery,data);
      });
    }
    else
      callback(errConn);
  });
}

mongoFunctions.prototype.updateOne = function (nomeDb, collection, filter, update, callback){
  setConnection(nomeDb, collection, function (errConn,collection,conn){
    if(errConn.codeErr==-1){
      collection.updateOne(filter,update, function(errQ,data) {
        let errQuery;
        if(!errQ){
          errQuery={codeErr:-1, message:""};
        }else
          errQuery={codeErr:500, message:"Errore durante l'esecuzione della query"};
        conn.close();
        callback(errQuery,data);
      });
    }
    else
      callback(errConn);
  });
}


mongoFunctions.prototype.find = function (nomeDb, collection, query, callback){
  setConnection(nomeDb, collection, function (errConn,collection,conn){
    if(errConn.codeErr==-1){
      collection.find(query).toArray(function(errQ,data) {
        conn.close();
        let errQuery = {codeErr: -1, message: ""};
        if(!errQ)
          callback(errQuery,data);
        else {
          errQuery = {codeErr: 500, message: "Errore durante l'esecuzione della query"};
          callback(errQuery,{});
        }
      });
    }
    else
      callback(errConn, {});
  });
}

mongoFunctions.prototype.findOne = function (nomeDb, collection, query, callback){
  setConnection(nomeDb, collection, function (errConn,collection,conn){
    if(errConn.codeErr==-1){
      collection.findOne(query,function(errQ,data) {
        conn.close();
        let errQuery = {codeErr: -1, message: ""};
        if(!errQ)
          callback(errQuery,data);
        else {
          errQuery = {codeErr: 500, message: "Errore durante l'esecuzione della query"};
          callback(errQuery,{});
        }
      });
    }
    else
      callback(errConn, {});
  });
}

module.exports = new mongoFunctions();
