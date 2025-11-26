export interface RouteExclusion {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'ALL';
}

export const jwtConfig = () => ({
  exclusions: [
    { path: '/api/docs', method: 'GET' },
    { path: '/api/docs/(.*)', method: 'ALL' },
    { path: '/api/docs-json', method: 'GET' },
    { path: '/auth', method: 'ALL' },
    { path: '/auth/(.*)', method: 'ALL' },
    { path: '/appointments', method: 'POST' },
    { path: '/public/(.*)', method: 'ALL' },
    { path: '/health', method: 'GET' },
  ] as RouteExclusion[],
});
