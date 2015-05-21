var commentModule = angular.module('CommentModule', []);

commentModule.factory('CommentService', ['$resource', function ($resource) {
    return $resource('http://121.40.106.155:5000/api/v1/comments');
}]);

commentModule.controller('CommentCtrl', ['$scope', '$rootScope', '$stateParams', '$http', 'Time', 'CommentService', function ($scope, $rootScope, $stateParams, $http, Time, CommentService) {
    $scope.comment = {};
    $scope.comment.star = 0;
    $scope.comment.commenter_id = $rootScope.userId;
    $scope.comment.type = $scope.comment_type_id;
    $scope.comment.resource_id = $stateParams.id;

    $scope.commentList = [];
    $scope.commentQuery = {};
    $scope.commentQuery.type = $scope.comment_type_id;
    $scope.commentQuery.resource_id = $stateParams.id;

    $scope.attrsShown = [];
    $scope.attrmodels = [];

    $http.get("http://121.40.106.155:5000/api/v1/commentSettings")
        .success(function (commentFields) {
            $scope.commentFields = commentFields;
            $http.get('http://121.40.106.155:5000/api/v1/settings')
                .success(function (data) {
                    var commentFieldsIds = data['commentFieldsIds']
                    commentFieldsIds.forEach(function (element) {
                        $scope.commentFields.forEach(function (inner) {
                            if(inner.id == element)
                                $scope.attrsShown.push(inner);
                        })
                    })
                });
        })

    var updateCommentList = function () {
        $http.post('http://121.40.106.155:5000/api/v1/comments/query', $scope.commentQuery).
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
            $scope.comment.star = 0;
        });
        this.simpleContent = '';
    };

    $scope.detailSubmit = function () {
        $scope.comment.comment_time = Time.currentTime(new Date());
        var result ='';
        for(var i =0;i<$scope.attrmodels.length;i++)
        {
            if($scope.attrmodels[i])
            {
                if(i == $scope.attrmodels.length-1)
                result+=$scope.attrmodels[i];
            else
                result+=$scope.attrmodels[i]+"&"
            }
        }
        console.log(result);
        $scope.comment.content = result;
        $scope.comment.is_simple = 0;
        CommentService.save($scope.comment, function (data) {
            updateCommentList();
            $scope.comment.star = 0;
        });

        for(var i =0;i<$scope.attrmodels.length;i++)
            $scope.attrmodels[i] = "";
    };
}]);