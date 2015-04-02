var routerApp = angular.module('routerApp', ['ui.router', 'ui.grid', 'ui.grid.resizeColumns', 'ui.grid.pagination', 'ui.bootstrap', 'ngResource', 'plupload.directive', 'LiteratureModule', 'UploadModule', 'CommentModule', 'userModule','datasetModule']);

routerApp.run(function ($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

    $rootScope.$watch('$state.$current', function(newVal, oldVal){
        console.log(newVal.toString());
    });
});

routerApp.factory('Time', function(){
    var currentTime = function getNowFormatDate() {
        var date = new Date();
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
        currentTime: currentTime()
    };
});

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
                    templateUrl: 'partial/resourceType.html'
                },
                'resourceGrid@showAllLiterature': {
                    templateUrl: 'partial/literatureGrid.html'
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
                    templateUrl: 'partial/resourceType.html'
                },
                'resourceGrid@showAllDataSet': {
                    templateUrl: 'partial/dataSetGrid.html'
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
                    templateUrl: 'partial/resourceType.html'
                },
                'resourceGrid@showAllCode': {
                    templateUrl: 'partial/codeGrid.html'
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
                },
                'literatureUpload@newLiterature': {
                    templateUrl: 'partial/literatureUpload.html'
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
        .state('login', {
            url: "/login",
            views: {
                '': {
                    templateUrl: 'partial/login.html'
                }
            }
        });

    plUploadServiceProvider.setConfig('flashPath', 'framework/plupload/plupload.flash.swf');
    plUploadServiceProvider.setConfig('silverLightPaht', 'framework/plupload/plupload.silverlight.xap');

}]);