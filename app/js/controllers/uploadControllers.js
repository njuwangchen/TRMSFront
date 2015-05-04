var uploadModule = angular.module('UploadModule', []);

uploadModule.controller('LiteratureUploadCtrl', ['$scope', '$stateParams', 'LiteratureService', 'RootURL', 'Time', function ($scope, $stateParams, LiteratureService, RootURL, Time) {
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
        var file = $scope.files.pop();
        console.log(file);
        var file_name = file.name;
        var target_name = file.target_name;

        var updatedInfo = {};
        updatedInfo.id = $stateParams.id;
        updatedInfo.updater_id = 1;
        updatedInfo.update_time = Time.currentTime(new Date());
        updatedInfo.create_time = $scope.literatureFile.create_time;
        updatedInfo.file_name = file_name;
        updatedInfo.upload_history = $scope.literatureFile.upload_history + ';' + file_name + ',' + target_name;

        LiteratureService.update(updatedInfo, function (data) {
            console.log('update success!');
            LiteratureService.get({literatureId: $stateParams.id}, function (data) {
                $scope.literatureFile = data;
            });
        });
    };

    $scope.delete = function () {
        var deleteInfo = {};
        deleteInfo.id = $stateParams.id;
        deleteInfo.updater_id = 1;
        deleteInfo.update_time = Time.currentTime(new Date());
        deleteInfo.create_time = $scope.literatureFile.create_time;
        deleteInfo.file_name = '';
        deleteInfo.uri = '';

        LiteratureService.update(deleteInfo, function (data) {
            console.log('delete success!');
            LiteratureService.get({literatureId: $stateParams.id}, function (data) {
                $scope.literatureFile = data;
            });
        });
    };

}]);

uploadModule.controller('VideoUploadCtrl', ['$scope', '$stateParams', '$http', 'VideoService', 'RootURL', function ($scope, $stateParams, $http, VideoService, RootURL) {
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
    ];

    $scope.getVideos = function () {
        $http.post('http://127.0.0.1:5000/api/v1/videos/query', {literature_id: $stateParams.id}).
            success(function (data, status, headers, config) {
                $scope.videoFiles = data;

                $scope.getFullDownloadURL = function (uri) {
                    return RootURL.rootURL + uri;
                };
            });
    };

    $scope.uploaded = function () {
        $http.post('http://127.0.0.1:5000/api/v1/videos/query', {literature_id: $stateParams.id}).
            success(function (data, status, headers, config) {
                $scope.videoFiles = data;

                var file = $scope.files.pop();
                var last_video = data[data.length - 1];
                console.log(file);
                var file_name = file.name;
                var size = file.size;
                last_video.video_name = file_name;
                last_video.size = file.size;

                var updatedInfo = {};
                updatedInfo.id = last_video.id;
                updatedInfo.size = size;
                updatedInfo.video_name = file_name;
                VideoService.update(updatedInfo, function (data) {
                    console.log('update success!');
                });
            });
    };

    $scope.delete = function (id) {
        VideoService.delete({videoId: id}, function (data) {
            $scope.getVideos();
        });
    };

    $scope.getVideos();

}]);

uploadModule.controller('PptUploadCtrl', ['$scope', '$stateParams', '$http', 'PptService', 'RootURL', function ($scope, $stateParams, $http, PptService, RootURL) {
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
    ];

    $scope.getPpts = function () {
        $http.post('http://127.0.0.1:5000/api/v1/ppts/query', {literature_id: $stateParams.id}).
            success(function (data, status, headers, config) {
                $scope.pptFiles = data;

                $scope.getFullDownloadURL = function (uri) {
                    return RootURL.rootURL + uri;
                };
            });
    };

    $scope.uploaded = function () {
        $http.post('http://127.0.0.1:5000/api/v1/ppts/query', {literature_id: $stateParams.id}).
            success(function (data, status, headers, config) {
                $scope.pptFiles = data;

                var file = $scope.files.pop();
                var last_ppt = data[data.length - 1];
                console.log(file);
                var file_name = file.name;
                var size = file.size;
                last_ppt.ppt_name = file_name;
                last_ppt.size = file.size;

                var updatedInfo = {};
                updatedInfo.id = last_ppt.id;
                updatedInfo.size = size;
                updatedInfo.ppt_name = file_name;
                PptService.update(updatedInfo, function (data) {
                    console.log('update success!');
                });
            });
    };

    $scope.delete = function (id) {
        PptService.delete({pptId: id}, function (data) {
            $scope.getPpts();
        });
    };

    $scope.getPpts();

}]);

