/**
 * Created by BAO on 4/13/15.
 */
var tagModule = angular.module('tagModule',[]);

tagModule.factory('tagService', ['$resource', function ($resource) {
    return $resource('http://127.0.0.1:5000/api/v1/tags/:tagId', {tagId: '@id'}, {
        update: {
            method: 'PUT'
        }
    });
}]);