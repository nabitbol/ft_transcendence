import { Component } from 'react';
import { Route, Routes } from 'react-router-dom'
import "bootstrap/dist/css/bootstrap.min.css";
import AuthPage from './pages/auth.page';
import HomePage from './pages/home.page';
import ProfilePage from './pages/profile.page';
import AuthApiPage from './pages/authApi.page';
import GenerateQrPage from './pages/generateQr.page';

class App extends Component {
	render() {  
		return (
		<Routes>
			<Route path='/home' element={<HomePage />}/>
			<Route path='/'  element={<HomePage />}/>
			<Route path='/profile' element={<ProfilePage />}/>
			<Route path='/auth' element={<AuthPage />}/>
			<Route path='/auth/api' element={<AuthApiPage />}/>
			<Route path='/auth/generateQr' element={<GenerateQrPage />}/>
		</Routes>
		)
	}
}

export default App;
