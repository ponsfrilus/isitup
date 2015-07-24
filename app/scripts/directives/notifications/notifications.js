'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */
angular.module('sbAdminApp')
	.directive('notifications',function(){
		return {
        templateUrl:'scripts/directives/notifications/notifications.html',
        restrict: 'E',
		controller: 'NotificationsCtrl',
        replace: true
    	}
	}).controller('NotificationsCtrl', function($scope, $http) {
        function refreshAlerts($scope, $http) {
            $http.get('api/alerts').
                success(function (data, status, headers, config) {
                    if (data.error) {
                        $scope.error = data.error;
                    }
                    else {
                        $scope.alerts = data;
                    }
                }).
                error(function (data, status, headers, config) {
                    // log error
                    alert("error");
                });
        }

        refreshAlerts($scope, $http);

        $scope.acknowledge = function (index) {
            $http.post('/api/acknowledgement', {alertId: $scope.alerts[index].alertId})
                .success(function (data, status, headers, config) {
                    $scope.alerts = data;
                })
                .error(function (data, status, headers, config) {
                    // log error
                    alert("error");
                });
        };
        $scope.login = function (index) {
            window.location.href = '/login';
        };
        var socket = io();
        socket.on('refresh', function () {
            refreshAlerts($scope, $http);
        });
    });


