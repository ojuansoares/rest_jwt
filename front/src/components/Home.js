// Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css'; // Importa o CSS

function Home() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await axios.get('http://localhost:5000/api/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setUserData(response.data);
            } catch (err) {
                setError('Erro ao buscar dados do usuário. Faça login novamente.');
                localStorage.removeItem('token');
                navigate('/login');
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!userData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="container">
            <h1>Bem-vindo, {userData.loggedInAs}</h1>
            <p><strong>Mensagem da API:</strong> {userData.message}</p>
            <button onClick={handleLogout}>Sair</button>
        </div>
    );
}

export default Home;
