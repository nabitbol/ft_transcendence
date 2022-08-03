import { Component } from 'react';
import Login from './components/Login.component'
import { Route, Routes } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import Register from './components/Register.component';
import Profile from './components/Profile.component';

class App extends Component {
	render() {  
		return (
		<Routes>
			<Route path='/'  element={<Login />}/>
			<Route path='/auth' element={<Register />}/>
			<Route path='/home' element={<Profile />}/>
		</Routes>
		)
	}
}

export default App;