uploadModule.controller('codeUploadCtrl', ['$scope', '$stateParams', 'codeService', 'RootURL', 'Time', function ($scope, $stateParams, codeService, RootURL, Time) {
    $scope.percent = 0;
    $scope.files = [];

    $scope.params = {
        'code_id': $stateParams.id
    };

    $scope.filter = [
        {
            title: 'Code Files',
            extensions: 'zip,rar,7z'
        }
    ];

    codeService.get({codeId: $stateParams.id}, function (data) {
        $scope.codeFile = data;
        $scope.getFullDownloadURL = function () {
            return RootURL.rootURL + $scope.codeFile.uri;
        };
    });

    $scope.uploaded = function () {
        var file = $scope.files.pop();
        console.log(file);
        var file_name = file.name;
        var size = file.size;
        var target_name = file.target_name;

        var updatedInfo = {};
        updatedInfo.id = $stateParams.id;
        updatedInfo.updater_id = 1;
        updatedInfo.update_time = Time.currentTime(new Date());
        updatedInfo.create_time = $scope.codeFile.create_time;
        updatedInfo.file_name = file_name;
        updatedInfo.size = size;
        updatedInfo.upload_history = $scope.codeFile.upload_history + ';' + file_name + ',' + target_name + ',' + size;

        codeService.update(updatedInfo, function (data) {
            codeService.get({codeId: $stateParams.id}, function (data) {
                $scope.codeFile = data;
            });
        });
    };

    $scope.delete = function () {
        var deleteInfo = {};
        deleteInfo.id = $stateParams.id;
        deleteInfo.updater_id = 1;
        deleteInfo.update_time = Time.currentTime(new Date());
        deleteInfo.create_time = $scope.codeFile.create_time;
        deleteInfo.file_name = '';
        deleteInfo.size = 0;
        deleteInfo.uri = '';

        codeService.update(deleteInfo, function (data) {
            console.log('delete success!');
            codeService.get({codeId: $stateParams.id}, function (data) {
                $scope.codeFile = data;
            });
        });
    };

}]);

uploadModule.controller('datasetUploadCtrl', ['$scope', '$stateParams', 'datasetService', 'RootURL', 'Time', function ($scope, $stateParams, datasetService, RootURL, Time) {
    $scope.percent = 0;
    $scope.files = [];

    $scope.params = {
        'data_set_id': $stateParams.id
    };

    $scope.filter = [
        {
            title: 'Dataset Files',
            extensions: 'zip,rar,7z'
        }
    ];

    datasetService.get({datasetId: $stateParams.id}, function (data) {
        $scope.datasetFile = data;
        $scope.getFullDownloadURL = function () {
            return RootURL.rootURL + $scope.datasetFile.uri;
        };
    });

    $scope.uploaded = function () {
        var file = $scope.files.pop();
        console.log(file);
        var file_name = file.name;
        var size = file.size;
        var target_name = file.target_name;

        var updatedInfo = {};
        updatedInfo.id = $stateParams.id;
        updatedInfo.updater_id = 1;
        updatedInfo.update_time = Time.currentTime(new Date());
        updatedInfo.create_time = $scope.datasetFile.create_time;
        updatedInfo.file_name = file_name;
        updatedInfo.size = size;
        updatedInfo.upload_history = $scope.datasetFile.upload_history + ';' + file_name + ',' + target_name + ',' + size;

        datasetService.update(updatedInfo, function (data) {
            datasetService.get({datasetId: $stateParams.id}, function (data) {
                $scope.datasetFile = data;
            });
        });
    };

    $scope.delete = function () {
        var deleteInfo = {};
        deleteInfo.id = $stateParams.id;
        deleteInfo.updater_id = 1;
        deleteInfo.update_time = Time.currentTime(new Date());
        deleteInfo.create_time = $scope.datasetFile.create_time;
        deleteInfo.file_name = '';
        deleteInfo.size = 0;
        deleteInfo.uri = '';

        datasetService.update(deleteInfo, function (data) {
            console.log('delete success!');
            datasetService.get({datasetId: $stateParams.id}, function (data) {
                $scope.datasetFile = data;
            });
        });
    };
}]);

