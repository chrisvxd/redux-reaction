import { createReducer } from 'redux-create-reducer'
import { reduce } from 'lodash'

const guid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
}

export const createReaction = (
  inputAction,
  reducer,
  type = guid()
) => ({
  action: (...args) => ({
    ...(
      inputAction || (() => ({})) // default inputAction
    )(...args),
    type
  }),
  reducer: (
    reducer || (
      (state, action) => {
        const { type, ...rest } = action
        return {
          ...state,
          ...rest
        }
      }
    )
  ),
  type
})

export const combineReactions = (...args) => (
  reduce(args, (result, reaction) => ({
    ...result,
    [reaction.type]: reaction.reducer
  }), {})
)

export const buildReducer = (initialState, ...args) => {
  return createReducer(initialState, combineReactions(...args))
}
