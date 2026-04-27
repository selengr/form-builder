'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Fragment, memo, useState } from 'react';
import { Button, IconButton, useMediaQuery } from '@mui/material';
//type
import { FormElements } from '@/types/FormElements';
// hook
import useDesigner from '@/hooks/useDesigner';
import { usePublishForm } from '@/app/(builder)/builder/_hook/usePublishForm';
// component
import SidebarBtnElement from './SidebarBtnElement';
import DesignerBottomSheet from './DesignerBottomSheet';
import SettingsDialog from '../SettingsDialog/SettingsDialog';
// image
import { CodiconEye } from '@/../public/images/home-page/EyeIcon';

const ELEMENTS = [FormElements.TEXT_FIELD, FormElements.MULTIPLE_CHOICE, FormElements.MULTIPLE_CHOICE_IMAGE, FormElements.SPECTRAL,FormElements.RATING, FormElements.INFO_FIELD];

interface DesignerSidebarProps {
  data: any; // تایپ دقیق‌تر هم می‌تونی بدی
}

// eslint-disable-next-line react/display-name
const DesignerSidebar = memo(function DesignerSidebar({ data }: DesignerSidebarProps) {
  const { id } = useParams();
  const isDesktop = useMediaQuery('(min-width:1280px)');
  const { formName, formSetting } = useDesigner();
  const [formTitle, setFormTitle] = useState("");

  useEffect(() => {
    if (formName) {
      setFormTitle(formName);
    }
  }, [formName]);

  const IsSurvey = data?.typeEnum === "SURVEY"
  const IsDataCollection = data?.typeEnum === "DATA_COLLECTION"
  console.log('data?.--------------', data?.typeEnum)
  const IsPackaging = data?.typeEnum === "PACKAGING"
  const publishMutation = usePublishForm({
    formId: id,
    IsSurvey: Boolean(IsSurvey),
    IsPackaging: Boolean(IsPackaging),
  });

  const handlePublish = () => {
    publishMutation.mutate();
  };

  // const renderElements = useMemo(
  //   () =>
  //     ELEMENTS.map((el, index) => (
  //       <SidebarBtnElement key={index} formElement={el} disabled={formSetting.formStatus !== 'CREATE'} />
  //     )),
  //   [formSetting.formStatus]
  // );


  const renderElements = ELEMENTS.map((el, index) => (
    <SidebarBtnElement
      key={index}
      formElement={el}
      disabled={formSetting.formStatus !== 'CREATE'}
    />
  ));


  const TopBar = (
    <div className="flex justify-between items-center gap-1 bg-[#F7F7FF] px-4 py-2 rounded-lg">
      <p className="text-[16px] text-[#2a2a2a] font-bold break-words whitespace-pre-wrap">{formTitle}</p>
      <div className="flex gap-2">
        <Link href={`/preview/${id}`}>
          <IconButton sx={{ height: 40, width: 40 }}>
            <CodiconEye color="#2A2A2A" />
          </IconButton>
        </Link>
        {/* پاس دادن data به SettingsDialog */}
        {formTitle && <SettingsDialog formName={formTitle} onChangeName={setFormTitle} data={data} />}
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
        height: 58,
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
        {!IsDataCollection && <>{PublishButton}</> }
      </div>
    );
  }

  return (
    <Fragment>
      <div dir="rtl" className="right-0 w-full flex flex-col rounded-[10px] gap-2 p-4 bg-white border-[1.5px] border-[#DDE1E6] ">
        {TopBar}
        {!IsDataCollection && <>{PublishButton}</> }
      </div>
      <DesignerBottomSheet>
        <div className="flex flex-col w-full gap-3">{renderElements}</div>
      </DesignerBottomSheet>
    </Fragment>
  );
});

export default DesignerSidebar;