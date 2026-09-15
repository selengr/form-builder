/** Resolve form-page back destination from `source` query (API still uses `from=TESTING`). */
export function getParticipateBackHref(source: string | null | undefined): string {
  switch (source) {
    case 'packaging':
      return '/packaging';
    default:
      return '/';
  }
}
