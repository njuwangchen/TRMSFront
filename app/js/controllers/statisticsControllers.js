/**
 * Created by justsavor on 15/4/24.
 */
var statisticsModule = angular.module('statisticsModule', []);

statisticsModule.controller('statisticsCtrl', ['$scope', 'userService', '$http', '$modal', function($scope, userService, $http, $modal){
    $scope.userList=[];
    $scope.literatureList=[];

    $scope.isActiveSeven = false;
    $scope.isActiveThirty = false;
    $scope.isActiveTotal = false;

    userService.query(function (data) {
        $scope.userList = data;



        var today = new Date();
        today.setDate(today.getDate()-7);

        count(data, today);

    });
        $scope.showSeven = function(){
            userService.query(function (data) {
                $scope.userList = data;
                var today = new Date();
                today.setDate(today.getDate()-7);
                count(data, today);
            });
            $scope.isActiveSeven = true;
            $scope.isActiveThirty = false;
            $scope.isActiveTotal = false;
        };

        $scope.showThirty = function(){
            userService.query(function (data) {
                $scope.userList = data;
                var today = new Date();
                today.setDate(today.getDate()-30);
                count(data, today);
            });
            $scope.isActiveSeven = false;
            $scope.isActiveThirty = true;
            $scope.isActiveTotal = false;
        };

        $scope.showTotal = function(){
            userService.query(function (data) {
                $scope.userList = data;
                var today = new Date();
                today.setDate(today.getDate()-1000000);
                count(data, today);
            });
            $scope.isActiveSeven = false;
            $scope.isActiveThirty = false;
            $scope.isActiveTotal = true;
        };

        function count(data, today) {

            for (var p = 0; p < data.length; p++) {

                (function (id, p) {

                    $http.post('http://127.0.0.1:5000/api/v1/literatures/query', {creator_id: id})
                        .success(function (data) {
                            var countLiteratureCreated = 0;

                            for (var i = 0; i < data.length; i++) {
                                var createTime = new Date(Date.parse(data[i]['create_time'].replace(/-/g, "/")));
                                if (createTime >= today) {
                                    countLiteratureCreated += 1;
                                }
                            }
                            //console.log(countLiteratureCreated);
                            $scope.userList[p]['countLiteratureCreated'] = countLiteratureCreated;
                            console.log($scope.userList[p]['countLiteratureCreated']);
                        });


                })(data[p]['id'], p);

                (function (id, p) {

                    $http.post('http://127.0.0.1:5000/api/v1/literatures/query', {updater_id: id})
                        .success(function (data) {
                            var countLiteratureUpdated = 0;
                            for (var i = 0; i < data.length; i++) {
                                var createTime = new Date(Date.parse(data[i]['update_time'].replace(/-/g, "/")));
                                if (createTime >= today) {
                                    countLiteratureUpdated += 1;
                                }
                            }
                            //console.log(countLiteratureUpdated);
                            $scope.userList[p]['countLiteratureUpdated'] = countLiteratureUpdated;
                        });


                })(data[p]['id'], p);

                (function (id, p) {

                    $http.post('http://127.0.0.1:5000/api/v1/data_sets/query', {creator_id: id})
                        .success(function (data) {
                            var countDataSetCreated = 0;
                            for (var i = 0; i < data.length; i++) {
                                var createTime = new Date(Date.parse(data[i]['create_time'].replace(/-/g, "/")));
                                if (createTime >= today) {
                                    countDataSetCreated += 1;
                                }
                            }
                            //console.log(countDataSetCreated);
                            $scope.userList[p]['countDataSetCreated'] = countDataSetCreated;
                        });


                })(data[p]['id'], p);

                (function (id, p) {

                    $http.post('http://127.0.0.1:5000/api/v1/data_sets/query', {updater_id: id})
                        .success(function (data) {
                            var countDataSetUpdated = 0;
                            for (var i = 0; i < data.length; i++) {
                                var createTime = new Date(Date.parse(data[i]['update_time'].replace(/-/g, "/")));
                                if (createTime >= today) {
                                    countDataSetUpdated += 1;
                                }
                            }
                            //console.log(countDataSetUpdated);
                            $scope.userList[p]['countDataSetUpdated'] = countDataSetUpdated;
                        });


                })(data[p]['id'], p);

                (function (id, p) {

                    $http.post('http://127.0.0.1:5000/api/v1/codes/query', {creator_id: id})
                        .success(function (data) {
                            var countCodeCreated = 0;
                            for (var i = 0; i < data.length; i++) {
                                var createTime = new Date(Date.parse(data[i]['create_time'].replace(/-/g, "/")));
                                if (createTime >= today) {
                                    countCodeCreated += 1;
                                }
                            }
                            //console.log(countCodeCreated);
                            $scope.userList[p]['countCodeCreated'] = countCodeCreated;
                        });


                })(data[p]['id'], p);

                (function (id, p) {

                    $http.post('http://127.0.0.1:5000/api/v1/codes/query', {updater_id: id})
                        .success(function (data) {
                            var countCodeUpdated = 0;
                            for (var i = 0; i < data.length; i++) {
                                var createTime = new Date(Date.parse(data[i]['update_time'].replace(/-/g, "/")));
                                if (createTime >= today) {
                                    countCodeUpdated += 1;
                                }
                            }
                            //console.log(countCodeUpdated);
                            $scope.userList[p]['countCodeUpdated'] = countCodeUpdated;
                        });


                })(data[p]['id'], p);

                (function (id, p) {

                    $http.post('http://127.0.0.1:5000/api/v1/reports/query', {creator_id: id})
                        .success(function (data) {
                            var countReportCreated = 0;
                            for (var i = 0; i < data.length; i++) {
                                var createTime = new Date(Date.parse(data[i]['create_time'].replace(/-/g, "/")));
                                if (createTime >= today) {
                                    countReportCreated += 1;
                                }
                            }
                            //console.log(countReportCreated);
                            $scope.userList[p]['countReportCreated'] = countReportCreated;
                        });


                })(data[p]['id'], p);

                (function (id, p) {

                    $http.post('http://127.0.0.1:5000/api/v1/reports/query', {updater_id: id})
                        .success(function (data) {
                            var countReportUpdated = 0;
                            for (var i = 0; i < data.length; i++) {
                                var createTime = new Date(Date.parse(data[i]['update_time'].replace(/-/g, "/")));
                                if (createTime >= today) {
                                    countReportUpdated += 1;
                                }
                            }
                            //console.log(countReportUpdated);
                            $scope.userList[p]['countReportUpdated'] = countReportUpdated;
                        });


                })(data[p]['id'], p);

                (function (id, p) {

                    $http.post('http://127.0.0.1:5000/api/v1/comments/query', {commenter_id: id})
                        .success(function (data) {
                            var countComment = 0;
                            for (var i = 0; i < data.length; i++) {
                                var createTime = new Date(Date.parse(data[i]['comment_time'].replace(/-/g, "/")));
                                if (createTime >= today) {
                                    countComment += 1;
                                }
                            }
                            //console.log(countComment);
                            $scope.userList[p]['countComment'] = countComment;
                        });


                })(data[p]['id'], p);

            }
        }

        $scope.showLiteratureCreated = function(){
            var addLiteratureModal = $modal.open({
            templateUrl: 'partial/literatureGrid.html',
            controller: 'literature_modal_controller',
            size: 'lg',
            resolve: {
                existed: function () {
                    return $scope.literatureList;
                }
            }
        });
        };



}]);

statisticsModule.controller('literature_modal_controller', ['$scope', '$modalInstance', 'LiteratureService', 'Utility', 'existed', function ($scope, $modalInstance, LiteratureService, Utility, existed) {

    LiteratureService.query(function (data) {
        var result = Utility.array_diff(data, existed);
        $scope.literatureList = result;
    });

    $scope.gridOptions = {
        data: 'literatureList',
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
            cellTemplate: '<div class="ui-grid-cell-contents"><a ui-sref="viewLiterature({id:row.entity.id})" target="_blank">{{grid.getCellValue(row, col)}}</a></div>'
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
}]);