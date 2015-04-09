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

uploadModule.controller('datasetUploadCtrl', ['$scope', '$stateParams', 'datasetService', 'RootURL', function ($scope, $stateParams, datasetService, RootURL) {
    $scope.percent = 0;
    $scope.files = [];

    $scope.params = {
        'data_set_id': $stateParams.id
    };

    datasetService.get({datasetId: $stateParams.id}, function (data) {
        $scope.datasetFile = data;
        $scope.getFullDownloadURL = function () {
            return RootURL.rootURL + $scope.datasetFile.uri;
        };
    });

    $scope.uploaded = function () {
        datasetService.get({datasetId: $stateParams.id}, function (data) {
            $scope.datasetFile = data;
        });
    };

}]);

uploadModule.controller('reportattachmentUploadCtrl', ['$scope', '$stateParams', '$http', 'RootURL', function ($scope, $stateParams, $http, RootURL) {
    $scope.percent = 0;
    $scope.files = [];

    $scope.reportattachmentFiles = '';

    $scope.params = {
        'report_id': $stateParams.id
    };

    $scope.filter = [
        {
            title: 'Reportattachment Files',
            extensions: 'pdf,txt,doc,docx'
        }
    ]

    $scope.getReportattachments = function () {
        $http.post('http://127.0.0.1:5000/api/v1/report_attachments/query', {report_id: $stateParams.id}).
            success(function (data, status, headers, config) {
                $scope.reportattachmentFiles = data;

                $scope.getFullDownloadURL = function (uri) {
                    return RootURL.rootURL + uri;
                };
            });
    };

    $scope.getReportattachments();

}]);

uploadModule.controller('reportrecordingUploadCtrl', ['$scope', '$stateParams', '$http', 'RootURL', function ($scope, $stateParams, $http, RootURL) {
    $scope.percent = 0;
    $scope.files = [];

    $scope.reportrecordingFiles = '';

    $scope.params = {
        'report_id': $stateParams.id
    };

    $scope.filter = [
        {
            title: 'Reportrecording Files',
            extensions: 'mkv,avi,rmvb,mp4,pdf'
        }
    ]

    $scope.getReportrecordings = function () {
        $http.post('http://127.0.0.1:5000/api/v1/report_recordings/query', {report_id: $stateParams.id}).
            success(function (data, status, headers, config) {
                $scope.reportrecordingFiles = data;

                $scope.getFullDownloadURL = function (uri) {
                    return RootURL.rootURL + uri;
                };
            });
    };

    $scope.getReportrecordings();

}]);