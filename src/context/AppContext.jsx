import { createContext, useContext, useReducer } from 'react'
import { ADMIN_SEED } from '../data/seed.js'
import { generateSecurityCode, hashPassword, validatePasswordComplexity } from '../utils/auth.js'

export const SECURITY_CODE_TTL_MS = 5 * 60 * 1000

const initialState = {
  admin: { ...ADMIN_SEED },
  isAuthenticated: false,
  pendingLogin: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN_BEGIN':
      return { ...state, pendingLogin: action.payload }
    case 'LOGIN_SUCCESS':
      return { ...state, isAuthenticated: true, pendingLogin: null }
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, pendingLogin: null }
    case 'SET_PASSWORD_HASH':
      return {
        ...state,
        admin: {
          ...state.admin,
          passwordHash: action.payload.passwordHash,
          mustChangePassword: action.payload.mustChangePassword,
        },
      }
    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  async function verifyCredentials(username, password) {
    const enteredHash = await hashPassword(password)
    return username === state.admin.username && enteredHash === state.admin.passwordHash
  }

  function beginLogin() {
    const code = generateSecurityCode()
    dispatch({ type: 'LOGIN_BEGIN', payload: { code, expiresAt: Date.now() + SECURITY_CODE_TTL_MS } })
  }

  function verifySecurityCode(code) {
    if (!state.pendingLogin) {
      return { ok: false, reason: 'invalid' }
    }
    if (Date.now() >= state.pendingLogin.expiresAt) {
      return { ok: false, reason: 'expired' }
    }
    if (code !== state.pendingLogin.code) {
      return { ok: false, reason: 'invalid' }
    }
    dispatch({ type: 'LOGIN_SUCCESS' })
    return { ok: true }
  }

  function logout() {
    dispatch({ type: 'LOGOUT' })
  }

  async function setNewPassword(newPassword) {
    const error = validatePasswordComplexity(newPassword)
    if (error) {
      return { ok: false, error }
    }
    const passwordHash = await hashPassword(newPassword)
    dispatch({ type: 'SET_PASSWORD_HASH', payload: { passwordHash, mustChangePassword: false } })
    return { ok: true }
  }

  async function changePassword(currentPassword, newPassword) {
    const currentHash = await hashPassword(currentPassword)
    if (currentHash !== state.admin.passwordHash) {
      return { ok: false, error: 'Current password is incorrect' }
    }
    const error = validatePasswordComplexity(newPassword)
    if (error) {
      return { ok: false, error }
    }
    const passwordHash = await hashPassword(newPassword)
    dispatch({
      type: 'SET_PASSWORD_HASH',
      payload: { passwordHash, mustChangePassword: state.admin.mustChangePassword },
    })
    return { ok: true }
  }

  const value = {
    admin: state.admin,
    isAuthenticated: state.isAuthenticated,
    pendingLogin: state.pendingLogin,
    verifyCredentials,
    beginLogin,
    verifySecurityCode,
    logout,
    setNewPassword,
    changePassword,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider')
  }
  return ctx
}
