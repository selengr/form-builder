export function getParticipateBackHref(
  source: string | null | undefined,
  back?: string | null,
): string {
  if (back) {
    try {
      const decoded = decodeURIComponent(back);
      if (
        decoded.startsWith('/') &&
        !decoded.startsWith('//') &&
        !decoded.includes('://')
      ) {
        return decoded;
      }
    } catch {
      // ignoring malformed back 
    }
  }

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
