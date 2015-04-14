/**
 * Created by justsavor on 15/4/9.
 */
var reportModule = angular.module('reportModule',[]);

reportModule.factory('reportService',['$resource',function($resource){
    return $resource('http://127.0.0.1:5000/api/v1/reports/:reportId', {reportId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);

reportModule.controller('reportListCtrl',['$scope','$http', '$modal', 'reportService',function($scope, $http, $modal, reportService) {
    reportService.query(function (data) {
        $scope.reportList = data;
    });

    $scope.gridOptions = {
        data: 'reportList',
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
            cellTemplate: '<div class="ui-grid-cell-contents"><a ui-sref="viewReport({id:row.entity.id})">{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            field: "reporter",
            displayName: "报告人"
        }, {
            field: "reporter_title",
            displayName: "报告人职位"
        }, {
            field: "company",
            displayName: "组织"
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
            templateUrl: 'partial/reportQuery.html',
            controller: 'reportQueryCtrl',
            size: 'lg'
        });

        queryModalInstance.result.then(function (query) {
            console.log(query);
            $http.post('http://127.0.0.1:5000/api/v1/reports/query', query).
                success(function (data) {
                    $scope.reportList = data;
                });
        }, function () {

        });
    };
}]);

reportModule.controller('reportQueryCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
    $scope.report = {};
    $scope.submit = function () {
        $modalInstance.close($scope.report);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]);

reportModule.controller('reportAddCtrl', ['$scope', '$state', 'reportService', 'Time', function ($scope, $state, reportService, Time) {
    $scope.isEdit = true;

    $scope.report = {};

    $scope.submit = function () {
        $scope.report.creator_id = 1;
        $scope.report.create_time = Time.currentTime(new Date());

        reportService.save($scope.report, function (data) {
            console.log("add successful");
            $state.go('viewReport', {id: data.id});
        });
    };
}]);

reportModule.controller('reportShowCtrl',['$scope','$stateParams','reportService', 'Time', function ($scope, $stateParams, reportService, Time) {
    $scope.isEdit = false;
    $scope.comment_type_id = 4;

    var id = $stateParams.id;

    reportService.get({reportId:id}, function (data) {
        $scope.report = data;
    });

    $scope.changeState = function () {
        $scope.isEdit = !$scope.isEdit;

        if($scope.isEdit){
            $scope.origin = angular.copy($scope.report);
        }

        if(!$scope.isEdit){
            $scope.report = $scope.origin;
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
        $scope.report.updater_id = 1;
        $scope.report.update_time = Time.currentTime(new Date());

        $scope.report.$update(function () {
            console.log("update ok");
            $scope.isEdit = !$scope.isEdit;
        })
    };
}]);