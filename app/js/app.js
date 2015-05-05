var routerApp = angular.module('routerApp', ['720kb.datepicker', 'ui.router', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.pagination', 'ui.grid.autoResize',
    'ui.bootstrap', 'ngResource', 'plupload.directive', 'LiteratureModule', 'UploadModule', 'CommentModule', 'userModule', 'datasetModule',
    'codeModule', 'typeModule', 'allModule', 'favorModule', 'reportModule', 'tagModule', 'RelationModule', 'statisticsModule']);

routerApp.run(function ($rootScope, $state, $stateParams, authenticationSvc) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        $("html, body").animate({scrollTop: 0}, 200);
    });

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name != 'login') {
            var userInfo = authenticationSvc.getUserInfo();
            if (userInfo) {
                console.log(userInfo);
            } else {
                event.preventDefault();
                $rootScope.$broadcast('NotLogIn');
            }
        }
    });

    $rootScope.$on('NotLogIn', function (event, data) {
        $state.transitionTo('login');
    });

});

routerApp.factory('RootURL', function () {
    var rootURL = function getRootURL() {
        return 'http://127.0.0.1:5000';
    };
    return {
        rootURL: rootURL()
    };
});

routerApp.factory('Time', function () {
    var currentTime = function getNowFormatDate(date) {
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    };

    return {
        currentTime: currentTime
    };
});

routerApp.factory('Utility', function () {
    var array_diff = function (array1, array2) {
        var hash = {}
        for (var i = 0; i < array2.length; i++) {
            hash[array2[i].id] = true;
        }
        var result = [];
        for (var i = 0; i < array1.length; i++) {
            value = array1[i];
            if (hash[value.id]) continue;
            result.push(value);
        }
        return result;
    };

    return {
        array_diff: array_diff
    };
});

