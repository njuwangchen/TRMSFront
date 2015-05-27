/**
 * Created by BAO on 4/2/15.
 */
var datasetModule = angular.module('datasetModule',['tagModule']);

datasetModule.factory('datasetService',['$resource',function($resource){
    return $resource('http://121.40.106.155:5000/api/v1/data_sets/:datasetId', {datasetId: '@id'}, {
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
            $http.post('http://121.40.106.155:5000/api/v1/data_sets/query', query).
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
        $http.post('http://121.40.106.155:5000/api/v1/types/query', {name:"", type_id: 2}).
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

datasetModule.controller('datasetAddCtrl', ['$scope', '$rootScope', '$http', '$state', 'datasetService','tagService', 'Time', function ($scope, $rootScope, $http, $state, datasetService,tagService ,Time) {
    $scope.isEdit = true;

    $scope.dataset = {};

    $scope.dataSetTypeList = [];

    $scope.getDataSetTypes = function(){
        $http.post('http://121.40.106.155:5000/api/v1/types/query', {name:"", type_id: 2}).
            success(function(data, status, headers, config){
                $scope.dataSetTypeList = data;
                $scope.selectedType = $scope.dataSetTypeList[0];
            });
    };
    $scope.getDataSetTypes();

    tagService.query(function (data) {
        $scope.allTags = data;
        console.log($scope.allTags);
    });

    $scope.submit = function () {
        $scope.dataset.creator_id = $rootScope.userId;
        $scope.dataset.create_time = Time.currentTime(new Date());
        $scope.dataset.data_set_type_id = $scope.selectedType.id;
        $scope.dataset.type_name = $scope.selectedType.name;

        datasetService.save($scope.dataset, function (data) {
            console.log("add successful");

            for (var i = 0; i < $scope.allTags.length; i++) {
                if ($scope.allTags[i]['selected'])
                    $http.post('http://121.40.106.155:5000/api/v1/tag_resources', {
                        "tag_id": $scope.allTags[i]['id'],
                        "resource_id": data.id,
                        "type": 4
                    })
            }

            $state.go('viewDataSet', {id: data.id});
        });
    };
}]);

datasetModule.controller('datasetShowCtrl',['$scope', '$rootScope', '$modal', '$stateParams', '$state', '$http', 'datasetService', 'typeService', 'Time', function ($scope, $rootScope, $modal, $stateParams, $state, $http, datasetService, typeService, Time) {
    $scope.isEdit = false;
    $scope.comment_type_id = 2;
    $scope.currentType = 4;
    $scope.currentId = $stateParams.id;

    var id = $stateParams.id;

    $scope.getDataSetTypes = function(){
        $http.post('http://121.40.106.155:5000/api/v1/types/query', {name:"", type_id: 2}).
            success(function(data, status, headers, config){
                $scope.dataSetTypeList = data;
                $scope.selectedType = $scope.dataSetTypeList[0];
            });
    };
    $scope.getDataSetTypes();

    datasetService.get({datasetId:id}, function (data) {
        $scope.dataset = data;

        $http.post("http://121.40.106.155:5000/api/v1/tag_resources/query", {"resource_id": data.id, "type": $scope.currentType})
            .success(function (data) {
                $scope.tag_res = data;
                $scope.tagIds = [];
                data.forEach(function (single_tag_res) {
                    $scope.tagIds.push(single_tag_res.tag_id)
                })

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

    $scope.changeState = function () {
        $scope.isEdit = !$scope.isEdit;

        if($scope.isEdit){
            $scope.origin = angular.copy($scope.dataset);
        }

        if(!$scope.isEdit){
            var from_literature_id = $scope.dataset.from_literature_id;
            var from_literature_name = $scope.dataset.from_literature_name;
            $scope.dataset = $scope.origin;
            $scope.dataset.from_literature_id = from_literature_id;
            $scope.dataset.from_literature_name = from_literature_name;
        }
    };

    $scope.getEditLabel = function () {
        if($scope.isEdit) {
            return "取消编辑";
        }else{
            return "编辑/上传";
        }
    };

    $scope.submit = function () {
        $scope.dataset.updater_id = $rootScope.userId;
        $scope.dataset.update_time = Time.currentTime(new Date());
        $scope.dataset.data_set_type_id = $scope.selectedType.id;
        $scope.dataset.type_name = $scope.selectedType.name;

        $scope.dataset.$update(function () {
            console.log("update ok");
            $scope.isEdit = !$scope.isEdit;
        });

        for (var i = 0; i < $scope.allTags.length; i++) {
            var not_found_in_tags_existed = true;
            $scope.tags.forEach(function (tag_existed) {
                if ($scope.allTags[i]['id'] == tag_existed['id'] )
                    not_found_in_tags_existed = false;
            });

            if (not_found_in_tags_existed && $scope.allTags[i]['selected'] ) {
                $http.post('http://121.40.106.155:5000/api/v1/tag_resources', {
                    "tag_id": $scope.allTags[i]['id'],
                    "resource_id": $scope.dataset.id,
                    "type": $scope.currentType
                });
                $scope.tags.push($scope.allTags[i]);
            }
            else if (!not_found_in_tags_existed && !$scope.allTags[i]['selected']) {
                $scope.tag_res.forEach(function (element) {
                    if (element.tag_id == $scope.allTags[i]['id'] && element.type == $scope.currentType) {
                        $http.delete('http://121.40.106.155:5000/api/v1/tag_resources/'.concat(element.id));
                        for (var j = 0; j < $scope.tags.length; j++)
                            if ($scope.tags[j]['id'] == element['tag_id']) {
                                console.log("delete tag");
                                console.log($scope.tags[j]['name']);
                                $scope.tags.splice(j, 1);
                                break;
                            }
                    }
                });
            }
        }
    };

    $scope.add_from_literature = function () {
        var addLiteratureModal = $modal.open({
            templateUrl: 'partial/literatureGrid.html',
            controller: 'Data_set_literature_modal_controller',
            size: 'lg',
            resolve: {
                existed: function () {
                    return [];
                }
            }
        });

        addLiteratureModal.result.then(function (literature_id) {
            var updatedInfo = {};
            updatedInfo.id = $stateParams.id;
            updatedInfo.updater_id = $rootScope.userId;
            updatedInfo.update_time = Time.currentTime(new Date());
            updatedInfo.create_time = $scope.dataset.create_time;
            updatedInfo.from_literature_id = literature_id;

            datasetService.update(updatedInfo, function (data) {
                datasetService.get({datasetId: $stateParams.id}, function (data) {
                    $scope.dataset.from_literature_id = data.from_literature_id;
                    $scope.dataset.from_literature_name = data.from_literature_name;
                });
            });

        }, function () {

        });
    };

    $scope.delete_from_literature = function () {
        var updatedInfo = {};
        updatedInfo.id = $stateParams.id;
        updatedInfo.updater_id = $rootScope.userId;
        updatedInfo.update_time = Time.currentTime(new Date());
        updatedInfo.create_time = $scope.dataset.create_time;
        updatedInfo.from_literature_id = 0;

        datasetService.update(updatedInfo, function (data) {
            datasetService.get({datasetId: $stateParams.id}, function (data) {
                $scope.dataset.from_literature_id = data.from_literature_id;
                $scope.dataset.from_literature_name = data.from_literature_name;
            });
        });

    }, function () {

    };
}]);