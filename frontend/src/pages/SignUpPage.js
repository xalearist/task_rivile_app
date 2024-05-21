import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function SignUpPage() {
    const { t } = useTranslation(); 
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        const response = await fetch(`${process.env.REACT_APP_AUTH_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: firstname,  
                lastName: lastname,
                email,
                password
            })
        });
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/login');
        } else {
            console.error(t('Signup failed'));
        }
    };

    return (
        <div className="form-container">
            <div className="form-box">
                <h1>{t('Sign Up')}</h1>
                <form onSubmit={handleSignUp}>
                    <input
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('Email')}
                    />
                    <input
                        type="text"
                        className="form-input"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        placeholder={t('First Name')}
                    />
                    <input
                        type="text"
                        className="form-input"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        placeholder={t('Last Name')}
                    />
                    <input
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t('Password')}
                    />
                    <button type="submit" className="form-button">{t('Sign Up')}</button>
                </form>
                <p className="link-text">{t('Already have an account?')} <Link to="/login">{t('Login Here')}</Link></p>
            </div>
        </div>
    );
}

export default SignUpPage;
