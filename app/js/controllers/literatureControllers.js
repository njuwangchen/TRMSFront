var literatureModule = angular.module('LiteratureModule', []);

literatureModule.factory('LiteratureService', ['$resource', function ($resource) {
    return $resource('http://127.0.0.1:5000/api/v1/literatures/:literatureId', {literatureId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);

literatureModule.factory('VideoService', ['$resource', function($resource){
    return $resource('http://127.0.0.1:5000/api/v1/videos/:videoId', {videoId: '@id'});
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
            cellTemplate: '<div><a ui-sref="viewLiterature({id:row.entity.id})">{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            field: "author",
            displayName: "作者"
        }, {
            field: "published_year",
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

literatureModule.controller('LiteratureAddCtrl', ['$scope', '$state', 'LiteratureService', 'Time', function ($scope, $state, LiteratureService, Time) {
    $scope.isEdit = true;

    $scope.literature = {};

    $scope.submit = function () {
        $scope.literature.creator_id = 1;
        $scope.literature.create_time = Time.currentTime;
        $scope.literature.literature_type_id = 1;

        LiteratureService.save($scope.literature, function (data) {
            console.log("add successful");
            $state.go('viewLiterature', {id: data.id});
        });
    };
}]);

literatureModule.controller('LiteratureShowCtrl', ['$scope', '$stateParams', 'LiteratureService', function ($scope, $stateParams, LiteratureService) {
    $scope.isEdit = false;

    var id = $stateParams.id;

    LiteratureService.get({literatureId: id}, function (data) {
        $scope.literature = data;
    });

    $scope.changeState = function () {
        $scope.isEdit = !$scope.isEdit;

        if ($scope.isEdit) {
            $scope.origin = angular.copy($scope.literature);
        }

        if (!$scope.isEdit) {
            $scope.literature = $scope.origin;
        }
    };

    $scope.getEditLabel = function () {
        if ($scope.isEdit) {
            return "取消";
        } else {
            return "编辑";
        }
    };

    $scope.submit = function () {
        $scope.literature.$update(function () {
            console.log("update successful");
            $scope.isEdit = !$scope.isEdit;
        });
    };
}]);
