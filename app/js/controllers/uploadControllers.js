var uploadModule = angular.module('UploadModule', []);

uploadModule.controller('LiteratureUploadCtrl', ['$scope', '$stateParams', 'LiteratureService', 'RootURL', function ($scope, $stateParams, LiteratureService, RootURL) {
    $scope.percent = 0;
    $scope.files = [];

    $scope.params = {
        'literature_id': $stateParams.id
    };

    LiteratureService.get({literatureId: $stateParams.id}, function (data) {
        $scope.literatureFile = data;
        $scope.getFullDownloadURL = function () {
            return RootURL.rootURL + $scope.literatureFile.uri;
        }
    });

    $scope.uploaded = function () {
        LiteratureService.get({literatureId: $stateParams.id}, function (data) {
            $scope.literatureFile = data;
        });
    };

}]);

uploadModule.controller('VideoUploadCtrl', function ($scope) {
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

uploadModule.controller('PptUploadCtrl', function ($scope) {
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