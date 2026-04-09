const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const endpoints = {
  login: import.meta.env.VITE_API_LOGIN_ENDPOINT || '/api/auth/login',
  register: import.meta.env.VITE_API_REGISTER_ENDPOINT || '/api/auth/register',
  adminUsers: import.meta.env.VITE_API_ADMIN_USERS_ENDPOINT || '/api/auth/admin/users',
  testimonials: import.meta.env.VITE_API_TESTIMONIALS_ENDPOINT || '/api/testimonials',
  paymentHistory: import.meta.env.VITE_API_PAYMENT_HISTORY_ENDPOINT || '/api/payments/history',
  adminPaymentHistory:
    import.meta.env.VITE_API_ADMIN_PAYMENT_HISTORY_ENDPOINT || '/api/payments/admin/history',
  midtransToken:
    import.meta.env.VITE_API_MIDTRANS_TOKEN_ENDPOINT || '/api/payments/midtrans/token',
  midtransStatus:
    import.meta.env.VITE_API_MIDTRANS_STATUS_ENDPOINT || '/api/payments/midtrans/status',
}

const getStoredAuthUser = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.localStorage.getItem('joinourday-auth-user')

  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue)
  } catch {
    return null
  }
}

const getAuthToken = () => {
  const authUser = getStoredAuthUser()

  return (
    authUser?.token ||
    authUser?.accessToken ||
    authUser?.access_token ||
    authUser?.tokens?.accessToken ||
    authUser?.tokens?.access_token ||
    authUser?.data?.token ||
    authUser?.data?.accessToken ||
    authUser?.data?.access_token ||
    authUser?.data?.tokens?.accessToken ||
    authUser?.data?.tokens?.access_token ||
    authUser?.jwt ||
    ''
  )
}

const createQueryString = (params = {}) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }

    searchParams.set(key, String(value))
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
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
  const token = getAuthToken()

  const response = await fetch(buildUrl(endpoint), {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

const fetchAdminUsers = async () => {
  return request(endpoints.adminUsers, { method: 'GET' })
}

const fetchAdminUserDetail = async (userId) => {
  return request(`${endpoints.adminUsers}/${encodeURIComponent(userId)}`, {
    method: 'GET',
  })
}

const fetchPaymentHistory = async () => {
  return request(endpoints.paymentHistory, { method: 'GET' })
}

const fetchAdminPaymentHistory = async (params = {}) => {
  return request(`${endpoints.adminPaymentHistory}${createQueryString(params)}`, {
    method: 'GET',
  })
}

const createMidtransTransaction = async (body) => {
  return request(endpoints.midtransToken, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

const fetchMidtransStatus = async (orderId) => {
  return request(`${endpoints.midtransStatus}/${encodeURIComponent(orderId)}`, {
    method: 'GET',
  })
}

export {
  createMidtransTransaction,
  createTestimonial,
  fetchAdminPaymentHistory,
  fetchAdminUserDetail,
  fetchAdminUsers,
  fetchMidtransStatus,
  fetchPaymentHistory,
  fetchTestimonials,
  loginUser,
  registerUser,
}
