/**
 * Created by justsavor on 15/4/9.
 */
var reportModule = angular.module('reportModule', ['tagModule']);

reportModule.factory('reportService', ['$resource', function ($resource) {
    return $resource('http://121.40.106.155:5000/api/v1/reports/:reportId', {reportId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);


literatureModule.factory('AttachmentService', ['$resource', function ($resource) {
    return $resource('http://121.40.106.155:5000/api/v1/report_attachments/:attachmentId', {attachmentId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);

literatureModule.factory('RecordingService', ['$resource', function ($resource) {
    return $resource('http://121.40.106.155:5000/api/v1/report_recordings/:recordingId', {recordingId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);

reportModule.controller('reportListCtrl', ['$scope', '$http', '$modal', 'reportService', function ($scope, $http, $modal, reportService) {
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
            displayName: "职位"
        }, {
            field: "company",
            displayName: "单位"
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
            controller: 'reportQueryCtrl'
        });

        queryModalInstance.result.then(function (query) {
            console.log(query);
            $http.post('http://121.40.106.155:5000/api/v1/reports/query', query).
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

reportModule.controller('reportAddCtrl', ['$scope', '$rootScope', '$state', '$http', 'reportService', 'tagService', 'Time', function ($scope, $rootScope, $state, $http, reportService, tagService, Time) {
    $scope.isEdit = true;
    $scope.report = {};


    tagService.query(function (data) {
        $scope.allTags = data;
        console.log($scope.allTags);
    });


    $scope.submit = function () {
        $scope.report.creator_id = $rootScope.userId;
        $scope.report.create_time = Time.currentTime(new Date());

        reportService.save($scope.report, function (data) {
            console.log("add successful");
            for (var i = 0; i < $scope.allTags.length; i++) {
                if ($scope.allTags[i]['selected'])
                    $http.post('http://121.40.106.155:5000/api/v1/tag_resources', {
                        "tag_id": $scope.allTags[i]['id'],
                        "resource_id": data.id,
                        "type": 6

                    });
            }
            $state.go('viewReport', {id: data.id});
        });
    };
}
])
;

reportModule.controller('reportShowCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$http', 'reportService', 'Time', function ($scope, $rootScope, $state, $stateParams, $http, reportService, Time) {
    $scope.isEdit = false;
    $scope.comment_type_id = 4;
    $scope.currentType = 6;
    $scope.currentId = $stateParams.id;

    var id = $stateParams.id;

    reportService.get({reportId: id}, function (data) {
        $scope.report = data;
        $http.post("http://121.40.106.155:5000/api/v1/tag_resources/query", {
            "resource_id": data.id,
            "type": $scope.currentType
        })
            .success(function (data) {
                $scope.tag_res = data;
                $scope.tagIds = [];
                data.forEach(function (single_tag_res) {
                    $scope.tagIds.push(single_tag_res.tag_id)
                });

                $http.get("http://121.40.106.155:5000/api/v1/tags")
                    .success(function (data) {
                        $scope.allTags = data;
                        $http.post("http://121.40.106.155:5000/api/v1/tags/batch", {"ids": $scope.tagIds})
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

    $scope.delete = function () {
        $scope.report.$delete(function () {
            $state.go('showAllReport');
        });
    };

    $scope.changeState = function () {
        $scope.isEdit = !$scope.isEdit;

        if ($scope.isEdit) {
            $scope.origin = angular.copy($scope.report);
        }

        if (!$scope.isEdit) {
            $scope.report = $scope.origin;
        }
    };

    $scope.getEditLabel = function () {
        if ($scope.isEdit) {
            return "取消编辑";
        } else {
            return "编辑/上传";
        }
    };

    $scope.submit = function () {
        $scope.report.updater_id = $rootScope.userId;
        $scope.report.update_time = Time.currentTime(new Date());

        $scope.report.$update(function () {
            console.log("update ok");
            $scope.isEdit = !$scope.isEdit;
        })

        for (var i = 0; i < $scope.allTags.length; i++) {
            var not_found_in_tags_existed = true;
            $scope.tags.forEach(function (tag_existed) {
                if ($scope.allTags[i]['id'] == tag_existed['id'])
                    not_found_in_tags_existed = false;
            });

            if (not_found_in_tags_existed && $scope.allTags[i]['selected']) {
                $http.post('http://121.40.106.155:5000/api/v1/tag_resources', {
                    "tag_id": $scope.allTags[i]['id'],
                    "resource_id": $scope.report.id,
                    "type": 5
                });
                $scope.tags.push($scope.allTags[i]);
            }
            else if (!not_found_in_tags_existed && !$scope.allTags[i]['selected']) {
                $scope.tag_res.forEach(function (element) {
                    if (element.tag_id == $scope.allTags[i]['id'] && element.type == $scope.currentType) {
                        $http.delete('http://121.40.106.155:5000/api/v1/tag_resources/'.concat(element.id))
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
    };
}]);