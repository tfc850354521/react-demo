import { createStore } from 'redux'

const stateDefault={ 
    newInf:[]
}

const reducers=function(state=stateDefault,action){
    switch (action.type){
        case 'ADDINF':
            state.newInf=action.data
            console.log(state.newInf)
            break
        default:
    }
    return state
}

const store = createStore(reducers)

// store.subscribe(function(){
//     var state=store.getState()
//     console.log(state)
// })
export default store

