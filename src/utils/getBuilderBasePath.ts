/** Resolves `/builder` vs `/builder-new` from the current pathname. */
export function getBuilderBasePath(pathname?: string | null): '/builder' | '/builder-new' {
  if (pathname?.includes('/builder-new')) return '/builder-new';
  return '/builder';
}
