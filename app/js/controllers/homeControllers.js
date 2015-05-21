/**
 * Created by ClarkWong on 21/5/15.
 */
var homeModule = angular.module('homeModule', []);

homeModule.controller('HomeController', ['$scope', '$rootScope', '$http', 'RootURL', function ($scope, $rootScope, $http, RootURL) {
    $http({
        method: 'POST',
        url: RootURL.rootURL + '/api/v1/users/resources',
        data: {
            user_id: $rootScope.userId,
            query_type: 0,
            resource_type: 0
        }
    }).success(function (data) {
        $scope.literatures_create = data;
    });

    $http({
        method: 'POST',
        url: RootURL.rootURL + '/api/v1/users/resources',
        data: {
            user_id: $rootScope.userId,
            query_type: 0,
            resource_type: 1
        }
    }).success(function (data) {
        $scope.data_sets_create = data;
    });

    $http({
        method: 'POST',
        url: RootURL.rootURL + '/api/v1/users/resources',
        data: {
            user_id: $rootScope.userId,
            query_type: 0,
            resource_type: 2
        }
    }).success(function (data) {
        $scope.codes_create = data;
    });

    $http({
        method: 'POST',
        url: RootURL.rootURL + '/api/v1/users/resources',
        data: {
            user_id: $rootScope.userId,
            query_type: 0,
            resource_type: 3
        }
    }).success(function (data) {
        $scope.reports_create = data;
    });
    
    $http({
        method: 'POST',
        url: RootURL.rootURL + '/api/v1/users/resources',
        data: {
            user_id: $rootScope.userId,
            query_type: 1,
            resource_type: 0
        }
    }).success(function (data) {
        $scope.literatures_update = data;
    });

    $http({
        method: 'POST',
        url: RootURL.rootURL + '/api/v1/users/resources',
        data: {
            user_id: $rootScope.userId,
            query_type: 1,
            resource_type: 1
        }
    }).success(function (data) {
        $scope.data_sets_update = data;
    });

    $http({
        method: 'POST',
        url: RootURL.rootURL + '/api/v1/users/resources',
        data: {
            user_id: $rootScope.userId,
            query_type: 1,
            resource_type: 2
        }
    }).success(function (data) {
        $scope.codes_update = data;
    });

    $http({
        method: 'POST',
        url: RootURL.rootURL + '/api/v1/users/resources',
        data: {
            user_id: $rootScope.userId,
            query_type: 1,
            resource_type: 3
        }
    }).success(function (data) {
        $scope.reports_update = data;
    });

    
    $http({
        method: 'POST',
        url: RootURL.rootURL + '/api/v1/users/resources',
        data: {
            user_id: $rootScope.userId,
            query_type: 2,
            resource_type: 0
        }
    }).success(function (data) {
        $scope.literatures_comment = data;
    });

    $http({
        method: 'POST',
        url: RootURL.rootURL + '/api/v1/users/resources',
        data: {
            user_id: $rootScope.userId,
            query_type: 2,
            resource_type: 1
        }
    }).success(function (data) {
        $scope.data_sets_comment = data;
    });

    $http({
        method: 'POST',
        url: RootURL.rootURL + '/api/v1/users/resources',
        data: {
            user_id: $rootScope.userId,
            query_type: 2,
            resource_type: 2
        }
    }).success(function (data) {
        $scope.codes_comment = data;
    });

    $http({
        method: 'POST',
        url: RootURL.rootURL + '/api/v1/users/resources',
        data: {
            user_id: $rootScope.userId,
            query_type: 2,
            resource_type: 3
        }
    }).success(function (data) {
        $scope.reports_comment = data;
    });

}]);