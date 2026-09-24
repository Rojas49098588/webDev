import { createContext, useContext, useReducer } from 'react'
import { ADMIN_SEED } from '../data/seed.js'
import { generateSecurityCode, generateTempPassword, hashPassword, validatePasswordComplexity } from '../utils/auth.js'
import { SAMPLE_USERS, SAMPLE_ADD_REQUESTS, SAMPLE_REMOVE_REQUESTS } from '../data/users.js'
import { SAMPLE_CHILDREN, SAMPLE_ADD_CHILD_REQUESTS, SAMPLE_REMOVE_CHILD_REQUESTS,
        SAMPLE_ATTENDANCE_RECORDS, SAMPLE_PAYMENT_RECORDS } from '../data/children.js'
import {
  validateName,
  validateDateOfBirth,
  validateCardNumber,
  validateExpiration,
  validateCVV,
  validateEmail,
  validatePhone,
  formatPhone,
} from '../utils/validation.js'
import { validateAddress, formatAddress, isAddressEmpty } from '../utils/address.js'

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

  children: SAMPLE_CHILDREN.map((child) => ({
    ...child,
    authorizedCaretakers: child.authorizedCaretakers ?? [],
  })),
  addChildRequests: [...SAMPLE_ADD_CHILD_REQUESTS],
  removeChildRequests: [...SAMPLE_REMOVE_CHILD_REQUESTS],

// ATTENDANCE / PAYMENTS ==============================
  attendanceRecords: [...SAMPLE_ATTENDANCE_RECORDS],
  paymentRecords: [...SAMPLE_PAYMENT_RECORDS], 

