export function getBuilderBackConfig(admin?: string) {
  switch (admin) {
    case 'data-collection':
    case 'data-collection-new': // legacy admin query from QA period
      return { href: '/data-collection', label: 'بازگشت' };
    case 'survey':
    case 'survey-new': // legacy admin query from QA period
      return { href: '/survey', label: 'بازگشت' };
    case 'packaging':
      return { href: '/packaging', label: 'بازگشت' };
    default:
      return { href: '/builder', label: 'بازگشت به فرم ساز' };
  }
}
