/**
 * A tiny in-memory database for the MSW mock API.
 * In the browser it is persisted to localStorage so data survives reloads.
 * In tests it lives in memory and is reset before each test.
 *
 * Types are declared here on purpose: the mock layer stands in for an
 * external backend, so it must not import feature code (ESLint enforces it).
 */
export type DbUser = {
  id: string;
  createdAt: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
  bio: string;
};

export type DbTask = {
  id: string;
  createdAt: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  authorId: string;
};

type Database = {
  users: DbUser[];
  tasks: DbTask[];
};

const STORAGE_KEY = 'zed-react:mock-db';
const isBrowser = typeof window !== 'undefined' && import.meta.env.MODE !== 'test';

/** Seeded accounts: an admin and a regular member (same password). */
export const DEMO_USER = { email: 'demo@example.com', password: 'password' };
export const MEMBER_USER = { email: 'member@example.com', password: 'password' };

export const uid = () =>
  globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 12);

function seed(): Database {
  const now = Date.now();
  const demo: DbUser = {
    id: 'user-demo',
    createdAt: now,
    firstName: 'Demo',
    lastName: 'User',
    email: DEMO_USER.email,
    password: DEMO_USER.password,
    role: 'ADMIN',
    bio: 'I am the demo account.',
  };

  const titles = [
    'Set up the project',
    'Customize the theme',
    'Add a new feature folder',
    'Write unit tests',
    'Connect the real API',
    'Configure CI/CD',
    'Add translations',
    'Review accessibility',
    'Deploy to production',
    'Celebrate 🎉',
    'Write documentation',
    'Plan the next sprint',
  ];
  const statuses: DbTask['status'][] = ['todo', 'in_progress', 'done'];
  const priorities: DbTask['priority'][] = ['low', 'medium', 'high'];

  return {
    users: [
      demo,
      {
        id: 'user-member',
        createdAt: now - 86_400_000 * 3,
        firstName: 'Mia',
        lastName: 'Member',
        email: MEMBER_USER.email,
        password: MEMBER_USER.password,
        role: 'USER',
        bio: '',
      },
    ],
    tasks: titles.map((title, i) => ({
      id: uid(),
      createdAt: now - i * 3_600_000 * 7,
      title,
      description: `Example task #${i + 1}. Edit or delete it to try the CRUD flow.`,
      status: statuses[i % 3]!,
      priority: priorities[(i + 1) % 3]!,
      authorId: demo.id,
    })),
  };
}

export let db: Database = seed();

export function initializeDb() {
  if (!isBrowser) return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) db = JSON.parse(raw) as Database;
    else persistDb();
  } catch {
    db = seed();
  }
}

export function persistDb() {
  if (!isBrowser) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function resetDb() {
  db = seed();
  persistDb();
}
