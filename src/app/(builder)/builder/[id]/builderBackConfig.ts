export function getBuilderBackConfig(admin?: string) {
  switch (admin) {
    case 'data-collection':
    case 'data-collection-new':
      return { href: '/data-collection', label: 'بازگشت' };
    case 'survey':
      return { href: '/survey', label: 'بازگشت' };
    case 'survey-new':
      return { href: '/survey-new', label: 'بازگشت' };
    case 'packaging':
      return { href: '/packaging', label: 'بازگشت' };
    default:
      return { href: '/builder', label: 'بازگشت به فرم ساز' };
  }
}
