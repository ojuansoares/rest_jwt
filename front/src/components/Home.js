"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import ServiceModal from "./ServiceModal"

function Home() {
  const [userData, setUserData] = useState(null)
  const [services, setServices] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const navigate = useNavigate()

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    return { Authorization: `Bearer ${token}` }
  }

  const handleTokenExpiry = (error) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.msg || error.response?.data?.message || ""
      if (errorMessage.includes("expired") || errorMessage.includes("Token has expired")) {
        localStorage.removeItem("token")
        navigate("/login")
        return true
      }
    }
    return false
  }

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      try {
        const [profileResponse, servicesResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/profile", {
            headers: getAuthHeaders(),
          }),
          axios.get("http://localhost:5000/api/services", {
            headers: getAuthHeaders(),
          }),
        ])

        setUserData(profileResponse.data)
        setServices(servicesResponse.data)
      } catch (err) {
        if (!handleTokenExpiry(err)) {
          setError("Erro ao carregar dados. Faça login novamente.")
          localStorage.removeItem("token")
          navigate("/login")
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const handleCreateService = async (serviceData) => {
    try {
      const response = await axios.post("http://localhost:5000/api/services", serviceData, {
        headers: getAuthHeaders(),
      })
      setServices([...services, response.data])
      setIsModalOpen(false)
    } catch (err) {
      if (!handleTokenExpiry(err)) {
        console.error("Erro ao criar serviço:", err)
        alert("Erro ao criar serviço. Tente novamente.")
      }
    }
  }

  const handleUpdateService = async (serviceData) => {
    try {
      const response = await axios.put("http://localhost:5000/api/services", serviceData, {
        headers: getAuthHeaders(),
      })
      setServices(services.map((s) => (s.id === serviceData.id ? response.data : s)))
      setIsModalOpen(false)
      setEditingService(null)
    } catch (err) {
      if (!handleTokenExpiry(err)) {
        console.error("Erro ao atualizar serviço:", err)
        alert("Erro ao atualizar serviço. Tente novamente.")
      }
    }
  }

  const handleDeleteService = async (serviceId) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return

    try {
      await axios.delete("http://localhost:5000/api/services", {
        headers: getAuthHeaders(),
        data: { id: serviceId },
      })
      setServices(services.filter((s) => s.id !== serviceId))
    } catch (err) {
      if (!handleTokenExpiry(err)) {
        console.error("Erro ao excluir serviço:", err)
        alert("Erro ao excluir serviço. Tente novamente.")
      }
    }
  }

  const openEditModal = (service) => {
    setEditingService(service)
    setIsModalOpen(true)
  }

  const openCreateModal = () => {
    setEditingService(null)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div>
          <div className="loading-spinner"></div>
          <p className="loading-text">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="loading-container">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <div className="logo">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="logo-icon">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Services Dashboard
          </div>
          <div className="header-actions">
            <span className="user-info">Olá, {userData?.loggedInAs}</span>
            <button onClick={handleLogout} className="logout-button">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="home-main">
        <div className="services-header">
          <div className="services-title-section">
            <h1 className="services-title">Gerenciar Serviços</h1>
            <p className="services-subtitle">Gerencie todos os seus serviços em um só lugar</p>
          </div>
          <button onClick={openCreateModal} className="create-button">
            <svg width="1" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2v20M2 12h20" />
            </svg>
            Novo Serviço
          </button>
        </div>

        {services.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h3 className="empty-title">Nenhum serviço cadastrado</h3>
            <p className="empty-description">Comece criando seu primeiro serviço clicando no botão acima.</p>
          </div>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-header">
                  <div className="service-icon">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div className="service-actions">
                    <button onClick={() => openEditModal(service)} className="action-button edit-button" title="Editar">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="action-button delete-button"
                      title="Excluir"
                    >
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="service-content">
                  <h3 className="service-name">{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                </div>
                <div className="service-footer">
                  <span className="service-id">ID: {service.id}</span>
                  <span className="service-status">Ativo</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingService(null)
        }}
        onSubmit={editingService ? handleUpdateService : handleCreateService}
        service={editingService}
      />
    </div>
  )
}

export default Home
