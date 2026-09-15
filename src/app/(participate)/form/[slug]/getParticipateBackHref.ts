export function getParticipateBackHref(source: string | null | undefined): string {
  switch (source) {
    case 'packaging':
      return '/packaging';
    case 'public-form':
      return '/public-form';
    case 'survey':
      return '/survey';
    default:
      return '/';
  }
}
