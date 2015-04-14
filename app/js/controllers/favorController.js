/**
 * Created by BAO on 4/8/15.
 */
var favorModule = angular.module('favorModule',[]);

favorModule.controller('favorDatasetListCtrl', ['$scope','$rootScope','$http', function ($scope, $rootScope, $http) {
    $rootScope.showAll = "showFavorLiterature";
    $rootScope.showDataSet = "showFavorDataSet";
    $rootScope.showCode = "showFavorCode";
    $rootScope.showReport = "showFavorReport";

    $rootScope.isFavor = true;

    $rootScope.userId = 1;

    $http.post("http://127.0.0.1:5000/api/v1/favorites/query",{"user_id":$rootScope.userId})
        .success(function(data){
            $rootScope.favorites = data;
            $http.post("http://127.0.0.1:5000/api/v1/favorite_resource/query",{"favorites":$rootScope.favorites,"type":4})
                .success(function (data) {
                    $http.post("http://127.0.0.1:5000/api/v1/data_sets/batch",{"ids":data})
                        .success(function (data) {
                            $scope.favorDatasetList = data;
                        });
                });
        });

    $scope.gridOptions = {
        data: 'favorDatasetList',
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
            cellTemplate: '<div><a ui-sref="viewDataSet({id:row.entity.id})">{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            field: "size",
            displayName: "大小"
        }, {
            field: "type_name",
            displayName: "类型"
        }]
    };
}]);

favorModule.controller('favorCodeListCtrl', ['$scope','$rootScope','$http', function ($scope, $rootScope, $http) {
    $rootScope.showAll = "showFavorLiterature";
    $rootScope.showDataSet = "showFavorDataSet";
    $rootScope.showCode = "showFavorCode";
    $rootScope.showReport = "showFavorReport";
    $rootScope.isFavor = true;

    $rootScope.userId = 1;

    $http.post("http://127.0.0.1:5000/api/v1/favorites/query",{"user_id":$rootScope.userId})
        .success(function(data){
            $rootScope.favorites = data;
            $http.post("http://127.0.0.1:5000/api/v1/favorite_resource/query",{"favorites":$rootScope.favorites,"type":5})
                .success(function (data) {
                    $http.post("http://127.0.0.1:5000/api/v1/codes/batch",{"ids":data})
                        .success(function (data) {
                            $scope.favorCodeList = data;
                        });
                });
        });

    $scope.gridOptions = {
        data: 'favorCodeList',
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
}]);

favorModule.controller('favorReportListCtrl', ['$scope','$rootScope','$http', function ($scope, $rootScope, $http) {
    $rootScope.isFavor = true;

    $rootScope.userId = 1;

    $http.post("http://127.0.0.1:5000/api/v1/favorites/query",{"user_id":$rootScope.userId})
        .success(function(data){
            $rootScope.favorites = data;
            $http.post("http://127.0.0.1:5000/api/v1/favorite_resource/query",{"favorites":$rootScope.favorites,"type":5})
                .success(function (data) {
                    $http.post("http://127.0.0.1:5000/api/v1/reports/batch",{"ids":data})
                        .success(function (data) {
                            $scope.favorReportList = data;
                        });
                });
        });

    $scope.gridOptions = {
        data: 'favorReportList',
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
            cellTemplate: '<div><a ui-sref="viewReport({id:row.entity.id})">{{grid.getCellValue(row, col)}}</a></div>'
        }, {
            field: "reporter",
            displayName: "报告人"
        }, {
            field: "reporter_title",
            displayName: "报告人职位"
        }, {
            field: "company",
            displayName: "组织"
        }]
    };
}]);



favorModule.controller('favorLiteratureListCtrl', ['$scope','$rootScope','$http',function ($scope,$rootScope,$http) {
    $rootScope.showAll = "showFavorLiterature";
    $rootScope.showDataSet = "showFavorDataSet";
    $rootScope.showCode = "showFavorCode";
    $rootScope.showReport = "showFavorReport";

    $rootScope.isFavor = true;


    //fake data
    //获取收藏夹

    $rootScope.userId = 1;

    $http.post("http://127.0.0.1:5000/api/v1/favorites/query",{"user_id":$rootScope.userId})
        .success(function(data){
            $rootScope.favorites = data;
            $http.post("http://127.0.0.1:5000/api/v1/favorite_resource/query",{"favorites":$rootScope.favorites,"type":1})
                .success(function (data) {
                    $http.post("http://127.0.0.1:5000/api/v1/literatures/batch",{"ids":data})
                        .success(function (data) {
                            $scope.favorLiteratureList = data;
                        });
                });
        });


    $scope.gridOptions = {
        data: 'favorLiteratureList',
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


favorModule.controller('someFavorController', function ($scope, $http, $stateParams,$rootScope) {
    $rootScope.showAll = "showFavorLiterature";
    $rootScope.showDataSet = "showFavorDataSet";
    $rootScope.showCode = "showFavorCode";
    $rootScope.showReport = "showFavorReport";

    $rootScope.isFavor = true;

    $rootScope.userId = 1;

    $http.post("http://127.0.0.1:5000/api/v1/favorites/query",{"user_id":$rootScope.userId})
        .success(function(data){
            $rootScope.favorites = data;
        });

    $scope.favorList = [];
    $http.post('http://127.0.0.1:5000/api/v1/favorite_resource/query',{"favorites":[{"id":$stateParams.favorId}],"type":1})
        .success(function (data) {
            $http.post('http://127.0.0.1:5000/api/v1/literatures/batch',{"ids":data})
                .success(function (data) {
                    $scope.favorLiteratureList = data;

                    for(var i =0 ;i <$scope.favorLiteratureList.length;i++)
                            $scope.favorList.push({"title":$scope.favorLiteratureList[i]['title'],"type":"文献"});

                })
        });

    $http.post('http://127.0.0.1:5000/api/v1/favorite_resource/query',{"favorites":[{"id":$stateParams.favorId}],"type":4})
        .success(function (data) {
            $http.post('http://127.0.0.1:5000/api/v1/data_sets/batch',{"ids":data})
                .success(function (data) {
                    $scope.favorDatasetList = data;
                    for(var i =0 ;i <$scope.favorDatasetList.length;i++)
                        $scope.favorList.push({"title":$scope.favorDatasetList[i]['title'],"type":"数据集"});
                })

        });

    $http.post('http://127.0.0.1:5000/api/v1/favorite_resource/query',{"favorites":[{"id":$stateParams.favorId}],"type":5})
        .success(function (data) {
            $http.post('http://127.0.0.1:5000/api/v1/codes/batch',{"ids":data})
                .success(function (data) {
                    $scope.favorCodeList = data;

                    for(var i =0 ;i <$scope.favorCodeList.length;i++)
                        $scope.favorList.push({"title":$scope.favorCodeList[i]['title'],"type":"代码"});

                })
        });

    $http.post('http://127.0.0.1:5000/api/v1/favorite_resource/query',{"favorites":[{"id":$stateParams.favorId}],"type":6})
        .success(function (data) {
            $http.post('http://127.0.0.1:5000/api/v1/reports/batch',{"ids":data})
                .success(function (data) {
                    $scope.favorReportList = data;

                    for(var i =0 ;i <$scope.favorReportList.length;i++)
                        $scope.favorList.push({"title":$scope.favorReportList[i]['title'],"type":"报告"});

                })
        });

    $scope.gridOptions = {
        data: 'favorList',
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
            width: 500
        },{
            field:"type",
            displayName:"类型"
        }]
    };
});