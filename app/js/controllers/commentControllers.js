var commentModule = angular.module('CommentModule', []);

commentModule.factory('CommentService', ['$resource', function ($resource) {
    return $resource('http://127.0.0.1:5000/api/v1/comments');
}]);

commentModule.controller('CommentCtrl', ['$scope', '$rootScope', '$stateParams', '$http', 'Time', 'CommentService', function ($scope, $rootScope, $stateParams, $http, Time, CommentService) {
    $scope.comment = {};
    $scope.comment.star = 3;
    $scope.comment.commenter_id = $rootScope.userId;
    $scope.comment.type = $scope.comment_type_id;
    $scope.comment.resource_id = $stateParams.id;

    $scope.commentList = [];
    $scope.commentQuery = {};
    $scope.commentQuery.type = $scope.comment_type_id;
    $scope.commentQuery.resource_id = $stateParams.id;

    var updateCommentList = function () {
        $http.post('http://127.0.0.1:5000/api/v1/comments/query', $scope.commentQuery).
            success(function (data) {
                $scope.commentList = data;
            });
    };

    updateCommentList();

    $scope.simpleSubmit = function () {
        $scope.comment.comment_time = Time.currentTime(new Date());

        $scope.comment.content = this.simpleContent;
        $scope.comment.is_simple = 1;
        CommentService.save($scope.comment, function (data) {
            updateCommentList();
            $scope.comment.star = 3;
        });
        this.simpleContent = '';
    };

    $scope.detailSubmit = function () {
        $scope.comment.comment_time = Time.currentTime(new Date());

        $scope.comment.content = this.attr1 + '&' + this.attr2 + '&' + this.attr3;
        $scope.comment.is_simple = 0;
        CommentService.save($scope.comment, function (data) {
            updateCommentList();
            $scope.comment.star = 3;
        });
        this.attr1 = this.attr2 = this.attr3 = '';
    };
}]);