import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Popover, NavBar, Icon } from 'antd-mobile';
import './index.css'
const Item = Popover.Item;



const myImg = src => <img src={`https://gw.alipayobjects.com/zos/rmsportal/${src}.svg`} className="am-icon am-icon-xs" alt="" />;
 class Navbar extends Component {

    constructor(){
        super()

        this.state={
            visible: false,
            selected: '',
        }
    }

    onSelect = (opt) => {
        if(opt.key === '1'){
          
          this.props.history.push('/additem')
        }else{
          
          this.props.history.push('/collect')

        }
        this.setState({
          visible: false,
          selected: opt.props.value,
        })
        
      };


      handleVisibleChange = (visible) => {
        this.setState({
          visible,
        });
      };

    

    render() {
        return (
            <div className="navbar">
          
            <NavBar
              mode="light"
              rightContent={
                <Popover mask
                  overlayClassName="fortest"
                  overlayStyle={{ color: 'currentColor' }}
                  visible={this.state.visible}
                  overlay={[
                    (<Item key="1" value="scan"data-seed="logId" >发布动态</Item>),
                    (<Item key="2" value="scan"data-seed="logId" >我的收藏</Item>)
                   
                  ]}
                  align={{
                    overflow: { adjustY: 0, adjustX: 0 },
                    offset: [-10, 0],
                  }}
                  onVisibleChange={this.handleVisibleChange}
                  onSelect={this.onSelect}
                  
                >
                  <div style={{
                    height: '100%',
                    padding: '0 15px',
                    marginRight: '-15px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  >
                    <Icon type="ellipsis" />
                  </div>
                </Popover>
              }
            >
              聊天吗
            </NavBar>
            </div>
        )
    }

}

export default withRouter(Navbar)