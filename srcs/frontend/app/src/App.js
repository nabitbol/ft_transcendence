import { Component } from 'react';
import { Route, Routes } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import AuthPage from './pages/auth.page';
import HomePage from './pages/home.page';

class App extends Component {
	render() {  
		return (
		<Routes>
			<Route path='/home' element={<HomePage />}/>
			<Route path='/'  element={<AuthPage />}/>
			<Route path='/auth' element={<AuthPage />}/>
		</Routes>
		)
	}
}

export default App;
