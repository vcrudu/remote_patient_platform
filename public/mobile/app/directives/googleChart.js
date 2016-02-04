/**
 * Created by Victor on 27/10/2015.
 */

angular.module('mobileApp').directive('googleChart', [
    '$timeout', '$window', '$rootScope', function($timeout, $window, $rootScope) {

        var convertUtcTimeToLocalTime = function(milleseconds) {
            var convertdLocalTime = new Date(milleseconds);

            convertdLocalTime.setHours(convertdLocalTime.getHours());/* - hourOffset)*/;

            return convertdLocalTime;
        };

        function getChartType(data) {
            return "google.charts.Line";
            /*var chartType = '';
            switch (data.deviceType) {
                case 'bloodPressure':
                    chartType = 'google.charts.Line';
                    break;
                default:
                    chartType = 'google.charts.Line';
                    break;
            }

            return chartType;*/
        }

        function getChartLabel(deviceType) {
            var chartLabel = '';

            switch (deviceType.toLowerCase()) {
                case 'bloodoxygen':
                    chartLabel = 'Blood Oxigen';
                    break;
                case 'heartrate':
                    chartLabel = 'Heart Rate';
                    break;
                case 'bloodglucose':
                    chartLabel = 'Blood Glucose';
                    break;
                case 'respiratoryrate':
                    chartLabel = 'Respiratory Rate';
                    break;
                case 'temperature':
                    chartLabel = 'Temperature';
                    break;
                case 'weight':
                    chartLabel = 'Weight';
                    break;
                case 'bloodpressure':
                    chartLabel = 'Blood Pressure';
                    break;
            }

            return chartLabel;
        }

        function getVAxis(data) {
            switch (data.deviceType) {
                case 'bloodglucose':
                    return { minValue: 0, maxValue: 35 };
                case 'temperature':
                    return { minValue: 0, maxValue: 40 };
                default:
                    return { minValue: 0, maxValue: 200 };
            }
        }

        function getChartOptions(data) {

            var options = {
                /*'title': data.deviceName,*/
                /*'tooltip': { isHtml: true },*/
                'height': 300,
                'pointSize': 5,
                'curveType': 'function',
                'legend': { position: 'right' },
                'vAxis': getVAxis(data),
                'hAxis': {
                    format: 'MM/dd/yyyy'
                }
            };

            return options;
        }

        function getControlOptions(data) {
            var options = {
                'filterColumnIndex': 0,
                'ui': {
                    'chartType': getChartType(data),
                    'chartOptions': {
                        'chartArea': { 'width': '90%' },
                        'hAxis': { 'baselineColor': 'none', 'format': 'MM/dd/yyyy' }
                    },
                    // 1 day in milliseconds = 24 * 60 * 60 * 1000 = 86,400,000
                    'minRangeSize': 86400000
                }
            };

            return options;
        }

        function createTooltip(dateTime, value, label) {
            return '[' + label + ']: ' + value + ' on ' + (dateTime.getMonth() + 1) + '/' + dateTime.getDate() + '/' + dateTime.getFullYear() + ' ' + dateTime.getHours() + ':' + dateTime.getMinutes();
        }

        function prepareData(dashboard) {
            var dataToReturn = {};

            var chartValues = [];

            if (dashboard.data && dashboard.data.Measurements) {
                angular.forEach(dashboard.data.Measurements, function (value, index) {
                    var dateTime = convertUtcTimeToLocalTime(value.UnixSessionDate);
                    switch (dashboard.deviceType) {
                        case 'bloodPressure':
                            chartValues.push(
                                {
                                    "c":
                                        [
                                            { "v": dateTime },
                                            { "v": value.FirstValue },
                                            { "v": createTooltip(dateTime, value.FirstValue, 'Systolic') },
                                            /*{ "v": value.FirstValue },*/
                                            { "v": value.SecondValue },
                                            { "v": createTooltip(dateTime, value.SecondValue, 'Diastolic') }
                                            /*{ "v": value.SecondValue }*/
                                        ]
                                }
                            );
                            break;
                        default:
                            chartValues.push(
                                {
                                    "c":
                                        [
                                            { "v": convertUtcTimeToLocalTime(value.UnixSessionDate) },
                                            { "v": value.FirstValue },
                                            { "v": createTooltip(dateTime, value.FirstValue, getChartLabel(dashboard.deviceType)) }
                                            /*{ "v": value.FirstValue }*/
                                        ]
                                }
                            );
                            break;
                    }
                });
                chartValues = window._.sortBy(chartValues,function(val){return val.c[0].v;});
                switch (dashboard.deviceType) {
                    case 'bloodPressure':
                        dataToReturn = {
                            "cols": [
                                {
                                    "id": "datetime",
                                    "label": "DateTime",
                                    "type": "date",
                                    "p": {},
                                },
                                {
                                    "id": "firstvalue",
                                    "label": "Systolic",
                                    "type": "number",
                                    "p": {}
                                },
                                {
                                    "id": "tooltip_firstvalue",
                                    "type": "string",
                                    "role": "tooltip",
                                    "p": {'html': false}
                                },
                                /*{
                                 "id": "anotation_firstvalue",
                                 "type": "string",
                                 "role": "annotation",
                                 "p": { 'html': false }
                                 },*/
                                {
                                    "id": "secondvalue",
                                    "label": "Diastolic",
                                    "type": "number",
                                    "p": {}
                                },
                                {
                                    "id": "tooltip_secondvalue",
                                    "type": "string",
                                    "role": "tooltip",
                                    "p": { 'html': false }
                                }/*,
                                 {
                                 "id": "anotation_secondvalue",
                                 "type": "string",
                                 "role": "annotation",
                                 "p": { 'html': false }
                                 }*/
                            ],
                            "rows": chartValues
                        };
                        break;
                    default:
                        dataToReturn = {
                            "cols": [
                                {
                                    "id": "datetime",
                                    "label": "DateTime",
                                    "type": "date",
                                    "p": {},
                                },
                                {
                                    "id": "firstvalue",
                                    "label": getChartLabel(dashboard.deviceType),
                                    "type": "number",
                                    "p": {}
                                },
                                {
                                    "id": "tooltip_firstvalue",
                                    "type": "string",
                                    "role": "tooltip"
                                }
                            ],
                            "rows": chartValues
                        };
                        break;
                }
            }
            return dataToReturn;
        }

        function getMinDate(dashboard) {

            var minDateTime = new Date();

            if (dashboard.data && dashboard.data.Measurements) {

                angular.forEach(dashboard.data.Measurements, function (value, index) {
                    if (index == 0) {
                        minDateTime = convertUtcTimeToLocalTime(value.UnixSessionDate);
                    } else {
                        var tempDate = convertUtcTimeToLocalTime(value.UnixSessionDate);
                        if (tempDate < minDateTime) {
                            minDateTime = tempDate;
                        }
                    }
                });
            }
            if(!minDateTime){
                minDateTime= new Date();
            }
            return minDateTime;
        }

        function getMaxDate(dashboard) {

            var maxDateTime;

            if (dashboard.data && dashboard.data.Measurements) {

                angular.forEach(dashboard.data.Measurements, function (value, index) {
                    if (index == 0) {
                        maxDateTime = convertUtcTimeToLocalTime(value.UnixSessionDate);
                    } else {
                        var tempDate = convertUtcTimeToLocalTime(value.UnixSessionDate);

                        if (tempDate > maxDateTime) {
                            maxDateTime = tempDate;
                        }
                    }
                });
            }
            if(!maxDateTime){
                maxDateTime= new Date();
            }
            return maxDateTime;
        }

        return {
            transclude: true,
            restrict: 'E',
            replace: true,
            scope: {
                dashboard: '=dashboard',
                chartid: '=chartid'
            },
            template: '<div id="dashboard_{{chartid}}"><div id="chart_{{chartid}}"></div><div id="control_{{chartid}}" style="height: 50px;margin-bottom:10px;"></div><div id="slider_{{chartid}}"  style="margin-right:50px;margin-left:50px;margin-bottom:10px;"></div></div>',
            link: function ($scope, element, attrs) {
                $scope.$watch(function () {
                    if ($scope && $scope.dashboard && $scope.dashboard.data) {
                        $scope.googleDashboard = {
                            data: prepareData($scope.dashboard),
                            chartOptions: getChartOptions($scope.dashboard),
                            controlOptions: getControlOptions($scope.dashboard),
                            type: getChartType($scope.dashboard),
                        };

                        return $scope.googleDashboard;
                    }
                    return $scope.googleDashboard;
                }, function() {
                    draw();
                }, true); // true is for deep object equality checking

                function draw() {
                    if ('chart_' + $scope.chartid == element[0].childNodes[0].getAttribute("id")) {
                        if (!draw.triggered && $scope.googleDashboard) {
                            draw.triggered = true;
                            $timeout(function() {
                                var chartWrapperArgs = {
                                    chartType: $scope.googleDashboard.type,
                                    options: $scope.googleDashboard.chartOptions,
                                    containerId: element[0].childNodes[0].getAttribute("id")
                                };

                                $scope.chartWrapper = new google.visualization.ChartWrapper(chartWrapperArgs);

                                $scope.controlWrapper = new google.visualization.ControlWrapper({
                                    'controlType': 'ChartRangeFilter',
                                    'containerId': element[0].childNodes[1].getAttribute("id"),
                                    'options': $scope.googleDashboard.controlOptions,
                                    /*'state': { 'range': { 'start': new Date(2014, 9, 9), 'end': new Date(2014, 9, 10) } }*/
                                });

                                $timeout(function () {
                                    var minDate = getMinDate($scope.dashboard);
                                    var maxDate = getMaxDate($scope.dashboard);

                                    var minDateForSlider = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
                                    var maxDateForSlider = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());

                                    maxDateForSlider.setDate(maxDateForSlider.getDate() + 1);

                                    $scope.chartDashboard = new google.visualization.Dashboard(element[0]);
                                    $scope.chartDashboard.bind($scope.controlWrapper, $scope.chartWrapper);
                                    $scope.chartDashboard.draw($scope.googleDashboard.data);
                                    draw.triggered = false;

                                    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

                                    if (isMobile) {
                                        jQuery('#slider_' + $scope.chartid).show();
                                        jQuery('#control_' + $scope.chartid).hide();

                                        jQuery('#slider_' + $scope.chartid).dateRangeSlider({
                                            bounds: {
                                                min: minDateForSlider,
                                                max: maxDateForSlider
                                            },
                                            defaultValues: {
                                                min: minDateForSlider,
                                                max: maxDateForSlider
                                            },
                                            step: {
                                                days: 1
                                            },
                                            arrows: true,
                                            wheelMode: null
                                        }).bind('valuesChanged', function(e, data) {
                                            $scope.controlWrapper.setState({ range: { start: data.values.min, end: data.values.max } });
                                            $scope.controlWrapper.draw();
                                        });
                                    } else {
                                        jQuery('#slider_' + $scope.chartid).hide();
                                        jQuery('#control_' + $scope.chartid).show();
                                    }
                                });

                            }, 50, true);
                        }
                    }
                }

                angular.element($window).bind('resize', function () {
                    $rootScope.$emit('resizeMsg');
                });

                var resizeHandler = $rootScope.$on('resizeMsg', function () {
                    $timeout(function () {
                        if ($scope.chartWrapper) {
                            draw();
                        }
                    },50);
                });

                $scope.$on('$destroy', function() {
                    resizeHandler();
                });

                $scope.$on('newMeasurement', function(evt, history) {
                    if ($scope.chartid === history.Id) {
                        $scope.dashboard = history.dashboard;
                        $scope.$apply();
                    }
                });
            }
        };
    }]);