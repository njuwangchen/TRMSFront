var uploadModule = angular.module('UploadModule', []);

uploadModule.controller('LiteratureUploadCtrl', ['$scope', '$stateParams', function($scope, $stateParams){
	$scope.percent = 0;
	$scope.files = [];

	$scope.params = {
		'literature_id': $stateParams.id
	};

	$scope.uploaded = function(){
		$scope.literatureFile = $scope.files[0];
	};

}]);

uploadModule.controller('VideoUploadCtrl', function($scope){
	$scope.percent = 0;
	$scope.files = [];

	$scope.videoFiles = [
		{
			"name": "demo.avi",
			"size": "102232"
		},
		{
			"name": "demo2.avi",
			"size": "233444"	
		}
	];
});

uploadModule.controller('PptUploadCtrl', function($scope){
	$scope.percent = 0;
	$scope.files = [];

	$scope.pptFiles = [
		{
			"name": "1.ppt",
			"size": "1042"
		},
		{
			"name": "2.ppt",
			"size": "2334"	
		}
	];
});