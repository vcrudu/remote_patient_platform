/**
 * Created by Victor on 19/05/2015.
 */
angular.module('app').directive('smartDatepicker', function () {
        return {

            restrict: 'A',
            compile: function (tElement, tAttributes) {
                tElement.removeAttr('smartDatepicker');

                var onSelectCallbacks = [];
                if (tAttributes.minRestrict) {
                    onSelectCallbacks.push(function (selectedDate) {
                        $(tAttributes.minRestrict).datepicker('option', 'minDate', selectedDate);
                    });
                }
                if (tAttributes.maxRestrict) {
                    onSelectCallbacks.push(function (selectedDate) {
                        $(tAttributes.maxRestrict).datepicker('option', 'maxDate', selectedDate);
                    });
                }

                var options = {
                    prevText: '<i class="fa fa-chevron-left"></i>',
                    nextText: '<i class="fa fa-chevron-right"></i>',
                    onSelect: function (selectedDate) {
                        angular.forEach(onSelectCallbacks, function (callback) {
                            callback.call(this, selectedDate);
                        });
                    }
                };

                if (tAttributes.numberOfMonths) options.numberOfMonths = parseInt(tAttributes.numberOfMonths);

                if (tAttributes.dateFormat) options.dateFormat = tAttributes.dateFormat;

                if (tAttributes.defaultDate) options.defaultDate = tAttributes.defaultDate;

                if (tAttributes.changeMonth) options.changeMonth = tAttributes.changeMonth == "true";

                if (tAttributes.changeYear) options.changeYear = tAttributes.changeYear == "true";

                tElement.datepicker(options);
            }
        };
});
