/**
 * Created by Victor on 2/25/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var TimeSelector = React.createClass({
        setTime: function(date) {
            //var changeTimePicker = $(this.refs.changeTimePicker);
            //changeTimePicker.mobiscroll("setVal", date);
            //changeTimePicker.mobiscroll("setDate", date, true)
        },
        handleShow: function() {
            var changeTimePicker = $(this.refs.changeTimePicker);
            changeTimePicker.mobiscroll('show');
            return false;
        },
        componentDidMount: function() {
            var changeTimePicker = $(this.refs.changeTimePicker);
            var component = this;
            var initRange1=new Date(new Date().setHours(8));
            var initRange2=new Date(new Date().setHours(17));
            changeTimePicker.mobiscroll().range({
                theme: "material",
                display: "bottom",
                controls: ['time'],
                timeFormat:'HH',
                defaultValue: [initRange1,initRange2],
                steps: {
                    minute: 60,
                    zeroBased: true
                },
                onSelect: function (valueText, inst) {
                    component.props.onSelectTimeCallback(valueText, inst);
                },
                maxWidth: 100,
                onBeforeShow:function(inst){
                    console.log(inst);
                    if(inst.haveRange) {
                        var start=inst.haveRange.intervals.split(':');
                        var first=new Date(new Date().setHours(start[0],0,0,0));
                        var second=start[1].split('-');
                        var end=new Date(new Date().setHours(second[1],0,0,0));
                        inst.setVal([new Date(new Date().setHours(start[0],0,0,0)), end]);
                        inst.haveRange=null;

                    }else{
                        inst.setVal([initRange1,initRange2]);
                    }
                },

            });
        },
        render: function() {
            return <div className="show-avaialbility-mobiscroll-wrapper">
                <input id="changeTimePicker" ref="changeTimePicker" className="hide"/>
                <button id="show" ref="show" onClick={this.handleShow} className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored show-availability-mobiscroll"><i className="material-icons">add</i></button>
            </div>
        }
    });



    var ProviderAvailabilityCalendar = React.createClass({

        getTodayAvailability: function(date) {
            var startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
            var endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
            var todayEvents = $(this.refs.availabilityCalendar).fullCalendar('clientEvents', function (anEvent) {
                if (anEvent.start && anEvent.start.toDate() >= startDate
                    && anEvent.start.toDate() <= endDate) {
                    return true
                }
            });

            if(todayEvents.length==0) return null;

            var availabilityString = '';

            _.forEach(todayEvents, function (todayEvent) {
                availabilityString += todayEvent.title + ',';
            });

            availabilityString = availabilityString.substring(0,availabilityString.length-1);
            return availabilityString;
        },
        onTimeChanged: function(valueText, inst) {
            var availabilityCalendarDiv = $(this.refs.availabilityCalendar);
            var dateString = moment(availabilityCalendarDiv.fullCalendar("getDate")).format("DD[.]MM[.]YYYY");
            var inputTimeRange=valueText.split(" ");
            var availabilityString=inputTimeRange[0]+':00-'+inputTimeRange[2]+':00';
            Bridge.providerSetAvailability({availabilityString: availabilityString, dateString: dateString }, function(result) {
                availabilityCalendarDiv.fullCalendar("refetchEvents");
            });

            //console.log(timeRange,dateString);
           // $(this.refs.avalabilityCalendar).fullCalendar("gotoDate", date);
        },
        handleProviderAvailability: function() {
            var availabilityModalDiv = $(this.refs.appointmentModal);
            var availabilityCalendarDiv = $(this.refs.availabilityCalendar);
            var availabilityText = $(this.refs.availabilityText);

            var modalTitle = $(".modal-title").html();
            var oldAvailability = $("#currentSchedule").html();
            var availabilityString = availabilityText.val();
            var dateString = moment(availabilityCalendarDiv.fullCalendar("getDate")).format("DD[.]MM[.]YYYY");
            var submitMode = modalTitle.split(" ");

            if(submitMode[0] == "Set"){
               Bridge.providerSetAvailability({availabilityString: availabilityString, dateString: dateString }, function(result) {
                       availabilityCalendarDiv.fullCalendar("refetchEvents");
                       availabilityModalDiv.modal('hide');
                   });
            }
            else {
                Bridge.providerUpdateAvailability({availabilityString: availabilityString, dateString: dateString, oldAvailabilityString: oldAvailability}, function(result) {
                    availabilityCalendarDiv.fullCalendar('refetchEvents' );
                    availabilityModalDiv.modal('hide');
                });
            }
        },
        componentDidMount: function() {
            var appointmentModalDiv = $(this.refs.appointmentModal);
            var availabilityModal = $(this.refs.appointmentModal).modal('hide');
            var availabilityTextInput = $(this.refs.availabilityText);

            var currentDate = new Date();
            var component = this;
            $(this.refs.availabilityCalendar).fullCalendar({
                schedulerLicenseKey: '0220103998-fcs-1447110034',
                defaultView: 'nursesGrid',
                defaultTimedEventDuration: '01:00:00',
                allDaySlot: false,
                header:{
                    left: 'prev,next',
                    center: 'title',
                    right: 'today'
                },
                allDay:false,
                views: {
                    nursesGrid: {
                        type: 'agenda',
                        duration: {days: 1},
                        slotDuration: '01:00',
                        slotLabelInterval: '01:00'
                    }
                },
                scrollTime: currentDate.getHours() + ':' + currentDate.getMinutes() + ':00',
                eventClick: function (calEvent, jsEvent, view) {

                    var range = calEvent.availability;
                    var timeSelector = component.refs.timeSelector;
                    if (timeSelector) {
                        var changeTimePicker = $(timeSelector.refs.changeTimePicker);
                        var inst = $(timeSelector.refs.changeTimePicker).mobiscroll('getInst');
                        if (changeTimePicker && changeTimePicker.length > 0){
                            inst.haveRange=range;
                            inst.show();

                        }
                    }


                },

                events: function (start, end, timezone, callback) {
                    var events = [];
                    Bridge.getProviderSlots(start,end,function (result) {
                        if (result.success) {
                            for (var i = 0; i < result.data.length; i++) {
                                var intervals = result.data[i].intervals.split("-");
                                events.push({
                                    availability: result.data[i],
                                    title: result.data[i].intervals,
                                    start: intervals[0]+':00',
                                    end: intervals[1]+':00',
                                    allDay:true,
                                    icon: 'fa fa-calendar',
                                    className: ["event", 'bg-color-' + 'greenLight'],
                                    backgroundColor:'green'
                                });
                            }

                            callback(events);
                        }
                    });
                    //component.refs["dateSelector"].setTime(start._d);
        },
                eventRender: function(event, element) {
                    element.find('.fc-event-title').append("<br/>" + event.location);
                    element.find('.fc-time').hide();
                },
                eventAfterAllRender: function (view) {
                },
                resources: [
                    {id: 'a', title: 'Availability'}
                ]
            });
        },
        render: function() {
            return <div ref="appointmentsCalendarWrapper">
                <div ref="availabilityCalendar" id="calendar"></div>

                <TimeSelector ref="timeSelector" onSelectTimeCallback={this.onTimeChanged}/>
            </div>
        }
    });

    ReactDOM.render(<ProviderAvailabilityCalendar />, document.getElementById("provider-availability"));
})();