import { connect } from 'react-redux'
import index_ui from './index_ui'

const mapStateToProps = function (state){
    return {
        getInf:state.newInf
    }
}
const mapDispatchToProps = function (dispatch){
    return {
        
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(index_ui)
