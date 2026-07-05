'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import useDesigner from '@/hooks/useDesigner';
import { usePublishForm } from '@/app/(builder)/builder/_hook/usePublishForm';

interface UseBuilderPublishOptions {
  isSurvey?: boolean;
  isPackaging?: boolean;
}

export function useBuilderPublish(data?: { typeEnum?: string }) {
  const { id } = useParams();
  const { refresh } = useRouter();
  const searchParams = useSearchParams();
  const pid = searchParams.get('pid');
  const [openConfirm, setOpenConfirm] = useState(false);
  const { formSetting } = useDesigner();

  const IsSurvey = data?.typeEnum === 'SURVEY';
  const IsPackaging = data?.typeEnum === 'PACKAGING';
  const IsDataCollection = data?.typeEnum === 'DATA_COLLECTION';

  const formIdToUse = IsPackaging && pid ? pid : id;

  const publishMutation = usePublishForm({
    formId: formIdToUse,
    IsSurvey: Boolean(IsSurvey),
    IsPackaging: Boolean(pid),
  });

  const confirmPublish = () => {
    publishMutation.mutate(undefined, {
      onSuccess: () => {
        refresh();
        setOpenConfirm(false);
      },
    });
  };

  const handlePublish = () => setOpenConfirm(true);

  const isPublishDisabled =
    publishMutation.isPending || formSetting.formStatus !== 'CREATE';

  const publishLabel =
    formSetting.formStatus === 'CREATE' ? 'ثبت نهایی' : 'منتشر شده';

  return {
    openConfirm,
    setOpenConfirm,
    confirmPublish,
    handlePublish,
    isPublishDisabled,
    isPublishing: publishMutation.isPending,
    publishLabel,
    IsDataCollection,
  };
}
