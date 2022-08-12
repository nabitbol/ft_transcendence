import { useSearchParams } from 'react-router-dom';
import authReqService from '../services/authReq.service';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import React from "react";


const AuthApi= () => {
    const [searchParams] = useSearchParams();
    let navigate = useNavigate();

    const handleLogin = () => {
    
        const code = searchParams.get("code");
        authReqService.sendApiCode(code).then(
            () => {
             navigate("/home");
             window.location.reload();
            })
    }
    
    useEffect(() => {
        handleLogin();
    });

	return(
    <div >
        <span>
        Wait a moment please...
        </span>
    </div>
    );
}

export default AuthApi