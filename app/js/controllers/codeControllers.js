/**
 * Created by justsavor on 15/4/3.
 */
var codeModule = angular.module('codeModule',[]);

codeModule.factory('codeService',['$resource',function($resource){
    return $resource('http://127.0.0.1:5000/api/v1/codes/:codeId', {codeId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);

codeModule.controller('codeListCtrl',['$scope', '$http', '$modal', 'codeService',function($scope, $http, $modal, codeService) {
    codeService.query(function (data) {
        $scope.codeList = data;
    });

    $scope.gridOptions = {
        data: 'codeList',
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
            cellTemplate: '<div><a ui-sref="viewCode({id:row.entity.id})">{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            field: "size",
            displayName: "大小"
        }, {
            field: "language",
            displayName: "语言"
        }]
    };

    $scope.toggleFiltering = function () {
        $scope.gridOptions.enableFiltering = !$scope.gridOptions.enableFiltering;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
    };

    $scope.openQuery = function () {
        var queryModalInstance = $modal.open({
            templateUrl: 'partial/codeQuery.html',
            controller: 'codeQueryCtrl',
            size: 'lg'
        });

        queryModalInstance.result.then(function (query) {
            console.log(query);
            $http.post('http://127.0.0.1:5000/api/v1/codes/query', query).
                success(function (data) {
                    $scope.codeList = data;
                });
        }, function () {

        });
    };

}]);

codeModule.controller('codeQueryCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
    $scope.code = {};
    $scope.submit = function () {
        $modalInstance.close($scope.code);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]);

codeModule.controller('codeAddCtrl', ['$scope', '$state', 'codeService', 'Time', function ($scope, $state, codeService, Time) {
    $scope.isEdit = true;

    $scope.code = {};

    $scope.submit = function () {
        $scope.code.creator_id = 1;
        $scope.code.create_time = Time.currentTime;

        codeService.save($scope.code, function (data) {
            console.log("add successful");
            $state.go('viewCode', {id: data.id});
        });
    };
}]);

codeModule.controller('codeShowCtrl',['$scope','$stateParams','codeService', 'Time', function ($scope, $stateParams, codeService, Time) {
    $scope.isEdit = false;

    var id = $stateParams.id;

    codeService.get({codeId:id}, function (data) {
        $scope.code = data;
    });

    $scope.changeState = function () {
        $scope.isEdit = !$scope.isEdit;

        if($scope.isEdit){
            $scope.origin = angular.copy($scope.code);
        }

        if(!$scope.isEdit){
            $scope.code = $scope.origin;
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
        $scope.code.updater_id = 1;
        $scope.code.update_time = Time.currentTime;

        $scope.code.$update(function () {
            console.log("update ok");
            $scope.isEdit = !$scope.isEdit;
        })
    };
}]);