'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Fragment, memo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button, IconButton, useMediaQuery } from '@mui/material';
//type
import { FormElements } from '@/types/FormElements';
// hook
import useDesigner from '@/hooks/useDesigner';
import { usePublishForm } from '@/app/(builder)/builder/_hook/usePublishForm';
// component
import ConfirmDialog from '../confirm-dialog';
import SidebarBtnElement from './SidebarBtnElement';
import DesignerBottomSheet from './DesignerBottomSheet';
import SettingsDialog from '../SettingsDialog/SettingsDialog';
// image
import { CodiconEye } from '@/../public/images/home-page/EyeIcon';

const ELEMENTS = [
  // FormElements.RATING,
  // FormElements.SPECTRAL,
  // FormElements.TEXT_FIELD,
  // FormElements.INFO_FIELD,
  // FormElements.MULTIPLE_CHOICE,
  // FormElements.MULTIPLE_CHOICE_IMAGE,
  // FormElements.PACKAGE_INJECTION_FIELD,

  FormElements.TEXT_FIELD,
  FormElements.MULTIPLE_CHOICE,
  FormElements.MULTIPLE_CHOICE_IMAGE,
  FormElements.SPECTRAL,
  FormElements.RATING,
  FormElements.PACKAGE_INJECTION_FIELD,
  FormElements.INFO_FIELD

];
export interface FormSettingModel {
  responseLimitation: string | null;
  label?: string | null;
  startFromContinue?: boolean | null;
}

export type FormTypeEnum =
  | 'SURVEY'
  | 'PACKAGING'
  | 'DATA_COLLECTION';

export interface DesignerSidebarData {
  typeEnum: FormTypeEnum;
  formSettingModel?: FormSettingModel | null;
}

interface DesignerSidebarProps {
  data: DesignerSidebarData;
}
// eslint-disable-next-line react/display-name
const DesignerSidebar = memo(function DesignerSidebar({ data }: DesignerSidebarProps) {
  const { id } = useParams();
  const { refresh } = useRouter();
  const searchParams = useSearchParams();
  const pid = searchParams.get('pid');
  const [formTitle, setFormTitle] = useState<string>("");
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [formLimitation, setFormLimitation] = useState<string | null>(
    data?.formSettingModel?.responseLimitation ?? null
  );
  const [startFromContinue, setStartFromContinue] = useState<boolean | null>(
    data?.formSettingModel?.startFromContinue ?? null
  );

  const { formName, formSetting } = useDesigner();
  const isDesktop = useMediaQuery('(min-width:1280px)');

  const IsSurvey = data?.typeEnum === "SURVEY"
  const IsPackaging = data?.typeEnum === "PACKAGING"
  const IsDataCollection = data?.typeEnum === "DATA_COLLECTION"

  const formIdToUse = IsPackaging && pid ? pid : id;
  const publishMutation = usePublishForm({
    formId: formIdToUse,
    IsSurvey: Boolean(IsSurvey),
    IsPackaging: Boolean(pid),
  });

  useEffect(() => {
    if (formName) {
      setFormTitle(formName);
    }
  }, [formName]);

  const confirmPublish = () => {
    publishMutation.mutate(undefined, {
      onSuccess: () => {
        refresh()
        setOpenConfirm(false);
      }
    });
  };

  const handlePublish = () => {
    // if (!hasQuestion) {
    //   toast.error('امکان انتشار فرم بدون داشتن سوال وجود ندارد.');
    //   return;
    // }
    setOpenConfirm(true)
  };

  const renderElements = ELEMENTS.map((el, index) => (
    <SidebarBtnElement
      key={index}
      formElement={el}
      disabled={formSetting.formStatus !== 'CREATE'}
    />
  ));

  const TopBar = (
    <div className="flex justify-between items-center gap-1 bg-[#F7F7FF] px-4 py-2 rounded-lg">
      <p className="text-[16px] text-[#2a2a2a] font-bold truncate max-w-full">{formTitle}</p>
      <div className="flex gap-2">
        <Link href={`/preview/${id}`}>
          <IconButton sx={{ height: 40, width: 40 }}>
            <CodiconEye color="#2A2A2A" />
          </IconButton>
        </Link>

        {formTitle && (
          <SettingsDialog
            formName={formTitle}
            data={data}
            formLimitation={formLimitation}
            onChangeName={setFormTitle}
            onChangeLimitation={setFormLimitation}
            startFromContinue={startFromContinue}
            onChangeStartFromContinue={setStartFromContinue}
          />
        )}

      </div>
    </div>
  );

  const PublishButton = (
    <Button
      onClick={handlePublish}
      variant="contained"
      loading={publishMutation.isPending}
      disabled={publishMutation.isPending || formSetting.formStatus !== 'CREATE'}
      sx={{
        backgroundColor: '#1758BA',
        fontWeight: 500,
        fontSize: 15,
        borderRadius: '10px',
          height: {xs: 45 , md: 58},
        mt: 1,
        '&:hover': {
          backgroundColor: '#1758BA',
        },
        minWidth: 132,
      }}
    >
      <p className="text-white font-bold text-[15px]">
        {formSetting.formStatus === 'CREATE' ? 'آماده برای انتشار' : 'منتشر شده'}
      </p>
    </Button>
  );

  if (isDesktop) {
    return (
      <div
        dir="rtl"
        className="bg-white rounded-2xl sticky top-4 right-0 w-[400px] max-w-[400px] border-[1.5px] border-[#DDE1E6] overflow-y-scroll select-none flex flex-col py-4 px-2 gap-2"
        style={{ scrollbarWidth: 'none', height: 'calc(100vh - 100px)' }}
      >
        {TopBar}
        <div className="p-1 rounded-lg h-full flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">{renderElements}</div>
        </div>
        {!IsDataCollection && <>{PublishButton}</>}

        <ConfirmationPublishDialog
          open={openConfirm}
          loading={publishMutation.isPending}
          onClose={() => setOpenConfirm(false)}
          onConfirm={confirmPublish}
        />
      </div>
    );
  }

  return (
    <Fragment>
      <div dir="rtl" className="right-0 w-full flex flex-col rounded-[10px] gap-2 p-4 bg-white border-[1.5px] border-[#DDE1E6] ">
        {TopBar}
        {!IsDataCollection && <>{PublishButton}</>}
      </div>
      <DesignerBottomSheet>
        <div className="flex flex-col w-full gap-3">{renderElements}</div>
      </DesignerBottomSheet>
      <ConfirmationPublishDialog
        open={openConfirm}
        loading={publishMutation.isPending}
        onClose={() => setOpenConfirm(false)}
        onConfirm={confirmPublish}
      />
    </Fragment>
  );
});

export default DesignerSidebar;
// ----------------------------------------------------------
interface ConfirmationPublishDialogProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmationPublishDialog = ({
  open,
  loading,
  onClose,
  onConfirm,
}: ConfirmationPublishDialogProps) => {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={`تأیید انتشار فرم`}
      content='پس از نهایی کردن فرم، امکان ویرایش یا تغییر آن وجود نخواهد داشت. آیا ادامه می‌دهید؟'
      cancelText='انصراف'
      loading={loading}
      action={
        <Button
          fullWidth
          disabled={loading}
          variant='contained'
          onClick={onConfirm}
          sx={{
            fontWeight: '400',
            fontSize: '15px',
            height: '50px',
            borderRadius: '8px',
            '&:hover': {
              bgcolor: (theme) => theme.palette.primary.main,
            },
          }}>
          انتشار فرم
        </Button>
      }
    />
  );
};