/**
 * Created by justsavor on 15/4/24.
 */
var statisticsModule = angular.module('statisticsModule', []);

statisticsModule.controller('statisticsCtrl', ['$scope', 'userService', '$http', '$modal', '$rootScope', function($scope, userService, $http, $modal, $rootScope){
    $scope.userList=[];

    $rootScope.isFavor = true;

    $scope.days=7;

    $scope.isActiveSeven = true;
    $scope.isActiveThirty = false;
    $scope.isActiveTotal = false;
    $scope.isActiveSixmonths = false;

    count(7);

    $scope.showSeven = function(){
        count(7);
        $scope.days=7;
        $scope.isActiveSeven = true;
        $scope.isActiveThirty = false;
        $scope.isActiveTotal = false;
        $scope.isActiveSixmonths = false;
    };

    $scope.showThirty = function(){
        count(30);
        $scope.days=30;
        $scope.isActiveSeven = false;
        $scope.isActiveThirty = true;
        $scope.isActiveTotal = false;
        $scope.isActiveSixmonths = false;
    };

    $scope.showTotal = function(){
        count(100000);
        $scope.days=100000;
        $scope.isActiveSeven = false;
        $scope.isActiveThirty = false;
        $scope.isActiveTotal = true;
        $scope.isActiveSixmonths = false;
    };

    $scope.showSixmonths = function () {
        count(180);
        $scope.days=180;
        $scope.isActiveSeven = false;
        $scope.isActiveThirty = false;
        $scope.isActiveTotal = false;
        $scope.isActiveSixmonths = true;
    }

    function count(days){
        $http.get('http://121.40.106.155:5000/api/v1/statistics/'+ days)
            .success(function(data){
                var sort = function (a, b) {
                    return a.userName.localeCompare(b.userName);
                };
                $scope.statisticsList = data;
                $scope.statisticsList.sort(sort);
            });
    }

    $scope.showLiterature = function(userId,days){
        var addLiteratureModal = $modal.open({
            templateUrl: 'partial/literatureGrid.html',
            controller: 'literature_modal_controller',
            size: 'lg',
            resolve: {
                userId: function(){
                    return userId;
                },
                days: function(){
                    return days;
                }
            }
        });
    };

    $scope.showDataSet = function(userId,days){
        var addDataSetModal = $modal.open({
            templateUrl: 'partial/dataSetGrid.html',
            controller: 'dataSet_modal_controller',
            size: 'lg',
            resolve: {
                userId: function(){
                    return userId;
                },
                days: function(){
                    return days;
                }
            }
        });
    }

    $scope.showCode = function(userId,days){
        var addCodeModal = $modal.open({
            templateUrl: 'partial/codeGrid.html',
            controller: 'code_modal_controller',
            size: 'lg',
            resolve: {
                userId: function(){
                    return userId;
                },
                days: function(){
                    return days;
                }
            }
        });
    }

    $scope.showReport = function(userId,days){
        var addReportModal = $modal.open({
            templateUrl: 'partial/reportGrid.html',
            controller: 'report_modal_controller',
            size: 'lg',
            resolve: {
                userId: function(){
                    return userId;
                },
                days: function(){
                    return days;
                }
            }
        });
    }

    $scope.showSimpleComment = function(userId,days){
        var addCommentModal = $modal.open({
            templateUrl: 'partial/commentGrid.html',
            controller: 'simpleComment_modal_controller',
            size: 'lg',
            resolve: {
                userId: function(){
                    return userId;
                },
                days: function(){
                    return days;
                }
            }
        });
    }

    $scope.showComplexComment = function(userId,days){
        var addCommentModal = $modal.open({
            templateUrl: 'partial/commentGrid.html',
            controller: 'complexComment_modal_controller',
            size: 'lg',
            resolve: {
                userId: function(){
                    return userId;
                },
                days: function(){
                    return days;
                }
            }
        });
    }


}]);

