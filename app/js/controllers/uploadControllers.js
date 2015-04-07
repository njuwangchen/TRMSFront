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
        };
    });

    $scope.uploaded = function () {
        LiteratureService.get({literatureId: $stateParams.id}, function (data) {
            $scope.literatureFile = data;
        });
    };

}]);

uploadModule.controller('VideoUploadCtrl', ['$scope', '$stateParams', '$http', 'RootURL', function ($scope, $stateParams, $http, RootURL) {
    $scope.percent = 0;
    $scope.files = [];

    $scope.videoFiles = '';

    $scope.params = {
        'literature_id': $stateParams.id
    };

    $scope.filter = [
        {
            title: 'Video Files',
            extensions: 'mkv,avi,rmvb,mp4'
        }
    ]

    $scope.getVideos = function () {
        $http.post('http://127.0.0.1:5000/api/v1/videos/query', {literature_id: $stateParams.id}).
            success(function (data, status, headers, config) {
                $scope.videoFiles = data;

                $scope.getFullDownloadURL = function (uri) {
                    return RootURL.rootURL + uri;
                };
            });
    };

    $scope.getVideos();

}]);

uploadModule.controller('PptUploadCtrl', ['$scope', '$stateParams', '$http', 'RootURL', function ($scope, $stateParams, $http, RootURL) {
    $scope.percent = 0;
    $scope.files = [];

    $scope.pptFiles = '';

    $scope.params = {
        'literature_id': $stateParams.id
    };

    $scope.filter = [
        {
            title: 'Ppt Files',
            extensions: 'ppt,pptx'
        }
    ]

    $scope.getPpts = function () {
        $http.post('http://127.0.0.1:5000/api/v1/ppts/query', {literature_id: $stateParams.id}).
            success(function (data, status, headers, config) {
                $scope.pptFiles = data;

                $scope.getFullDownloadURL = function (uri) {
                    return RootURL.rootURL + uri;
                };
            });
    };

    $scope.getPpts();

}]);

uploadModule.controller('codeUploadCtrl', ['$scope', '$stateParams', 'codeService', 'RootURL', function ($scope, $stateParams, codeService, RootURL) {
    $scope.percent = 0;
    $scope.files = [];

    $scope.params = {
        'code_id': $stateParams.id
    };

    codeService.get({codeId: $stateParams.id}, function (data) {
        $scope.codeFile = data;
        $scope.getFullDownloadURL = function () {
            return RootURL.rootURL + $scope.codeFile.uri;
        };
    });

    $scope.uploaded = function () {
        codeService.get({codeId: $stateParams.id}, function (data) {
            $scope.codeFile = data;
        });
    };

}]);