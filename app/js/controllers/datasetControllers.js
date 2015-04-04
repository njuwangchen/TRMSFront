/**
 * Created by BAO on 4/2/15.
 */
var datasetModule = angular.module('datasetModule',[]);

datasetModule.factory('datasetService',['$resource',function($resource){
    return $resource('http://127.0.0.1:5000/api/v1/data_sets/:datasetId', {datasetId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);

datasetModule.controller('datasetListCtrl',['$scope','datasetService',function($scope,datasetService)
{
    datasetService.query(function (data) {
        $scope.datasetList = data;
    });

    $scope.gridOptions = {
        data: 'datasetList',
        enableColumnResizing: true,
        paginationPageSizes: [20, 50, 100],
        paginationPageSize: 20,
        columnDefs: [{
            field: "title",
            displayName: "标题",
            width: 300,
            cellTemplate: '<div><a ui-sref="viewDataset({id:row.entity.id})">{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            field: "size",
            displayName: "大小"
        }, {
            field: "type",
            displayName: "类型"
        }]
    };
}]);

datasetModule.controller('datasetShowCtrl',['$scope','$stateParams','datasetService', function ($scope, $stateParams, datasetService) {
    $scope.isEdit = false;

    var id = $stateParams.id;

    datasetService.get({datasetId:id}, function (data) {
        $scope.dataset = data;
    });

    $scope.changeState = function () {
        $scope.isEdit = !$scope.isEdit;

        if($scope.isEdit){
            $scope.origin = angular.copy($scope.dataset);
        }

        if(!$scope.isEdit){
            $scope.dataset = $scope.origin;
        }
    };

    $scope.getEditLabel = function () {
        if($scope.isEdit) {
            return "取消";
        }else{
            return "编辑";
        }
    };

    $scope.submit = function () {
        $scope.dataset.$update(function () {
            console.log("update ok");
            $scope.isEdit = !$scope.isEdit;
        })
    };
}]);