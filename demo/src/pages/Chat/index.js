import { connect } from 'react-redux'
import  index_ui from './index_ui'

const mapStateToProps = function(state){
  return{
      listinf:state
  }
}
const mapDispatchToProps = function(dispatch){
  return{
     addInf(data){
        dispatch({
          type:'ADDINF',
          data
        })
     }
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(index_ui)