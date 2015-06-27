/**
 * @title ng-poll-img.js
 * @description An AngularJS directive which polls the server for an image and shows a fallback until it's available.
 * @author Rick Kuipers <rskuipers@enrise.com>
 * @version 2.0.0
 *
 * @example <poll-img source="http://example.com/2Fd1aZs.jpg" class="img-responsive" fallback="http://placehold.it/1216x400" on-success="success()"></poll-img>
 */
angular.module('ngPollImg', [])
    .directive('pollImg', ['$http', '$timeout', 'pollImgService', function($http, $timeout, pollImgService) {
        return {
            restrict: 'E',
            replace: true,
            template: '<img ng-src="{{ currentSource }}" ng-class="{\'ng-poll-img-loaded\': imageLoaded, \'ng-poll-img-given-up\': givenUp}" />',
            scope: {
                source: '@',
                fallback: '@',
                currentSource: '@',
                giveUpAfter: '@',
                onSuccess: '&?',
                onGivingUp: '&?'
            },
            link: function($scope) {
                pollImgService.addImage(
                    $scope.source,
                    function() {
                        $scope.currentSource = $scope.source;
                        $scope.imageLoaded = true;
                        if ($scope.onSuccess) {
                            $scope.onSuccess();
                        }
                    },
                    function() {
                        $scope.currentSource = $scope.fallback;
                    },
                    $scope.giveUpAfter,
                    function() {
                        $scope.givenUp = true;
                        $scope.onGivingUp();
                    }
                );
            }
        };
    }])
    .factory('pollImgService', ['$http', '$interval', 'ngPollImgConfig', function($http, $interval, ngPollImgConfig) {
        var service = {};

        service.pollingImages = {};
        service.pollInterval = null;

        service.addImage = function(imageUrl, success, error, giveUpAfter, giveUp) {
            if (!angular.isDefined(service.pollingImages[imageUrl])) {
                service.pollingImages[imageUrl] = {
                    success: [],
                    error: [],
                    giveUp: [],
                    giveUpAfter: giveUpAfter,
                    tries: 0,
                    state: 'PENDING'
                };
            }

            if (service.pollingImages[imageUrl].state == 'SUCCESS') {
                success();
                return;
            }

            service.pollingImages[imageUrl].success.push(success);
            service.pollingImages[imageUrl].error.push(error);
            service.pollingImages[imageUrl].giveUp.push(giveUp);

            service.pollImage(imageUrl, service.pollingImages[imageUrl]);

            if (!service.pollInterval) {
                service.pollInterval = $interval(service.pollImages, ngPollImgConfig.interval);
            }
        };

        service.pollImage = function(imageUrl, pollObj) {
            if (pollObj.state !== 'PENDING') {
                return;
            }
            pollObj.tries++;
            $http
                .get(imageUrl)
                .success(function() {
                    angular.forEach(pollObj.success, function(callback) {
                        callback();
                    });

                    service.finishImage(pollObj, 'SUCCESS');
                })
                .error(function() {
                    angular.forEach(pollObj.error, function(callback) {
                        callback();
                    });
                    pollObj.state = 'PENDING';
                    if (pollObj.giveUpAfter > 0 && pollObj.tries >= pollObj.giveUpAfter) {
                        service.finishImage(pollObj, 'GIVEN_UP');

                        angular.forEach(pollObj.giveUp, function(callback) {
                            callback();
                        });
                    }
                });
            pollObj.state = 'POLLING';
        };

        service.pollImages = function() {
            var active = false;
            angular.forEach(service.pollingImages, function(pollObj, imageUrl) {
                if (pollObj.state == 'SUCCESS') {
                    return;
                }
                active = true;
                service.pollImage(imageUrl, pollObj);
            });

            if (!active) {
                $interval.cancel(service.pollInterval);
            }
        };

        service.finishImage = function(pollObj, state) {
            pollObj.state = state;

            pollObj.success = [];
            pollObj.error = [];
            pollObj.giveUp = [];
        };

        return service;
    }])
    .provider('ngPollImgConfig', function() {
        this.interval = 3000;

        this.$get = function() {
            return {
                interval: this.interval
            };
        };
    });