import * as NgTemplates from '../components/react';
import ReactComponents from './componentIndex';
import controllerFactory from './controllerFactory';

const injectReactComponents = (app) => {
    const injectComponent = ({ Component },i) => {
        const component = Component.WrappedComponent || Component;
        const { name: compName } = component;
        const getName = (name) => `${name.charAt(0).toLowerCase()}${name.slice(1)}`;
        const directiveName = getName(compName);
        const ReactFactory = (component) => component;
        const CreateDirective = (ReactComponent, reactDirective) => reactDirective(ReactComponent);
        const template = NgTemplates[compName];
        const NgComponent = {
            template,
            controller: controllerFactory(directiveName),
            controllerAs: '$props'
        };
        app.component(`react${compName}`, NgComponent);
        app.factory(`CreateDirective-${i}`, () => ReactFactory(component));
        app.directive(directiveName, CreateDirective);
        CreateDirective.$inject = [`CreateDirective-${i}`, 'reactDirective'];
    };

    Object.values(ReactComponents).forEach((ConnectComponent,i) => injectComponent(ConnectComponent,i));
};

export default injectReactComponents;
