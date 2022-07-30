import { useReducer } from "react";
function useArrayReducer(reducer, initialState) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return [state, dispatch];
}
export { useArrayReducer };