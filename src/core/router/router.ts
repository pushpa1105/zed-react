/**
 * Router adapter. Everything outside this file imports routing primitives from
 * `@/core/router/router`, never from `react-router` directly (ESLint enforces
 * it), so the routing library can be swapped or upgraded in one place.
 */
export {
  createBrowserRouter,
  createMemoryRouter,
  isRouteErrorResponse,
  Link,
  Navigate,
  NavLink,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
  useParams,
  useRouteError,
  useSearchParams,
  type LoaderFunction,
  type LoaderFunctionArgs,
  type RouteObject,
} from 'react-router';
export { RouterProvider } from 'react-router/dom';
