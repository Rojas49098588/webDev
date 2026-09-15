import { createContext, useContext, useReducer } from 'react'
import { ADMIN_SEED } from '../data/seed.js'
import { generateSecurityCode, generateTempPassword, hashPassword, validatePasswordComplexity } from '../utils/auth.js'
import { SAMPLE_USERS, SAMPLE_ADD_REQUESTS, SAMPLE_REMOVE_REQUESTS } from '../data/users.js'
import { SAMPLE_CHILDREN, SAMPLE_ADD_CHILD_REQUESTS, SAMPLE_REMOVE_CHILD_REQUESTS } from '../data/children.js'
import { validateName, validateDateOfBirth } from '../utils/validation.js'

export const SECURITY_CODE_TTL_MS = 5 * 60 * 1000

const initialState = {
  admin: { ...ADMIN_SEED },
  session: null,
  pendingLogin: null,

  // USER MANAGEMENT ===================================

  users: [...SAMPLE_USERS],
  addRequests: [...SAMPLE_ADD_REQUESTS],
  removeRequests: [...SAMPLE_REMOVE_REQUESTS],

  // CHILD MANAGEMENT ===================================

  children: [...SAMPLE_CHILDREN],
  addChildRequests: [...SAMPLE_ADD_CHILD_REQUESTS],
  removeChildRequests: [...SAMPLE_REMOVE_CHILD_REQUESTS],
}

