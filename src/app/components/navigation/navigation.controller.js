export default class NavigationController {
    constructor($location) {
        this.$location = $location;
    }
    $onInit() {
        console.log('Loaded  Navigationontroller...');
    }
    handleDashboard() {
        this.$location.url('/dashboard');
    }
    handleLocation() {
        this.$location.url('/settings/loc');
    }
    handleAbout() {
        this.$location.url('/about');
    }
    handleAuth() {
        this.$location.url('/login');
    }
    handleHelp() {
        this.$location.url('/help');
    }
}

NavigationController.$inject = ['$location'];
