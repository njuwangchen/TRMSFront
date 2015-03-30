var literatureModule = angular.module('LiteratureModule', []);

literatureModule.controller('LiteratureListCtrl', ['$scope', '$resource', function($scope, $resource){

	var literature = $resource('http://127.0.0.1:5000/api/v1/literatures/:literatureId', {literatureId: '@id'});

	literature.query(function(data){
		$scope.literatureList = data;
		console.log($scope.literatureList);
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
        	field: "creator_id",
        	displayName: "创建者"
        }, {
        	field: "updater_id",
        	displayName: "更新者"
        }, {
        	field: "create_time", 
        	displayName: "创建时间"
        }, {
        	field: "update_time", 
        	displayName: "更新时间"
        }]
    };
}]);