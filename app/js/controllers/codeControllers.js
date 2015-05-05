/**
 * Created by justsavor on 15/4/3.
 */
var codeModule = angular.module('codeModule', ['tagModule']);

codeModule.factory('codeService', ['$resource', function ($resource) {
    return $resource('http://127.0.0.1:5000/api/v1/codes/:codeId', {codeId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);

codeModule.controller('codeListCtrl', ['$scope', '$http', '$modal', 'codeService', function ($scope, $http, $modal, codeService) {
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
            cellTemplate: '<div class="ui-grid-cell-contents"><a ui-sref="viewCode({id:row.entity.id})">{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            field: "publisher",
            displayName: "发布者"
        }, {
            field: "language",
            displayName: "语言"
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
            templateUrl: 'partial/codeQuery.html',
            controller: 'codeQueryCtrl'
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

codeModule.controller('codeAddCtrl', ['$scope', '$rootScope', '$state', '$modal', '$http', '$timeout', 'codeService', 'tagService', 'Time', function ($scope, $rootScope, $state, $modal, $http, $timeout, codeService, tagService, Time) {
    $scope.isEdit = true;

    $scope.code = {};

    tagService.query(function (data) {
        $scope.allTags = data;
        console.log($scope.allTags);
    });


    $scope.submit = function () {
        $scope.code.creator_id = $rootScope.userId;
        $scope.code.create_time = Time.currentTime(new Date());


        codeService.save($scope.code, function (data) {
            console.log("add successful");
            for (var i = 0; i < $scope.allTags.length; i++) {
                if ($scope.allTags[i]['selected'])
                    $http.post('http://127.0.0.1:5000/api/v1/tag_resources', {
                        "tag_id": $scope.allTags[i]['id'],
                        "resource_id": data.id,
                        "type": 5
                    })
            }
            $state.go('viewCode', {id: data.id});
        });
    };
}]);

codeModule.controller('codeShowCtrl', ['$scope', '$rootScope', '$stateParams', '$http', '$state', 'codeService', 'Time', function ($scope, $rootScope, $stateParams, $http, $state, codeService, Time) {
    $scope.isEdit = false;
    $scope.comment_type_id = 3;
    $scope.currentType = 5;


    var id = $stateParams.id;

    codeService.get({codeId: id}, function (data) {
        $scope.currentId = data.id;
        $scope.code = data;
        $http.post("http://127.0.0.1:5000/api/v1/tag_resources/query", {"resource_id": data.id, "type": 5})
            .success(function (data) {
                $scope.tag_res = data;
                $scope.tagIds = [];
                data.forEach(function (single_tag_res) {
                    $scope.tagIds.push(single_tag_res.tag_id)
                });

                $http.get("http://127.0.0.1:5000/api/v1/tags")
                    .success(function (data) {
                        $scope.allTags = data;
                        $http.post("http://127.0.0.1:5000/api/v1/tags/batch", {"ids": $scope.tagIds})
                            .success(function (data) {
                                $scope.tags = data;

                                $scope.allTags.forEach(function (element) {
                                    $scope.tags.forEach(function (inner_element) {
                                        if (element.id == inner_element.id)
                                            element.selected = true;
                                    });
                                });
                            });
                    });

            });
    });

    $scope.changeState = function () {
        $scope.isEdit = !$scope.isEdit;

        if ($scope.isEdit) {
            $scope.origin = angular.copy($scope.code);
        }

        if (!$scope.isEdit) {
            $scope.code = $scope.origin;
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
        $scope.code.updater_id = $rootScope.userId;
        $scope.code.update_time = Time.currentTime(new Date());

        $scope.code.$update(function () {
            console.log("update ok");
            $scope.isEdit = !$scope.isEdit;
        })

        for (var i = 0; i < $scope.allTags.length; i++) {
            var not_found_in_tags_existed = true;
            $scope.tags.forEach(function (tag_existed) {
                if ($scope.allTags[i]['id'] == tag_existed['id'] )
                    not_found_in_tags_existed = false;
            });

            if (not_found_in_tags_existed && $scope.allTags[i]['selected'] ) {
                $http.post('http://127.0.0.1:5000/api/v1/tag_resources', {
                    "tag_id": $scope.allTags[i]['id'],
                    "resource_id": $scope.code.id,
                    "type": 5
                });
                $scope.tags.push($scope.allTags[i]);
            }
            else if (!not_found_in_tags_existed && !$scope.allTags[i]['selected']) {
                $scope.tag_res.forEach(function (element) {
                    if (element.tag_id == $scope.allTags[i]['id'] && element.type == 5) {
                        $http.delete('http://127.0.0.1:5000/api/v1/tag_resources/'.concat(element.id))
                        for (var j = 0; j < $scope.tags.length; j++)
                            if ($scope.tags[j]['id'] == element['tag_id']) {
                                console.log("delete tag")
                                console.log($scope.tags[j]['name']);
                                $scope.tags.splice(j, 1);
                                break;
                            }
                    }
                })
            }
        }

        $http.post("http://127.0.0.1:5000/api/v1/tag_resources/query", {"resource_id": $scope.code.id, "type": 5})
            .success(function (data) {
                $scope.tag_res = data;
            });
    };
}]);