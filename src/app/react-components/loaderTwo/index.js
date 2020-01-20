import React, { useState } from 'react';
import { connect } from 'react-redux';

const divStyle = {
    left: '50%',
    position: 'absolute',
    cursor: 'pointer',
    border: 'solid 1px green',
};

const mapStateToProps = (state) => ({ state });

const mapDispatchToProps = dispatch => {
    return {
      add: (payload) => dispatch({ type: 'ADD', payload }),
    }
}

const LoaderTwo = (props) => {
    const { add } = props;
    const [value, setValue] = useState(0);
    const increment = () => {
        add(value+1);
        setValue(value+1);
    }
    // rendering 5 times...why??
    console.log(props)
    return (
        <div style={divStyle} className='ReactLoaderTwo' onClick={increment}>
            <p>useState Prop value : {value}, ReduxStore: {JSON.stringify(props.state)}</p>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(LoaderTwo);
export {
    mapStateToProps,
    mapDispatchToProps,
};
