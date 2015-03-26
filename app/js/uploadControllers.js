var uploadModule = angular.module('UploadModule', []);

uploadModule.controller('LiteratureUploadCtrl', function($scope){
	$scope.percent = 0;
	$scope.files = [];

	$scope.literatureFile = {
		"name": "abcd.pdf",
	}
});

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