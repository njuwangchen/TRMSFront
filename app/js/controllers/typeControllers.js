/**
 * Created by justsavor on 15/4/7.
 */
var typeModule = angular.module('typeModule',[]);

typeModule.factory('typeService',['$resource',function($resource){
    return $resource('http://127.0.0.1:5000/api/v1/types/:typeId', {typeId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);

typeModule.controller('dataSetTypeListShowCtrl', ['$scope', '$http', '$stateParams', 'typeService', function($scope, $http, $stateParams, typeService){
    $scope.dataSetTypeList = '';
    $scope.getDataSetTypes = function(){
        $http.post('http://127.0.0.1:5000/api/v1/types/query', {name:"", type_id: 2}).
            success(function(data, status, headers, config){
                $scope.dataSetTypeList = data;
            });
    };
    $scope.getDataSetTypes();
}]);

typeModule.controller('dataSetTypeShowCtrl', ['$scope', '$stateParams', 'typeService', 'datasetService', function($scope, $stateParams, typeService, datasetService){
    datasetService.get({datasetId: $stateParams.id}, function(data){
        $scope.dataSetTypeId = data.data_set_type_id;
        $scope.dataSetType = typeService.get({typeId: data.data_set_type_id});

    });
}]);