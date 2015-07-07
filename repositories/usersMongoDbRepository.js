/**
 * Created by Victor on 15/06/2015.
 */

(function(){
    var mongodbUrl = 'mongodb://hcmuser:devpass@hcm-store.cloudapp.net:27017/hcm';
    var MongoClient = require('mongodb').MongoClient;
    var insertUser = function(user, db, callback){

        var usersCollection = db.collection("users");
        usersCollection.insert(user, function(err, result){
            if(err){
                console.error(err);
                callback(err, null);
                return;
            }
            console.log("The user has been inserted successfully.");
            callback(null, result.ops[0]);
        });
    };

    var findUser = function(user, db, callback){

        var usersCollection = db.collection("users");
        usersCollection.findOne(user, function(err, result){
            if(err) {
                console.error(err);
                callback(err, null);
                return;
            }
            console.log("The user has been inserted successfully.");
            callback(null, result);
        });
    };

    module.exports = {
            findOne : function(user, callback){

                MongoClient.connect(mongodbUrl, function(err, db){

                    if(err){
                        console.error(err);
                        callback(err, null);
                        return;
                    }

                    console.log("Connected correctly to server");

                    findUser(user, db, function(err, foundUser){
                        db.close();
                        callback(err, foundUser);
                    });
                });
            },
            findOneByEmail : function(email, callback){

                  MongoClient.connect(mongodbUrl, function(err, db){

                      if(err){
                          console.error(err);
                          callback(err, null);
                          return;
                      }

                      console.log("Connected correctly to server");

                      findUser({_id:email}, db, function(err, foundUser){
                          db.close();
                          callback(err, foundUser);
                      });
                  });
            },
            updateToken : function(user, callback){

                MongoClient.connect(mongodbUrl, function (err, db) {
                    if(err){
                        console.error(err);
                        callback(err, null);
                        return;
                    }

                    console.log("Connected correctly to server");

                    var usersCollection = db.collection("users");
                    usersCollection.update({_id:user.email},{$set: {token : user.token}}, function(err, result){
                        if(err) {
                            console.error(err);
                            callback(err, null);
                            return;
                        }
                        console.log("The token has been updated successfully.");
                        callback(err, result);
                    });
                });

            },
            save : function(user, callback) {

                MongoClient.connect(mongodbUrl, function (err, db) {
                    if(err){
                        console.error(err);
                        callback(err, null);
                        return;
                    }

                    console.log("Connected correctly to server");

                    insertUser(user, db, function (err, savedUser) {
                        db.close();
                        callback(err, savedUser);
                    });
                });
            }
        }
  })();
