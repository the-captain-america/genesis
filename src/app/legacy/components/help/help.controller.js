function helpController($scope, $rootScope, $location, $http, serverurl, $sce) {
    console.log('Loading HelpCtrl...');

    // To set page class
    $rootScope.bodylayout = 'dashboard-page';

    $http.get(serverurl + 'help/token').then(function onSuccess(response) {
        var data = response.data;
        $scope.token = data.token;
        $scope.iframeSrc = $sce.trustAsResourceUrl(data.token);
    });
}

helpController.$inject = [
    '$scope',
    '$rootScope',
    '$location',
    '$http',
    'serverurl',
    '$sce'
];

export default helpController;
