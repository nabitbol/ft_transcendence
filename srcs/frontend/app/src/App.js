import { Component } from 'react';
import Login from './components/Login.component'
import { Route, Routes } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
	render() {  
		return (
		<Routes>
			<Route path='/' element={<Login />}/>
		</Routes>
		)
	}
}

export default App;
