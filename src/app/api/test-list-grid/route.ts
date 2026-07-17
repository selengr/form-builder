import { NextRequest, NextResponse } from 'next/server';
import { generateFakeListGridItems, TestListGridItem } from './data';

interface SearchRestriction {
  fieldName: string;
  fieldOperation: string;
  fieldValue: string | string[];
}

function parseSearchFilterModel(raw: string | null): {
  page: number;
  rows: number;
  restrictions: SearchRestriction[];
  sort: 'ASC' | 'DSC';
} {
  if (!raw) {
    return { page: 0, rows: 10, restrictions: [], sort: 'DSC' };
  }

  try {
    const parsed = JSON.parse(raw);
    const restrictions =
      parsed.searchFilterBoxList?.[0]?.restrictionList?.filter(Boolean) ?? [];
    const sort: 'ASC' | 'DSC' = parsed.sortList?.[0]?.type === 'ASC' ? 'ASC' : 'DSC';

    return {
      page: Number(parsed.page ?? 0),
      rows: Number(parsed.rows ?? 10),
      restrictions,
      sort,
    };
  } catch {
    return {
      page: 0,
      rows: 10,
      restrictions: [] as SearchRestriction[],
      sort: 'DSC' as const,
    };
  }
}

function matchesRestriction(item: TestListGridItem, restriction: SearchRestriction) {
  const value = restriction.fieldValue;

  if (restriction.fieldName === 'name' && restriction.fieldOperation === 'MATCH') {
    return item.name.includes(String(value));
  }

  if (restriction.fieldName === 'typeEnum' && restriction.fieldOperation === 'EQUAL') {
    return item.type === value;
  }

  if (restriction.fieldName === 'status' && restriction.fieldOperation === 'EQUAL') {
    return item.status === value;
  }

  return true;
}

function filterItems(items: TestListGridItem[], restrictions: SearchRestriction[]) {
  return items.filter((item) =>
    restrictions.every((restriction) => matchesRestriction(item, restriction)),
  );
}

function sortItems(items: TestListGridItem[], sort: 'ASC' | 'DSC') {
  return [...items].sort((a, b) => (sort === 'ASC' ? a.id - b.id : b.id - a.id));
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { page, rows, restrictions, sort } = parseSearchFilterModel(
    searchParams.get('searchFilterModel'),
  );

  const allItems = generateFakeListGridItems();
  const filtered = sortItems(filterItems(allItems, restrictions), sort);
  const start = page * rows;
  const data = filtered.slice(start, start + rows);

  return NextResponse.json({
    success: true,
    data,
    total: filtered.length,
  });
}
