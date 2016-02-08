/**
 * Created by Victor on 08/02/2016.
 */
(function(){
    angular.module('app')
        .factory('calendarFactory',[function() {
            function getCurrentTimeString(dateTime) {
                var hours = dateTime.getHours();
                if (hours < 10)hours = '0' + hours;
                var minutes = dateTime.getMinutes();
                if (minutes < 10)minutes = '0' + minutes;
                var seconds = dateTime.getSeconds();
                if (seconds < 10)seconds = '0' + seconds;
                return hours + ':' + minutes + ':' + seconds;
            }
            return {
                getCurrentTimeString:getCurrentTimeString,
                getEvent:function(slotData, patientData){
                    var matchedSlot = _.find(patientData.result,function(slot) {
                        return slotData.slotDateTime === slot.slotDateTime;
                    });

                    var eventType;
                    if(matchedSlot) {
                        eventType = 'appointment';
                    }else if(slotData.countOfProviders > 0){
                        eventType = 'available';
                    }else {
                        eventType = 'noProvider';
                    }

                    var dateTime = new Date();
                    dateTime.setTime(slotData.slotDateTime);
                    var event = {
                        id: slotData.slotDateTime,
                        title: slotData.countOfProviders + " nurses are available.",
                        titleText: " nurses are available.",
                        slot: slotData,
                        start: getCurrentTimeString(dateTime),
                        icon: 'fa fa-calendar',
                        borderColor: '#000000'
                    };
                    switch(eventType){
                        case 'noProvider':
                            event.backgroundColor = 'red';
                            event.textColor = 'rgb(255,255,255)';
                            return event;
                            break;
                        case 'available':
                            event.backgroundColor = 'rgb(153,217,234)';
                            event.textColor = 'rgb(0,0,0)';
                            return event;
                            break;
                        case 'appointment':
                            event.backgroundColor = 'rgb(255,255,193)';
                            event.textColor = 'rgb(0,0,0)';
                            event.title = "You have booked the appointment at this time. " + matchedSlot.providerName + " will be with you. Please be online!";
                            return event;
                            break;
                    }
                }
            };
        }]);
})();
