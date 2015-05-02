var literatureModule = angular.module('LiteratureModule', []);

literatureModule.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
    }]);


literatureModule.factory('LiteratureService', ['$resource', function ($resource) {
    return $resource('http://127.0.0.1:5000/api/v1/literatures/:literatureId', {literatureId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);

literatureModule.factory('VideoService', ['$resource', function ($resource) {
    return $resource('http://127.0.0.1:5000/api/v1/videos/:videoId', {videoId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);

literatureModule.factory('PptService', ['$resource', function ($resource) {
    return $resource('http://127.0.0.1:5000/api/v1/ppts/:pptId', {pptId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);

literatureModule.controller('LiteratureListCtrl', ['$scope', '$rootScope', '$modal', '$http', 'uiGridConstants', 'LiteratureService', function ($scope, $rootScope, $modal, $http, uiGridConstants, LiteratureService) {
    LiteratureService.query(function (data) {
        $scope.literatureList = data;
    });

    $scope.gridOptions = {
        data: 'literatureList',
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
            cellTemplate: '<div class="ui-grid-cell-contents"><a ui-sref="viewLiterature({id:row.entity.id})">{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            field: "author",
            displayName: "作者"
        }, {
            field: "published_year",
            displayName: "年份"
        }, {
            field: "publisher",
            displayName: "期刊(会议)"
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
            templateUrl: 'partial/literatureQuery.html',
            controller: 'LiteratureQueryCtrl'
        });

        queryModalInstance.result.then(function (query) {
            console.log(query);
            $http.post('http://127.0.0.1:5000/api/v1/literatures/query', query).
                success(function (data) {
                    $scope.literatureList = data;
                });
        }, function () {

        });
    };
}]);

literatureModule.controller('LiteratureQueryCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
    $scope.literature = {};
    $scope.submit = function () {
        $modalInstance.close($scope.literature);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss();
    };
}]);

literatureModule.controller('LiteratureAddCtrl', ['$scope', '$state', '$http', 'LiteratureService', 'Time', function ($scope, $state, $http, LiteratureService, Time) {
    $scope.literatureTypeList = [];

    $http.post('http://127.0.0.1:5000/api/v1/types/query', {name: "", type_id: 1}).
        success(function (data) {
            $scope.literatureTypeList = data;
            $scope.selectedType = $scope.literatureTypeList[0];
        });

    $scope.isEdit = true;

    $scope.literature = {};

    $scope.submit = function () {
        $scope.literature.creator_id = 1;
        $scope.literature.create_time = Time.currentTime(new Date());
        $scope.literature.literature_type_id = $scope.selectedType.id;

        LiteratureService.save($scope.literature, function (data) {
            $state.go('viewLiterature', {id: data.id});
        });
    };
}]);

literatureModule.controller('LiteratureShowCtrl', ['$scope', '$stateParams', '$http', 'LiteratureService', 'Time', function ($scope, $stateParams, $http, LiteratureService, Time) {
    $scope.literatureTypeList = [];
    $scope.comment_type_id = 1;

    $scope.isEdit = false;
    $scope.currentType = 1;
    $scope.currentId = $stateParams.id;

    var id = $stateParams.id;

    LiteratureService.get({literatureId: id}, function (data) {
        $scope.literature = data;

        $http.post('http://127.0.0.1:5000/api/v1/types/query', {name: "", type_id: 1}).
            success(function (data) {
                $scope.literatureTypeList = data;

                for (var i = 0; i < $scope.literatureTypeList.length; i++) {
                    if ($scope.literatureTypeList[i].id == $scope.literature.literature_type_id) {
                        $scope.selectedType = $scope.literatureTypeList[i];
                        break;
                    }
                }
            });
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
            return "编辑/上传";
        }
    };

    $scope.submit = function () {
        $scope.literature.updater_id = 1;
        $scope.literature.update_time = Time.currentTime(new Date());
        $scope.literature.literature_type_id = $scope.selectedType.id;

        $scope.literature.$update(function () {
            console.log($scope.literature);
            $scope.isEdit = !$scope.isEdit;
        });
    };

    $http.post("http://127.0.0.1:5000/api/v1/literatures/export",{'id':id})
        .success(function (data) {
            var content = data;
            var blob = new Blob([ content ], { type : 'text/plain' });
            $scope.exportUrl = (window.URL || window.webkitURL).createObjectURL( blob );
        })

}]);
