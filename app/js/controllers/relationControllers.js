var relationModule = angular.module('RelationModule', []);

relationModule.factory('Data_set_literature_service', ['$resource', function($resource){
    return $resource('http://127.0.0.1:5000/api/v1/data_set_literatures');
}]);

relationModule.controller('Literature_data_set_controller', ['$scope', '$stateParams', '$modal', '$http', 'Data_set_literature_service', function($scope, $stateParams, $modal, $http, Data_set_literature_service){
    var literatureId = $stateParams.id;
    data_set_literature = {};
    data_set_literature.literature_id = literatureId;

    $scope.data_set_list = [];

    $scope.update_data_set_list = function () {
        $http.post('http://127.0.0.1:5000/api/v1/data_set_literatures/query', {literature_id: literatureId}).success(function (data) {
            $scope.data_set_list = data;
        });
    };

    $scope.update_data_set_list();

    $scope.add = function(){
        var addDataSetModal = $modal.open({
            templateUrl : 'partial/dataSetGrid.html',
            controller: 'Literature_data_set_modal_controller',
            size: 'lg',
            resolve: {
                existed: function () {
                    return $scope.data_set_list;
                }
            }
        });

        addDataSetModal.result.then(function(data_set_id){
            data_set_literature.data_set_id = data_set_id;
            Data_set_literature_service.save(data_set_literature, function(data){
                $scope.update_data_set_list();
            });
        }, function(){

        });
    };
}]);

relationModule.controller('Literature_data_set_modal_controller', ['$scope', '$modalInstance', 'datasetService', 'Utility', 'existed', function($scope, $modalInstance, datasetService, Utility, existed){
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

    $scope.add_data_set = function(data_set_id){
        $modalInstance.close(data_set_id);
    };

}]);