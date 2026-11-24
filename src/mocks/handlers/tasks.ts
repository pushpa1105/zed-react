import { http, HttpResponse } from 'msw';

import { env } from '@/core/config/env';

import { db, persistDb, uid, type DbTask } from '../db';
import { errorResponse, networkDelay, requireAuth } from '../utils';

const PAGE_SIZE = 8;

type TaskBody = Pick<DbTask, 'title' | 'description' | 'status' | 'priority'>;

export const tasksHandlers = [
  http.get(`${env.API_URL}/tasks`, async ({ request }) => {
    await networkDelay();
    const auth = requireAuth(request);
    if ('error' in auth) return auth.error;

    const url = new URL(request.url);
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
    const q = url.searchParams.get('q')?.toLowerCase();
    const status = url.searchParams.get('status');

    const filtered = db.tasks
      .filter((t) => !q || t.title.toLowerCase().includes(q))
      .filter((t) => !status || t.status === status)
      .sort((a, b) => b.createdAt - a.createdAt);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    return HttpResponse.json({
      data: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      meta: { page, total: filtered.length, totalPages },
    });
  }),

  http.get(`${env.API_URL}/tasks/:taskId`, async ({ request, params }) => {
    await networkDelay();
    const auth = requireAuth(request);
    if ('error' in auth) return auth.error;

    const task = db.tasks.find((t) => t.id === params.taskId);
    if (!task) return errorResponse('Task not found', 404);
    return HttpResponse.json(task);
  }),

  http.post<never, TaskBody>(`${env.API_URL}/tasks`, async ({ request }) => {
    await networkDelay();
    const auth = requireAuth(request);
    if ('error' in auth) return auth.error;

    const body = await request.json();
    const task: DbTask = { ...body, id: uid(), createdAt: Date.now(), authorId: auth.user.id };
    db.tasks.push(task);
    persistDb();
    return HttpResponse.json(task, { status: 201 });
  }),

  http.patch<{ taskId: string }, Partial<TaskBody>>(
    `${env.API_URL}/tasks/:taskId`,
    async ({ request, params }) => {
      await networkDelay();
      const auth = requireAuth(request);
      if ('error' in auth) return auth.error;

      const task = db.tasks.find((t) => t.id === params.taskId);
      if (!task) return errorResponse('Task not found', 404);
      if (auth.user.role !== 'ADMIN' && task.authorId !== auth.user.id) {
        return errorResponse('Forbidden', 403);
      }
      Object.assign(task, await request.json());
      persistDb();
      return HttpResponse.json(task);
    },
  ),

  http.delete(`${env.API_URL}/tasks/:taskId`, async ({ request, params }) => {
    await networkDelay();
    const auth = requireAuth(request);
    if ('error' in auth) return auth.error;

    const task = db.tasks.find((t) => t.id === params.taskId);
    if (!task) return errorResponse('Task not found', 404);
    if (auth.user.role !== 'ADMIN' && task.authorId !== auth.user.id) {
      return errorResponse('Forbidden', 403);
    }
    db.tasks = db.tasks.filter((t) => t.id !== task.id);
    persistDb();
    return new HttpResponse(null, { status: 204 });
  }),
];
