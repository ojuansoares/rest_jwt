"use client"

import { useState, useEffect } from "react"

function ServiceModal({ isOpen, onClose, onSubmit, service }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (service) {
      setName(service.name)
      setDescription(service.description)
    } else {
      setName("")
      setDescription("")
    }
  }, [service])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const serviceData = {
      name,
      description,
      ...(service && { id: service.id }),
    }

    await onSubmit(serviceData)
    setLoading(false)
    setName("")
    setDescription("")
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{service ? "Editar Serviço" : "Novo Serviço"}</h2>
          <button onClick={onClose} className="modal-close">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Nome do Serviço</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do serviço"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite a descrição do serviço"
              rows={4}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancelar
            </button>
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Salvando..." : service ? "Atualizar" : "Criar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ServiceModal
