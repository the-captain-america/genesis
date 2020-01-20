import angular from 'angular';
import ngResource from 'angular-resource';

let userService = angular.module('userService', [ngResource]).factory('User', [
    '$resource',
    'serverurl',
    function($resource, serverurl) {
        return $resource(
            serverurl + 'user/d/:username',
            {},
            {
                update: {
                    method: 'PUT' // this method issues a PUT request
                }
            }
        );
    }
]).name;

export default userService;
