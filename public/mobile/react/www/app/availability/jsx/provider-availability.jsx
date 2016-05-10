/**
 * Created by Victor on 2/25/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var TimeSelector = React.createClass({

        handleShow: function() {

                var changeTimePicker = $(this.refs.changeTimePicker);
                var inst = changeTimePicker.mobiscroll('getInst');
                if (changeTimePicker && changeTimePicker.length > 0){
                    inst.haveRange=null;
                    inst.show();

                }


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

                    if(inst.haveRange) {
                        var first=inst.haveRange.intervals.split(':');
                        var start=new Date(new Date().setHours(first[0],0,0,0));
                        var second=first[1].split('-');
                        var end=new Date(new Date().setHours(second[1],0,0,0));
                        inst.setVal([start, end]);


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
            if(!inst.haveRange) {
                Bridge.providerSetAvailability({
                    availabilityString: availabilityString,
                    dateString: dateString
                }, function (result) {
                    availabilityCalendarDiv.fullCalendar("refetchEvents");
                });
            } else {
                var oldAvailability=inst.haveRange.intervals;
                Bridge.providerUpdateAvailability({
                    availabilityString: availabilityString,
                    dateString: dateString,
                    oldAvailabilityString: oldAvailability
                }, function(result) {
                    availabilityCalendarDiv.fullCalendar('refetchEvents' );

                });
            }

        },
        isToday: function (td){
            var d = new Date();
            return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
        },
        componentDidMount: function() {
            var component = this;

            $(component.refs.availabilityCalendar).on("swipeleft" , function(event) {
                $(component.refs.availabilityCalendar).fullCalendar("next");
            });

            $(component.refs.availabilityCalendar).on("swiperight", function(event) {
                var defDate = $(component.refs.availabilityCalendar).fullCalendar("getDate")._d;
                if (component.isToday(defDate)) {return;}
                $(component.refs.availabilityCalendar).fullCalendar("prev");
            });

            var currentDate = new Date();
            $(this.refs.availabilityCalendar).fullCalendar({
                schedulerLicenseKey: '0220103998-fcs-1447110034',
                defaultView: 'nursesGrid',
                defaultTimedEventDuration: '01:00:00',
                allDaySlot: false,
                height: $(window).height() - 3,
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