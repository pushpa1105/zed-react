import { defineRoute } from '../routes';

describe('defineRoute', () => {
  it('builds hrefs for routes without params', () => {
    const route = defineRoute('/login');
    expect(route.href()).toBe('/login');
    expect(route.href({ redirectTo: '/app/x', empty: '', none: undefined })).toBe(
      '/login?redirectTo=%2Fapp%2Fx',
    );
  });

  it('fills and encodes params', () => {
    const route = defineRoute('/app/projects/:projectId/tasks/:taskId');
    expect(route.href({ projectId: 'p 1', taskId: 7 }, { tab: 'files' })).toBe(
      '/app/projects/p%201/tasks/7?tab=files',
    );
  });

  it('rejects missing params at compile time', () => {
    const route = defineRoute('/app/tasks/:taskId');
    // @ts-expect-error: taskId is required
    expect(() => route.href({})).toThrow(/Missing route param "taskId"/);
  });
});
