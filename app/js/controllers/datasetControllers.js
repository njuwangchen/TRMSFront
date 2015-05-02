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

datasetModule.controller('datasetListCtrl',['$scope', '$http', '$modal', 'datasetService',function($scope, $http, $modal, datasetService)
{
    datasetService.query(function (data) {
        $scope.datasetList = data;
    });

    $scope.gridOptions = {
        data: 'datasetList',
        enableFiltering: false,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
        enableColumnResizing: true,
        paginationPageSizes: [20, 50, 100],
        paginationPageSize: 20,
        columnDefs: [{
            field: "title",
            displayName: "标题",
            width: 300,
            cellTemplate: '<div class="ui-grid-cell-contents"><a ui-sref="viewDataSet({id:row.entity.id})">{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            field: "publisher",
            displayName: "发布者"
        }, {
            field: "type_name",
            displayName: "类型"
        }, {
            field: "rank_str",
            displayName: "评分/人数"
        }]
    };

    $scope.toggleFiltering = function () {
        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    $scope.openQuery = function () {
        var queryModalInstance = $modal.open({
            templateUrl: 'partial/dataSetQuery.html',
            controller: 'datasetQueryCtrl'
        });

        queryModalInstance.result.then(function (query) {
            console.log(query);
            $http.post('http://127.0.0.1:5000/api/v1/data_sets/query', query).
                success(function (data) {
                    $scope.datasetList = data;
                });
        }, function () {

        });
    };


}]);

datasetModule.controller('datasetQueryCtrl', ['$scope', '$http', '$modalInstance', function ($scope, $http, $modalInstance) {
    $scope.dataset = {};

    $scope.getDataSetTypes = function(){
        $http.post('http://127.0.0.1:5000/api/v1/types/query', {name:"", type_id: 2}).
            success(function(data, status, headers, config){
                $scope.dataSetTypeList = data;
                $scope.selectedType = 0;
            });
    };
    $scope.getDataSetTypes();

    $scope.submit = function () {
        $scope.dataset.data_set_type_id = $scope.selectedType.id;
        $modalInstance.close($scope.dataset);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]);

datasetModule.controller('datasetAddCtrl', ['$scope', '$http', '$state', 'datasetService', 'Time', function ($scope, $http, $state, datasetService, Time) {
    $scope.isEdit = true;

    $scope.dataset = {};

    $scope.dataSetTypeList = [];

    $scope.getDataSetTypes = function(){
        $http.post('http://127.0.0.1:5000/api/v1/types/query', {name:"", type_id: 2}).
            success(function(data, status, headers, config){
                $scope.dataSetTypeList = data;
                $scope.selectedType = $scope.dataSetTypeList[0];
            });
    };
    $scope.getDataSetTypes();


    $scope.submit = function () {
        $scope.dataset.creator_id = 1;
        $scope.dataset.create_time = Time.currentTime(new Date());
        $scope.dataset.data_set_type_id = $scope.selectedType.id;
        $scope.dataset.type_name = $scope.selectedType.name;

        datasetService.save($scope.dataset, function (data) {
            console.log("add successful");
            $state.go('viewDataSet', {id: data.id});
        });
    };
}]);

datasetModule.controller('datasetShowCtrl',['$scope','$stateParams', '$state', '$http', 'datasetService', 'typeService', 'Time', function ($scope, $stateParams, $state, $http, datasetService, typeService, Time) {
    $scope.isEdit = false;
    $scope.comment_type_id = 2;
    $scope.currentType = 4;
    $scope.currentId = $stateParams.id;

    var id = $stateParams.id;

    $scope.getDataSetTypes = function(){
        $http.post('http://127.0.0.1:5000/api/v1/types/query', {name:"", type_id: 2}).
            success(function(data, status, headers, config){
                $scope.dataSetTypeList = data;
                $scope.selectedType = $scope.dataSetTypeList[0];
            });
    };
    $scope.getDataSetTypes();

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
            return "编辑/上传";
        }
    };

    $scope.submit = function () {
        $scope.dataset.updater_id = 1;
        $scope.dataset.update_time = Time.currentTime(new Date());
        $scope.dataset.data_set_type_id = $scope.selectedType.id;
        $scope.dataset.type_name = $scope.selectedType.name;

        $scope.dataset.$update(function () {
            console.log("update ok");
            $scope.isEdit = !$scope.isEdit;
        })
    };
}]);