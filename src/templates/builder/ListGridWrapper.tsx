'use client';

import React, { useState, useCallback, useMemo } from 'react';
import ListGrid from '@/components/ListGrid/ListGrid';
import ListCard from '@/components/ListGrid/ListCard';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import Image from 'next/image';
import FilterIcon from '@/../public/images/home-page/filter-icon.svg';

type FormFilter = {
  type: 'ALL' | 'COMPETITION' | 'QUESTION' | 'TEST';
  status: 'ALL' | 'PUBLIC' | 'PRIVATE';
  isCreatedSoloReport: 'ALL' | 'true' | 'false';
  fieldOperation: 'ASC' | 'DSC';
};

const DEFAULT_FILTER: FormFilter = {
  type: 'ALL',
  status: 'ALL',
  isCreatedSoloReport: 'ALL',
  fieldOperation: 'DSC',
};

export default function ListGridWrapper() {
  const [refreshGrid, setRefreshGrid] = useState(false);
  const [formType, setFormType] = useState<FormFilter>(DEFAULT_FILTER);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const handleChange = useCallback(
    (key: keyof FormFilter) =>
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormType((prev) => ({
          ...prev,
          [key]: event.target.value,
        }));
      },
    []
  );

  const searchBoxList = useMemo(
    () => [
      {
        fieldName: 'formSetting.name',
        fieldOperation: 'MATCH',
        fieldValue: '',
        nextConditionOperator: 'OR',
      },
    ],
    []
  );

  const handleApply = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('query');
    push(`${pathname}?${params.toString()}`);
    setRefreshGrid((prev) => !prev);
  }, [searchParams, pathname, push]);

  const handleReset = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.delete('query');
    push(`${pathname}?${params.toString()}`);
    setFormType(DEFAULT_FILTER);
    setRefreshGrid((prev) => !prev);
  }, [searchParams, pathname, push]);

  return (
    <ListGrid
      title='فرم‌های من'
      showCreateButton
      searchBoxList={searchBoxList}
      filterBoxList={[]}
      url='/form/main-list'
      filterComponent={
        <FilterSidebar
          formType={formType}
          onChange={handleChange}
          onApply={handleApply}
          onReset={handleReset}
        />
      }
      CartComponent={(item: any) => (
        <ListCard setRefreshGrid={setRefreshGrid} {...item} />
      )}
      disableFilter={false}
      refreshGrid={refreshGrid}
      searchQueryFilter={formType}
    />
  );
}
