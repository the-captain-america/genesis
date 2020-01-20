import DashboardController from '../components/dashboard0/dashboard.controller';
import HelpController from '../legacy/controllers/help.controller';

import { configureStore } from '../store/middlewares';

const routerConfig = (
  $stateProvider,
  $urlRouterProvider,
  $ngReduxProvider,
  $locationProvider
) => {
  // Remove "!" from URL location
  $locationProvider.hashPrefix('');
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('auth', {
    url: '/login',
    component: 'loginCtrl',
    showSideNavMain: false,
    SecondSideNav: false,
    SideNavWorkflow: false,
    SideNavWorkflowEditor: false,
    SideNavSettingsHome: false,
    SideNavReports: false,
    SideNavCSRSettingsHome: false,
    SideNavContentEditor: false,
    title: 'Sign In'
  });

  $stateProvider.state('dashboard', {
    url: '/dashboard',
    controllerAs: '$ctrl',
    template: require('../components/dashboard0/dashboard.html'),
    controller: DashboardController
  });

  $stateProvider.state('help', {
    url: '/help',
    controllerAs: '$ctrl',
    template: require('../legacy/views/help.html'),
    controller: HelpController
  });

  $stateProvider.state('settings', {
    url: '/settings/loc',
    component: 'settingsLocation'
  });

  $stateProvider.state('about', {
    url: '/about',
    component: 'aboutComponent'
  });

  $ngReduxProvider.provideStore(configureStore());
};

routerConfig.$inject = [
  '$stateProvider',
  '$urlRouterProvider',
  '$ngReduxProvider',
  '$locationProvider'
];

export default routerConfig;
