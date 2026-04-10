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

const tokenPaths = [
  ['token'],
  ['accessToken'],
  ['access_token'],
  ['authToken'],
  ['auth_token'],
  ['bearerToken'],
  ['bearer_token'],
  ['jwt'],
  ['jwtToken'],
  ['jwt_token'],
  ['idToken'],
  ['id_token'],
  ['tokens', 'accessToken'],
  ['tokens', 'access_token'],
  ['tokens', 'token'],
  ['tokens', 'authToken'],
  ['tokens', 'auth_token'],
  ['session', 'token'],
  ['session', 'accessToken'],
  ['session', 'access_token'],
  ['session', 'authToken'],
  ['session', 'auth_token'],
  ['auth', 'token'],
  ['auth', 'accessToken'],
  ['auth', 'access_token'],
  ['auth', 'authToken'],
  ['auth', 'auth_token'],
  ['data', 'token'],
  ['data', 'accessToken'],
  ['data', 'access_token'],
  ['data', 'authToken'],
  ['data', 'auth_token'],
  ['data', 'bearerToken'],
  ['data', 'bearer_token'],
  ['data', 'jwt'],
  ['data', 'jwtToken'],
  ['data', 'jwt_token'],
  ['data', 'idToken'],
  ['data', 'id_token'],
  ['data', 'tokens', 'accessToken'],
  ['data', 'tokens', 'access_token'],
  ['data', 'tokens', 'token'],
  ['data', 'tokens', 'authToken'],
  ['data', 'tokens', 'auth_token'],
  ['data', 'session', 'token'],
  ['data', 'session', 'accessToken'],
  ['data', 'session', 'access_token'],
  ['data', 'session', 'authToken'],
  ['data', 'session', 'auth_token'],
  ['data', 'auth', 'token'],
  ['data', 'auth', 'accessToken'],
  ['data', 'auth', 'access_token'],
  ['data', 'auth', 'authToken'],
  ['data', 'auth', 'auth_token'],
  ['data', 'data', 'token'],
  ['data', 'data', 'accessToken'],
  ['data', 'data', 'access_token'],
  ['data', 'data', 'authToken'],
  ['data', 'data', 'auth_token'],
  ['data', 'data', 'bearerToken'],
  ['data', 'data', 'bearer_token'],
  ['data', 'data', 'jwt'],
  ['data', 'data', 'jwtToken'],
  ['data', 'data', 'jwt_token'],
  ['user', 'token'],
  ['user', 'accessToken'],
  ['user', 'access_token'],
  ['user', 'authToken'],
  ['user', 'auth_token'],
  ['user', 'jwt'],
  ['data', 'user', 'token'],
  ['data', 'user', 'accessToken'],
  ['data', 'user', 'access_token'],
  ['data', 'user', 'authToken'],
  ['data', 'user', 'auth_token'],
  ['data', 'user', 'jwt'],
]

const getValueAtPath = (source, path) =>
  path.reduce((current, key) => current?.[key], source)

const normalizeTokenString = (value) => {
  if (typeof value !== 'string') {
    return ''
  }

  const normalized = value.trim()

  if (!normalized) {
    return ''
  }

  return normalized.replace(/^Bearer\s+/i, '')
}

const looksLikeJwt = (value) => /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(value)

const looksLikeBearerToken = (value) => /^Bearer\s+\S+$/i.test(value)

const preferredTokenKeys = new Set([
  'token',
  'accessToken',
  'access_token',
  'authToken',
  'auth_token',
  'bearerToken',
  'bearer_token',
  'jwt',
  'jwtToken',
  'jwt_token',
  'idToken',
  'id_token',
])

const findTokenDeep = (source, visited = new Set()) => {
  if (!source || typeof source !== 'object' || visited.has(source)) {
    return ''
  }

  visited.add(source)

  for (const [key, value] of Object.entries(source)) {
    if (preferredTokenKeys.has(key)) {
      const token = normalizeTokenString(value)

      if (token) {
        return token
      }
    }
  }

  for (const value of Object.values(source)) {
    if (typeof value === 'string' && (looksLikeBearerToken(value) || looksLikeJwt(value.trim()))) {
      return normalizeTokenString(value)
    }

    const nestedToken = findTokenDeep(value, visited)

    if (nestedToken) {
      return nestedToken
    }
  }

  return ''
}

const extractAuthToken = (source) => {
  for (const path of tokenPaths) {
    const value = normalizeTokenString(getValueAtPath(source, path))

    if (value) {
      return value
    }
  }

  return findTokenDeep(source)
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

  return extractAuthToken(authUser)
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

  if (Array.isArray(payload.error_messages) && payload.error_messages.length) {
    return payload.error_messages
      .filter((item) => typeof item === 'string' && item.trim())
      .join(', ')
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
  extractAuthToken,
  fetchAdminPaymentHistory,
  fetchAdminUserDetail,
  fetchAdminUsers,
  fetchMidtransStatus,
  fetchPaymentHistory,
  fetchTestimonials,
  loginUser,
  registerUser,
}
