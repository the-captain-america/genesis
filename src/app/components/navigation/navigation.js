import angular from 'angular';
import NavigationComponent from './navigation.component';

const app = angular
	.module('EnboarderApp', [])
	.component('navigation', NavigationComponent).name;

export default app;
