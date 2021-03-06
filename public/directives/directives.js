angular.module('app')
    .directive('basketAmount', function ($rootScope, BasketService) {
        return {
            restrict: 'AE',
            template: '<span class="badge bg-color-green" ng-if="basket.getAmount() >0 ">{{basket.getAmount() | number :2}}&pound</span>',
            replace: true,
            link: function (scope, elm, attrs) {

                $rootScope.$on('basketChanged', function () {
                    scope.basket = BasketService.getBasket();
                });

            }
        };
    })
    .directive('smartMaskedInput', function () {
        return {
            restrict: 'A',
            compile: function (tElement, tAttributes) {
                tElement.removeAttr('smart-masked-input data-smart-masked-input');

                var options = {};
                if (tAttributes.maskPlaceholder) options.placeholder = tAttributes.maskPlaceholder;
                tElement.mask(tAttributes.smartMaskedInput, options);
            }
        };
    })
    .directive('scheduleTime',function(){
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl){
                ctrl.$validators.scheduleTime = function(modelValue, viewValue){
                    if(!modelValue)
                    return true;
                    var re = /((([0-1][0-9])|([2][0-3])):([0-5][0-9]))(\s)*[-](\s)*((([0-1][0-9])|([2][0-3])):([0-5][0-9]))/g;
                    return re.test(modelValue);
                };
            }
        };
    })
    .directive('formatIntervals',function(){
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl){

                function toModel(value) {
                    var re = /(((([0-1][0-9])|([2][0-3])):([0-5][0-9]))(\s)*[-](\s)*((([0-1][0-9])|([2][0-3])):([0-5][0-9])))/g;
                    var results = re.exec(value);

                    var valueToReturn = '';

                    while(results){
                        var result = results[0];
                        result = result.replace(/\s/g, '');
                        valueToReturn = valueToReturn + result + ','
                        results = re.exec(value);
                    }

                    if(valueToReturn.length>0){
                        valueToReturn= valueToReturn.slice(0,valueToReturn.length-1);
                    }

                    scope.scheduleForm.schedule.$viewValue = valueToReturn;
                    scope.scheduleForm.schedule.$render();
                    return valueToReturn === '' ? 'NA' : valueToReturn;
                }

                ctrl.$parsers.push(toModel);
            }
        };
    }).directive('scheduleTimeRequired',function(){
        return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl){
                return scope.$apply(attrs.scheduleTimeRequired);
            }
        };
    })
    .directive('widgetGrid', function ($rootScope, $compile, $q, $state, $timeout) {

        var jarvisWidgetsDefaults = {
            grid: 'article',
            widgets: '.jarviswidget',
            localStorage: true,
            deleteSettingsKey: '#deletesettingskey-options',
            settingsKeyLabel: 'Reset settings?',
            deletePositionKey: '#deletepositionkey-options',
            positionKeyLabel: 'Reset position?',
            sortable: true,
            buttonsHidden: false,
            // toggle button
            toggleButton: true,
            toggleClass: 'fa fa-minus | fa fa-plus',
            toggleSpeed: 200,
            onToggle: function () {
            },
            // delete btn
            deleteButton: true,
            deleteMsg: 'Warning: This action cannot be undone!',
            deleteClass: 'fa fa-times',
            deleteSpeed: 200,
            onDelete: function () {
            },
            // edit btn
            editButton: true,
            editPlaceholder: '.jarviswidget-editbox',
            editClass: 'fa fa-cog | fa fa-save',
            editSpeed: 200,
            onEdit: function () {
            },
            // color button
            colorButton: true,
            // full screen
            fullscreenButton: true,
            fullscreenClass: 'fa fa-expand | fa fa-compress',
            fullscreenDiff: 3,
            onFullscreen: function () {
            },
            // custom btn
            customButton: false,
            customClass: 'folder-10 | next-10',
            customStart: function () {
                alert('Hello you, this is a custom button...');
            },
            customEnd: function () {
                alert('bye, till next time...');
            },
            // order
            buttonOrder: '%refresh% %custom% %edit% %toggle% %fullscreen% %delete%',
            opacity: 1.0,
            dragHandle: '> header',
            placeholderClass: 'jarviswidget-placeholder',
            indicator: true,
            indicatorTime: 600,
            ajax: true,
            timestampPlaceholder: '.jarviswidget-timestamp',
            timestampFormat: 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
            refreshButton: true,
            refreshButtonClass: 'fa fa-refresh',
            labelError: 'Sorry but there was a error:',
            labelUpdated: 'Last Update:',
            labelRefresh: 'Refresh',
            labelDelete: 'Delete widget:',
            afterLoad: function () {
            },
            rtl: false, // best not to toggle this!
            onChange: function () {

            },
            onSave: function () {

            },
            ajaxnav: true

        }

        var dispatchedWidgetIds = [];
        var setupWaiting = false;

        var debug = 1;

        var setupWidgets = function (element, widgetIds) {

            if (!setupWaiting) {

                if(_.intersection(widgetIds, dispatchedWidgetIds).length != widgetIds.length){

                    dispatchedWidgetIds = _.union(widgetIds, dispatchedWidgetIds);

//                    console.log('setupWidgets', debug++);

                    element.data('jarvisWidgets') && element.data('jarvisWidgets').destroy();
                    element.jarvisWidgets(jarvisWidgetsDefaults);
                    initDropdowns(widgetIds);
                }

            } else {
                if (!setupWaiting) {
                    setupWaiting = true;
                    $timeout(function () {
                        setupWaiting = false;
                        setupWidgets(element, widgetIds)
                    }, 200);
                }
            }

        };

        var destroyWidgets = function(element, widgetIds){
            element.data('jarvisWidgets') && element.data('jarvisWidgets').destroy();
            dispatchedWidgetIds = _.xor(dispatchedWidgetIds, widgetIds);
        };

        var initDropdowns = function (widgetIds) {
            angular.forEach(widgetIds, function (wid) {
                $('#' + wid + ' [data-toggle="dropdown"]').each(function () {
                    var $parent = $(this).parent();
                    $(this).removeAttr('data-toggle');
                    if (!$parent.attr('dropdown')) {
                        $(this).removeAttr('href');
                        $parent.attr('dropdown', '');
                        var compiled = $compile($parent)($parent.scope())
                        $parent.replaceWith(compiled);
                    }
                })
            });
        };

        var jarvisWidgetAddedOff,
            $viewContentLoadedOff,
            $stateChangeStartOff;

        return {
            restrict: 'A',
            compile: function(element){

                element.removeAttr('widget-grid data-widget-grid');

                var widgetIds = [];

                $viewContentLoadedOff = $rootScope.$on('$viewContentLoaded', function (event, data) {
                    $timeout(function () {
                        setupWidgets(element, widgetIds)
                    }, 100);
                });


                $stateChangeStartOff = $rootScope.$on('$stateChangeStart',
                    function(event, toState, toParams, fromState, fromParams){
                        jarvisWidgetAddedOff();
                        $viewContentLoadedOff();
                        $stateChangeStartOff();
                        destroyWidgets(element, widgetIds)
                    });

                jarvisWidgetAddedOff = $rootScope.$on('jarvisWidgetAdded', function (event, widget) {
                    if (widgetIds.indexOf(widget.attr('id')) == -1) {
                        widgetIds.push(widget.attr('id'));
                        $timeout(function () {
                            setupWidgets(element, widgetIds)
                        }, 100);
                    }
//                    console.log('jarvisWidgetAdded', widget.attr('id'));
                });

            }
        }
    })
    .directive('jarvisWidget', function($rootScope){
    return {
        restrict: "A",
        compile: function(element, attributes){
            if(element.data('widget-color'))
                element.addClass('jarviswidget-color-' + element.data('widget-color'));


            element.find('.widget-body').prepend('<div class="jarviswidget-editbox"><input class="form-control" type="text"></div>');

            element.addClass('jarviswidget jarviswidget-sortable');
            $rootScope.$emit('jarvisWidgetAdded', element )

        }
    }
})

;
