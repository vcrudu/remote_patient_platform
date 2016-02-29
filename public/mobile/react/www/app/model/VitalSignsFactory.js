/**
 * Created by Victor on 2/26/2016.
 */

var VitalSignsFactory = {};

VitalSignsFactory.createEmptyVitalSings = function() {
    var objectToReturn = {
        temperatureVitalSignsDef: {
            label: "Temperature",
            measurementType:"temperature",
            unit: "&#176;C",
            minValue: 30,
            maxValue: 43,
            values: []
        },
        bloodPressureDef: {
            label: "Blood Pressure",
            measurementType:"bloodPressure",
            unit: "mmHg",
            minValue: 50,
            maxValue: 150,
            values: []
        }
    };

    return objectToReturn;
}

VitalSignsFactory.createVitalSings = function(data) {

    var objectToReturn = this.createEmptyVitalSings();

    if (data) {
        var sortedResult = _.sortBy(data, function(item) {
            return item.utcDateTime;
        });

        _.each(sortedResult, function(item) {
            switch (item.measurementType)
            {
                case "temperature":
                    objectToReturn.temperatureVitalSignsDef.values.push({
                        value: item.value,
                        time: item.utcDateTime
                    });
                    break;
                case "bloodPressure":
                    objectToReturn.bloodPressureDef.values.push({
                        value: {
                            systolic: item.value.systolic,
                            diastolic: item.value.diastolic
                        },
                        time: item.utcDateTime
                    });
                    break;
            }
        })
    }

    return objectToReturn;
}