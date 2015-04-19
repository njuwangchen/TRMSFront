var relationModule = angular.module('RelationModule', []);

relationModule.factory('Data_set_literature_service', ['$resource', function ($resource) {
    return $resource('http://127.0.0.1:5000/api/v1/data_set_literatures');
}]);

relationModule.factory('Code_literature_service', ['$resource', function ($resource) {
    return $resource('http://127.0.0.1:5000/api/v1/code_literatures');
}]);

relationModule.factory('Cite_service', ['$resource', function ($resource) {
    return $resource('http://127.0.0.1:5000/api/v1/cites');
}]);

relationModule.controller('Literature_data_set_controller', ['$scope', '$stateParams', '$modal', '$http', 'Data_set_literature_service', function ($scope, $stateParams, $modal, $http, Data_set_literature_service) {
    var literatureId = $stateParams.id;
    var data_set_literature = {};
    data_set_literature.literature_id = literatureId;

    $scope.data_set_list = [];

    $scope.update_data_set_list = function () {
        $http.post('http://127.0.0.1:5000/api/v1/data_set_literatures/query', {literature_id: literatureId}).success(function (data) {
            $scope.data_set_list = data;
        });
    };

    $scope.update_data_set_list();

    $scope.add = function () {
        var addDataSetModal = $modal.open({
            templateUrl: 'partial/dataSetGrid.html',
            controller: 'Literature_data_set_modal_controller',
            size: 'lg',
            resolve: {
                existed: function () {
                    return $scope.data_set_list;
                }
            }
        });

        addDataSetModal.result.then(function (data_set_id) {
            data_set_literature.data_set_id = data_set_id;
            Data_set_literature_service.save(data_set_literature, function (data) {
                $scope.update_data_set_list();
            });
        }, function () {

        });
    };
}]);

relationModule.controller('Literature_data_set_modal_controller', ['$scope', '$modalInstance', 'datasetService', 'Utility', 'existed', function ($scope, $modalInstance, datasetService, Utility, existed) {
    $scope.isFavor = true;

    datasetService.query(function (data) {
        var result = Utility.array_diff(data, existed);
        $scope.datasetList = result;
    });

    $scope.gridOptions = {
        data: 'datasetList',
        enableFiltering: true,
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
            cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.add_data_set(row.entity.id)" href>{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            field: "size",
            displayName: "大小"
        }, {
            field: "type_name",
            displayName: "类型"
        }, {
            field: "rank_str",
            displayName: "评分/人数"
        }]
    };

    $scope.add_data_set = function (data_set_id) {
        $modalInstance.close(data_set_id);
    };

}]);

relationModule.controller('Literature_code_controller', ['$scope', '$stateParams', '$modal', '$http', 'Code_literature_service', function ($scope, $stateParams, $modal, $http, Code_literature_service) {
    var literatureId = $stateParams.id;
    var code_literature = {};
    code_literature.literature_id = literatureId;

    $scope.code_list = [];

    $scope.update_code_list = function () {
        $http.post('http://127.0.0.1:5000/api/v1/code_literatures/query', {literature_id: literatureId}).success(function (data) {
            $scope.code_list = data;
        });
    };

    $scope.update_code_list();

    $scope.add = function () {
        var addCodeModal = $modal.open({
            templateUrl: 'partial/codeGrid.html',
            controller: 'Literature_code_modal_controller',
            size: 'lg',
            resolve: {
                existed: function () {
                    return $scope.code_list;
                }
            }
        });

        addCodeModal.result.then(function (code_id) {
            code_literature.code_id = code_id;
            Code_literature_service.save(code_literature, function (data) {
                $scope.update_code_list();
            });
        }, function () {

        });
    };
}]);

relationModule.controller('Literature_code_modal_controller', ['$scope', '$modalInstance', 'codeService', 'Utility', 'existed', function ($scope, $modalInstance, codeService, Utility, existed) {
    $scope.isFavor = true;

    codeService.query(function (data) {
        var result = Utility.array_diff(data, existed);
        $scope.codeList = result;
    });

    $scope.gridOptions = {
        data: 'codeList',
        enableFiltering: true,
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
            cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.add_code(row.entity.id)" href>{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            field: "size",
            displayName: "大小"
        }, {
            field: "language",
            displayName: "语言"
        }, {
            field: "rank_str",
            displayName: "评分/人数"
        }]
    };

    $scope.add_code = function (code_id) {
        $modalInstance.close(code_id);
    };

}]);

