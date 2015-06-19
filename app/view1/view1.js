'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', function($scope, $http) {

        $http.get('api/alerts').
            success(function(data, status, headers, config) {
                $scope.alerts = data;
            }).
            error(function(data, status, headers, config) {
                // log error
                alert("error");
            });

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
});