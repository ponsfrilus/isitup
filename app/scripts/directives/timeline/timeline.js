'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
    .directive('timeline',function() {
        return {
            templateUrl:'scripts/directives/timeline/timeline.html',
            restrict: 'E',
            replace: true,
            controller: 'TimelineCtrl',
            scope: true
        }
    })
    .controller('TimelineCtrl', function($scope, $http) {
        function refreshAlerts($scope, $http){
            $http.get('api/alerts').
                success(function(data, status, headers, config) {
                    $scope.alerts = data;

                }).
                error(function(data, status, headers, config) {
                    // log error
                    alert("error");
                });
        };

        refreshAlerts($scope, $http);

        $scope.acknowledge = function(index){
            $http.post('/api/acknowledgement', {alertId: $scope.alerts[index].alertId})
                .success(function(data, status, headers, config) {
                    $scope.alerts = data;
                })
                .error(function(data, status, headers, config) {
                    // log error
                    alert("error");
                });
        }
        var socket = io();
        socket.on('refresh', function(){
            refreshAlerts($scope, $http);
        });
    });


