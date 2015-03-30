var literatureModule = angular.module('LiteratureModule', []);

literatureModule.factory('LiteratureService', ['$resource', function ($resource) {
    return $resource('http://127.0.0.1:5000/api/v1/literatures/:literatureId', {literatureId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);

literatureModule.controller('LiteratureListCtrl', ['$scope', 'LiteratureService', function ($scope, LiteratureService) {
    LiteratureService.query(function (data) {
        $scope.literatureList = data;
    });

    $scope.gridOptions = {
        data: 'literatureList',
        enableColumnResizing: true,
        paginationPageSizes: [20, 50, 100],
        paginationPageSize: 20,
        columnDefs: [{
            field: "title",
            displayName: "标题",
            width: 300,
            cellTemplate: '<div><a ui-sref="viewLiterature">{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            field: "author",
            displayName: "作者"
        }, {
            field: "publish_year",
            displayName: "年份"
        }, {
            field: "publisher",
            displayName: "期刊/会议"
        }, {
            field: "abstract",
            displayName: "摘要"
        }]
    };
}]);

literatureModule.controller('LiteratureAddCtrl', ['$scope', 'LiteratureService', function ($scope, LiteratureService) {
    $scope.isEdit = true;
}]);

literatureModule.controller('LiteratureShowCtrl', ['$scope', 'LiteratureService', function ($scope, LiteratureService) {
    $scope.isEdit = false;

    $scope.changeState = function () {
        $scope.isEdit = !$scope.isEdit;
    }

    $scope.getEditLabel = function () {
        if ($scope.isEdit) {
            return "查看";
        } else {
            return "编辑";
        }
    }
}]);