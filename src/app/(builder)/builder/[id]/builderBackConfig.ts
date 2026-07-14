export function getBuilderBackConfig(admin?: string) {
  switch (admin) {
    case 'data-collection':
      return { href: '/data-collection', label: 'بازگشت' };
    case 'survey':
      return { href: '/survey', label: 'بازگشت' };
    case 'packaging':
      return { href: '/packaging', label: 'بازگشت' };
    default:
      return { href: '/builder', label: 'بازگشت به فرم ساز' };
  }
}
