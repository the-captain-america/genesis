function HelpCtrl(
    $scope,
    $rootScope,
    $location,
    csrMenuChangeService,
    $cookies
) {
    console.log('Loaded HelpCtrl...');
}

HelpCtrl.$inject = [
    '$scope',
    '$rootScope',
    '$location',
    'csrMenuChangeService',
    '$cookies'
];

export default HelpCtrl;
