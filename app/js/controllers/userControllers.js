var userModule = angular.module('userModule', ['ui.bootstrap']);

userModule.controller('userLoginCtrl', ['$scope','$rootScope','$log', '$modal', '$http', '$location',
    function ($scope,$rootScope,$log, $modal, $http, $location) {

        $scope.open = function (size) {

            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
            });

            modalInstance.result.then(function (loginInfo) {
                $scope.username = loginInfo.un;
                $scope.password = loginInfo.pw;

                $http({

                    method: 'POST',
                    url: 'http://127.0.0.1:5000/api/v1/users/login',
                    headers: {'Content-Type': 'application/json'},
                    data: {
                        "username": $scope.username,
                        "password": $scope.password
                    }
                }).

                    success(function (data, status) {

                        $scope.data = data;
                        if (data == 'FALSE') {
                            $scope.errorMessage = '验证失败';
                        } else {
                            //$scope.$apply(function() { $location.path("/index"); });
                            $scope.errorMessage = '登录成功'
                            $rootScope.username = $scope.username;
                            $location.path("/index");

                        }

                    }).

                    error(function (data, status) {
                        $scope.data = data || "FALSE";
                        $scope.errorMessage = 'Something went wrong';
                        $location.path("/login");

                    });


                //http
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


    }])

userModule.controller('ModalInstanceCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {

    $scope.loginInfo = {};

    $scope.ok = function () {
        
        $modalInstance.close($scope.loginInfo);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);