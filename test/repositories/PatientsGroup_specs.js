(function() {

  var connectionOptions = require('../../repositories/awsOptions1');
  var patientsGroup = require('../../repositories/patientsGroupRepository');
  var AWS = require('aws-sdk');
  var _ = require("underscore");
  var uuid = require('node-uuid');
  var expect = require('chai').expect;
  var exec = require('child_process').exec,
      child;

  child = exec('java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb',
      {shell: 'cmd.exe', cwd: __dirname + '../../dblocal'});

  var getDb = function () {
    var dynamodb = new AWS.DynamoDB(connectionOptions);
    return dynamodb;
  };


  describe("Test operations on PatientsGroup table", function () {

    this.timeout(20000);

    describe("Creating PatientsGroup table", function () {

      before(function (done) {
        var db = getDb();
        patientsGroup.setDependencies(db);
        done();
      });

      after(function (done) {

      patientsGroup.deleteTable("PatientsGroup", function (err, data) {

        if (data) {
          done();
          }

        if (err) {
          done();
          throw err;
          }
        });
      });

    it("It will be create PatientsGroup table\n", function (done) {

      patientsGroup.createTable("PatientsGroup", function (err, data) {

        if (data) {
          expect(data.TableDescription).to.have.property('TableName', 'PatientsGroup');
          expect(data.TableDescription).to.have.property('TableStatus', 'ACTIVE');
          done();
          }
        if (err) {
          done();
          }
        });
      });
    });


    describe("Saving Item to PatientsGroup table", function () {

      before(function (done) {
        var db = getDb();
        patientsGroup.setDependencies(db);

    patientsGroup.createTable("PatientsGroup", function (err, data) {

      if (data) {
        done();
          }

      if (err) {
        done();
        throw err;
          }
        });
      });

      afterEach(function (done) {

        patientsGroup.getList({providerId: "First Provider"}, function (err, data) {

          if (data) {
            expect(data).to.be.a('array');
            expect(data).to.have.deep.property('[0].providerId', 'First Provider');
            expect(data.length).to.be.equal(1);
            done();
          }

          if (err) {
            done();
            throw err;
          }
        });
      });

      after(function (done) {

        patientsGroup.deleteTable("PatientsGroup", function (err, data) {

          if (data) {
            done();
          }
          if (err) {
            done();
            throw err;
          }

        });

      });

    it("It will save an Item to PatientsGroup table\n", function (done) {

      patientsGroup.save({providerId: "First Provider", groupName: "First Group Name"}, function (err, data) {

        if (data) {
          expect(data).to.be.eql({});
          done();
          }

        if (err) {
          done();
          throw err;
          }
        });
      });
    });

    describe("Getting Item from PatientsGroup table", function () {

      before(function (done) {

        var db = getDb();
        patientsGroup.setDependencies(db);
        patientsGroup.createTable("PatientsGroup", function (err, data) {

          if (data) {

            patientsGroup.save({providerId: "First Provider", groupName: "First Group Name"}, function (err, data) {

              if (data) {
                done();
              }

              if (err) {
                done();
                throw err;
              }
            });
          }

          if (err) {
            done();
            throw err;
          }
        });
      });

      after(function (done) {

        patientsGroup.deleteTable("PatientsGroup", function (err, data) {

          if (err) {
            throw err;
          }
          done();
        });
      });

    it("It will Get Item from PatientsGroup table\n", function (done) {

      patientsGroup.getOne({
        providerId: "First Provider",
        groupName: "First Group Name"
        }, function (err, data) {
          if (data) {
            expect(data).to.have.property('providerId', 'First Provider');
            expect(data).to.have.property('groupName', 'First Group Name');
            done();
          }

          if (err) {
            done();
            throw err;
          }
        });
      });
    });

    describe("Getting list of items by providerId from PatientsGroup table", function () {

      before(function (done) {
        var db = getDb();
        patientsGroup.setDependencies(db);
        patientsGroup.createTable("PatientsGroup", function (err, data) {

          if (data) {
            patientsGroup.save({providerId: "First Provider", groupName: "First Group Name"}, function (err, data) {

              if (data) {
                patientsGroup.save({
                  providerId: "First Provider",
                  groupName: "Second Group Name"
                }, function (err, data) {

                  if (data) {

                    patientsGroup.save({
                      providerId: "First Provider",
                      groupName: "Third Group Name"
                    }, function (err, data) {

                      if (data) {
                        done();

                      }

                      if (err) {
                        done();
                        throw err;
                      }
                    });
                  }

                  if (err) {
                    done();
                    throw err;
                  }
                });
              }

              if (err) {
                done();
                throw err;
              }
            });
          }

          if (err) {
            done();
            throw err;
          }
        });
      });

      after(function (done) {

        patientsGroup.deleteTable("PatientsGroup", function (err, data) {

          if (data) {
            done();
          }

          if (err) {
            done();
            throw err;
          }
        });
      });

    it("It will get a list of items by providerId from PatientsGroup table\n", function (done) {

        patientsGroup.getList({providerId: "First Provider"}, function (err, data) {

          if (data) {
            expect(data).to.be.a('array');
            expect(data).to.have.deep.property('[0].providerId', 'First Provider');
            expect(data).to.have.property('length', 3);
            done();
          }

          if (err) {
            done();
            throw err;
          }
        });
      });
    });

    describe("Deleting item from PatientsGroup table", function () {

      before(function (done) {
        var db = getDb();
        patientsGroup.setDependencies(db);
        patientsGroup.createTable("PatientsGroup", function (err, data) {

          if (data) {
            patientsGroup.save({providerId: "First Provider", groupName: "First Group Name"}, function (err, data) {

              if (data) {
                done();
              }

              if (err) {
                done();
                throw err;
              }
            });
          }

          if (err) {
            done();
            throw err;
          }
        });
      });

      afterEach(function (done) {

        patientsGroup.getList({providerId: "First Provider"}, function (err, data) {

          if (data) {
            expect(data).to.be.a('array');
            expect(data.length).to.be.equal(0);
            done();
          }

          if (err) {
            done();
            throw err;
          }
        });
      });

      after(function (done) {

        patientsGroup.deleteTable("PatientsGroup", function (err, data) {

          if (data) {
            done();
          }

          if (err) {
            done();
            throw err;
          }
        });
      });

    it("It will delete item from PatientsGroup table\n", function (done) {

      patientsGroup.delete({

        providerId: "First Provider",
        groupName: "First Group Name"

        }, function (err, data) {

          if (data) {
            expect(data).to.be.eql({});
            done();
          }

          if (err) {
            done();
            throw err;
          }
        });
      });
    });
  });
})();