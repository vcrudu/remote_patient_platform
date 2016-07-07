/**
 * Created by Victor on 7/7/2016.
 */

(function() {

    var patientSymptomsRepository = require('../repositories').PatientSymptomsRepository;

    function addPatientSymptoms(evidence, callback) {
        patientSymptomsRepository.save(evidence, function (err, data) {
            if (err) {
                callback(err, null);
            }
            else {
                callback(null, data);
            }
        });
    }

    module.exports = {
        addPatientSymptoms:addPatientSymptoms
    }
})();