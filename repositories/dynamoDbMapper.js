/**
 * Created by Victor on 06/07/2015.
 */

(function() {
    var bcrypt = require('bcrypt');
    var domainModel = require('@vcrudu/hcm.domainmodel');

    function buildArray(source, mapper) {
        var all = [];
        for (var i = 0; i < source.length; i++) {
            var temp = mapper(source[i]);
            all.push(temp);
        }
        return all;
    }

    //
    //-----------------Map To DbEntity-------------------
    //

    function mapOtherIdentifiersToDbEntity(identifier) {
        return {
            M: {
                otherIdentifierType: {S: identifier.otherIdentifierType},
                otherIdentifier: {S: identifier.otherIdentifier}
            }
        };
    }

    //----------------- Relevant Contacts
    function mapRelevantContactsDetailsToDbEntity(contactDetail) {
        return {
            contactType: {S: contactDetail.contactType},
            contact: {S: contactDetail.contact}
        };
    }

    function mapRelevantContactsToDbEntity(relevantContact) {
        var allRelevantContactDetails = [];
        for (var i = 0; i < relevantContact.contactDetails.length; i++) {
            var temp = mapRelevantContactsDetailsToDbEntity(relevantContact.contactDetails[i]);
            allRelevantContactDetails.push(temp);
        }
        return {
            fullName: {S: relevantContact.fullName},
            relationship: {S: relevantContact.relationship},
            contactDetails: {L: allRelevantContactDetails}
        };
    }

    //---------------- End Relevant Contacts

    function mapDevicesToDbEntity(device) {
        return {
            model: {S: device.model},
            serialNumber: {S: device.serialNumber},
            manufacturer: {S: device.manufacturer},
            deviceType: {S: device.deviceType}
        };
    }

    function mapHealthProblemsToDbEntity(item) {
        var tempDate = item.date ? new Date(item.date) : new Date();
        var dateTemp = tempDate.getTime().toString();
        return {
            M: {
                problemType: {S: item.problemType},
                date: {N: dateTemp},
                description: item.description ? {S: item.description} : {NULL: true}
            }
        };
    }

    function buildDynamoDbString(str) {
        if (str && str !== "") return {S: str};
        else return {NULL: true};
    }

    function mapAddressToDbEntity(item) {
        return {
            id: {S: item.id},
            addressLine1: {S: item.addressLine1},
            addressLine2: buildDynamoDbString(item.addressLine2),
            town: {S: item.town},
            county: {S: item.county},
            country: {S: item.country},
            postCode: {S: item.postCode},
            longitude: buildDynamoDbString(item.longitude),
            latitude: buildDynamoDbString(item.latitude)
        };
    }

    //-----------------End Map To DbEntity-------------------

    //
    //-----------------Map From DbEntity-------------------
    //


    function mapOtherIdentifiersFromDbEntity(identifier) {
        return {
            otherIdentifierType: identifier.otherIdentifierType.S,
            otherIdentifier: identifier.otherIdentifier.S
        };
    }

    function mapRelevantContactDetailsFromDbEntity(contactDetail) {
        return {
            contactType: contactDetail.contactType.S,
            contact: contactDetail.contact.S
        };
    }

    function mapRelevantContactsFromDbEntity(relevantContact) {
        var allRelevantContactDetails = [];
        for (var i = 0; i < relevantContact.contactDetails.L.length; i++) {
            var temp = mapRelevantContactDetailsFromDbEntity(relevantContact.contactDetails.L[i]);
            allRelevantContactDetails.push(temp);
        }
        return domainModel.createRelevantContact({
            fullName: relevantContact.fullName.S,
            relationship: relevantContact.relationship.S,
            contactDetails: allRelevantContactDetails
        });
    }


    function mapAddressFromDbEntity(item) {
        if (item.addressLine1.S == "") {
            return {
                id: item.id.S,
                addressLine1: item.addressLine1.S
            };
        }
        return domainModel.createAddress({
            id: item.id.S,
            addressLine1: item.addressLine1.S,
            addressLine2: item.addressLine2.S,
            town: item.town.S,
            county: item.county.S,
            country: item.country.S,
            postCode: item.postCode.S,
            longitude: item.longitude.S,
            latitude: item.latitude.S
        });
    }

    function mapDevicesFromDbEntity(device) {
        return {
            model: device.model.S,
            serialNumber: device.serialNumber.S,
            manufacturer: device.manufacturer.S,
            deviceType: device.deviceType.S
        };
    }

    function mapHealthProblemsFromDbEntity(item) {
        var dateTemp = new Date();
        dateTemp.setTime(parseInt(item.M.date.N));
        return {
            problemType: item.M.problemType.S,
            date: dateTemp,
            description: item.M.description.S
        };
    }

    //-----------------End Map From DbEntity-------------------


    module.exports = {
        //Todo-here to move db mapper from user model to here
        createUserFromDbEntity: function (dbEntity) {
            var createdDateTime = new Date();
            createdDateTime.setTime(dbEntity.createdDateTime.N);
            return {
                email: dbEntity.email.S,
                passwordHash: dbEntity.passwordHash.S,
                token: dbEntity.token.S,
                isActive: dbEntity.isActive.BOOL,
                name: dbEntity.name.S,
                surname: dbEntity.surname.S,
                onlineStatus: dbEntity.onlineStatus.S,
                createdDateTime: createdDateTime,
                userState: dbEntity.userState ? dbEntity.userState.S : null
            };
        },

        createUserDetailsDbEntityFromPatient: function (patient) {
            var patientDbEntity = {
                id: {S: patient.id},
                name: {S: patient.name},
                surname: {S: patient.surname},
                email: {S: patient.email}
            }

            if (patient.title) {
                patientDbEntity.title = {S: patient.title};
            }
            if (patient.dateOfBirth) {
                try {
                    var dateOfBirthNumber = patient.dateOfBirth.getTime().toString();
                    patientDbEntity.dateOfBirth = {N: dateOfBirthNumber};
                } catch (e) {
                    var dateOfBirthNumber = new Date(patient.dateOfBirth).getTime().toString();
                    patientDbEntity.dateOfBirth = {N: dateOfBirthNumber};
                }

            }
            // if (patient.sex) { patientDbEntity.dateOfBirth = {S:patient.sex}; } //not such field
            if (patient.gender) {
                patientDbEntity.gender = {S: patient.gender};
            }
            if (patient.ethnicity) {
                patientDbEntity.ethnicity = {S: patient.ethnicity};
            }
            if (patient.nhsNumber) {
                patientDbEntity.nhsNumber = {S: patient.nhsNumber};
            }
            if (patient.otherIdentifiers) {
                var allOtherIdentifiers = buildArray(patient.otherIdentifiers, mapOtherIdentifiersToDbEntity);
                patientDbEntity.otherIdentifiers = {L: allOtherIdentifiers};
            }
            if (patient.phone) {
                patientDbEntity.phone = {S: patient.phone};
            }
            /*if (patient.mobile)*/
            {
                patientDbEntity.mobile = buildDynamoDbString(patient.mobile);
            }
            if (patient.fax) {
                patientDbEntity.fax = buildDynamoDbString(patient.fax);
            }
            if (patient.relevantContacts) {
                var allRelevantContacts = buildArray(patient.relevantContacts, mapRelevantContactsToDbEntity);
                patientDbEntity.relevantContacts = {L: allRelevantContacts};
            }
            if (patient.communicationPreference) {
                patientDbEntity.communicationPreference = buildDynamoDbString(patient.communicationPreference);
            }
            if (patient.address) {
                var fullAddress = mapAddressToDbEntity(patient.address);
                patientDbEntity.address = {M: fullAddress};
            }
            if (patient.avatar) {
                patientDbEntity.avatar = buildDynamoDbString(patient.avatar);
            }
            if (patient.externalId) {
                patientDbEntity.externalId = buildDynamoDbString(patient.externalId);
            }
            if (patient.devices) {
                var allDevices = buildArray(patient.devices, mapDevicesToDbEntity);
                // patientDbEntity.devices = c;
            }

            if (patient.healthProblems) {
                var allHealthProblems = buildArray(patient.healthProblems, mapHealthProblemsToDbEntity);
                patientDbEntity.healthProblems = {L: allHealthProblems};
            }

            if (patient.weight) {
                patientDbEntity.weight = {S: patient.weight};
            }
            else {
                patientDbEntity.weight = {NULL: true};
            }

            if (patient.height) {
                patientDbEntity.height = {S: patient.height};
            }
            else {
                patientDbEntity.height = {NULL: true};
            }

            return patientDbEntity;
        },

        mapPatientFromUserDetailsDbEntity: function (dbEntity) {
            var dateOfBirthOriginal = new Date();
            if (dbEntity.dateOfBirth) {
                dateOfBirthOriginal.setTime(parseInt(dbEntity.dateOfBirth.N));
            }
            if (!dbEntity.otherIdentifiers) {
                dbEntity.otherIdentifiers = {L: []};
            }
            var allOtherIdentifiers = buildArray(dbEntity.otherIdentifiers.L, mapOtherIdentifiersFromDbEntity);
            if (!dbEntity.relevantContacts) {
                dbEntity.relevantContacts = {L: []};
            }
            var allRelevantContacts = buildArray(dbEntity.relevantContacts.L, mapRelevantContactsFromDbEntity);
            if (!dbEntity.address) {
                dbEntity.address = {
                    M: {
                        "id": {
                            "S": ""
                        },
                        "county": {
                            "S": ""
                        },
                        "postCode": {
                            "S": ""
                        },
                        "town": {
                            "S": ""
                        },
                        "addressLine2": {
                            "S": ""
                        },
                        "addressLine1": {
                            "S": ""
                        },
                        "country": {
                            "S": ""
                        },
                        "longitude": {
                            "NULL": true
                        },

                        "latitude": {
                            "NULL": true
                        }
                    }
                };
            }

            var fullAddress = mapAddressFromDbEntity(dbEntity.address.M);

            if (!dbEntity.devices) {
                dbEntity.devices = {L: []};
            }
            var allDevices = buildArray(dbEntity.devices.L, mapDevicesFromDbEntity);
            if (!dbEntity.healthProblems) {
                dbEntity.healthProblems = [];
            }

            var allHealthProblems;

            if (dbEntity.healthProblems) {
                allHealthProblems = buildArray(dbEntity.healthProblems.L, mapHealthProblemsFromDbEntity);
            }

            var checkNull = function (arg1) {
                if (arg1) return arg1.S;
                else return undefined;
            };

            var checkNumberNull = function (arg1) {
                if (arg1) return arg1.N;
                else return undefined;
            };

            var patient = domainModel.createPatient({
                    name: dbEntity.name.S,
                    surname: dbEntity.surname.S,
                    title: dbEntity.title ? dbEntity.title.S : dbEntity.title = " ",
                    dateOfBirth: dateOfBirthOriginal,
                    sex: checkNull(dbEntity.sex),
                    gender: dbEntity.gender ? dbEntity.gender.S : dbEntity.gender = "",
                    ethnicity: dbEntity.ethnicity ? dbEntity.ethnicity.S : dbEntity.ethnicity = "",
                    nhsNumber: dbEntity.nhsNumber ? dbEntity.nhsNumber.S : dbEntity.nhsNumber = "",
                    otherIdentifiers: allOtherIdentifiers,
                    phone: checkNull(dbEntity.phone),
                    mobile: checkNull(dbEntity.mobile),
                    fax: checkNull(dbEntity.fax),
                    email: dbEntity.email.S,
                    relevantContacts: allRelevantContacts,
                    communicationPreference: dbEntity.communicationPreference ? dbEntity.communicationPreference.S : dbEntity.communicationPreference = "",
                    address: fullAddress,
                    avatar: checkNull(dbEntity.avatar),
                    externalId: checkNull(dbEntity.externalId),
                    devices: allDevices,
                    weight: checkNull(dbEntity.weight),
                    height: checkNull(dbEntity.height)
                }
            );

            var _ = require('underscore');
            patient.healthProblems = [];
            _.forEach(allHealthProblems, function (healthProblem) {
                patient.healthProblems.push(healthProblem.problemType);
            });

            return patient;
        },
        mapAddressFromDbEntity: mapAddressFromDbEntity
    };
})();
