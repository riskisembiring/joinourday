const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const endpoints = {
  login: import.meta.env.VITE_API_LOGIN_ENDPOINT || '/api/auth/login',
  register: import.meta.env.VITE_API_REGISTER_ENDPOINT || '/api/auth/register',
  testimonials: import.meta.env.VITE_API_TESTIMONIALS_ENDPOINT || '/api/testimonials',
}

const buildUrl = (endpoint) => {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint
  }

  if (!API_BASE_URL) {
    return endpoint
  }

  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
}

const extractMessage = (payload, fallbackMessage) => {
  if (!payload) {
    return fallbackMessage
  }

  if (typeof payload === 'string') {
    return payload
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message
  }

  if (typeof payload.error === 'string' && payload.error.trim()) {
    return payload.error
  }

  if (typeof payload.errors === 'string' && payload.errors.trim()) {
    return payload.errors
  }

  return fallbackMessage
}

const normalizeTestimonials = (payload) => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  if (Array.isArray(payload?.testimonials)) {
    return payload.testimonials
  }

  if (Array.isArray(payload?.results)) {
    return payload.results
  }

  return []
}

const request = async (endpoint, options = {}) => {
  const response = await fetch(buildUrl(endpoint), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const contentType = response.headers.get('content-type') || ''
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    throw new Error(extractMessage(payload, 'Permintaan ke server gagal.'))
  }

  return payload
}

const fetchTestimonials = async () => {
  const payload = await request(endpoints.testimonials, { method: 'GET' })
  return normalizeTestimonials(payload)
}

const createTestimonial = async (body) => {
  return request(endpoints.testimonials, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

const loginUser = async (body) => {
  return request(endpoints.login, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

const registerUser = async (body) => {
  return request(endpoints.register, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export { createTestimonial, fetchTestimonials, loginUser, registerUser }
