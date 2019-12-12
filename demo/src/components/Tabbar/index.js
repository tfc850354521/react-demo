import { connect } from 'react-redux'
import  index_ui from './index_ui'

const mapStateToProps = function(state){
  return{
      tabInf:state.newInf
  }
}
const mapDispatchToProps = function(dispatch){
  return{
     addInf(data){
        dispatch({
          type:'ADDINF',
          data
        })
        console.log(data)
     }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(index_ui)

