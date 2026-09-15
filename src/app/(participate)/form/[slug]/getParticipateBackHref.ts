export function getParticipateBackHref(source: string | null | undefined): string {
  switch (source) {
    case 'packaging':
      return '/packaging';
    default:
      return '/';
  }
}