//ACTIVITY LOG ===================================
  activity: [],
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
    case 'SUBMIT_ADD_REQUEST':
      return {
        ...state,
        addRequests: [...state.addRequests, action.payload],
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
    case 'DENY_ADD_CHILD_REQUEST':
      return {
        ...state,
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
    case 'DENY_REMOVE_CHILD_REQUEST':
      return {
        ...state,
        removeChildRequests: state.removeChildRequests.filter(
          (request) => request.id !== action.payload.requestId
        ),
      }
    case 'SUBMIT_ADD_CHILD_REQUEST':
      return {
        ...state,
        addChildRequests: [...state.addChildRequests, action.payload],
      }
    case 'ADD_AUTHORIZED_CARETAKER':
      return {
        ...state,
        children: state.children.map((child) =>
          child.id === action.payload.childId
            ? {
                ...child,
                authorizedCaretakers: [
                  ...(child.authorizedCaretakers ?? []),
                  action.payload.caretaker,
                ],
              }
            : child
        ),
      }
    case 'REMOVE_AUTHORIZED_CARETAKER':
      return {
        ...state,
        children: state.children.map((child) =>
          child.id === action.payload.childId
            ? {
                ...child,
                authorizedCaretakers: (child.authorizedCaretakers ?? []).filter(
                  (caretaker) => caretaker.id !== action.payload.caretakerId
                ),
              }
            : child
        ),
      }
    case 'REMOVE_SECONDARY_CARETAKER':
      return {
        ...state,
        children: state.children.map((child) =>
          child.id === action.payload.childId
            ? {
                ...child,
                otherCaretakerIds: (child.otherCaretakerIds ?? []).filter(
                  (caretakerId) => caretakerId !== action.payload.caretakerId
                ),
              }
            : child
        ),
      }
    case 'SUBMIT_REMOVE_CHILD_REQUEST':
      return {
        ...state,
        removeChildRequests: [...state.removeChildRequests, action.payload],
      }

    // ATTENDANCE =============================================

    case 'ADD_ATTENDANCE_RECORD':
      return {
        ...state,
        attendanceRecords: [
          ...state.attendanceRecords,
          action.payload,
        ],
      }

    // PAYMENTS =================================================
    case 'ADD_PAYMENT_RECORD':
      return {
        ...state,
        paymentRecords: [
          ...state.paymentRecords,
          action.payload,
        ],
      }

    case 'UPDATE_PAYMENT_RECORD':
      return {
        ...state,
        paymentRecords: state.paymentRecords.map((record) =>
          record.id === action.payload.id
            ? action.payload
            : record
        ),
      }

    // ACTIVITY LOG =================================
    case 'LOG_ACTIVITY':
      return {
        ...state,
        activity: [action.payload, ...state.activity].slice(0, 10),
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
  const actorName = currentAccount
    ? [currentAccount.firstName, currentAccount.lastName].filter(Boolean).join(' ') || currentAccount.username
    : 'Someone'

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

      const caretakerMatch = state.users.find(
        (user) => user.role === 'caretaker' && user.active && user.username === username
      )
      if (caretakerMatch && caretakerMatch.passwordHash && enteredHash === caretakerMatch.passwordHash) {
        return { ok: true, role: 'caretaker', id: caretakerMatch.id }
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

  // ACTIVITY LOG ================================

  function logActivity(message) {
    dispatch({
      type: 'LOG_ACTIVITY',
      payload: { id: `activity-${Date.now()}`, message, timestamp: Date.now() },
    })
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

  function updateUser(userId, { email, phone, mailingAddress }) {
    const user = state.users.find((item) => item.id === userId)
    if (!user) {
      return { ok: false, error: 'User could not be found.' }
    }

    const emailError = validateEmail(email)
    if (emailError) {
      return { ok: false, error: emailError }
    }

    const phoneError = validatePhone(phone)
    if (phoneError) {
      return { ok: false, error: phoneError }
    }

    // Staff accounts don't require a mailing address; caretakers do.
    const skipAddress = user.role === 'staff' && isAddressEmpty(mailingAddress)
    const addressError = skipAddress ? null : validateAddress(mailingAddress)
    if (addressError) {
      return { ok: false, error: addressError }
    }

    dispatch({
      type: 'UPDATE_USER',
      payload: {
        id: userId,
        email: email.trim(),
        phone: formatPhone(phone),
        mailingAddress: skipAddress ? '' : formatAddress(mailingAddress),
      },
    })

    logActivity(
      `${actorName} updated ${user.firstName} ${user.lastName}'s contact information`
    )

    return { ok: true }
  }

  // ADD USER REQUESTS ========================================

  function submitAccountRequest({ role, firstName, lastName, email, phone, mailingAddress }) {
    if (role !== 'staff' && role !== 'caretaker') {
      return { ok: false, error: 'Choose an account type.' }
    }

    const firstNameError = validateName(firstName)
    if (firstNameError) {
      return { ok: false, error: `First name: ${firstNameError}` }
    }
    const lastNameError = validateName(lastName)
    if (lastNameError) {
      return { ok: false, error: `Last name: ${lastNameError}` }
    }

    const emailError = validateEmail(email)
    if (emailError) {
      return { ok: false, error: emailError }
    }

    const phoneError = validatePhone(phone)
    if (phoneError) {
      return { ok: false, error: phoneError }
    }

    if (role === 'caretaker') {
      const addressError = validateAddress(mailingAddress)
      if (addressError) {
        return { ok: false, error: addressError }
      }
    }

    const normalizedEmail = email.trim().toLowerCase()
    const emailTaken =
      state.users.some((user) => user.active && user.email?.toLowerCase() === normalizedEmail) ||
      state.addRequests.some((request) => request.email?.toLowerCase() === normalizedEmail)
    if (emailTaken) {
      return { ok: false, error: 'An account or pending request already uses this email address.' }
    }

    const request = {
      id: `add-${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: formatPhone(phone),
      mailingAddress: role === 'caretaker' ? formatAddress(mailingAddress) : '',
      role,
    }

    dispatch({ type: 'SUBMIT_ADD_REQUEST', payload: request })

    return { ok: true }
  }

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

    logActivity(
      `${actorName} approved adding ${newUser.firstName} ${newUser.lastName}`
    )

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

    logActivity(`${actorName} archived ${user.firstName} ${user.lastName}`)

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

    const primaryCaretaker = state.users.find(
      (user) => user.id === request.primaryCaretakerId && user.role === 'caretaker' && user.active
    )
    if (!primaryCaretaker) {
      return { ok: false, error: 'The primary caretaker on this request could not be found.' }
    }

    const otherCaretakerIds = request.otherCaretakerIds ?? []
    const hasInvalidOtherCaretaker = otherCaretakerIds.some(
      (caretakerId) =>
        !state.users.some((user) => user.id === caretakerId && user.role === 'caretaker' && user.active)
    )
    if (hasInvalidOtherCaretaker) {
      return { ok: false, error: 'One of the other caretakers on this request could not be found.' }
    }

    const newChild = {
      id: `child-${Date.now()}`,
      firstName: request.firstName,
      lastName: request.lastName,
      dateOfBirth: request.dateOfBirth,
      primaryCaretakerId: request.primaryCaretakerId,
      otherCaretakerIds,
      medications: request.medications ?? [],
      active: true,
    }

    dispatch({
      type: 'APPROVE_ADD_CHILD_REQUEST',
      payload: { requestId, child: newChild },
    })

    logActivity(
      `${currentAccount.firstName} ${currentAccount.lastName} approved adding ${newChild.firstName} ${newChild.lastName}`
    )

    return { ok: true }
  }

  function denyAddChildRequest(requestId) {
    const request = state.addChildRequests.find(
      (item) => item.id === requestId
    )

    if (!request) {
      return {
        ok: false,
        error: 'Add-child request could not be found.',
      }
    }

    dispatch({
      type: 'DENY_ADD_CHILD_REQUEST',
      payload: { requestId },
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

    logActivity(`${currentAccount.firstName} ${currentAccount.lastName} archived ${child.firstName} ${child.lastName}`)

    return { ok: true }
  }

  function denyRemoveChildRequest(requestId) {
    const request = state.removeChildRequests.find(
      (item) => item.id === requestId
    )

    if (!request) {
      return {
        ok: false,
        error: 'Remove-child request could not be found.',
      }
    }

    dispatch({
      type: 'DENY_REMOVE_CHILD_REQUEST',
      payload: { requestId },
    })

    return { ok: true }
  }

  // CHILD MANAGEMENT FUNCTIONS ================================

  function submitAddChildRequest({firstName, lastName, dateOfBirth, medication,}) {
    const nameError = validateName(firstName) || validateName(lastName)
    if (nameError) {
      return { ok: false, error: nameError }
    }

    const dobError = validateDateOfBirth(dateOfBirth)
    if (dobError) {
      return { ok: false, error: dobError }
    }

    const isSameChild = (item) =>
      item.primaryCaretakerId === state.session.id &&
      item.firstName.trim().toLowerCase() === firstName.trim().toLowerCase() &&
      item.lastName.trim().toLowerCase() === lastName.trim().toLowerCase() &&
      item.dateOfBirth === dateOfBirth

    if (state.addChildRequests.some(isSameChild)) {
      return { ok: false, error: `You already have a pending request to admit ${firstName} ${lastName}.` }
    }
    if (state.children.some((child) => child.active && isSameChild(child))) {
      return { ok: false, error: `${firstName} ${lastName} is already enrolled under your account.` }
    }

    const request = {
      id: `add-child-${Date.now()}`,
      firstName,
      lastName,
      dateOfBirth,
      primaryCaretakerId: state.session.id,
      otherCaretakerIds: [],
      medications: medication ? [medication] : [],
    }

    dispatch({ type: 'SUBMIT_ADD_CHILD_REQUEST', payload: request })
    logActivity(`${actorName} requested to add ${firstName} ${lastName}`)

    return { ok: true }
  }

  function addAuthorizedCaretaker(childId, { firstName, lastName, email, phone, mailingAddress }) {
    const child = state.children.find((item) => item.id === childId)

    if (!child || child.primaryCaretakerId !== state.session.id) {
      return {
        ok: false,
        error: 'Only the primary caretaker can add a caretaker to this child.',
      }
    }

    const trimmedFirstName = firstName.trim()
    const trimmedLastName = lastName.trim()

    const nameError =
      validateName(trimmedFirstName) ||
      validateName(trimmedLastName)

    if (nameError) {
      return {
        ok: false,
        error: nameError,
      }
    }

    const contactError =
      validateEmail(email) ||
      validatePhone(phone) ||
      validateAddress(mailingAddress)

    if (contactError) {
      return {
        ok: false,
        error: contactError,
      }
    }

    const alreadyExists = (child.authorizedCaretakers ?? []).some(
      (caretaker) =>
        caretaker.firstName.toLowerCase() === trimmedFirstName.toLowerCase() &&
        caretaker.lastName.toLowerCase() === trimmedLastName.toLowerCase()
    )

    if (alreadyExists) {
      return {
        ok: false,
        error: 'This caretaker is already authorized for this child.',
      }
    }

    const caretaker = {
      id: `authorized-${Date.now()}`,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: email.trim(),
      phone: formatPhone(phone),
      mailingAddress: formatAddress(mailingAddress),
    }

    dispatch({
      type: 'ADD_AUTHORIZED_CARETAKER',
      payload: {
        childId,
        caretaker,
      },
    })

    logActivity(
      `${actorName} added ${trimmedFirstName} ${trimmedLastName} as an authorized caretaker for ${child.firstName} ${child.lastName}`
    )

    return {
      ok: true,
      caretaker,
    }
  }

  function removeAuthorizedCaretaker(childId, caretakerId) {
    const child = state.children.find((item) => item.id === childId)
    if (!child || child.primaryCaretakerId !== state.session.id) {
      return { ok: false, error: 'Only the primary caretaker can remove a caretaker from this child.' }
    }

    const caretaker = (child.authorizedCaretakers ?? []).find((item) => item.id === caretakerId)
    if (!caretaker) {
      return { ok: false, error: 'Caretaker could not be found.' }
    }

    dispatch({ type: 'REMOVE_AUTHORIZED_CARETAKER', payload: { childId, caretakerId } })
    logActivity(
      `${actorName} removed ${caretaker.firstName} ${caretaker.lastName} as a caretaker for ${child.firstName} ${child.lastName}`
    )

    return { ok: true, caretaker }
  }

  function removeSecondaryCaretaker(childId, caretakerId) {
    const child = state.children.find((item) => item.id === childId)
    if (!child || child.primaryCaretakerId !== state.session.id) {
      return { ok: false, error: 'Only the primary caretaker can remove a caretaker from this child.' }
    }

    dispatch({ type: 'REMOVE_SECONDARY_CARETAKER', payload: { childId, caretakerId } })
    logActivity(`${actorName} removed a caretaker from ${child.firstName} ${child.lastName}`)

    return { ok: true }
  }

  function submitRemoveChildRequest(childId) {
    const child = state.children.find((item) => item.id === childId)
    if (!child) {
      return { ok: false, error: 'Child could not be found.' }
    }
    if (child.primaryCaretakerId !== state.session.id) {
      return { ok: false, error: 'Only the primary caretaker can request this child’s removal.' }
    }
    if (state.removeChildRequests.some((request) => request.childId === childId)) {
      return { ok: false, error: 'A removal request for this child is already pending.' }
    }

    const request = {
      id: `remove-child-${Date.now()}`,
      childId,
      requestedByUserId: state.session.id,
    }

    dispatch({ type: 'SUBMIT_REMOVE_CHILD_REQUEST', payload: request })
    logActivity(`${actorName} requested to remove ${child.firstName} ${child.lastName}`)

    return { ok: true }
  }

  //ATTENDANCE ================================================

  function validateAttendanceInformation(childId, caretakerId) {
    const child = state.children.find((item) => item.id === childId)

    if (!child) {
      return {
        ok: false,
        error: 'Child could not be found.',
      }
    }

    if (!child.active) {
      return {
        ok: false,
        error: 'This child is archived and cannot have attendance recorded.',
      }
    }

    const authorizedCaretakerIds = [
      child.primaryCaretakerId,
      ...(child.otherCaretakerIds ?? []),
    ]

    const caretaker =
      state.users.find(
        (user) =>
          user.id === caretakerId &&
          authorizedCaretakerIds.includes(user.id) &&
          user.role === 'caretaker' &&
          user.active
      ) ?? (child.authorizedCaretakers ?? []).find((item) => item.id === caretakerId)

    if (!caretaker) {
      return {
        ok: false,
        error: 'The person is not an authorized caretaker for this child.',
      }
    }

    return {
      ok: true,
      child,
      caretaker,
    }
  }

  function recordAttendance(childId, type, caretakerId) {
    if (type !== 'drop-off' && type !== 'pickup') {
      return {
        ok: false,
        error: 'Invalid attendance type.',
      }
    }

    const validation = validateAttendanceInformation(
      childId,
      caretakerId
    )

    if (!validation.ok) {
      return validation
    }

    const { child, caretaker } = validation

    const attendanceRecord = {
      id: `attendance-${Date.now()}`,
      type,
      dateTime: new Date().toISOString(),

      childId: child.id,
      childFirstName: child.firstName,
      childLastName: child.lastName,

      caretakerId: caretaker.id,
      caretakerFirstName: caretaker.firstName,
      caretakerLastName: caretaker.lastName,
    }

    dispatch({
      type: 'ADD_ATTENDANCE_RECORD',
      payload: attendanceRecord,
    })

    return {
      ok: true,
      record: attendanceRecord,
    }
  }

  function getChildAttendance(childId) {
    return state.attendanceRecords
      .filter((record) => record.childId === childId)
      .sort(
        (a, b) =>
          new Date(b.dateTime) - new Date(a.dateTime)
      )
  }

  function getAttendanceForDate(date) {
    return state.attendanceRecords
      .filter((record) => record.dateTime.startsWith(date))
      .sort(
        (a, b) =>
          new Date(a.dateTime) - new Date(b.dateTime)
      )
  }

  // PAYMENTS ==================================================

  function getChildPayments(childId) {
    return state.paymentRecords
      .filter((record) => record.childId === childId)
      .sort(
        (a, b) =>
          new Date(b.dueOn) - new Date(a.dueOn)
      )
  }

  function addPaymentRecord(paymentInformation) {
    const child = state.children.find(
      (item) => item.id === paymentInformation.childId
    )

    if (!child) {
      return {
        ok: false,
        error: 'Child could not be found.',
      }
    }

    const caretaker = state.users.find(
      (user) =>
        user.id === child.primaryCaretakerId &&
        user.role === 'caretaker' &&
        user.active
    )

    if (!caretaker) {
      return {
        ok: false,
        error: 'The child does not have a valid primary caretaker.',
      }
    }

    const amountDue = Number(paymentInformation.amountDue)
    const amountPaid = Number(paymentInformation.amountPaid)

    if (Number.isNaN(amountDue) || amountDue < 0) {
      return {
        ok: false,
        error: 'Amount due must be a valid non-negative number.',
      }
    }

    if (Number.isNaN(amountPaid) || amountPaid < 0) {
      return {
        ok: false,
        error: 'Amount paid must be a valid non-negative number.',
      }
    }

    const paymentRecord = {
      id: `payment-${Date.now()}`,

      childId: child.id,
      childFirstName: child.firstName,
      childLastName: child.lastName,

      primaryCaretakerId: caretaker.id,
      primaryCaretakerFirstName: caretaker.firstName,
      primaryCaretakerLastName: caretaker.lastName,

      dueOn: paymentInformation.dueOn,
      amountDue,
      
      amountPaid,
      notes: paymentInformation.notes || '',

      balance: amountDue - amountPaid,
    }

    dispatch({
      type: 'ADD_PAYMENT_RECORD',
      payload: paymentRecord,
    })

    return {
      ok: true,
      record: paymentRecord,
    }
  }

function updatePaymentRecord(paymentInformation) {
  const existingRecord = state.paymentRecords.find(
    (record) => record.id === paymentInformation.id
  )

  if (!existingRecord) {
    return {
      ok: false,
      error: 'Payment record could not be found.',
    }
  }

  const child = state.children.find(
    (item) => item.id === paymentInformation.childId
  )

  if (!child) {
    return {
      ok: false,
      error: 'Child could not be found.',
    }
  }

  const caretaker = state.users.find(
    (user) =>
      user.id === child.primaryCaretakerId &&
      user.role === 'caretaker' &&
      user.active
  )

  if (!caretaker) {
    return {
      ok: false,
      error: 'The child does not have a valid primary caretaker.',
    }
  }

  const amountDue = Number(paymentInformation.amountDue)
  const amountPaid = Number(paymentInformation.amountPaid)

  if (Number.isNaN(amountDue) || amountDue < 0) {
    return {
      ok: false,
      error: 'Amount due must be a valid non-negative number.',
    }
  }

  if (Number.isNaN(amountPaid) || amountPaid < 0) {
    return {
      ok: false,
      error: 'Amount paid must be a valid non-negative number.',
    }
  }

  const updatedRecord = {
    id: existingRecord.id,

    childId: child.id,
    childFirstName: child.firstName,
    childLastName: child.lastName,

    primaryCaretakerId: caretaker.id,
    primaryCaretakerFirstName: caretaker.firstName,
    primaryCaretakerLastName: caretaker.lastName,

    dueOn: paymentInformation.dueOn,
    amountDue,

    paidOn: paymentInformation.paidOn || null,
    amountPaid,

    balance: amountDue - amountPaid,
  }

  dispatch({
    type: 'UPDATE_PAYMENT_RECORD',
    payload: updatedRecord,
  })

  return {
    ok: true,
    record: updatedRecord,
  }
}

  function makePayment(recordId, amount, card) {
    const record = state.paymentRecords.find((item) => item.id === recordId)
    if (!record) {
      return { ok: false, error: 'Payment record could not be found.' }
    }

    const child = state.children.find((item) => item.id === record.childId)
    if (!child || child.primaryCaretakerId !== state.session.id) {
      return { ok: false, error: 'Only the primary caretaker can make this payment.' }
    }

    const cardError =
      validateCardNumber(card.cardNumber) ||
      validateExpiration(card.expiration) ||
      validateCVV(card.cvv) ||
      (validateName(card.nameOnCard) ? `Name on card: ${validateName(card.nameOnCard)}` : null)
    if (cardError) {
      return { ok: false, error: cardError }
    }

    const paymentAmount = Number(amount)
    if (Number.isNaN(paymentAmount) || paymentAmount <= 0 || paymentAmount > record.balance) {
      return { ok: false, error: 'Enter a payment amount between $0.01 and the remaining balance.' }
    }

    const updatedRecord = {
      ...record,
      amountPaid: record.amountPaid + paymentAmount,
      balance: record.balance - paymentAmount,
      paidOn: new Date().toISOString().slice(0, 10),
    }

    dispatch({ type: 'UPDATE_PAYMENT_RECORD', payload: updatedRecord })
    logActivity(`${actorName} paid $${paymentAmount.toFixed(2)} for ${child.firstName} ${child.lastName}`)

    return { ok: true, record: updatedRecord }
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
    submitAccountRequest,
    approveAddUserRequest,
    approveRemoveUserRequest,
    
    // CHILD MANAGEMENT =====================
    children: state.children,
    addChildRequests: state.addChildRequests,
    removeChildRequests: state.removeChildRequests,
    approveAddChildRequest,
    denyAddChildRequest,
    approveRemoveChildRequest,
    denyRemoveChildRequest,
    submitAddChildRequest,
    addAuthorizedCaretaker,
    removeAuthorizedCaretaker,
    removeSecondaryCaretaker,
    submitRemoveChildRequest,

    //LOGIN=====================================
    verifyCredentials,
    beginLogin,
    verifySecurityCode,
    logout,
    setNewPassword,
    changePassword,

    // ACTIVITY LOG =====================
    activity: state.activity,

    //ATTENDANCE / PAYMENTS =================
    attendanceRecords: state.attendanceRecords,
    paymentRecords: state.paymentRecords,
    recordAttendance,
    getChildAttendance,
    getAttendanceForDate,
    getChildPayments,
    addPaymentRecord,
    updatePaymentRecord,
    makePayment,
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
