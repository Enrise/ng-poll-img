/**
 * @title ng-poll-img.js
 * @description An AngularJS directive which polls the server for an image and shows a fallback until it's available.
 * @author Rick Kuipers <rskuipers@enrise.com>
 * @version 1.0.0
 *
 * @example <poll-img source="http://example.com/2Fd1aZs.jpg" class="img-responsive" fallback="http://placehold.it/1216x400" on-success="success()"></poll-img>
 */
angular.module('ngPollImg', [])
    .directive('pollImg', ['$http', '$timeout', function($http, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            template: '<img ng-src="{{ currentSource }}" ng-class="{\'ng-poll-img-loaded\': imageLoaded}" />',
            scope: {
                source: '@',
                fallback: '@',
                currentSource: '@',
                interval: '@',
                giveUpAfter: '@',
                onSuccess: '&?'
            },
            link: function($scope) {
                $scope.interval = $scope.interval || 3000;
                $scope.giveUpAfter = $scope.giveUpAfter || 0;
                $scope.imageLoaded = false;
                var i = 0;
                var poll = function() {
                    i++;
                    $http
                        .get($scope.source)
                        .success(function() {
                            $scope.currentSource = $scope.source;
                            $scope.imageLoaded = true;
                            if ($scope.onSuccess) {
                                $scope.onSuccess();
                            }
                        })
                        .error(function() {
                            $scope.currentSource = $scope.fallback;
                            if ($scope.giveUpAfter == 0 || i < $scope.giveUpAfter) {
                                $timeout(poll, $scope.interval);
                            }
                        });
                };

                poll();
            }
        }
    }]);
