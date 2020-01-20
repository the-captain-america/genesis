function loginController(
    $scope,
    $rootScope,
    CustCompany,
    $http,
    $cookies,
    $mdDialog,
    loginurl,
    serverurl,
    csrMenuChangeService,
    csrAcctHierarchyService,
    $location
) {
    let ctrl = this;
    ctrl.$onInit = init;

    CWDialogController.$inject = [
        '$scope',
        '$mdDialog',
        'compkey',
        'username',
        'displayname',
        'password',
        'compname',
        'loginurl'
    ];

    function init() {
        ctrl.title = 'Login Component';
    }

    $http.get(serverurl + 'login/invalidate').then(
        function onSuccess(response) {
            var data = response.data;
            if (data && data.redirecturl) {
                window.location = data.redirecturl;
            } else if ($scope.lumlogo === 'yes') {
                //for lumesse
                window.location = window.location.origin + '/#/lumesse';
            }
            // Intercom('shutdown'); // on click of logout
        },
        function onError(response) {
            // Intercom('shutdown'); // on session time out
        }
    );

    // Forget the user preference
    delete $rootScope.userpref;

    $cookies.remove('ltok');
    $cookies.remove('a_u');
    $cookies.remove('s_u');
    $rootScope.showHelpIcon = 'no';
    // These are old cookies, remove these on logout
    $cookies.remove('uname');
    $cookies.remove('compname');
    $cookies.remove('dispname');
    $cookies.remove('sessattr');
    $scope.forgotpassword = {};

    $scope.showforgotpasswordbox = false;
    $scope.showresetpasswordbox = false;
    $scope.showforgotpasswordboxForm = false;
    $scope.showloginbox = true;

    $scope.showUpgradePassword = false;
    $scope.showForcePasswordChange = false;
    $scope.forgotPasswordSuccess = false;
    $scope.forgotPasswordError = false;
    $scope.showAccountLockedResetPassword = false;

    $scope.resetError = $cookies.get('resetError');
    $scope.resetMsg = $cookies.get('resetMsg');

    $cookies.remove('resetError');
    $cookies.remove('resetMsg');

    if ($scope.resetError && $scope.resetMsg) {
        $scope.showforgotpasswordbox = false;
        $scope.showresetpasswordbox = true;
        $scope.showloginbox = false;
        $scope.showUpgradePassword = false;
        $scope.showForcePasswordChange = false;
        $scope.showAccountLockedResetPassword = false;
    }

    $scope.showforgotpassword = function() {
        $cookies.remove('resetError');
        $cookies.remove('resetMsg');
        $scope.showloginbox = false;
        $scope.showforgotpasswordbox = true;
        $scope.showforgotpasswordboxForm = true;
        $scope.showresetpasswordbox = false;
        $scope.showUpgradePassword = false;
        $scope.showForcePasswordChange = false;
        $scope.showAccountLockedResetPassword = false;
    };
    $scope.showlogin = function() {
        $cookies.remove('resetError');
        $cookies.remove('resetMsg');
        $scope.showloginbox = true;
        $scope.showforgotpasswordbox = false;
        $scope.showresetpasswordbox = false;
        $scope.showforgotpasswordboxForm = false;
        $scope.forgotPasswordSuccess = false;
        $scope.forgotPasswordError = false;
        $scope.showUpgradePassword = false;
        $scope.showForcePasswordChange = false;
        $scope.forgotpassword.email = '';
        $scope.showAccountLockedResetPassword = false;
    };

    $scope.changePassword = function() {
        $scope.resetPasswordSuccess = false;
        $scope.mismatcherror = false;
        $scope.BackToSignInButton = false;
        if (
            $scope.changePassword.confirmpassword !==
            $scope.changePassword.newpassword
        ) {
            $scope.mismatcherror = true;
            return;
        }
        $scope.strengthError = 'no';
        $scope.upgPasswordError = 'no';
        var userdata;
        if ($scope.upgradePasswordPolicy === true) {
            userdata = {
                newpassword: $scope.changePassword.newpassword,
                user_name: $scope.username,
                ckey: $scope.upgPasswordCkey,
                user_password: $scope.password
            };
            $http
                .post(loginurl + 'login/upgpwd', userdata, {
                    headers: {
                        'auth-token': '5c334e6c63533988636d5632615756994c333d3d'
                    }
                })
                .then(
                    function onSuccess(response) {
                        var data = response.data;
                        if (data.strengthError) {
                            $scope.strengthError = 'yes';
                            $scope.strengthErrors = data.strengthError;
                            return;
                        }
                        if (data.error) {
                            $scope.upgPasswordError = 'yes';
                            $scope.upgPasswordErrorMsg = data.error;
                            return;
                        }
                        $scope.resetPasswordSuccess = true;
                        $scope.BackToSignInButton = true;
                        $scope.showUpgradePassword = false;
                        $scope.showForcePasswordChange = false;
                        $scope.changePasswordUserName = data.message;
                        $scope.resetMsg = 'no';
                        $scope.resetError = 'no';
                        $scope.showAccountLockedResetPassword = false;
                    },
                    function onError(error) {
                        // $scope.forgotPasswordError = true;
                    }
                );
        } else {
            userdata = {
                newpassword: $scope.changePassword.newpassword,
                resetToken: $scope.resetMsg
            };
            $http
                .post(loginurl + 'login/cp', userdata, {
                    headers: {
                        'auth-token': '5c334e6c63533988636d5632615756994c333d3d'
                    }
                })
                .then(
                    function onSuccess(response) {
                        var data = response.data;
                        if (data.strengthError) {
                            $scope.strengthError = 'yes';
                            $scope.strengthErrors = data.strengthError;
                            return;
                        }
                        if (data.error) {
                            $scope.resetPasswordError = 'yes';
                            $scope.resetPasswordMsg = data.error;
                            return;
                        }
                        $scope.resetPasswordSuccess = true;
                        $scope.BackToSignInButton = true;
                        $cookies.remove('resetError');
                        $cookies.remove('resetMsg');
                        $scope.resetMsg = 'no';
                        $scope.resetError = 'no';
                        $scope.changePasswordUserName = data.message;
                    },
                    function onError(error) {
                        // $scope.forgotPasswordError = true;
                    }
                );
        }
    };

    $scope.forgetPassswordLink = function() {
        $cookies.remove('resetError');
        $cookies.remove('resetMsg');

        var userdata = {
            username: $scope.forgotpassword.email
        };
        $scope.forgotPasswordSuccess = false;
        $scope.forgotPasswordError = false;
        $http
            .post(loginurl + 'login/f', userdata, {
                headers: {
                    'auth-token': '5c334e6c63533988636d5632615756994c333d3d'
                }
            })
            .then(
                function onSuccess(response) {
                    var data = response.data;
                    // console.info('data.message  '+data.message);
                    if (data.message === 'Invalid Username') {
                        $scope.forgotPasswordError = true;
                    } else {
                        $scope.showforgotpasswordboxForm = false;
                        $scope.forgotPasswordSuccess = true;
                    }
                },
                function onError(error) {
                    $scope.forgotPasswordError = true;
                }
            );
    };
    $scope.forcePasswordChangeBtn = function(username) {
        $cookies.remove('resetError');
        $cookies.remove('resetMsg');

        var userdata = {
            username: username
        };
        $scope.forgotPasswordSuccess = false;
        $scope.forgotPasswordError = false;
        $http
            .post(loginurl + 'login/f', userdata, {
                headers: {
                    'auth-token': '5c334e6c63533988636d5632615756994c333d3d'
                }
            })
            .then(
                function onSuccess(response) {
                    // var data = response.data;
                    // console.info('data.message  '+data.message);
                    $scope.showForcePasswordChange = false;
                    $scope.showforgotpasswordbox = true;
                    $scope.showforgotpasswordboxForm = false;
                    $scope.forgotPasswordSuccess = true;
                },
                function onError(error) {}
            );
    };

    $scope.loginToHome = function(action) {
        $cookies.remove('a_u');
        $cookies.remove('resetError');
        $cookies.remove('resetMsg');
        $('.error.login').removeClass('hidethis');

        var logindata = {};
        if (action) {
            logindata.username = $scope.changePasswordUserName;
            logindata.password = $scope.changePassword.confirmpassword;
        } else {
            logindata.username = $scope.username;
            logindata.password = $scope.password;
        }
        $scope.accountlocked = false;
        $scope.invalidlogin = false;

        $http
            .post(loginurl + 'login', logindata, {
                headers: {
                    'auth-token': '5c334e6c63533988636d5632615756994c333d3d'
                }
            })
            .then(
                function onSuccess(response) {
                    var data = response.data;
                    if (data.message && data.message === 'CW') {
                        $mdDialog
                            .show({
                                controller: CWDialogController,
                                controllesAs: 'ctrlDialog',
                                templateUrl:
                                    'views/includes/modal-clickwrap.html',
                                parent: angular.element(document.body),
                                // targetEvent: ev,
                                locals: {
                                    compkey: data.compkey,
                                    username: logindata.username,
                                    displayname: data.displayname,
                                    password: logindata.password,
                                    compname: data.compname,
                                    loginurl: loginurl
                                },
                                clickOutsideToClose: false
                            })
                            .then(
                                function(answer) {
                                    // $scope.status = 'You said the information was "' + answer + '".';
                                    // console.info('Your Information was '+answer+' :::: and action was '+action);
                                    $scope.loginToHome(action);
                                },
                                function() {
                                    //$scope.status = 'You cancelled the dialog.';
                                    // console.info('You cancelled the dialog');
                                }
                            );
                        return;
                    }

                    console.log('Data is  :::: ' + JSON.stringify(data));

                    if (data.result) {
                        if (typeof woopra !== 'undefined') {
                            woopra
                                .identify({
                                    email: data.result.userNameHashed,
                                    name: data.result.Name,
                                    company: data.result.compname,
                                    role: data.result.role,
                                    loginurl: loginurl
                                })
                                .push();
                        }

                        $rootScope.userdata = {
                            email: data.result.username,
                            name: data.result.Name,
                            company: data.result.compname,
                            role: data.result.role,
                            appversion: data.result.appversion,
                            enblbulkcsv: data.result.enblbulkcsv,
                            is_sb: data.result.is_sb,
                            linked_comp: data.result.linked_comp,
                            photo_l: data.result.photo_l,
                            reactui: data.result.reactui
                        };

                        // Intercom('boot', {
                        //     app_id: data.result.intercomAppId,
                        //     name: data.result.Name, // Full name
                        //     user_id: data.result.username,
                        //     email: data.result.username, // Email address
                        //     company: data.result.compname,
                        //     user_hash: data.result.intercomHash,
                        //     avatar: {
                        //         type: 'avatar',
                        //         image_url: data.result.photo_l
                        //     }
                        // });
                        console.log(
                            'Intercom settings loaded for user on login',
                            data.result.intercomHash
                        );
                        // console.log('$rootScope.userdata  is after login....'+JSON.stringify($rootScope.userdata));

                        var configItem = CustCompany.get(
                            { userdata: 'yes' },
                            function() {
                                if (configItem.attr) {
                                    if ($scope.$parent) {
                                        $scope.$parent.gradient =
                                            configItem.attr.overlay;
                                        $scope.$parent.backgroundImg =
                                            configItem.attr.bgimage;
                                        $scope.$parent.backgroundImgCdn =
                                            configItem.attr.bgimageCdn;
                                    }
                                } else {
                                    if ($scope.$parent) {
                                        $scope.$parent.gradient =
                                            'theme-gradient-red';
                                        $scope.$parent.backgroundImg =
                                            '//static.enboarder.net/images/enboarder-bg.jpg';
                                    }
                                }
                                //if cookies contain a_u, then it's CSR login
                                if (
                                    $cookies.get('a_u') &&
                                    !$cookies.get('s_u')
                                ) {
                                    // console.info('Calling  set isCSR true>>>>>>>>');
                                    csrMenuChangeService.setIsCsr(true);
                                } else {
                                    // console.info('Calling  set isCSR false>>>>>>>>');
                                    csrMenuChangeService.setIsCsr(false);
                                }
                                var role = 'admin';
                                if (
                                    $rootScope.userdata &&
                                    $rootScope.userdata.role
                                ) {
                                    role = $rootScope.userdata.role;
                                    // console.log('Setting user role to........'+role);
                                }

                                csrMenuChangeService.setChangedRole(role);
                                if (configItem.isparent === 'yes') {
                                    csrAcctHierarchyService.setAccountHierarchy(
                                        configItem,
                                        configItem.isparent,
                                        configItem.maxchildaccts
                                    );
                                } else {
                                    csrAcctHierarchyService.setAccountHierarchy(
                                        null,
                                        false,
                                        0
                                    );
                                }

                                $location.path('/dashboard');
                                $rootScope.userdata.profile =
                                    configItem.userdata.profile;
                                // customised logo for login
                                $rootScope.adminappbubble =
                                    (configItem.adminappbubble ||
                                        '//static.enboarder.net/images/logo.gif') +
                                    '?' +
                                    new Date().getTime();
                            }
                        );
                    } else {
                        if (data.message === 'UpgradePassword') {
                            $scope.showUpgradePassword = true;
                            $scope.showForcePasswordChange = false;
                            $scope.upgPasswordCkey = data.ckey;
                            $scope.showloginbox = false;
                        } else if (data.message === 'ForcePasswordChange') {
                            $scope.showForcePasswordChange = true;
                            // $scope.upgPasswordCkey = data.ckey;
                            $scope.showloginbox = false;
                        } else if (data.message === 'AccountLocked') {
                            $scope.accountlocked = true;
                            $scope.showloginbox = true;
                        } else if (
                            data.message === 'AccountLockedResetPassword'
                        ) {
                            $scope.showAccountLockedResetPassword = true;
                            $scope.showloginbox = false;
                        } else if (data.message === 'maintenance') {
                            $scope.maintenance = true;
                            $scope.showloginbox = false;
                        } else {
                            $scope.invalidlogin = true;
                            $('input.loginbtn').attr('disabled', 'disabled');

                            $('body').on('keyup', '.logininput input', function(
                                e
                            ) {
                                $('input.loginbtn').removeAttr('disabled');

                                if (e.keyCode == 13) {
                                    $('.error.login').removeClass('hidethis');
                                    $('input.loginbtn').attr(
                                        'disabled',
                                        'disabled'
                                    );
                                } else {
                                    $('.error.login').addClass('hidethis');
                                }
                            });
                        }
                    }
                },
                function onError(error) {}
            );
    };

    $scope.upgradePasswordBtn = function() {
        $scope.showforgotpasswordbox = false;
        $scope.showresetpasswordbox = true;
        $scope.showloginbox = false;
        $scope.showUpgradePassword = false;
        $scope.showForcePasswordChange = false;
        $scope.resetError = 'no';
        $scope.upgradePasswordPolicy = true;
        $scope.showAccountLockedResetPassword = false;
    };

    // ClickWrap Agreement Dialog
    function CWDialogController(
        $scope,
        $mdDialog,
        compkey,
        username,
        displayname,
        password,
        compname,
        loginurl
    ) {
        // acceptflag
        $scope.cancel = function() {
            $mdDialog.cancel();
        };

        $scope.saveClickWrap = function() {
            // console.info('Saving ClickWrap for username [%s] , displayname [%s]
            //and compkey [%s] and company name is [%s]', username, displayname, compkey, compname);
            var cwdata = {
                username: username,
                displayname: displayname,
                compkey: compkey,
                compname: compname,
                ptoken: password
            };
            $http
                .post(loginurl + 'login/acceptcw', cwdata, {
                    headers: {
                        'auth-token': '5c334e6c63533988636d5632615756994c333d3d'
                    }
                })
                .then(
                    function onSuccess(response) {
                        var data = response.data;
                        if (data.message === 'OK') {
                            $mdDialog.hide();
                        }
                    },
                    function onError(error) {}
                );
        };
    }
}

loginController.$inject = [
    '$scope',
    '$rootScope',
    'CustCompany',
    '$http',
    '$cookies',
    '$mdDialog',
    'loginurl',
    'serverurl',
    'csrMenuChangeService',
    'csrAcctHierarchyService',
    '$location'
];

export default loginController;

/* ############# */
