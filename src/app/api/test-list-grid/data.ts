export interface TestListGridItem {
  id: number;
  name: string;
  type: 'QUESTION' | 'TEST' | 'COMPETITION';
  status: 'ACTIVE' | 'DRAFT';
  description: string;
}

export const TEST_LIST_GRID_TYPES: TestListGridItem['type'][] = [
  'QUESTION',
  'TEST',
  'COMPETITION',
];

export const TEST_LIST_GRID_STATUSES: TestListGridItem['status'][] = ['ACTIVE', 'DRAFT'];

export function generateFakeListGridItems(count = 35): TestListGridItem[] {
  const names = [
    'پرسشنامه رضایت',
    'آزمون هوش هیجانی',
    'مسابقه دانش',
    'فرم ثبت‌نام',
    'ارزیابی عملکرد',
    'نظرسنجی محصول',
    'آزمون شخصیت',
    'فرم بازخورد',
  ];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `${names[index % names.length]} ${index + 1}`,
    type: TEST_LIST_GRID_TYPES[index % TEST_LIST_GRID_TYPES.length],
    status: TEST_LIST_GRID_STATUSES[index % TEST_LIST_GRID_STATUSES.length],
    description: `توضیحات آیتم شماره ${index + 1} برای تست List Grid`,
  }));
}
