import angular from 'angular';
import ngResource from 'angular-resource';

let categoryService = angular
    .module('categoryService', [ngResource])
    .factory('Category', [
        '$resource',
        'serverurl',
        function($resource, serverurl) {
            return $resource(
                serverurl + 'category/d/:purpose/:typekey',
                {},
                {
                    query: { method: 'PUT' }
                }
            );
        }
    ])
    .factory('CustCompany', [
        '$resource',
        'serverurl',
        function($resource, serverurl) {
            return $resource(
                serverurl + 'custcomp/c/:ckey',
                {},
                {
                    update: {
                        method: 'PUT' // this method issues a PUT request
                    },
                    getIntegrationData: {
                        method: 'GET',
                        isArray: false,
                        url: serverurl + 'custcomp/i'
                    }
                }
            );
        }
    ])
    .factory('CustLabels', function() {
        return {
            customLabels: {},
            getCustomLabels: function() {
                return this.customLabels || {};
            },
            setCustomLabels: function(val) {
                console.log('>>><>val=%j', val);
                this.customLabels = val;
            }
        };
    }).name;

export default categoryService;