relationModule.controller('Cite_controller', ['$scope', '$stateParams', '$modal', '$http', 'Cite_service', function ($scope, $stateParams, $modal, $http, Cite_service) {
    var literatureId = $stateParams.id;
    var cite = {};
    cite.literature_id = literatureId;

    $scope.cite_list = [];
    $scope.cite_literature_list = [];

    $scope.update_cite_list = function () {
        $http.post('http://127.0.0.1:5000/api/v1/cites/query', {literature_id: literatureId}).success(function (data) {
            $scope.cite_list = data;

            var ids = new Array();
            for (var i = 0; i < data.length; i++) {
                ids.push(data[i].cited_id);
            }
            $http.post('http://127.0.0.1:5000/api/v1/literatures/batch', {ids: ids}).success(function (data) {
                $scope.cite_literature_list = data;
            });
        });
    };

    $scope.update_cite_list();

    $scope.add = function () {
        var addCiteModal = $modal.open({
            templateUrl: 'partial/literatureGrid.html',
            controller: 'Cite_modal_controller',
            size: 'lg',
            resolve: {
                existed: function () {
                    return $scope.cite_literature_list;
                }
            }
        });

        addCiteModal.result.then(function (pcite) {
            cite.cited_id = pcite.cited_id;
            cite.cite_type_id = pcite.cite_type_id;
            Cite_service.save(cite, function (data) {
                $scope.update_cite_list();
            });
        }, function () {

        });
    };
}]);

relationModule.controller('Cite_modal_controller', ['$scope', '$modalInstance', '$http', 'LiteratureService', 'Utility', 'existed', function ($scope, $modalInstance, $http, LiteratureService, Utility, existed) {
    $scope.isFavor = true;
    $scope.isCite = true;
    $scope.cite_type_list = [];

    LiteratureService.query(function (data) {
        var result = Utility.array_diff(data, existed);
        $scope.citeList = result;
    });

    $http.post('http://127.0.0.1:5000/api/v1/types/query', {name: "", type_id: 3}).
        success(function (data) {
            $scope.cite_type_list = data;
            $scope.selectedType = $scope.cite_type_list[0];
        });

    $scope.gridOptions = {
        data: 'citeList',
        enableFiltering: true,
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
            cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.add_cited(row.entity.id)" href>{{grid.getCellValue(row, col)}}</a></div>'
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

    $scope.add_cited = function (cited_id) {
        var pcite = {};
        pcite.cited_id = cited_id;
        pcite.cite_type_id = $scope.selectedType.id;
        $modalInstance.close(pcite);
    };

}]);

relationModule.controller('Cited_controller', ['$scope', '$stateParams', '$modal', '$http', 'Cite_service', function ($scope, $stateParams, $modal, $http, Cite_service) {
    var literatureId = $stateParams.id;
    var cite = {};
    cite.cited_id = literatureId;

    $scope.cited_list = [];
    $scope.cited_literature_list = [];

    $scope.update_cited_list = function () {
        $http.post('http://127.0.0.1:5000/api/v1/cites/query', {cited_id: literatureId}).success(function (data) {
            $scope.cited_list = data;

            var ids = new Array();
            for (var i = 0; i < data.length; i++) {
                ids.push(data[i].literature_id);
            }
            $http.post('http://127.0.0.1:5000/api/v1/literatures/batch', {ids: ids}).success(function (data) {
                $scope.cited_literature_list = data;
            });
        });
    };

    $scope.update_cited_list();

    $scope.add = function () {
        var addCitedModal = $modal.open({
            templateUrl: 'partial/literatureGrid.html',
            controller: 'Cited_modal_controller',
            size: 'lg',
            resolve: {
                existed: function () {
                    return $scope.cited_literature_list;
                }
            }
        });

        addCitedModal.result.then(function (pcite) {
            cite.literature_id = pcite.literature_id;
            cite.cite_type_id = pcite.cite_type_id;
            Cite_service.save(cite, function (data) {
                $scope.update_cited_list();
            });
        }, function () {

        });
    };
}]);

relationModule.controller('Cited_modal_controller', ['$scope', '$modalInstance', '$http', 'LiteratureService', 'Utility', 'existed', function ($scope, $modalInstance, $http, LiteratureService, Utility, existed) {
    $scope.isFavor = true;
    $scope.isCite = true;
    $scope.cite_type_list = [];

    LiteratureService.query(function (data) {
        var result = Utility.array_diff(data, existed);
        $scope.citedList = result;
    });

    $http.post('http://127.0.0.1:5000/api/v1/types/query', {name: "", type_id: 3}).
        success(function (data) {
            $scope.cite_type_list = data;
            $scope.selectedType = $scope.cite_type_list[0];
        });

    $scope.gridOptions = {
        data: 'citedList',
        enableFiltering: true,
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
            cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.add_literature(row.entity.id)" href>{{grid.getCellValue(row, col)}}</a></div>'
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

    $scope.add_literature = function (literature_id) {
        var pcite = {};
        pcite.literature_id = literature_id;
        pcite.cite_type_id = $scope.selectedType.id;
        $modalInstance.close(pcite);
    };
}]);


