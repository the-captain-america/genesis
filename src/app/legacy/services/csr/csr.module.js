import angular from 'angular';
import ngResource from 'angular-resource';

let csrService = angular
    .module('csrService', [ngResource])
    .factory('Company', [
        '$resource',
        'serverurl',
        function($resource, serverurl) {
            return $resource(
                serverurl + 'v2/company/c/:ckey',
                {},
                {
                    update: {
                        method: 'PUT' // this method issues a PUT request
                    }
                }
            );
        }
    ])
    .factory('csrAcctHierarchyService', [
        function() {
            let isParent;
            let maxChildAccts = 0;
            let parentAcct;

            return {
                isParentAccount: () => {
                    return isParent;
                },
                getMaxChildAccounts: () => {
                    return maxChildAccts;
                },
                getParentAccount: () => {
                    return parentAcct;
                },
                setAccountHierarchy: (parent, parentflag, maxchild) => {
                    parentAcct = parent;
                    isParent = parentflag;
                    maxChildAccts = maxchild;
                    console.log(
                        ' setting account hierarchy : ',
                        parentflag,
                        parent
                    );
                    // $rootScope.$broadcast('event:parentChange');
                }
            };
        }
    ])
    .factory('csrMenuChangeService', [
        function() {
            var isCsr = false;
            var changedRole = 'admin';

            return {
                getIsCSR: function() {
                    // console.info('is Service GET ::::: '+isCsr);
                    return isCsr;
                },
                setIsCsr: function(val) {
                    //Dump allCaches whenever CSR change happens
                    // console.info('is set Service::::: '+val);
                    isCsr = val;
                    // $rootScope.$broadcast('event:csrChange');
                },

                getChangedRole: function() {
                    return changedRole;
                },
                setChangedRole: function(val) {
                    changedRole = val;
                    // $rootScope.$broadcast('event:roleChange');
                }
            };
        }
    ])
    .factory('CSRCustThemeService', [
        function() {
            var theme = {};
            var showSigninAs = false;
            var compname = '';

            return {
                getCustTheme: function() {
                    // console.info('is Service GET ::::: '+isCsr);
                    return theme;
                },
                getShowSigninAs: function() {
                    // console.info('is Service GET ::::: '+isCsr);
                    return showSigninAs;
                },
                getCompanyName: function() {
                    // console.info('is Service GET ::::: '+isCsr);
                    return compname;
                },
                setCustTheme: function(
                    val,
                    signInVal,
                    compval,
                    parentflag = false,
                    maxchild = 0
                ) {
                    // console.info('is set Service::::: '+val);
                    theme = val;
                    showSigninAs = signInVal;
                    compname = compval;
                    // $rootScope.$broadcast('event:custtheme');
                }
            };
        }
    ]).name;

export default csrService;
