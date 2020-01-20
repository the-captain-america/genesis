function locationCtrl($scope) {
    let ctrl = this;
    ctrl.$onInit = init;

    DialogController.$inject = ['$mdDialog'];
    $scope.searchChars = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,OTHER,ALL'.split(
        ','
    );
    $scope.filter = {};
    $scope.filter.selected = 'ALL';

    function init() {
        ctrl.title = 'Settings Location Component';
    }

    function DialogController($mdDialog) {
        console.log('dialog');
    }
}

locationCtrl.$inject = ['$mdDialog', '$scope'];

export default locationCtrl;