uploadModule.controller('reportattachmentUploadCtrl', ['$scope', '$stateParams', '$http', 'AttachmentService', 'RootURL', function ($scope, $stateParams, $http, AttachmentService, RootURL) {
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
    ];

    $scope.getReportattachments = function () {
        $http.post('http://127.0.0.1:5000/api/v1/report_attachments/query', {report_id: $stateParams.id}).
            success(function (data, status, headers, config) {
                $scope.reportattachmentFiles = data;

                $scope.getFullDownloadURL = function (uri) {
                    return RootURL.rootURL + uri;
                };
            });
    };

    $scope.uploaded = function () {
        $http.post('http://127.0.0.1:5000/api/v1/report_attachments/query', {report_id: $stateParams.id}).
            success(function (data, status, headers, config) {
                $scope.reportattachmentFiles = data;

                var file = $scope.files.pop();
                var last_attach = data[data.length - 1];
                console.log(file);
                var file_name = file.name;
                var size = file.size;
                last_attach.attachment_name = file_name;
                last_attach.size = size;

                var updatedInfo = {};
                updatedInfo.id = last_attach.id;
                updatedInfo.size = size;
                updatedInfo.attachment_name = file_name;
                AttachmentService.update(updatedInfo, function (data) {
                    console.log('update success!');
                });
            });
    };

    $scope.delete = function (id) {
        AttachmentService.delete({attachmentId: id}, function (data) {
            $scope.getReportattachments();
        });
    };

    $scope.getReportattachments();

}]);

uploadModule.controller('reportrecordingUploadCtrl', ['$scope', '$stateParams', '$http', 'RecordingService', 'RootURL', function ($scope, $stateParams, $http, RecordingService, RootURL) {
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
    ];

    $scope.getReportrecordings = function () {
        $http.post('http://127.0.0.1:5000/api/v1/report_recordings/query', {report_id: $stateParams.id}).
            success(function (data, status, headers, config) {
                $scope.reportrecordingFiles = data;

                $scope.getFullDownloadURL = function (uri) {
                    return RootURL.rootURL + uri;
                };
            });
    };

    $scope.uploaded = function () {
        $http.post('http://127.0.0.1:5000/api/v1/report_recordings/query', {report_id: $stateParams.id}).
            success(function (data, status, headers, config) {
                $scope.reportrecordingFiles = data;

                var file = $scope.files.pop();
                var last_record = data[data.length - 1];
                console.log(file);
                var file_name = file.name;
                var size = file.size;
                last_record.recording_name = file_name;
                last_record.size = size;

                var updatedInfo = {};
                updatedInfo.id = last_record.id;
                updatedInfo.size = size;
                updatedInfo.recording_name = file_name;
                RecordingService.update(updatedInfo, function (data) {
                    console.log('update success!');
                });
            });
    };

    $scope.delete = function (id) {
        RecordingService.delete({recordingId: id}, function (data) {
            $scope.getReportrecordings();
        });
    };

    $scope.getReportrecordings();

}]);


uploadModule.controller('LiteraturePersonalizedUploadCtrl', ['$scope', '$stateParams', '$rootScope', '$http', 'RootURL', function ($scope, $stateParams, $rootScope, $http, RootURL) {
    $scope.percent = 0;
    $scope.files = [];

    $scope.params = {
        'literature_id': $stateParams.id,
        'user_id': $rootScope.userId
    };
    console.log("LiteraturePersonalizedUploadCtrl initliazed")

    $http.post("http://127.0.0.1:5000/api/v1/personalize/query", {
        literature_id: $stateParams.id,
        user_id: $rootScope.userId
    })
        .success(function (data) {
            $scope.literatureFile = data;
            console.log($scope.literatureFile);
            $scope.getFullDownloadURL = function () {
                return RootURL.rootURL + $scope.literatureFile.uri;
            };
        });

    $scope.uploaded = function () {
        $http.post('http://127.0.0.1:5000/api/v1/personalize/query', {
            literature_id: $stateParams.id,
            user_id: $rootScope.userId
        })
            .success(function (data) {
                $scope.literatureFile = data;
                console.log(data);
            });
    };


}]);