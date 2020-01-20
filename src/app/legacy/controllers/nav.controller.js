function NavCtrl(
    $scope,
    $rootScope,
    $routeParams,
    $location,
    csrMenuChangeService,
    $cookies
) {
    $scope.wfid = $routeParams.wfid;
    $scope.wfname = $routeParams.wfname;

    $rootScope.$on('event:csrChange', function() {
        $scope.csr = csrMenuChangeService.getIsCSR();
    });

    $rootScope.$on('event:roleChange', function() {
        $scope.loggedinRole = csrMenuChangeService.getChangedRole();
    });

    if ($cookies.get('a_u') && !$cookies.get('s_u')) {
        $scope.csr = true;
    } else {
        $scope.csr = false;
    }
    $scope.loggedinRole = 'admin';
    if ($rootScope.userdata && $rootScope.userdata.role) {
        $scope.loggedinRole = $rootScope.userdata.role;
    }

    $scope.getUserDetails = function() {
        if (!$rootScope.userdata) {
            return {};
        }

        return {
            loggedinUser: $rootScope.userdata.email,
            loggedinComp: $rootScope.userdata.company,
            appversion: $rootScope.userdata.appversion,
            loggedinDispName: $rootScope.userdata.name,
            is_sb: $rootScope.userdata.is_sb,
            has_sb:
                $rootScope.userdata.linked_comp &&
                (!$rootScope.userdata.is_sb ||
                    $rootScope.userdata.is_sb === 'N')
                    ? 'Y'
                    : 'N',
            linked_comp: $rootScope.userdata.linked_comp,
            prevjobrunid: $rootScope.userdata.prevjobrunid,
            prevjobruntime: $rootScope.userdata.prevjobruntime,
            profile: $rootScope.userdata.profile,
            photo_l: $rootScope.userdata.photo_l
        };
    };

    $scope.getadminappbubble = function() {
        return { logo: $rootScope.adminappbubble };
    };

    $scope.getIntercomHelpCenterUrl = function() {
        return $scope.intercomHelpCenterUrl;
    };

    $scope.task = function() {
        return {
            name: $rootScope.taskName,
            running: $rootScope.taskinprogress,
            stage: $rootScope.taskstage
        };
    };

    $scope.isActive = function(viewLocation) {
        // console.info('$location.path() :::: '+$location.path());
        return $location.path().indexOf(viewLocation) != -1;
    };

    $scope.isActiveEquals = function(viewLocation) {
        return viewLocation === $location.path();
    };

    $scope.showBackButton = function(locs) {
        let result = false;
        _.forEach(locs, function(loc) {
            if (loc && $location.path().indexOf(loc) !== -1) {
                result = true;
                return false;
            }
        });
        return result;
    };

    $scope.GlobalbackButton = function() {
        if (document.URL.indexOf('workflow-editor') >= 0) {
            $location.path('/workflow').search('wfname', null);
            return;
        }
        if (document.URL.indexOf('dashboard-level2') >= 0) {
            $location.path('/dashboard');
            return;
        }

        if (
            $location.path().indexOf('workflow-logic-editor') >= 0 ||
            $location.path().indexOf('workflow-logic-editor-seq') >= 0 ||
            $location.path().indexOf('workflow-content-editor-seq') >= 0 ||
            $location.path().indexOf('workflow-content-editor') >= 0 ||
            $location.path().indexOf('workflow-esign-editor') >= 0 ||
            $location.path().indexOf('workflow-forms-editor-seq') >= 0 ||
            $location.path().indexOf('workflow-forms-editor') >= 0 ||
            $location.path().indexOf('workflow-multi-page-editor') >= 0 ||
            $location.path().indexOf('workflow-embed-course-editor') >= 0 ||
            $location.path().indexOf('workflow-senddata-editor') >= 0 ||
            $location.path().indexOf('workflow-embed-course-editor') >= 0
        ) {
            var startidx = $location.path().indexOf('/wf/');
            var endidx = $location.path().indexOf('/', startidx + 4);
            // endidx < 0 for new module
            var wfediturl =
                endidx > 0
                    ? $location.path().substring(startidx, endidx)
                    : $location.path().substring(startidx);
            wfediturl = '/workflow-editor' + wfediturl;
            //console.log('>>>wfediturl=%j',wfediturl);
            $location.path(wfediturl);
            const urlParams = $location.search();
            _.forEach(urlParams, function(value, key) {
                if (key !== 'wfname') {
                    $location.path(wfediturl).search(key, null);
                }
            });
            return;
        }

        history.back();
    };
}

NavCtrl.$inject = [
    '$scope',
    '$rootScope',
    '$routeParams',
    '$location',
    'csrMenuChangeService',
    '$cookies'
];

export default NavCtrl;
