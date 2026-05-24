'use client';

import { toast } from 'sonner';
import { useEffect } from 'react';
import BuilderLoading from './loading';
import { useParams } from 'next/navigation';
import useActionDesigner from '@/hooks/useActionDesigner';
import useActionElements from '@/hooks/useActionElements';
import { idGenerator } from '@/lib/idGenerator';
import { FormElementInstance } from '@/types/FormElements';
import FormBuilder from '@/templates/builder/FormBuilder';
import { useGetForm } from '../_hook/useGetForm';
import { fetchFormData } from '../../../../../actions/builder/getForm';
import FormBuilderWapper from '@/templates/builder/FormBuilderWapper';

export default function BuilderPage() {
  const { id } = useParams();
  const data = await fetchFormData()

  return <FormBuilderWapper data={data} />;
}

