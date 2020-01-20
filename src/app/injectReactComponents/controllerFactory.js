import Components from './componentIndex';

const controllerFactory = (compName) => {
    const {
        mapStateToProps = () => {},
        mapDispatchToProps = () => {},
    } = Components[compName];

    class Controller {
        constructor($ngRedux) {
            this.state = {};
            this.unsubscribe = $ngRedux.connect(this.mapStateToTarget, this.mapDispatchToTarget)(this);
        }
    
        $onDestroy() {
            this.unsubscribe();
        }
    
        mapDispatchToTarget(dispatch) {
            return mapDispatchToProps(dispatch);
        }
          
        mapStateToTarget(state) {
            return mapStateToProps(state);
        }
    }

    return Controller;
};

export default controllerFactory;
