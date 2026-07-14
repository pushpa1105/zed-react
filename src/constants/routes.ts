const WORKSPACE_PREFIX = '/workspaces'

/**
 * !!! Use this for new routes or route url updates
 * 
 */
export const ROUTES = {
    /**
     * Auth Sections
     * ---BEGIN---
     */
    LOGIN: '/login',
    REGISTER: '/register',

    /**
     * Auth Sections
     * ---END---
     */

    /**
     * Basic Sections
     * ---BEGIN---
     */
    ROOT: '/',

    /**
     * Basic Sections
     * ---END---
     */

    /**
     * Workspace Sections
     * ---BEGIN---
     */
    CREATE_WORKSPACE: `${WORKSPACE_PREFIX}/create`,

    /**
     * Workspace Sections
     * ---END---
     */

    /**
 * Pana Sections
 * ---BEGIN---
 */
    PANA: '/:id',

    /**
     * Pana Sections
     * ---END---
     */
}