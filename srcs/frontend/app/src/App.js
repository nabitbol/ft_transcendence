import { Component } from 'react';
import { Route, Routes } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import AuthPage from './pages/auth.page';
import HomePage from './pages/home.page';
import ProfilePage from './pages/profile.page';
import AuthApiPage from './pages/authApi.page';

class App extends Component {
	render() {  
		return (
		<Routes>
			<Route path='/home' element={<HomePage />}/>
			<Route path='/'  element={<HomePage />}/>
			<Route path='/auth' element={<AuthPage />}/>
			<Route path='/profile' element={<ProfilePage />}/>
			<Route path='/auth/api' element={<AuthApiPage />}/>
		</Routes>
		)
	}
}

export default App;