function getCurrentAccount(state) {
  if (!state.session) {
    return null
  }
  if (state.session.role === 'admin') {
    return state.admin
  }
  return state.users.find((user) => user.id === state.session.id) ?? null
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN_BEGIN':
      return { ...state, pendingLogin: action.payload }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        session: { role: action.payload.role, id: action.payload.id },
        pendingLogin: null,
      }
    case 'LOGOUT':
      return { ...state, session: null, pendingLogin: null }
    case 'SET_PASSWORD_HASH':
      if (action.payload.role === 'admin') {
        return {
          ...state,
          admin: {
            ...state.admin,
            passwordHash: action.payload.passwordHash,
            mustChangePassword: action.payload.mustChangePassword,
          },
        }
      }
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id
            ? {
                ...user,
                passwordHash: action.payload.passwordHash,
                mustChangePassword: action.payload.mustChangePassword,
              }
            : user
        ),
      }
    // USER MANAGEMENT =================================

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

    // CHILD MANAGEMENT =================================

    case 'APPROVE_ADD_CHILD_REQUEST':
      return {
        ...state,
        children: [...state.children, action.payload.child],
        addChildRequests: state.addChildRequests.filter(
          (request) => request.id !== action.payload.requestId
        ),
      }
    case 'APPROVE_REMOVE_CHILD_REQUEST':
      return {
        ...state,
        children: state.children.map((child) =>
          child.id === action.payload.childId
            ? { ...child, active: false }
            : child
        ),
        removeChildRequests: state.removeChildRequests.filter(
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
  const currentAccount = getCurrentAccount(state)
  const isAuthenticated = state.session !== null

  async function verifyCredentials(username, password) {
    try {
      const enteredHash = await hashPassword(password)

      if (username === state.admin.username && enteredHash === state.admin.passwordHash) {
        return { ok: true, role: 'admin', id: null }
      }

      const staffMatch = state.users.find(
        (user) => user.role === 'staff' && user.active && user.username === username
      )
      if (staffMatch && staffMatch.passwordHash && enteredHash === staffMatch.passwordHash) {
        return { ok: true, role: 'staff', id: staffMatch.id }
      }

      return { ok: false }
    } catch {
      return { ok: false }
    }
  }

  function beginLogin(role, id) {
    const code = generateSecurityCode()
    dispatch({
      type: 'LOGIN_BEGIN',
      payload: { code, expiresAt: Date.now() + SECURITY_CODE_TTL_MS, role, id },
    })
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
    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { role: state.pendingLogin.role, id: state.pendingLogin.id },
    })
    return { ok: true, role: state.pendingLogin.role }
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
      dispatch({
        type: 'SET_PASSWORD_HASH',
        payload: {
          role: state.session.role,
          id: state.session.id,
          passwordHash,
          mustChangePassword: false,
        },
      })
      return { ok: true }
    } catch {
      return { ok: false, error: 'Something went wrong. Please try again.' }
    }
  }

  async function changePassword(currentPassword, newPassword) {
    try {
      const account = getCurrentAccount(state)
      const currentHash = await hashPassword(currentPassword)
      if (currentHash !== account.passwordHash) {
        return { ok: false, error: 'Current password is incorrect' }
      }
      const error = validatePasswordComplexity(newPassword)
      if (error) {
        return { ok: false, error }
      }
      const passwordHash = await hashPassword(newPassword)
      dispatch({
        type: 'SET_PASSWORD_HASH',
        payload: {
          role: state.session.role,
          id: state.session.id,
          passwordHash,
          mustChangePassword: account.mustChangePassword,
        },
      })
      return { ok: true }
    } catch {
      return { ok: false, error: 'Something went wrong. Please try again.' }
    }
  }

  // USER MANAGEMENT FUNCTIONS ================================

  function updateUser(userId, updatedInformation) {
    dispatch({
      type: 'UPDATE_USER',
      payload: {
        id: userId,
        ...updatedInformation,
      },
    })
  }

  // ADD USER REQUESTS ========================================

  async function approveAddUserRequest(requestId) {
    const request = state.addRequests.find(
      (item) => item.id === requestId
    )

    if (!request) {
      return {
        ok: false,
        error: 'Add request could not be found.',
      }
    }

    let username = ''
    let usernameExists = true

    while (usernameExists) {
      const randomDigits = Math.floor(10 + Math.random() * 90)

      username =
        request.firstName.charAt(0).toLowerCase() +
        request.lastName.toLowerCase().replace(/[^a-z]/g, '') +
        randomDigits

      usernameExists = state.users.some(
        (user) => user.username === username
      )
    }

    const initialPassword = generateTempPassword()
    const passwordHash = await hashPassword(initialPassword)

    const newUser = {
      id: `user-${Date.now()}`,
      firstName: request.firstName,
      lastName: request.lastName,
      username,
      email: request.email,
      phone: request.phone,
      mailingAddress: request.mailingAddress,
      role: request.role,
      groupNumber: request.groupNumber ?? null,
      active: true,
      connectedChildren: [],
      passwordHash,
      mustChangePassword: true,
    }

    dispatch({
      type: 'APPROVE_ADD_REQUEST',
      payload: {
        requestId,
        user: newUser,
      },
    })

    return {
      ok: true,
      username,
      initialPassword,
    }
  }

  // REMOVE USER REQUESTS =========================================

  function approveRemoveUserRequest(requestId) {
    const request = state.removeRequests.find(
      (item) => item.id === requestId
    )

    if (!request) {
      return {
        ok: false,
        error: 'Remove request could not be found.',
      }
    }

    const user = state.users.find(
      (item) => item.id === request.userId
    )

    if (!user) {
      return {
        ok: false,
        error: 'User could not be found.',
      }
    }

    if (user.connectedChildren && user.connectedChildren.length > 0) {
      return {
        ok: false,
        error:
          'This user cannot be removed because a child is still connected to their account.',
      }
    }

    dispatch({
      type: 'APPROVE_REMOVE_REQUEST',
      payload: {
        requestId,
        userId: request.userId,
      },
    })

    return {
      ok: true,
    }
  }

  // ADD CHILD REQUESTS ========================================

  function approveAddChildRequest(requestId) {
    const request = state.addChildRequests.find((item) => item.id === requestId)

    if (!request) {
      return { ok: false, error: 'Add-child request could not be found.' }
    }

    const nameError = validateName(request.firstName) || validateName(request.lastName)
    if (nameError) {
      return { ok: false, error: nameError }
    }

    const dobError = validateDateOfBirth(request.dateOfBirth)
    if (dobError) {
      return { ok: false, error: dobError }
    }

    const newChild = {
      id: `child-${Date.now()}`,
      firstName: request.firstName,
      lastName: request.lastName,
      dateOfBirth: request.dateOfBirth,
      primaryCaretakerId: request.primaryCaretakerId,
      otherCaretakerIds: request.otherCaretakerIds ?? [],
      active: true,
    }

    dispatch({
      type: 'APPROVE_ADD_CHILD_REQUEST',
      payload: { requestId, child: newChild },
    })

    return { ok: true }
  }

  // REMOVE CHILD REQUESTS =========================================

  function approveRemoveChildRequest(requestId) {
    const request = state.removeChildRequests.find((item) => item.id === requestId)

    if (!request) {
      return { ok: false, error: 'Remove-child request could not be found.' }
    }

    const child = state.children.find((item) => item.id === request.childId)

    if (!child) {
      return { ok: false, error: 'Child could not be found.' }
    }

    if (request.requestedByUserId !== child.primaryCaretakerId) {
      return {
        ok: false,
        error: "Only the primary caretaker can request this child's removal.",
      }
    }

    dispatch({
      type: 'APPROVE_REMOVE_CHILD_REQUEST',
      payload: { requestId, childId: request.childId },
    })

    return { ok: true }
  }

  const value = {
    admin: state.admin,
    isAuthenticated,
    session: state.session,
    currentAccount,
    pendingLogin: state.pendingLogin,
    // USER MANAGEMENT =====================
    users: state.users,
    addRequests: state.addRequests,
    removeRequests: state.removeRequests,
    updateUser,
    approveAddUserRequest,
    approveRemoveUserRequest,
    // CHILD MANAGEMENT =====================
    children: state.children,
    addChildRequests: state.addChildRequests,
    removeChildRequests: state.removeChildRequests,
    approveAddChildRequest,
    approveRemoveChildRequest,
    //========================================
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
