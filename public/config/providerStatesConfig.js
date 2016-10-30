/**
 * Created by Victor on 14/07/2015.
 */

angular.module('app').config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state("provider", {
        url: "/provider",
        views: {
            "headerView": {templateUrl: "provider/provider.header.html"},
            "mainView": {templateUrl: "provider/provider.html"},
            "asideView": {templateUrl: "asideNav.html"}
        }
    }).state("provider.availability", {
        url: "/provider.availability",
        templateUrl: "provider/availability/provider.availability.html",
        controller: 'providerAvailabilityCtrl',
        controllerAs: 'vm'
    }).state("provider.appointments", {
        url: "/provider.appointments",
        templateUrl: "provider/appointments/provider.appointments.view.html",
        controller: 'providerAppointmentsViewCtrl',
        controllerAs: 'vm'
    }).state("provider.patient", {
        url: "/patient/:userName",
        templateUrl: "provider/appointments/provider.appointments.patient.html",
        controller: 'providerAppointmentsPatientViewCtrl'
    }).state("provider.settings", {
        url: "/provider.settings",
        templateUrl: "provider/settings/provider.settings.html",
        controller: 'providerSettingsCtrl'
    }).state("provider.alarm_list", {
        url: "/provider.alarm_list",
        templateUrl: "provider/alarms/provider.alarm.list.html",
        controller: "providerAlarmListCtrl"
    }).state("provider.alarm_builder", {
        url: "/provider.alarm_builder",
        templateUrl: "provider/alarms/provider.alarm.builder.html",
        controller: "providerAlarmBuilderCtrl"
    }).state("provider.group_alarm_builder", {
        url: "/provider.group_alarm_builder",
        templateUrl: "provider/alarms/provider.group.alarm.builder.html",
        controller: "providerGroupAlarmBuilderCtrl"
    }).state("provider.alarm_builder_edit", {
        url: "/provider.alarm_builder/:alarmName",
        templateUrl: "provider/alarms/provider.alarm.builder.html",
        controller: "providerAlarmBuilderCtrl"
    }).state("provider.call", {
        url: "/provider.call",
        templateUrl: "provider/appointments/provider.call.html",
        controller: 'providerCallCtrl as vm'
    }).state("provider.patients_groups", {
        url: "/patients_groups",
        templateUrl: "provider/patients_groups/provider.patients_groups.html",
        controller: 'providerPatientsGroupsCtrl'
    }).state("provider.patients_groups_members", {
        url: "/patients_groups/:groupName",
        templateUrl: "provider/patients_groups/provider.patients_group_members_and_alarm_rules.html",
        controller: 'providerPatientsGroupMembersCtrl'
    }).state("provider.patients_groups_members.members", {
        url: "/members",
        templateUrl: "provider/patients_groups/provider.patients_group_members.html"/*,
         controller: 'providerPatientsGroupMembersCtrl'*/
    }).state("provider.patients_groups_members.groupalarmrules", {
        url: "/alarms",
        templateUrl: "provider/alarms/provider.group.alarm.list.html",
        controller: "providerGroupAlarmList"
    }).state("provider.patients_groups_members.schedules", {
        url: "/schedules",
        templateUrl: "provider/alarms/provider.group.schedule.list.html",
        controller: "providerGroupScheduleList"
    }).state("provider.patients_groups_members.alarmbuilder", {
        url: "/alarmbuilder",
        templateUrl: "provider/alarms/provider.group.alarm.builder.html",
        controller: "providerGroupAlarmBuilderCtrl"
    }).state("provider.patients_groups_members.schedulebuilder", {
        url: "/schedulebuilder",
        templateUrl: "provider/alarms/provider.group.schedule.builder.html",
        controller: "providerGroupScheduleBuilderCtrl"
    }).state("provider.patients_groups_members.alarmbuilder_edit", {    // state("provider.group_alarm_builder_edit", {
        url: "/alarmbuilder_edit/:alarmName",
        templateUrl: "provider/alarms/provider.group.alarm.builder.html",
        controller: "providerGroupAlarmBuilderCtrl"
    }).state("provider.patients_groups_members.schedulebuilder_edit", {
        url: "/schedulebuilder_edit/:scheduleName",
        templateUrl: "provider/alarms/provider.group.schedule.builder.html",
        controller: "providerGroupScheduleBuilderCtrl"
    }).state("provider.home", {
        url: "/provider.home",
        templateUrl: "provider/home/provider.home.html"
    }).state("provider.home.inbox", {
        url: "/provider.home.inbox",
        templateUrl: "provider/home/provider.home.inbox.html",
        controller: 'providerHomeInboxCtrl as vm'
    }).state("provider.home.message", {
        url: "/provider.home.message",
        templateUrl: "provider/home/provider.home.message.html",
        controller: 'providerHomeMessageCtrl as vm'
    });
}]);
