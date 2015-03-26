var commentModule = angular.module('CommentModule', []);

commentModule.controller('CommentRateCtrl', function($scope){
	$scope.rate = 3;
});

commentModule.controller('CommentShowCtrl', function($scope){
	$scope.currentPage = 1;
	$scope.totalItems = 100;
	$scope.itemsPerPage = 10;
	
});