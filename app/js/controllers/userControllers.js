var userModule = angular.module('userModule',[]);

userModule.controller('userLoginCtrl', ['$scope','$http','$location',
	function($scope,$http,$location)
	{
		$scope.Login=function()
		{
			
			$http({

                method: 'POST', 
                url: 'http://127.0.0.1:5000/api/v1/users/login',
                headers: {'Content-Type': 'application/json'},
                data: { 
                        'username': $scope.un, 
                        'password': $scope.pw 
                     }
            }).

            success(function(data, status) {

                $scope.data = data;
                if(data == 'FALSE'){
                    $scope.errorMessage = '验证失败';
                } else {
                   //$scope.$apply(function() { $location.path("/index"); });
                    $location.path("/index");

                }

            }).

            error(function(data, status) {
                $scope.data = data || "FALSE";
                $scope.errorMessage = 'Something went wrong';
                $location.path("/login");

            });
		}
	}

	])