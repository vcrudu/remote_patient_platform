/**
 * Created by Victor on 01/10/2015.
 */

(function() {
    module.exports = function (args) {
        assert.ok(args.date, "Date is required");
        assert.ok(args.slot === 0 || args.slot === 1 || args.slot === 2 || args.slot === 3,
            "Slot should be an integer number between 0 and 3");
        assert.ok(args.providerId, "Provider is required");
        var self = this;
        self.providerId = args.providerId;
        self.datetime = args.date;
        self.startTime = args.startTime;
        self.patientId = args.patientId;
        self.getSlotId = function () {
            var dateTime = new Date(self.date.year, self.date.month, self.day);
            return self.day.toString() + self.date.month.toSource() + self.date.year.toSource()
                + '#' + self.hour.toSource() + '#' + self.slot.toString();
        };
    }
})();