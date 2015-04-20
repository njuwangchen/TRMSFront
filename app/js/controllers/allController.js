/**
 * Created by BAO on 4/8/15.
 */
var allModule = angular.module('allModule',[]);

allModule.controller('allController', ['$scope','$rootScope',function ($scope,$rootScope) {
    $rootScope.showAll = "showAllLiterature";
    $rootScope.showDataSet = "showAllDataSet";
    $rootScope.showCode = "showAllCode";
    $rootScope.showReport = "showAllReport";
    $rootScope.isFavor = false;
    $rootScope.favorites = null;
}]);
