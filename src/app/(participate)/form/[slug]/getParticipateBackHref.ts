export function getParticipateBackHref(source: string | null | undefined): string {
  switch (source) {
    case 'packaging':
      return '/packaging';
    case 'public-form':
      return '/public-form';
    case 'survey':
      return '/survey';
    case 'builder':
      return '/builder';
    case 'my-assessments':
      return '/my-assessments';
    case 'data-collection':
      return '/data-collection';
    default:
      return '/';
  }
}
