/**
 * Created by Victor on 06/08/2015.
 */
var HealthProfessional                = require('../model').HealthProfessional;
var assert                            = require('assert');

(function(){

    describe("Test health professional entity", function () {
        describe("All constructing arguments are valid", function () {
            var healthProfessionalUnderTest;
            before(function () {
                healthProfessionalUnderTest = new HealthProfessional({
                    //ToDo-here provide valid arguments
                });
            });

            it("Properties are valid", function () {
                //ToDo-here test properties are valid
            });
        });

        describe("Invalid health professional type", function () {
            it("Throw invalid professional type", function () {
                var healthProfessionalUnderTest = new HealthProfessional({
                    //ToDo-here provide invalid professional type
                });
            });
        });
    });
})();