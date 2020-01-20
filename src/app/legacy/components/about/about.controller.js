function aboutController() {
    let ctrl = this;
    ctrl.$onInit = init;
    function init() {
        ctrl.title = 'About Controller';
    }
}

aboutController.$inject = [];

export default aboutController;
