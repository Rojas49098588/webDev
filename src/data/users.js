// ============================================================
// SAMPLE USERS
// ============================================================

export const SAMPLE_USERS = [
  {
    id: 'user-1',
    firstName: 'Jane',
    lastName: 'Doe',
    username: 'jdoe15',
    email: 'jane.doe@example.com',
    phone: '555-123-4567',
    mailingAddress: '123 Main Street, Dallas, TX 75205',
    role: 'caretaker',
    active: true,

    // A caretaker's connected children.
    connectedChildren: [
      {
        id: 'child-1',
        name: 'Alex Doe',
        relationship: 'Primary caretaker',
      },
      {
        id: 'child-2',
        name: 'Emma Doe',
        relationship: 'Primary caretaker',
      },
    ],

    // Demo caretaker credentials for local testing: username "jdoe15",
    // password "Caretaker123!". This is the precomputed SHA-256 hex digest
    // of "Caretaker123!":
    //   node -e "console.log(require('crypto').createHash('sha256').update('Caretaker123!').digest('hex'))"
    passwordHash: 'a68104cdff1acf1acf38b953a9b7a337957a9fd8a677f1fe88cc371f4cb7e41d',
    mustChangePassword: true,
  },

  {
    id: 'user-2',
    firstName: 'John',
    lastName: 'Smith',
    username: 'jsmith27',
    email: 'john.smith@example.com',
    phone: '555-234-5678',
    mailingAddress: '456 Oak Avenue, Dallas, TX 75205',
    role: 'staff',
    groupNumber: 12,
    active: true,

    connectedChildren: [
      {
        id: 'child-1',
        name: 'Alex Doe',
        relationship: 'Staff',
      },
    ],
  },

  {
    id: 'user-3',
    firstName: 'Sarah',
    lastName: 'Johnson',
    username: 'sjohnson42',
    email: 'sarah.johnson@example.com',
    phone: '555-345-6789',
    mailingAddress: '789 Pine Road, Dallas, TX 75205',
    role: 'caretaker',
    active: true,

    connectedChildren: [
      {
        id: 'child-3',
        name: 'Michael Johnson',
        relationship: 'Primary caretaker',
      },
    ],
  },

  {
    id: 'user-4',
    firstName: 'Taylor',
    lastName: 'Reed',
    username: 'treed08',
    email: 'taylor.reed@example.com',
    phone: '555-678-1234',
    mailingAddress: '55 Birch Court, Dallas, TX 75205',
    role: 'staff',
    groupNumber: 5,
    active: true,
    connectedChildren: [],

    // Demo staff credentials for local testing: username "treed08",
    // password "Staff123!". This is the precomputed SHA-256 hex digest of
    // "Staff123!":
    //   node -e "console.log(require('crypto').createHash('sha256').update('Staff123!').digest('hex'))"
    passwordHash: '05dd4a1376a72d9a5e0fad32000f7e61651a5cef5c9c9a0c3816c7443dafbf6f',
    mustChangePassword: true,
  },

  {
    id: 'user-5',
    firstName: 'Dave',
    lastName: 'Miller',
    username: 'dmiller99',
    email: 'millerd@example.com',
    phone: '555-789-0123',
    mailingAddress: '88 Willow Lane, Dallas, TX 75205',
    role: 'caretaker',
    active: true,

    connectedChildren: [
      {
        id: 'child-1',
        name: 'Alex Doe',
        relationship: 'Caretaker',
      },
    ],

    // Demo secondary-caretaker credentials for local testing: username
    // "dmiller99", password "Secondary123!". Dave is an authorized (but not
    // primary) caretaker on child-1 (Alex Doe) — the same child whose
    // primary caretaker, Jane Doe, is the "jdoe15" demo login above. Log in
    // as jdoe15 to see full primary-caretaker access to Alex, then as
    // dmiller99 to see the contrast on the exact same child: "My Children"
    // comes back empty, and there's no in-app path to Alex's profile at all
    // (only the primary caretaker can search/view/manage a child). This is
    // the precomputed SHA-256 hex digest of "Secondary123!":
    //   node -e "console.log(require('crypto').createHash('sha256').update('Secondary123!').digest('hex'))"
    passwordHash: '8253b08a67063ce7d73eb7b798509380a27427548354ff2e182da01e025c99a9',
    mustChangePassword: true,
  }
]

// ============================================================
// SAMPLE ADD REQUESTS
// ============================================================

export const SAMPLE_ADD_REQUESTS = [
  {
    id: 'add-1',
    firstName: 'Emily',
    lastName: 'Brown',
    email: 'emily.brown@example.com',
    phone: '555-456-7890',
    mailingAddress: '100 Cedar Lane, Dallas, TX 75205',
    role: 'caretaker',
  },

  {
    id: 'add-2',
    firstName: 'Michael',
    lastName: 'Williams',
    email: 'michael.williams@example.com',
    phone: '555-567-8901',
    mailingAddress: '200 Maple Street, Dallas, TX 75205',
    role: 'staff',
    groupNumber: 18,
  },
]

// ============================================================
// SAMPLE REMOVE REQUESTS
// ============================================================

export const SAMPLE_REMOVE_REQUESTS = [
  {
    id: 'remove-1',
    userId: 'user-2',
  },

  {
    id: 'remove-2',
    userId: 'user-3',
  },
]