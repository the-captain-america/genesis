import angular from 'angular';
import { APP_CONTROLLER } from '../../constants';

let ctrls = angular.module(APP_CONTROLLER, []).controller('AppCtrl', [
    '$scope',
    '$rootScope',
    '$location',
    'serverurl',
    '$http',
    '$mdDialog',
    function($scope, $rootScope, $location, serverurl, $http, $mdDialog) {
        console.log('loaded AppCtrl...');
    }
]).name;

export default ctrls;
