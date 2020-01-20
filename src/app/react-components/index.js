import loaderTwo, {
    mapDispatchToProps as loaderTwoDispatch,
    mapStateToProps as loaderTwoState
} from './loaderTwo';

import loader, {
    mapStateToProps as loaderState
} from './loader';

export default {
    loaderTwo: {
        Component: loaderTwo,
        mapDispatchToProps: loaderTwoDispatch,
        mapStateToProps: loaderTwoState,
    },
    loader: {
        Component: loader,
        mapStateToProps: loaderState,
    },
};