import produce from "immer";
import { act } from "react-dom/test-utils";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { Cell } from "../cell";

interface CellsState {
  data: {
    [key: string]: Cell
  };
  order: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CellsState = {
  data: {},
  order: [],
  loading: false,  
  error: null
};

// Wrap with immer's produce() function to easily update state of Cell objects
const reducer = produce((state: CellsState = initialState, action: Action) => {
  switch (action.type) {
    case ActionType.SAVE_CELLS_ERROR:
      state.error = action.payload;
      return state;

    case ActionType.FETCH_CELLS:
      state.loading = true;
      state.error = null;
      return state;

    case ActionType.FETCH_CELLS_COMPLETE:
      state.order = action.payload.map(cell => cell.id);
      state.data = action.payload.reduce((acc, cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {} as CellsState['data']);
      return state;

    case ActionType.FETCH_CELLS_ERROR:
      state.loading = false;
      state.error = action.payload;
      return state;

    // Update
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      state.data[id].content = content;
      return state;

    // Delete
    case ActionType.DELETE_CELL:
      delete state.data[action.payload];
      state.order = state.order.filter(id => id !== action.payload);
      return state;

    // Move
    case ActionType.MOVE_CELL:
      const { direction } = action.payload;
      const index = state.order.findIndex((id) => id === action.payload.id);
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      // Array bounds check for target index
      if (targetIndex < 0 || targetIndex > state.order.length - 1) {
        return state;
      }
      state.order[index] = state.order[targetIndex];
      state.order[targetIndex] = action.payload.id;
      return state;

    // Insert
    case ActionType.INSERT_CELL_AFTER:
      const cell: Cell = {
        content: '',
        type: action.payload.type,
        id: idGenerator(),
      };

      state.data[cell.id] = cell;
      const foundIndex = state.order.findIndex((id) => id === action.payload.id);

      if (foundIndex < 0) {
        state.order.unshift(cell.id);
      } else {
        state.order.splice(foundIndex + 1, 0, cell.id);
      }
      return state;

    // No change
    default:
      return state;
  }
}, initialState);

// Generate random string, pull substring for new ID 
const idGenerator = () => {
  return Math.random().toString(36).substring(2, 7);
};

export default reducer;