var userModule = angular.module('userModule', ['ui.bootstrap']);

userModule.factory('userService', ['$resource', function ($resource) {
    return $resource('http://121.40.106.155:5000/api/v1/users/:userId', {userId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);

userModule.controller('userListCtrl', ['$scope', 'userService', function ($scope, userService) {
    userService.query(function (data) {
        $scope.userList = data;
    });

    $scope.addState = false;
    $scope.changeState = function () {
        $scope.addState = true;
        $scope.user = {};
    };

    $scope.showEdit = true;
    $scope.master = {};
}]);

userModule.controller('userLoginCtrl', ['$scope', '$rootScope', '$http', '$state', '$window', 'authenticationSvc', '$modal',
    function ($scope, $rootScope, $http, $state, $window, authenticationSvc, $modal) {

        $scope.userNotExist = false;
        $scope.passwdNotRight = false;

        $scope.logout = function () {
            authenticationSvc.logout();
            $state.go('login');
        };

        $scope.ok = function () {
            authenticationSvc.login($scope.username, $scope.password).then(function (userInfo) {
                console.log(userInfo);
                if (userInfo.isSucceed) {
                    $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
                    $rootScope.userName = userInfo.name;
                    $rootScope.userId = userInfo.id;
                    $rootScope.userPrivilege = userInfo.privilege;
                    $state.go('index');
                } else if (userInfo.userNotExist) {
                    $scope.userNotExist = true;
                } else if (userInfo.passwdNotRight) {
                    $scope.passwdNotRight = true;
                }
            });
        };

        $scope.changePassword = function(id){
            var queryModalInstance = $modal.open({
                templateUrl: 'partial/changePassword.html',
                controller: 'changePasswordCtrl',
                resolve: {
                    userId: function () {
                        return id;
                    }
                }
            });


        }
    }]);

userModule.controller('changePasswordCtrl', ['$scope', '$modalInstance', 'userId', '$http',
    function($scope, $modalInstance, userId, $http){
        $scope.judge = {};
        $scope.judge.isTrue = true;
        $scope.judge.isSame = true;
        $scope.judge.isValid = false;

        $http.get('http://121.40.106.155:5000/api/v1/users/'+userId)
            .success(function(data){
                $scope.user = data;
                $scope.submit = function(){
                    $scope.judge.isTrue = true;
                    $scope.judge.isSame = true;
                    $scope.judge.isValid = false;
                    if($scope.judge.oldPassword != data.password){
                        $scope.judge.isTrue = false;
                    }
                    else{
                        if($scope.judge.newPassword1 != $scope.judge.newPassword2){
                            $scope.judge.isSame = false;
                        }
                        else{
                            $scope.judge.isValid = true;
                        }
                    }
                    if($scope.judge.isValid){
                        $http.put('http://121.40.106.155:5000/api/v1/users/'+userId, {password: $scope.judge.newPassword1})
                        .success(function(){
                            console.log($scope.judge.newPassword1);
                            alert("密码修改成功");
                                $modalInstance.dismiss();
                        });
                    }

                }
            });

        $http.get("http://121.40.106.155:5000/api/v1/users/export/"+userId)
            .success(function (data) {
                if(data!="")
                {
                    var content = data;
                    var blob = new Blob([ content ], { type : 'text/plain' });
                    $scope.exportUrl = (window.URL || window.webkitURL).createObjectURL( blob );
                }
            });

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

    }]
);

userModule.directive("edit", function ($document) {
    return {
        restrict: 'AE',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind("click", function () {
                var name = "txt_name_" + ngModel.$modelValue.name;
                var password = "txt_password_" + ngModel.$modelValue.password;
                var privilege = "txt_privilege_" + ngModel.$modelValue.privilege;
                scope.$apply(function () {
                    angular.copy(ngModel.$modelValue, scope.master);
                    //console.log(scope.master);
                })
                //console.log(id);
                var obj = $("#" + name);
                obj.removeClass("inactive");
                obj.addClass("inactive");
                //obj.removeAttr("readOnly");
                var obj1 = $("#" + password);
                obj1.removeClass("inactive");
                obj1.addClass("active");
                //obj1.removeAttr("readOnly");
                var obj2 = $("#" + privilege);
                obj2.removeClass("inactive");
                obj2.addClass("active");
                //obj2.removeAttr("readOnly");
                scope.$apply(function () {
                    scope.showEdit = false;
                })
            });
        }
    }
});

userModule.directive("update", function ($document) {
    return {
        restrict: 'AE',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind("click", function () {
                //alert(ngModel.$modelValue + " is updated, Update your value here.");
                var name = "txt_name_" + ngModel.$modelValue.name;
                var password = "txt_password_" + ngModel.$modelValue.password;
                var privilege = "txt_privilege_" + ngModel.$modelValue.privilege;
                alert("用户：" + ngModel.$modelValue.name +" 信息已更新");
                var obj = $("#" + name);
                obj.removeClass("active");
                obj.addClass("inactive");
                //obj.attr("readOnly", true);
                var obj1 = $("#" + password);
                obj1.removeClass("active");
                obj1.addClass("inactive");
                //obj1.attr("readOnly", true);
                var obj2 = $("#" + privilege);
                obj2.removeClass("active");
                obj2.addClass("inactive");
                //obj2.attr("readOnly", true);

                scope.$apply(function () {
                    scope.user.$update(function () {
                        scope.showEdit = true;
                    });

                })
            })
        }
    }
});

userModule.directive("cancel", function ($document) {
    return {
        restrict: 'AE',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind("click", function () {
                scope.$apply(function () {
                    angular.copy(scope.master, ngModel.$modelValue);
                    //console.log(ngModel.$modelValue);
                })

                var name = "txt_name_" + ngModel.$modelValue.name;
                var password = "txt_password_" + ngModel.$modelValue.password;
                var privilege = "txt_privilege_" + ngModel.$modelValue.privilege;
                var obj = $("#" + name);
                obj.removeClass("active");
                obj.addClass("inactive");
                //obj.prop("readOnly", true);
                var obj1 = $("#" + password);
                obj1.removeClass("active");
                obj1.addClass("inactive");
                //obj1.prop("readOnly", true);
                var obj2 = $("#" + privilege);
                obj2.removeClass("active");
                obj2.addClass("inactive");
                //obj2.prop("readOnly", true);
                scope.$apply(function () {
                    scope.showEdit = true;
                })
            })
        }
    }
});

userModule.directive("delete", function ($document) {
    return {
        restrict: 'AE',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind("click", function () {
                var name = ngModel.$modelValue.name;
                alert("用户：" + name + " 已删除");
                scope.$apply(function () {
                    for (var i = 0; i < scope.userList.length; i++) {
                        if (scope.userList[i].name == name) {
                            console.log(scope.userList[i])
                            scope.userList.splice(i, 1);
                        }
                    }
                    scope.user.$delete(function () {
                        scope.showEdit = true;
                    });
                    console.log(scope.user);
                })
            })
        }
    }
});

userModule.directive("save", function ($document, $state, userService) {
    return {
        restrict: 'AE',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind("click", function () {
                var name = "name" + ngModel.$modelValue.name;
                var password = "password" + ngModel.$modelValue.password;
                var privilege = "privilege" + ngModel.$modelValue.privilege;
                scope.$apply(function () {
                    angular.copy(ngModel.$modelValue, scope.master);
                })

                scope.$apply(function () {
                    userService.save(scope.user, function (data) {
                        console.log("用户：" + data.name + " 信息已保存");
                    });
                    scope.userList.push(scope.user);
                    scope.addState = false;
                })
            });
        }
    }
});

userModule.directive("cancela", function ($document, $state, userService) {
    return {
        restrict: 'AE',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            element.bind("click", function () {
                scope.$apply(function () {
                    scope.addState = false;
                })
            });
        }
    }
});
