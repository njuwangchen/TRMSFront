var literatureModule = angular.module('LiteratureModule', []);

literatureModule.controller('LiteratureListCtrl', function($scope, $http){

	$http.get('data/literatureList.json').success(function(data){
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
        	cellTemplate: '<div><a ui-sref="viewLiterature">{{grid.getCellValue(row, col)}}</a></div>'
        }, {
        	field: "creator", 
        	displayName: "创建者"
        }, {
        	field: "updater", 
        	displayName: "更新者"
        }, {
        	field: "create_time", 
        	displayName: "创建时间"
        }, {
        	field: "update_time", 
        	displayName: "更新时间"
        }]
    };
});