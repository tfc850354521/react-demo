import React, {Suspense,lazy} from 'react';
import { BrowserRouter,Route } from 'react-router-dom'
import Wspin from './components/Await/index'
import TabBar from './components/Tabbar/index'
// import Home from './pages/Home/inde'
// import AddressList from './pages/AddressList/index'
import Social  from './pages/Social/index'
// import Personal from './pages/Personal/index'
import NavBar from './components/NavBar/index'
import Login from './pages/Login/index'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
// import Register from './pages/Register/index'
// import AddLitem from './pages/AddItem/index'
// import Collect from './pages/Collect/index'
// import Modification from './pages/Modification/index'


const AddressList = lazy(()=> import ('./pages/AddressList/index'))
// const Social = lazy(()=> import ('./pages/Social/index'))
const Personal = lazy(()=> import ('./pages/Personal/index'))
const Register = lazy(()=> import ('./pages/Register/index'))
const AddLitem = lazy(()=> import ('./pages/AddItem/index'))
const Collect = lazy(()=> import ('./pages/Collect/index'))
const Modification = lazy (()=> import ('./pages/Modification/index'))
const Home =lazy (()=> import ('./pages/Home/inde'))
const Homepage= lazy (()=> import ('./pages/Homepage/index'))
const Chat = lazy(()=> import ('./pages/Chat/index'))
const PoneLogin=lazy (()=> import ('./pages/PoneLogin/index'))


function App() {
  return (
    <BrowserRouter>

     <div className="App">
     <NavBar></NavBar>

     <Route path="/"  exact component={ Login }></Route>

     <Suspense fallback={ <Wspin/> }>
         <Route path="/chat" component={ Chat }></Route>
     </Suspense>

     <Suspense fallback={ <Wspin/> }>
         <Route path="/homepage" component={ Homepage }></Route>
     </Suspense>

     <Suspense fallback={ <Wspin/> }>
         <Route path="/home"  component={ Home }></Route>
     </Suspense>

     <Suspense fallback={ <Wspin/> }>
        <Route path='/register' component={ Register }></Route>
     </Suspense>

     <Suspense fallback={ <Wspin/> }>
        <Route path='/address' component= { AddressList }></Route>
     </Suspense>

     <CacheSwitch>
    
        <CacheRoute path='/social'  component={ Social }></CacheRoute>
     
     </CacheSwitch>

     <Suspense fallback={ <Wspin/> }>
        <Route path='/personal' component={ Personal }></Route>
     </Suspense>

     <Suspense fallback={ <Wspin/> }>
        <Route path='/additem' component={ AddLitem }></Route>
     </Suspense>

     <Suspense fallback={ <wspin/> }>
        <Route path='/collect' component={ Collect }></Route>
     </Suspense>

     <Suspense fallback={ <Wspin/> } >
        <Route path='/modification' component= { Modification }></Route>
     </Suspense>
     
     <Suspense fallback={ <Wspin/> }>
     <Route path='/ponelogin' component= { PoneLogin }></Route>
     
     </Suspense>
      <TabBar></TabBar>
    </div>

    </BrowserRouter>
  );
}

export default App;
