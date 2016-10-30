(function() {

  var PatientsGroupMemberRepository = require('../../repositories/PatientsGroupMemberRepository');
  var connectionOptions = require('../../repositories/awsOptions1');

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


  describe("Test operations on Repository table", function () {

    this.timeout(20000);

    describe("Creating PatientsGroupMember table", function () {

      before(function (done) {
        var db = getDb();
        PatientsGroupMemberRepository.setDependencies(db);
        done();
      });

      after(function (done) {

        PatientsGroupMemberRepository.deleteTable("PatientsGroupMemberRepository", function (err, data) {

          if (data) {
            done();
          }

          if (err) {
            done();
            throw err;
          }
        });
      });

      it("It will be create PatientsGroupMemberRepository table\n", function (done) {

        PatientsGroupMemberRepository.createTable("PatientsGroupMemberRepository", function (err, data) {

          if (data) {
            expect(data.TableDescription).to.have.property('TableName', 'PatientsGroupMemberRepository');
            expect(data.TableDescription).to.have.property('TableStatus', 'ACTIVE');
            done();
          }

          if (err) {
            done();
          }
        });
      });
    });

    describe("Saving Item to PatientsGroupMember table", function () {

      before(function (done) {
        var db = getDb();
        PatientsGroupMemberRepository.setDependencies(db);

        PatientsGroupMemberRepository.createTable("PatientsGroupMember", function (err, data) {

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

        PatientsGroupMemberRepository.getList({

          providerId: "First Provider",
          groupName: "First Group Name",
          patientId: "First Patient ID",
          createDateTime: +new Date(),
          createdBy: "First CreatedBy"

        }, function (err, data) {

          if (data) {
            expect(data).to.be.a('array');
            expect(data).to.have.deep.property('[0].groupId', 'First Provider#First Group Name');
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

        PatientsGroupMemberRepository.deleteTable("PatientsGroupMember", function (err, data) {

          if (data) {
            done();
          }

          if (err) {
            done();
            throw err;
          }
        });
      });

      it("It will save an Item to PatientsGroupMember table\n", function (done) {

        PatientsGroupMemberRepository.save({

          providerId: "First Provider",
          groupName: "First Group Name",
          patientId: "First Patient ID",
          createDateTime: +new Date(),
          createdBy: "First CreatedBy"

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

    describe("Getting Item from PatientsGroupMember table", function () {

      before(function (done) {

        var db = getDb();
        PatientsGroupMemberRepository.setDependencies(db);
        PatientsGroupMemberRepository.createTable("PatientsGroupMember", function (err, data) {

          if (data) {

            PatientsGroupMemberRepository.save({

              providerId: "First Provider",
              groupName: "First Group Name",
              patientId: "First Patient ID",
              createDateTime: +new Date(),
              createdBy: "First CreatedBy"

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
      });

      after(function (done) {

        PatientsGroupMemberRepository.deleteTable("PatientsGroupMember", function (err, data) {

          if (err) {
            throw err;
          }
          done();
        });
      });

      it("It will Get Item from PatientsGroupMember table\n", function (done) {

        PatientsGroupMemberRepository.getOne({

          providerId: "First Provider",
          groupName: "First Group Name",
          patientId: "First Patient ID",
          createDateTime: +new Date(),
          createdBy: "First CreatedBy"

        }, function (err, data) {
          if (data) {
            expect(data).to.have.property('groupId', 'First Provider#First Group Name');
            expect(data).to.have.property('patientId', 'First Patient ID');
            done();
          }
          if (err) {
            done();
            throw err;
          }
        });
      });
    });

    describe("Getting list of items by providerId from PatientsGroupMember table", function () {

      before(function (done) {
        var db = getDb();
        PatientsGroupMemberRepository.setDependencies(db);
        PatientsGroupMemberRepository.createTable("PatientsGroupMember", function (err, data) {

          if (data) {
            PatientsGroupMemberRepository.save({

              providerId: "First Provider",
              groupName: "First Group Name",
              patientId: "First Patient ID",
              createDateTime: +new Date(),
              createdBy: "First CreatedBy"

            }, function (err, data) {

              if (data) {
                PatientsGroupMemberRepository.save({

                  providerId: "First Provider",
                  groupName: "First Group Name",
                  patientId: "Second Patient ID",
                  createDateTime: +new Date(),
                  createdBy: "First CreatedBy"

                }, function (err, data) {

                  if (data) {
                    PatientsGroupMemberRepository.save({

                      providerId: "First Provider",
                      groupName: "First Group Name",
                      patientId: "Third Patient ID",
                      createDateTime: +new Date(),
                      createdBy: "First CreatedBy"

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

        PatientsGroupMemberRepository.deleteTable("PatientsGroupMember", function (err, data) {

          if (data) {
            done();
          }

          if (err) {
            done();
            throw err;
          }
        });
      });

      it("It will get a list of items by providerId from PatientsGroupMember table\n", function (done) {

        PatientsGroupMemberRepository.getList({

          providerId: "First Provider",
          groupName: "First Group Name",
          patientId: "First Patient ID",
          createDateTime: +new Date(),
          createdBy: "First CreatedBy"

        }, function (err, data) {

          if (data) {
            expect(data).to.be.a('array');
            expect(data).to.have.deep.property('[0].groupId', 'First Provider#First Group Name');
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

    describe("Deleting item from PatientsGroupMember table", function () {

      before(function (done) {
        var db = getDb();
        PatientsGroupMemberRepository.setDependencies(db);
        PatientsGroupMemberRepository.createTable("PatientsGroupMember", function (err, data) {

          if (data) {
            PatientsGroupMemberRepository.save({

              providerId: "First Provider",
              groupName: "First Group Name",
              patientId: "First Patient ID",
              createDateTime: +new Date(),
              createdBy: "First CreatedBy"

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
      });

      afterEach(function (done) {

        PatientsGroupMemberRepository.getList({

          providerId: "First Provider",
          groupName: "First Group Name",
          patientId: "First Patient ID",
          createDateTime: +new Date(),
          createdBy: "First CreatedBy"

        }, function (err, data) {

          if (data) {
            expect(data).to.be.a('array');
            expect(data).to.be.eql([]);
            done();
          }

          if (err) {
            done();
            throw err;
          }
        });
      });

      after(function (done) {

        PatientsGroupMemberRepository.deleteTable("PatientsGroupMember", function (err, data) {

          if (data) {
            done();
          }

          if (err) {
            done();
            throw err;
          }
        });
      });

      it("It will delete item from PatientsGroupMember table\n", function (done) {

        PatientsGroupMemberRepository.delete({

          providerId: "First Provider",
          groupName: "First Group Name",
          patientId: "First Patient ID",
          createDateTime: +new Date(),
          createdBy: "First CreatedBy"

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