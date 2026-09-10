import { createContext, useContext, useReducer } from 'react'
import { ADMIN_SEED } from '../data/seed.js'
import { generateSecurityCode, hashPassword, validatePasswordComplexity } from '../utils/auth.js'
import { SAMPLE_USERS, SAMPLE_ADD_REQUESTS, SAMPLE_REMOVE_REQUESTS, } from '../data/users.js'

export const SECURITY_CODE_TTL_MS = 5 * 60 * 1000

const initialState = {
  admin: { ...ADMIN_SEED },
  isAuthenticated: false,
  pendingLogin: null,

  // USER MANAGEMENT ================

  users: [...SAMPLE_USERS],
  addRequests: [...SAMPLE_ADD_REQUESTS],
  removeRequests: [...SAMPLE_REMOVE_REQUESTS],
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
    // USER MANAGEMENT ================

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id
            ? {
                ...user,
                email: action.payload.email,
                phone: action.payload.phone,
                mailingAddress: action.payload.mailingAddress,
              }
            : user
        ),
      }
    case 'APPROVE_ADD_REQUEST':
      return {
        ...state,
        users: [...state.users, action.payload.user],
        addRequests: state.addRequests.filter(
          (request) => request.id !== action.payload.requestId
        ),
      }
    case 'APPROVE_REMOVE_REQUEST':
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.userId
            ? { ...user, active: false }
            : user
        ),
        removeRequests: state.removeRequests.filter(
          (request) => request.id !== action.payload.requestId
        ),
      }
    default:
      return state
  }
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  async function verifyCredentials(username, password) {
    try {
      const enteredHash = await hashPassword(password)
      return username === state.admin.username && enteredHash === state.admin.passwordHash
    } catch {
      return false
    }
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
    try {
      const passwordHash = await hashPassword(newPassword)
      dispatch({ type: 'SET_PASSWORD_HASH', payload: { passwordHash, mustChangePassword: false } })
      return { ok: true }
    } catch {
      return { ok: false, error: 'Something went wrong. Please try again.' }
    }
  }

  async function changePassword(currentPassword, newPassword) {
    try {
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
    } catch {
      return { ok: false, error: 'Something went wrong. Please try again.' }
    }
  }

  // USER MANAGEMENT FUNCTIONS =====================
  
  function updateUser(userId, updatedInformation) {
    dispatch({
      type: 'UPDATE_USER',
      payload: {
        id: userId,
        ...updatedInformation,
      },
    })
  }

  const value = {
    admin: state.admin,
    isAuthenticated: state.isAuthenticated,
    pendingLogin: state.pendingLogin,
    // USER MANAGEMENT ================
    users: state.users,
    addRequests: state.addRequests,
    removeRequests: state.removeRequests,
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