import angular from 'angular';

import AppCtrl from './main.controller.js';
import NavCtrl from './nav.controller.js';
import HelpCtrl from './help.controller.js';

const controllers = angular
    .module('EnboarderApp.controllers', [])
    .controller('AppCtrl', AppCtrl)
    .controller('NavCtrl', NavCtrl)
    .controller('HelpCtrl', HelpCtrl);

export default controllers.name;
