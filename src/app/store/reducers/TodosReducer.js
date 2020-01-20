const initialState = [];

export const TodosReducer = (state = initialState, action) => {
  const newState = JSON.parse(JSON.stringify(state));
  switch (action.type) {
    case 'ADD':
      newState.push(action.payload);
      return newState;
    default:
      return state;
  }
};
