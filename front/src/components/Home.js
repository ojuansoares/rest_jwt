"use client"

// Home.js
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "../App.css" // Importa o CSS

function Home() {
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }
      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        setUserData(response.data)
      } catch (err) {
        setError("Erro ao buscar dados do usuário. Faça login novamente.")
        localStorage.removeItem("token")
        navigate("/login")
      }
    }
    fetchProfile()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  if (error) {
    return (
      <div className="loading-container">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="loading-container">
        <div>
          <div className="loading-spinner"></div>
          <p className="loading-text">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <div className="logo">Dashboard</div>
          <button onClick={handleLogout} className="logout-button">
            Sair
          </button>
        </div>
      </header>

      <main className="home-main">
        <section className="welcome-section">
          <h1 className="welcome-title">Olá, {userData.loggedInAs}! 👋</h1>
          <p className="welcome-message">{userData.message}</p>
        </section>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h3 className="card-title">Sistema Ativo</h3>
            <p className="card-description">
              Sua sessão está ativa e todos os sistemas estão funcionando perfeitamente.
            </p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
              </svg>
            </div>
            <h3 className="card-title">Dados Seguros</h3>
            <p className="card-description">Seus dados estão protegidos com criptografia de ponta a ponta.</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2.5-9H19v2h-1.5v16.5c0 1.1-.9 2-2 2h-11c-1.1 0-2-.9-2-2V4H1V2h3.5c0-1.1.9-2 2-2h7c1.1 0 2 .9 2 2zm-3.5 0h-5v16h5V2z" />
              </svg>
            </div>
            <h3 className="card-title">Performance</h3>
            <p className="card-description">Sistema otimizado para máxima performance e velocidade.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
