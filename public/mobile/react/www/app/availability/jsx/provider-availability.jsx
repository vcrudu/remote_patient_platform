/**
 * Created by Victor on 2/25/2016.
 */

(function() {
    "use strict";

    $.material.init();

    var ProviderAvailabilityCalendar = React.createClass({
        validateTimeString: function() {
            var reasonText = $(this.refs.availabilityText);
            var scheduleValue=reasonText.val();
            var re = /((([0-1][0-9])|([2][0-3])):([0-5][0-9]))(\s)*[-](\s)*((([0-1][0-9])|([2][0-3])):([0-5][0-9]))/g;
            var match = re.exec(scheduleValue);

            if(match){
                $( "#modal-submit" ).prop( "disabled", false );
            } else {
                $( "#modal-submit" ).prop( "disabled", true );
            }

        },
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
                    var dateTitle="Edit availability "+moment(calEvent._start._d).format("DD[/]MM[/]YYYY");
                    $(".modal-title").text(dateTitle);

                    var calendarDate = $(component.refs.availabilityCalendar).fullCalendar("getDate")._d;
                    var availabilityText = component.getTodayAvailability(calendarDate);
                    availabilityTextInput.val(availabilityText);

                    $("#currentSchedule").html(availabilityText);
                    if (!availabilityText || availabilityText == "") {
                        $("#modal-body-header").hide();
                    }
                    else {
                        $("#modal-body-header").show();
                    }

                    availabilityModal.modal('show');
                },
                dayClick: function (calEvent, jsEvent, view) {
                    var now = new Date();
                    if (calEvent < now.getTime()) {
                        return;
                    }

                    var dateTitle="Set availability "+moment(calEvent._d).format("DD[/]MM[/]YYYY");//formattedDate(calEvent);

                    $(".modal-title").text(dateTitle);

                    var dateTitle="Set availability "+moment(calEvent._d).format("DD[/]MM[/]YYYY");
                    $("span#modal-title-data").text(dateTitle);

                    var calendarDate = $(component.refs.availabilityCalendar).fullCalendar("getDate")._d;
                    var availabilityText = component.getTodayAvailability(calendarDate);
                    availabilityTextInput.val(availabilityText);

                    $("#currentSchedule").html(availabilityText);
                    if (!availabilityText || availabilityText == "") {
                        $("#modal-body-header").hide();
                    }
                    else {
                        $("#modal-body-header").show();
                    }

                    availabilityModal.modal('show');

                    $( "#modal-submit" ).prop( "disabled", true );
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
                    })},
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
            return <div>
                <div ref="availabilityCalendar" id="calendar"></div>
                <div ref="appointmentModal" id="appointmentModal" className="modal fade" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                                <h4 className="modal-title"></h4>
                            </div>
                            <div className="modal-body">

                                <div className="form-group is-empty">
                                    <header id="modal-body-header">Current schedule:
                                        <span id="currentSchedule"></span>
                                    </header>
                                    <label htmlFor="availabilityText" className="control-label">Availability</label>
                                    <textarea className="form-control" rows="3" id="availabilityText" ref="availabilityText" onChange={this.validateTimeString}></textarea>
                                    <span className="note">Example: 08:00-12:00, 13:00-17:00 </span>
                                    <input type="hidden" id="slotId"/>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" id="modal-submit" onClick={this.handleProviderAvailability}>Submit<div className="ripple-container"></div></button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        }
    });

    ReactDOM.render(<ProviderAvailabilityCalendar />, document.getElementById("provider-availability"));
})();