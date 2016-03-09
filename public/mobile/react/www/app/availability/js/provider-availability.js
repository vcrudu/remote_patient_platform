/**
 * Created by Victor on 2/25/2016.
 */

(function () {
    "use strict";

    $.material.init();

    var ProviderAvailabilityCalendar = React.createClass({
        displayName: 'ProviderAvailabilityCalendar',

        handleProviderAvailability: function () {},

        componentDidMount: function () {
            var appointmentModalDiv = $(this.refs.appointmentModal);
            var appointmentModal = $(this.refs.appointmentModal).modal('hide');

            var currentDate = new Date();
            $(this.refs.appointmentsCalendar).fullCalendar({
                schedulerLicenseKey: '0220103998-fcs-1447110034',
                defaultView: 'nursesGrid',
                defaultTimedEventDuration: '00:15:00',
                allDaySlot: false,
                views: {
                    nursesGrid: {
                        type: 'agenda',
                        duration: { days: 1 },
                        slotDuration: '00:15',
                        slotLabelInterval: '00:15'
                    }
                },
                scrollTime: currentDate.getHours() + ':' + currentDate.getMinutes() + ':00',
                dayClick: function (calEvent, jsEvent, view) {

                    var now = new Date();
                    if (calEvent < now.getTime()) {
                        return;
                    }

                    var dateTitle = calEvent;
                    console.log(dateTitle);
                    $("span#modal-title-data").text(dateTitle);
                    // appointmentModalDiv.attr("data-slot-id", calEvent.id);
                    appointmentModal.modal('show');
                },
                events: function (start, end, timezone, callback) {
                    var events = [];
                    Bridge.getProviderSlots(start, end, function (slotsResult) {
                        if (!slotsResult.success) return;
                        console.log(slotsResult);
                        //aici va fi popularea calendarului cu evenimente
                    });
                },
                eventAfterAllRender: function (view) {},
                resources: [{ id: 'a', title: 'Availability' }]
            });
        },
        render: function () {
            return React.createElement(
                'div',
                null,
                React.createElement('div', { ref: 'appointmentsCalendar' }),
                React.createElement(
                    'div',
                    { ref: 'appointmentModal', id: 'appointmentModal', className: 'modal fade', role: 'dialog' },
                    React.createElement(
                        'div',
                        { className: 'modal-dialog' },
                        React.createElement(
                            'div',
                            { className: 'modal-content' },
                            React.createElement(
                                'div',
                                { className: 'modal-header' },
                                React.createElement(
                                    'button',
                                    { type: 'button', className: 'close', 'data-dismiss': 'modal' },
                                    '×'
                                ),
                                React.createElement(
                                    'h4',
                                    { className: 'modal-title' },
                                    'Set availability ',
                                    React.createElement('span', { id: 'modal-title-data' }),
                                    ' '
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'modal-body' },
                                React.createElement(
                                    'div',
                                    { className: 'form-group is-empty' },
                                    React.createElement(
                                        'label',
                                        { htmlFor: 'reasonText', className: 'control-label' },
                                        'Availability'
                                    ),
                                    React.createElement('textarea', { className: 'form-control', rows: '3', id: 'reasonText', ref: 'reasonText' }),
                                    React.createElement(
                                        'span',
                                        { className: 'note' },
                                        'Example: 08:00 - 12:00, 13:00-17:00 '
                                    ),
                                    React.createElement('input', { type: 'hidden', id: 'slotId' })
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'modal-footer' },
                                React.createElement(
                                    'button',
                                    { type: 'button', className: 'btn btn-default', 'data-dismiss': 'modal' },
                                    'Close'
                                ),
                                React.createElement(
                                    'button',
                                    { type: 'button', className: 'btn btn-primary', onClick: this.handleProviderAvailability },
                                    'Submit',
                                    React.createElement('div', { className: 'ripple-container' })
                                )
                            )
                        )
                    )
                )
            );
        }
    });

    ReactDOM.render(React.createElement(ProviderAvailabilityCalendar, null), document.getElementById("provider-availability"));
})();