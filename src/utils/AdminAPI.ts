// Admin API utility functions
const API_BASE = '/api/admin'

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Invalid JSON response')
  }
}

export const AdminAPI = {
  // Resources
  createResource: async (formData: FormData) => {
    try {
      const response = await fetch(`${API_BASE}/resources`, {
        method: 'POST',
        body: formData
      })
      return await handleResponse(response)
    } catch (error) {
      console.error('API not available:', error)
      return { error: 'API not available' }
    }
  },

  getResources: async () => {
    try {
      const response = await fetch(`${API_BASE}/resources`)
      return await handleResponse(response)
    } catch (error) {
      console.error('API not available:', error)
      return []
    }
  },

  getResource: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/resources/${id}`)
      return await handleResponse(response)
    } catch (error) {
      console.error('API not available:', error)
      return { error: 'API not available' }
    }
  },

  updateResource: async (id: string, data: any) => {
    try {
      const response = await fetch(`${API_BASE}/resources/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      return await handleResponse(response)
    } catch (error) {
      console.error('API not available:', error)
      return { error: 'API not available' }
    }
  },

  updateResourceWithFile: async (id: string, formData: FormData) => {
    try {
      const response = await fetch(`${API_BASE}/resources/${id}`, {
        method: 'PUT',
        body: formData
      })
      return await handleResponse(response)
    } catch (error) {
      console.error('API not available:', error)
      return { error: 'API not available' }
    }
  },

  deleteResource: async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/resources/${id}`, {
        method: 'DELETE'
      })
      return await handleResponse(response)
    } catch (error) {
      console.error('API not available:', error)
      return { error: 'API not available' }
    }
  }
}