import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngMaterial from 'angular-material';
import ngAnimate from 'angular-animate';
import ngRedux from 'ng-redux';
import 'ngreact';
import ngCookies from 'angular-cookies';
import 'angular-material/angular-material.css';
import './legacy/styles/main.less';

// import controllers
import controllers from './legacy/controllers/controller.module';
// import components
import settingsLocationComponent from './legacy/components/settings/settings-location.component';
import loginComponent from './legacy/components/auth/auth-settings.component';
import aboutComponent from './legacy/components/about/about.component';

// common styles applied to both react and angular
import './common/less/main.less';
import './legacy/styles/main.less';

// Route Configurations
import config from './config/route.config';
// import Common
import NavigationComponent from './components/navigation/navigation.component';
// import Layout
import LayoutComponent from './components/layout/layout.component';
// import views
import EnboarderView from './components/view/view.component';

// import Services
import categoryService from './legacy/services/category/category.module';
import csrService from './legacy/services/csr/csr.module';
import workflowService from './legacy/services/workflow/workflow.module';
import userService from './legacy/services/user/user.module';

import injectReactComponents from './injectReactComponents';


// Dependencies
const dependencies = [
    'react',
    ngCookies,
    controllers,
    categoryService,
    csrService,
    workflowService,
    userService,
    ngAnimate,
    ngMaterial,
    ngRedux,
    uiRouter
];

// Application
const app = angular.module('EnboarderApp', dependencies);

// Config
app.config(config);
// Components
app.component('enboarderView', EnboarderView);
app.component('navigation', NavigationComponent);
app.component('layout', LayoutComponent);
app.component('settingsLocation', settingsLocationComponent);
app.component('aboutComponent', aboutComponent);
app.component('loginCtrl', loginComponent);

// Constants
app.constant('serverurl', '/v1/');
app.constant('loginurl', '/');

// React Entry
injectReactComponents(app);


// library links
const $ = require('jquery');
window.$ = $;
window.jQuery = $;

export default app;
