class ViewController {
    constructor($ngRedux) {
        this.state = {};
        this.unsubscribe = $ngRedux.connect(this.mapStateToTarget, this.mapDispatchToTarget)(this);
    }
    $onInit() {
        console.log('Loaded ViewController...');
    }

    $onDestroy() {
        this.unsubscribe();
    }

    mapDispatchToTarget(dispatch) {
        return {
            add: (payload) => dispatch({ type: 'ADD', payload }),
        }
    }

    mapStateToTarget(state) {
        return { state };
    }
}

ViewController.$inject = ['$ngRedux'];

export default ViewController;