statisticsModule.controller('literature_modal_controller', ['$scope', '$modalInstance', '$http', 'LiteratureService', 'Utility', 'userId', 'days', function ($scope, $modalInstance, $http, LiteratureService, Utility, userId, days) {
    var literatureList = [];
    $scope.literatureList = [];

    $scope.getDetails = function (userId, days){
        $http.post('http://121.40.106.155:5000/api/v1/literatures/query', {creator_id: userId})
                        .success(function (data) {
                literatureList = data;
                $http.post('http://121.40.106.155:5000/api/v1/literatures/query', {updater_id: userId})
                    .success(function(data){
                        for(var i=0;i<data.length;i++){
                            literatureList.push(data[i]);
                        }
                        $scope.updateLiteratureList(days);
                });
            });
    }
    $scope.getDetails(userId, days);

    function isContain(list,obj){
        for(var i=0;i<list.length;i++){
            if(list[i]['title']==obj){
                return true;
            }
        }
        return false;
    }


    $scope.updateLiteratureList = function(days){
        var today=new Date();
        today = today.setDate(today.getDate()-days);
        for(var i=0;i<literatureList.length;i++){
            var createTime = new Date(Date.parse(literatureList[i]['create_time'].replace(/-/g, "/")));
            var temp = $scope.literatureList;
            if(createTime >= today&&literatureList[i]['creator_id'] == userId){
                if(!isContain(temp,literatureList[i]['title'])){
                    $scope.literatureList.push(literatureList[i]);
                }
            }
        }
        if($scope.literatureList.length>0) {
            for (var i = 0; i < literatureList.length; i++) {
                if(literatureList[i]['update_time']==null){
                    continue;
                }
                var temp = $scope.literatureList;
                var updateTime = new Date(Date.parse(literatureList[i]['update_time'].replace(/-/g, "/")));
                if (updateTime >= today && literatureList[i]['updater_id'] == userId) {

                    if(isContain(temp,literatureList[i]['title'])){
                        continue;
                    }
                    else{
                        $scope.literatureList.push(literatureList[i]);
                    }

                }
            }
        }
        else{
            for (var i = 0; i < literatureList.length; i++) {
                if(literatureList[i]['update_time']==null){
                    continue;
                }
                var updateTime = new Date(Date.parse(literatureList[i]['update_time'].replace(/-/g, "/")));
                if (updateTime >= today&&literatureList[i]['updater_id'] == userId) {
                    if(!isContain(temp,literatureList[i]['title'])) {
                        $scope.literatureList.push(literatureList[i]);
                    }
                }
            }
        }
    }


    $scope.gridOptions = {
        data: $scope.literatureList,
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
            //cellTemplate: '<div class="ui-grid-cell-contents"><a target="_blank" ui-sref="viewLiterature({id:row.entity.id})" >{{grid.getCellValue(row, col)}}</a></div>'
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="http://121.40.106.155/#/viewLiterature/{{row.entity.id}}" target="_blank">{{grid.getCellValue(row, col)}}</a></div>'
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

statisticsModule.controller('dataSet_modal_controller', ['$scope', '$modalInstance', '$http', 'Utility', 'userId', 'days', function ($scope, $modalInstance, $http, Utility, userId, days) {

    var dataSetList = [];
    $scope.dataSetList = [];

    $scope.getDetails = function (userId, days){
        $http.post('http://121.40.106.155:5000/api/v1/data_sets/query', {creator_id: userId})
                        .success(function (data) {
                dataSetList = data;
                $http.post('http://121.40.106.155:5000/api/v1/data_sets/query', {updater_id: userId})
                    .success(function(data){
                        for(var i=0;i<data.length;i++){
                            dataSetList.push(data[i]);
                        }
                        $scope.updateDataSetList(days);
                });
            });
    }
    $scope.getDetails(userId, days);

    function isContain(list,obj){
        for(var i=0;i<list.length;i++){
            if(list[i]['title']==obj){
                return true;
            }
        }
        return false;
    }

    $scope.updateDataSetList = function(days){
        var today=new Date();
        today = today.setDate(today.getDate()-days);
        for(var i=0;i<dataSetList.length;i++){
            var createTime = new Date(Date.parse(dataSetList[i]['create_time'].replace(/-/g, "/")));
            var temp = $scope.dataSetList;
            if(createTime >= today&&dataSetList[i]['creator_id'] == userId){
                if(!isContain(temp, dataSetList[i]['title'])) {
                    $scope.dataSetList.push(dataSetList[i]);
                }
            }
        }
        if($scope.dataSetList.length>0) {
            for (var i = 0; i < dataSetList.length; i++) {
                if(dataSetList[i]['update_time']==null){
                    continue;
                }
                var temp = $scope.dataSetList;
                var updateTime = new Date(Date.parse(dataSetList[i]['update_time'].replace(/-/g, "/")));
                if (updateTime >= today&&dataSetList[i]['updater_id'] == userId) {
                    if(!isContain(temp,dataSetList[i]['title'])){
                        $scope.dataSetList.push(dataSetList[i]);
                    }

                }
            }
        }
        else{
            for (var i = 0; i < dataSetList.length; i++) {
                if(dataSetList[i]['update_time']==null){
                    continue;
                }
                var updateTime = new Date(Date.parse(dataSetList[i]['update_time'].replace(/-/g, "/")));
                if (updateTime >= today&&dataSetList[i]['updater_id'] == userId) {
                    if(!isContain(temp,dataSetList[i]['title'])) {
                        $scope.dataSetList.push(dataSetList[i]);
                    }
                }
            }
        }
    }

    $scope.gridOptions = {
        data: $scope.dataSetList,
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
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="http://121.40.106.155/#/viewDataSet/{{row.entity.id}}" target="_blank">{{grid.getCellValue(row, col)}}</a></div>'
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
}]);

statisticsModule.controller('code_modal_controller', ['$scope', '$modalInstance', '$http', 'Utility', 'userId', 'days', function ($scope, $modalInstance, $http, Utility, userId, days) {

    var codeList = [];
    $scope.codeList = [];

    $scope.getDetails = function (userId, days){
        $http.post('http://121.40.106.155:5000/api/v1/codes/query', {creator_id: userId})
                        .success(function (data) {
                codeList = data;
                $http.post('http://121.40.106.155:5000/api/v1/codes/query', {updater_id: userId})
                    .success(function(data){
                        for(var i=0;i<data.length;i++){
                            codeList.push(data[i]);
                        }
                        $scope.updateCodeList(days);
                });
            });
    }
    $scope.getDetails(userId, days);

    function isContain(list,obj){
        for(var i=0;i<list.length;i++){
            if(list[i]['title']==obj){
                return true;
            }
        }
        return false;
    }

    $scope.updateCodeList = function(days){
        var today=new Date();
        today = today.setDate(today.getDate()-days);
        for(var i=0;i<codeList.length;i++){
            var createTime = new Date(Date.parse(codeList[i]['create_time'].replace(/-/g, "/")));
            var temp = $scope.codeList;
            if(createTime >= today&&codeList[i]['creator_id'] == userId){
                if(!isContain(temp, codeList[i]['title'])){
                    $scope.codeList.push(codeList[i]);
                }
            }
        }
        if($scope.codeList.length>0) {
            for (var i = 0; i < codeList.length; i++) {
                if(codeList[i]['update_time']==null){
                    continue;
                }
                var temp = $scope.codeList;
                var updateTime = new Date(Date.parse(codeList[i]['update_time'].replace(/-/g, "/")));
                if (updateTime >= today&&codeList[i]['updater_id'] == userId) {

                    if(isContain(temp,codeList[i]['title'])){
                        continue;
                    }
                    else{
                        $scope.codeList.push(codeList[i]);
                    }

                }
            }
        }
        else{
            for (var i = 0; i < codeList.length; i++) {
                if(codeList[i]['update_time']==null){
                    continue;
                }
                var updateTime = new Date(Date.parse(codeList[i]['update_time'].replace(/-/g, "/")));
                if (updateTime >= today&&codeList[i]['updater_id'] == userId) {
                    if(!isContain(temp, codeList[i]['title'])){
                        $scope.codeList.push(codeList[i]);
                    }
                }
            }
        }
    }

    $scope.gridOptions = {
        data: $scope.codeList,
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
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="http://121.40.106.155/#/viewCode/{{row.entity.id}}" target="_blank">{{grid.getCellValue(row, col)}}</a></div>'
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
}]);

statisticsModule.controller('report_modal_controller', ['$scope', '$modalInstance', '$http', 'Utility', 'userId', 'days', function ($scope, $modalInstance, $http, Utility, userId, days) {

    var reportList = [];
    $scope.reportList = [];

    $scope.getDetails = function (userId, days){
        $http.post('http://121.40.106.155:5000/api/v1/reports/query', {creator_id: userId})
                        .success(function (data) {
                reportList = data;
                $http.post('http://121.40.106.155:5000/api/v1/reports/query', {updater_id: userId})
                    .success(function(data){
                        for(var i=0;i<data.length;i++){
                            reportList.push(data[i]);
                        }
                        $scope.updateReportList(days);
                });
            });
    }
    $scope.getDetails(userId, days);

    function isContain(list,obj){
        for(var i=0;i<list.length;i++){
            if(list[i]['title']==obj){
                return true;
            }
        }
        return false;
    }

    $scope.updateReportList = function(days){
        var today=new Date();
        today = today.setDate(today.getDate()-days);
        for(var i=0;i<reportList.length;i++){
            var createTime = new Date(Date.parse(reportList[i]['create_time'].replace(/-/g, "/")));
            var temp = $scope.reportList;
            if(createTime >= today&&reportList[i]['creator_id'] == userId){
                if(!isContain(temp, reportList[i]['title'])) {
                    $scope.reportList.push(reportList[i]);
                }
            }
        }
        if($scope.reportList.length>0) {
            for (var i = 0; i < reportList.length; i++) {
                if(reportList[i]['update_time']==null){
                    continue;
                }
                var temp = $scope.reportList;
                var updateTime = new Date(Date.parse(reportList[i]['update_time'].replace(/-/g, "/")));
                if (updateTime >= today&&reportList[i]['updater_id'] == userId) {

                    if(isContain(temp,reportList[i]['title'])){
                        continue;
                    }
                    else{
                        $scope.reportList.push(reportList[i]);
                    }
                }
            }
        }
        else{
            for (var i = 0; i < reportList.length; i++) {
                if(reportList[i]['update_time']==null){
                    continue;
                }
                var updateTime = new Date(Date.parse(reportList[i]['update_time'].replace(/-/g, "/")));
                if (updateTime >= today&&reportList[i]['updater_id'] == userId) {
                    if(!isContain(temp, reportList[i]['title'])) {
                        $scope.reportList.push(reportList[i]);
                    }
                }
            }
        }
    }

    $scope.gridOptions = {
        data: $scope.reportList,
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
            cellTemplate: '<div class="ui-grid-cell-contents"><a href="http://121.40.106.155/#/viewReport/{{row.entity.id}}" target="_blank">{{grid.getCellValue(row, col)}}</a></div>'
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
}]);

statisticsModule.controller('simpleComment_modal_controller', ['$scope', '$modalInstance', '$http', 'Utility', 'userId', 'days', function ($scope, $modalInstance, $http, Utility, userId, days) {

    var commentList = [];
    $scope.commentList = [];

    $scope.getDetails = function(userId, days){
        $http.post('http://121.40.106.155:5000/api/v1/comments/query', {commenter_id: userId}).success(function(data){
            commentList = data;
            var today=new Date();
            today = today.setDate(today.getDate()-days);
            for(var i=0;i<data.length;i++){
                var createTime = new Date(Date.parse(data[i]['comment_time'].replace(/-/g, "/")));
                if(createTime >= today){
                    if(data[i]['is_simple']){
                        $scope.commentList.push(data[i]);
                    }
                }
            }
        });
    };
    $scope.getDetails(userId,days);

    function getUrl(type){
        if(type==1){
            return '<div class="ui-grid-cell-contents"><a href="http://121.40.106.155/#/viewLiterature/{{row.entity.id}}" target="_blank">{{grid.getCellValue(row, col)}}</a></div>'
        }
        else if(type==2){
            return '<div class="ui-grid-cell-contents"><a href="http://121.40.106.155/#/viewDataSet/{{row.entity.id}}" target="_blank">{{grid.getCellValue(row, col)}}</a></div>'
        }
        else if(type==3){
            return '<div class="ui-grid-cell-contents"><a href="http://121.40.106.155/#/viewCode/{{row.entity.id}}" target="_blank">{{grid.getCellValue(row, col)}}</a></div>'
        }
        else if(type==4){
            return '<div class="ui-grid-cell-contents"><a href="http://121.40.106.155/#/viewReport/{{row.entity.id}}" target="_blank">{{grid.getCellValue(row, col)}}</a></div>'
        }
    }


    $scope.gridOptions = {
        data: $scope.commentList,
        enableFiltering: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
        enableColumnResizing: true,
        paginationPageSizes: [20, 50, 100],
        paginationPageSize: 20,
        columnDefs: [{
            field: "resource_name",
            displayName: "标题",
            width: 300,
            //cellTemplate: getUrl(grid.getCellValue(row, col))
        }, {
            field: "resource_type_name",
            displayName: "资源种类"
        }, {
            field: "comment_time",
            displayName: "评论时间"
        }]
    };
}]);

statisticsModule.controller('complexComment_modal_controller', ['$scope', '$modalInstance', '$http', 'Utility', 'userId', 'days', function ($scope, $modalInstance, $http, Utility, userId, days) {

    var commentList = [];
    $scope.commentList = [];

    $scope.getDetails = function(userId, days){
        $http.post('http://121.40.106.155:5000/api/v1/comments/query', {commenter_id: userId}).success(function(data){
            commentList = data;
            var today=new Date();
            today = today.setDate(today.getDate()-days);
            for(var i=0;i<data.length;i++){
                var createTime = new Date(Date.parse(data[i]['comment_time'].replace(/-/g, "/")));
                if(createTime >= today){
                    if(!data[i]['is_simple']){
                        $scope.commentList.push(data[i]);
                    }
                }
            }
        });
    };
    $scope.getDetails(userId,days);

    function getUrl(type){
        if(type==1){
            return '<div class="ui-grid-cell-contents"><a href="http://121.40.106.155/#/viewLiterature/{{row.entity.id}}" target="_blank">{{grid.getCellValue(row, col)}}</a></div>'
        }
        else if(type==2){
            return '<div class="ui-grid-cell-contents"><a href="http://121.40.106.155/#/viewDataSet/{{row.entity.id}}" target="_blank">{{grid.getCellValue(row, col)}}</a></div>'
        }
        else if(type==3){
            return '<div class="ui-grid-cell-contents"><a href="http://121.40.106.155/#/viewCode/{{row.entity.id}}" target="_blank">{{grid.getCellValue(row, col)}}</a></div>'
        }
        else if(type==4){
            return '<div class="ui-grid-cell-contents"><a href="http://121.40.106.155/#/viewReport/{{row.entity.id}}" target="_blank">{{grid.getCellValue(row, col)}}</a></div>'
        }
    }


    $scope.gridOptions = {
        data: $scope.commentList,
        enableFiltering: true,
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
        enableColumnResizing: true,
        paginationPageSizes: [20, 50, 100],
        paginationPageSize: 20,
        columnDefs: [{
            field: "resource_name",
            displayName: "标题",
            width: 300,
            //cellTemplate: getUrl(grid.getCellValue(row, col))
        }, {
            field: "resource_type_name",
            displayName: "资源种类"
        }, {
            field: "comment_time",
            displayName: "评论时间"
        }]
    };
}]);

