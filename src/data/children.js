// ============================================================
// SAMPLE CHILDREN
// ============================================================

export const SAMPLE_CHILDREN = [
  {
    id: 'child-1',
    firstName: 'Alex',
    lastName: 'Doe',
    dateOfBirth: '2023-06-10',
    primaryCaretakerId: 'user-1',
    otherCaretakerIds: [],
    active: true,
  },

  {
    id: 'child-2',
    firstName: 'Emma',
    lastName: 'Doe',
    dateOfBirth: '2024-02-20',
    primaryCaretakerId: 'user-1',
    otherCaretakerIds: [],
    active: true,
  },

  {
    id: 'child-3',
    firstName: 'Michael',
    lastName: 'Johnson',
    dateOfBirth: '2022-09-05',
    primaryCaretakerId: 'user-3',
    otherCaretakerIds: [],
    active: true,
  },
]

// ============================================================
// SAMPLE ADD CHILD REQUESTS
// ============================================================

export const SAMPLE_ADD_CHILD_REQUESTS = [
  {
    id: 'add-child-1',
    firstName: 'Olivia',
    lastName: 'Brown',
    dateOfBirth: '2023-08-15',
    primaryCaretakerId: 'user-1',
    otherCaretakerIds: [],
  },

  {
    id: 'add-child-2',
    firstName: 'Noah',
    lastName: 'Johnson',
    dateOfBirth: '2024-01-10',
    primaryCaretakerId: 'user-3',
    otherCaretakerIds: [],
  },
]

// ============================================================
// SAMPLE REMOVE CHILD REQUESTS
// ============================================================

export const SAMPLE_REMOVE_CHILD_REQUESTS = [
  {
    id: 'remove-child-1',
    childId: 'child-2',
    requestedByUserId: 'user-1',
  },

  {
    id: 'remove-child-2',
    childId: 'child-3',
    requestedByUserId: 'user-1',
  },
]
