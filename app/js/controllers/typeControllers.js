/**
 * Created by justsavor on 15/4/7.
 */
var typeModule = angular.module('typeModule',[]);

typeModule.factory('typeService',['$resource',function($resource){
    return $resource('http://121.40.106.155:5000/api/v1/types/:typeId', {typeId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);