routerApp.factory("authenticationSvc", function ($http, $q, $window, $rootScope) {
    var userInfo;

    function login(userName, password) {
        var deferred = $q.defer();

        $http.post("http://127.0.0.1:5000/api/v1/users/login", {
            username: userName,
            password: password
        }).then(function (result) {
            userInfo = result.data;
            //$window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
            //$rootScope.userName = userInfo.name;
            //$rootScope.userId = userInfo.id;
            deferred.resolve(userInfo);
        }, function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function logout() {
        //var deferred = $q.defer();
        //
        //$http({
        //    method: "GET",
        //    url: "data/logout.json",
        //    headers: {
        //        "accessToken": userInfo.accessToken
        //    }
        //}).then(function (result) {
        $window.sessionStorage.clear();
        $rootScope.userName = null;
        $rootScope.userId = null;
        $rootScope.userPrivilege = null;
        userInfo = null;
        //    deferred.resolve(result);
        //}, function (error) {
        //    deferred.reject(error);
        //});
        //
        //return deferred.promise;
    }

    function getUserInfo() {
        return userInfo;
    }

    function init() {
        if ($window.sessionStorage["userInfo"]) {
            userInfo = JSON.parse($window.sessionStorage["userInfo"]);
            $rootScope.userName = userInfo.name;
            $rootScope.userId = userInfo.id;
            $rootScope.userPrivilege = userInfo.privilege;
        }
    }

    init();

    return {
        login: login,
        logout: logout,
        getUserInfo: getUserInfo
    };
});

routerApp.factory('authService', ['$q', 'authenticationSvc', function ($q, authenticationSvc) {
    var userInfo = authenticationSvc.getUserInfo();

    if (userInfo) {
        return $q.when(userInfo);
    } else {
        return $q.reject({authenticated: false});
    }
}]);

routerApp.config(['$stateProvider', '$urlRouterProvider', 'plUploadServiceProvider', function ($stateProvider, $urlRouterProvider, plUploadServiceProvider) {
    $urlRouterProvider.otherwise('/index');
    $stateProvider
        .state('index', {
            url: '/index',
            views: {
                '': {
                    templateUrl: 'partial/home.html'
                },
                'nav@index': {
                    templateUrl: 'partial/nav.html'
                },
                'homebody@index': {
                    templateUrl: 'partial/homebody.html'
                }
            }
        })
        .state('showAllLiterature', {
            url: '/showAllLiterature',
            views: {
                '': {
                    templateUrl: 'partial/resourceList.html'
                },
                'nav@showAllLiterature': {
                    templateUrl: 'partial/nav.html'
                },
                'resourceType@showAllLiterature': {
                    templateUrl: 'partial/resourceType.html',
                    controller: 'allController'
                },
                'resourceGrid@showAllLiterature': {
                    templateUrl: 'partial/literatureGrid.html',
                    controller: 'LiteratureListCtrl'
                }
            }
        })
        .state('showAllDataSet', {
            url: '/showAllDataSet',
            views: {
                '': {
                    templateUrl: 'partial/resourceList.html'
                },
                'nav@showAllDataSet': {
                    templateUrl: 'partial/nav.html'
                },
                'resourceType@showAllDataSet': {
                    templateUrl: 'partial/resourceType.html',
                    controller: 'allController'
                },
                'resourceGrid@showAllDataSet': {
                    templateUrl: 'partial/dataSetGrid.html',
                    controller: 'datasetListCtrl'
                }
            }
        })
        .state('showAllCode', {
            url: '/showAllCode',
            views: {
                '': {
                    templateUrl: 'partial/resourceList.html'
                },
                'nav@showAllCode': {
                    templateUrl: 'partial/nav.html'
                },
                'resourceType@showAllCode': {
                    templateUrl: 'partial/resourceType.html',
                    controller: 'allController'
                },
                'resourceGrid@showAllCode': {
                    templateUrl: 'partial/codeGrid.html',
                    controller: 'codeListCtrl'
                }
            }
        })
        .state('showAllReport', {
            url: '/showAllReport',
            views: {
                '': {
                    templateUrl: 'partial/resourceList.html'
                },
                'nav@showAllReport': {
                    templateUrl: 'partial/nav.html'
                },
                'resourceType@showAllReport': {
                    templateUrl: 'partial/resourceType.html',
                    controller: 'allController'
                },
                'resourceGrid@showAllReport': {
                    templateUrl: 'partial/reportGrid.html',
                    controller: 'reportListCtrl'
                }
            }
        })
        .state('newLiterature', {
            url: '/newLiterature',
            views: {
                '': {
                    templateUrl: 'partial/newLiterature.html'
                },
                'nav@newLiterature': {
                    templateUrl: 'partial/nav.html'
                },
                'literatureMeta@newLiterature': {
                    templateUrl: 'partial/literatureMeta.html'
                }
            }
        })
        .state('newDataSet', {
            url: '/newDataSet',
            views: {
                '': {
                    templateUrl: 'partial/newDataSet.html'
                },
                'nav@newDataSet': {
                    templateUrl: 'partial/nav.html'
                },
                'dataSetMeta@newDataSet': {
                    templateUrl: 'partial/dataSetMeta.html'
                }
                //'viewDataSetType@newDataSet':{
                //    templateUrl: 'partial/viewDataSetType.html'
                //}
            }
        })
        .state('newCode', {
            url: '/newCode',
            views: {
                '': {
                    templateUrl: 'partial/newCode.html'
                },
                'nav@newCode': {
                    templateUrl: 'partial/nav.html'
                },
                'codeMeta@newCode': {
                    templateUrl: 'partial/codeMeta.html'
                }
            }
        })
        .state('viewLiterature', {
            url: '/viewLiterature/:id',
            views: {
                '': {
                    templateUrl: 'partial/viewLiterature.html'
                },
                'nav@viewLiterature': {
                    templateUrl: 'partial/nav.html'
                },
                'viewLiteratureMeta@viewLiterature': {
                    templateUrl: 'partial/viewLiteratureMeta.html'
                },
                'editLiteratureMeta@viewLiterature': {
                    templateUrl: 'partial/literatureMeta.html'
                },
                'viewLiteratureUpload@viewLiterature': {
                    templateUrl: 'partial/literatureUpload.html'
                },
                'viewLiteratureRelation@viewLiterature': {
                    templateUrl: 'partial/literatureRelation.html'
                },
                'addComment@viewLiterature': {
                    templateUrl: 'partial/addComment.html'
                },
                'showComment@viewLiterature': {
                    templateUrl: 'partial/showComment.html'
                },
                'simpleComment@viewLiterature': {
                    templateUrl: 'partial/simpleComment.html'
                },
                'detailComment@viewLiterature': {
                    templateUrl: 'partial/detailComment.html'
                }
            }
        })
        .state('viewDataSet', {
            url: '/viewDataSet/:id',
            views: {
                '': {
                    templateUrl: 'partial/viewDataSet.html'
                },
                'nav@viewDataSet': {
                    templateUrl: 'partial/nav.html'
                },
                'viewDataSetMeta@viewDataSet': {
                    templateUrl: 'partial/viewDataSetMeta.html'
                },
                'editDataSetMeta@viewDataSet': {
                    templateUrl: 'partial/dataSetMeta.html'
                },
                'viewDataSetUpload@viewDataSet': {
                    templateUrl: 'partial/dataSetUpload.html'
                },
                'viewDataSetRelation@viewDataSet': {
                    templateUrl: 'partial/dataSetRelation.html'
                },
                'addComment@viewDataSet': {
                    templateUrl: 'partial/addComment.html'
                },
                'showComment@viewDataSet': {
                    templateUrl: 'partial/showComment.html'
                },
                'simpleComment@viewDataSet': {
                    templateUrl: 'partial/simpleComment.html'
                },
                'detailComment@viewDataSet': {
                    templateUrl: 'partial/detailComment.html'
                }
            }
        })
        .state('viewCode', {
            url: '/viewCode/:id',
            views: {
                '': {
                    templateUrl: 'partial/viewCode.html'
                },
                'nav@viewCode': {
                    templateUrl: 'partial/nav.html'
                },
                'viewCodeMeta@viewCode': {
                    templateUrl: 'partial/viewCodeMeta.html'
                },
                'editCodeMeta@viewCode': {
                    templateUrl: 'partial/codeMeta.html'
                },
                'viewCodeUpload@viewCode': {
                    templateUrl: 'partial/codeUpload.html'
                },
                'viewCodeRelation@viewCode': {
                    templateUrl: 'partial/codeRelation.html'
                },
                'addComment@viewCode': {
                    templateUrl: 'partial/addComment.html'
                },
                'showComment@viewCode': {
                    templateUrl: 'partial/showComment.html'
                },
                'simpleComment@viewCode': {
                    templateUrl: 'partial/simpleComment.html'
                },
                'detailComment@viewCode': {
                    templateUrl: 'partial/detailComment.html'
                }
            }
        })
        .state('viewReport', {
            url: '/viewReport/:id',
            views: {
                '': {
                    templateUrl: 'partial/viewReport.html'
                },
                'nav@viewReport': {
                    templateUrl: 'partial/nav.html'
                },
                'viewReportMeta@viewReport': {
                    templateUrl: 'partial/viewReportMeta.html'
                },
                'editReportMeta@viewReport': {
                    templateUrl: 'partial/reportMeta.html'
                },
                'viewReportUpload@viewReport': {
                    templateUrl: 'partial/reportUpload.html'
                },
                'viewReportRelation@viewReport': {
                    templateUrl: 'partial/reportRelation.html'
                },
                'addComment@viewReport': {
                    templateUrl: 'partial/addComment.html'
                },
                'showComment@viewReport': {
                    templateUrl: 'partial/showComment.html'
                },
                'simpleComment@viewReport': {
                    templateUrl: 'partial/simpleComment.html'
                },
                'detailComment@viewReport': {
                    templateUrl: 'partial/detailComment.html'
                }
            }
        })
        .state('login', {
            url: "/login",
            views: {
                '': {
                    templateUrl: 'partial/login.html'
                }
            }
        })
        .state('showFavorLiterature', {
            url: '/showFavorLiterature',
            views: {
                '': {
                    templateUrl: 'partial/resourceList.html',
                    controller: 'favorLiteratureListCtrl'
                },
                'nav@showFavorLiterature': {
                    templateUrl: 'partial/nav.html'
                },
                'resourceType@showFavorLiterature': {
                    templateUrl: 'partial/resourceType.html'
                },
                'resourceGrid@showFavorLiterature': {
                    templateUrl: 'partial/literatureGrid.html'
                }
            }
        })
        .state('showFavorDataSet', {
            url: '/showFavorDataSet',
            views: {
                '': {
                    templateUrl: 'partial/resourceList.html',
                    controller: 'favorDatasetListCtrl'
                },
                'nav@showFavorDataSet': {
                    templateUrl: 'partial/nav.html'
                },
                'resourceType@showFavorDataSet': {
                    templateUrl: 'partial/resourceType.html'
                },
                'resourceGrid@showFavorDataSet': {
                    templateUrl: 'partial/dataSetGrid.html'
                }
            }
        })
        .state('showFavorCode', {
            url: '/showFavorCode',
            views: {
                '': {
                    templateUrl: 'partial/resourceList.html',
                    controller: 'favorCodeListCtrl'
                },
                'nav@showFavorCode': {
                    templateUrl: 'partial/nav.html'
                },
                'resourceType@showFavorCode': {
                    templateUrl: 'partial/resourceType.html'
                },
                'resourceGrid@showFavorCode': {
                    templateUrl: 'partial/codeGrid.html'
                }
            }
        })
        .state('showFavorReport', {
            url: '/showFavorReport',
            views: {
                '': {
                    templateUrl: 'partial/resourceList.html',
                    controller: 'favorReportListCtrl'
                },
                'nav@showFavorReport': {
                    templateUrl: 'partial/nav.html'
                },
                'resourceType@showFavorReport': {
                    templateUrl: 'partial/resourceType.html'
                },
                'resourceGrid@showFavorReport': {
                    templateUrl: 'partial/reportGrid.html'
                }
            }
        })
        .state('showSomeFavor', {
            url: '/showSomeFavor/:favorId',
            views: {
                '': {
                    templateUrl: 'partial/resourceList.html',
                    controller: 'someFavorController'
                },
                'nav@showSomeFavor': {
                    templateUrl: 'partial/nav.html'
                },
                'resourceType@showSomeFavor': {
                    templateUrl: 'partial/resourceType.html'
                },
                'resourceGrid@showSomeFavor': {
                    templateUrl: 'partial/literatureGrid.html'
                }
            }
        })
        .state('newReport', {
            url: '/newReport',
            views: {
                '': {
                    templateUrl: 'partial/newReport.html'
                },
                'nav@newReport': {
                    templateUrl: 'partial/nav.html'
                },
                'reportMeta@newReport': {
                    templateUrl: 'partial/reportMeta.html'
                }
            }
        })
        .state('showAllUser', {
            url: '/showAllUser',
            views: {
                '': {
                    templateUrl: 'partial/manageList.html'
                },
                'nav@showAllUser': {
                    templateUrl: 'partial/nav.html'
                },
                'manageFunction@showAllUser': {
                    templateUrl: 'partial/manageFunction.html'
                },
                'manageGrid@showAllUser': {
                    templateUrl: 'partial/userGrid.html',
                    controller: 'userListCtrl'
                }
            }
        })
        //.state('showManageFunctions', {
        //    url: '/showManageFunctions',
        //    views: {
        //        '': {
        //            templateUrl: 'partial/manageList.html'
        //        },
        //        'nav@showStatistics': {
        //            templateUrl: 'partial/nav.html'
        //        },
        //        'manageFunction@showStatistics': {
        //            templateUrl: 'partial/manageFunction.html'
        //        },
        //        'manageGrid@showStatistics': {
        //            templateUrl: 'partial/statisticsGrid.html',
        //            controller: 'statisticsCtrl'
        //        }
        //    }
        //})
        .state('showStatistics', {
            url: '/showStatistics',
            views: {
                '': {
                    //templateUrl: 'partial/manageList.html'
                    templateUrl: 'partial/statistics.html',
                },
                'nav@showStatistics': {
                    templateUrl: 'partial/nav.html'
                },
                //'manageFunction@showStatistics': {
                //    templateUrl: 'partial/manageFunction.html'
                //},
                'statisticsGrid@showStatistics': {
                    templateUrl: 'partial/statisticsGrid.html',
                    controller: 'statisticsCtrl'
                }
            }
        })
        .state('showSetting', {
            url: '/showSetting',
            views: {
                '': {
                    templateUrl: 'partial/manageList.html'
                },
                'nav@showSetting': {
                    templateUrl: 'partial/nav.html'
                },
                'manageFunction@showSetting': {
                    templateUrl: 'partial/manageFunction.html'
                },
                'manageGrid@showSetting': {
                    templateUrl: 'partial/setting.html',
                    //controller: 'settingCtrl'
                }
            }
        });


    plUploadServiceProvider.setConfig('flashPath', 'framework/plupload/plupload.flash.swf');
    plUploadServiceProvider.setConfig('silverLightPath', 'framework/plupload/plupload.silverlight.xap');
    plUploadServiceProvider.setConfig('chunkSize', '1mb');
    plUploadServiceProvider.setConfig('uniqueNames', true);

}]);