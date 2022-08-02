import { Component } from 'react';
import Login from './components/Login.component'
import { Route, Routes } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import Register from './components/Register.component';

class App extends Component {
	render() {  
		return (
		<Routes>
			<Route path='/'  element={<Login />}/>
			<Route path='/auth' element={<Register />}/>
		</Routes>
		)
	}
}

export default App;
