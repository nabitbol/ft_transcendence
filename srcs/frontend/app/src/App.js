import { Component } from 'react';
import Login from './components/Login.component'
import { Route, Routes } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from './components/Modal.component';

class App extends Component {
	render() {  
		return (
		<Routes>
			<Route path='/'  element={<Login />}/>
			<Route path='/home' element={<Modal />}/>
		</Routes>
		)
	}
}

export default App;
