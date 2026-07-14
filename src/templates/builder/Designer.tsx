'use client';

import { memo, useCallback, useEffect, useState } from 'react';
import { useDndMonitor } from '@dnd-kit/core';
import useMediaQuery from '@mui/material/useMediaQuery';
import useActionOpenBottomSheet from '@/hooks/useActionOpenBottomSheet';
import useDesigner from '@/hooks/useDesigner';
import KanbanBoard from './kanban/KanbanBoard';
import CreateFieldDialog from '@/components/builder/CreateFieldDialog';
import DesignerSidebar from '@/components/builder/DesignerSidebar';
import DesignerBottomSheet from '@/components/builder/DesignerBottomSheet';
import BuilderHeader from '@/components/builder/BuilderHeader';
import BuilderMobileBottomBar from '@/components/builder/BuilderMobileBottomBar';
import BuilderFAB from '@/components/builder/BuilderFAB';
import { DesignerTabsNew } from './TabComponent';
import SidebarBtnElement from '@/components/builder/SidebarBtnElement';
import SidebarBtnLogic from '@/components/builder/SidebarBtnLogic';
import { ConfirmationPublishDialog } from '@/components/builder/ConfirmationPublishDialog';
import { useBuilderPublish } from '@/components/builder/useBuilderPublish';
import LogicBoard from './logic/LogicBoard';
import LogicFormPanel from './logic/LogicFormPanel';
import LogicFormDialogs from './logic/LogicFormDialogs';
import { useLogicItems } from './logic/useLogicItems';
import { LogicFormState } from './logic/types';
import { IGetCondition } from '@/types/condition';
import { FormElements } from '@/types/FormElements';
import type { DesignerSidebarData } from '@/components/builder/DesignerSidebar';

const ELEMENTS = [
  FormElements.TEXT_FIELD,
  FormElements.MULTIPLE_CHOICE,
  FormElements.MULTIPLE_CHOICE_IMAGE,
  FormElements.SPECTRAL,
  FormElements.RATING,
  FormElements.PACKAGE_INJECTION_FIELD,
  FormElements.INFO_FIELD,
];

interface DesignerProps {
  data: DesignerSidebarData;
}

const Designer = memo(function Designer({ data }: DesignerProps) {
  const isDesktop = useMediaQuery('(min-width:900px)');
  const setOpenBottomSheet = useActionOpenBottomSheet();
  const [selectedTab, setSelectedTab] = useState(1);
  const [logicFormState, setLogicFormState] = useState<LogicFormState>(null);
  const { formName, formSetting } = useDesigner();
  const { invalidate: invalidateLogicItems } = useLogicItems(false);
  const [formTitle, setFormTitle] = useState('');
  const [formLimitation, setFormLimitation] = useState<string | null>(
    data?.formSettingModel?.responseLimitation ?? null
  );
  const [startFromContinue, setStartFromContinue] = useState<boolean | null>(
    data?.formSettingModel?.startFromContinue ?? null
  );

  const publish = useBuilderPublish(data);
  const isDisabled = formSetting.formStatus !== 'CREATE';
  const isQuestionnaireTab = selectedTab === 1;
  const isLogicFormOpen = logicFormState !== null;

  const closeLogicForm = useCallback(() => {
    setLogicFormState(null);
    invalidateLogicItems();
  }, [invalidateLogicItems]);

  const openLogicForm = useCallback(
    (state: NonNullable<LogicFormState>) => {
      if (!isDesktop) setOpenBottomSheet(false);
      setLogicFormState(state);
    },
    [isDesktop, setOpenBottomSheet],
  );

  const openCreateCalculator = useCallback(() => {
    openLogicForm({ type: 'calculator', mode: 'create' });
  }, [openLogicForm]);

  const openCreateCondition = useCallback(() => {
    openLogicForm({ type: 'condition', mode: 'create' });
  }, [openLogicForm]);

  const openEditCalculator = useCallback(
    (id: number) => {
      openLogicForm({ type: 'calculator', mode: 'edit', id });
    },
    [openLogicForm],
  );

  const openEditCondition = useCallback(
    (condition: IGetCondition) => {
      openLogicForm({ type: 'condition', mode: 'edit', condition });
    },
    [openLogicForm],
  );

  const handleTabChange = useCallback((tab: number) => {
    setSelectedTab(tab);
    setLogicFormState(null);
  }, []);

  useDndMonitor({
    onDragEnd: (event) => {
      if (isQuestionnaireTab || isDisabled) return;

      const { active, over } = event;
      if (!over) return;
      if (!active.data?.current?.isSidebarBtnLogic) return;
      if (over.data?.current?.type !== 'logic-board') return;

      const logicType = active.data.current.logicType;
      if (logicType === 'calculator') {
        openCreateCalculator();
      } else if (logicType === 'condition') {
        openCreateCondition();
      }
    },
  });

  useEffect(() => {
    if (formName) setFormTitle(formName);
  }, [formName]);

  const sidebarFormProps = {
    data,
    formTitle,
    formLimitation,
    startFromContinue,
    onChangeName: setFormTitle,
    onChangeLimitation: setFormLimitation,
    onChangeStartFromContinue: setStartFromContinue,
  };

  const publishProps = {
    onPublish: publish.handlePublish,
    isPublishing: publish.isPublishing,
    isPublishDisabled: publish.isPublishDisabled,
    publishLabel: publish.publishLabel,
    isDataCollection: publish.IsDataCollection,
  };

  const mobileBottomSheetElements =
    selectedTab === 1
      ? ELEMENTS.map((el, index) => (
          <SidebarBtnElement key={index} formElement={el} disabled={isDisabled} />
        ))
      : [
          <SidebarBtnLogic
            key="calculator"
            title="محاسبه‌گر جدید"
            icon="/images/calc/ic_calculator.svg"
            logicType="calculator"
            disabled={isDisabled}
            onClick={openCreateCalculator}
          />,
          <SidebarBtnLogic
            key="condition"
            title="شرط جدید"
            icon="/images/calc/ic_condition.svg"
            logicType="condition"
            disabled={isDisabled}
            onClick={openCreateCondition}
          />,
        ];

  const renderMainContent = () => {
    if (isQuestionnaireTab) {
      return <KanbanBoard />;
    }

    if (!isDesktop && isLogicFormOpen && logicFormState) {
      return (
        <LogicFormPanel
          formState={logicFormState}
          onBack={closeLogicForm}
          onSuccess={invalidateLogicItems}
        />
      );
    }

    return (
      <LogicBoard
        disabled={isDisabled}
        onEditCalculator={openEditCalculator}
        onEditCondition={openEditCondition}
      />
    );
  };

  const isLogic = logicFormState?.type === 'calculator' || logicFormState?.type === 'condition';

  return (
    <div className="w-full h-full flex flex-col px-2 lg:px-4 pt-2">
      <CreateFieldDialog />

      <BuilderHeader {...sidebarFormProps} {...publishProps} />

      <div className="lg:hidden shrink-0 px-10">
        <DesignerTabsNew
          variant="mobile"
          value={selectedTab}
          onChange={handleTabChange}
        />
      </div>

      <div className={`flex flex-1 min-h-0 gap-3 lg:flex-row flex-col ${isLogic ? "xs:border md:border-none xs:border-[#DDE1E6] rounded-[20px]" : ""}`}>
        <div
          className="flex-1 min-h-0 overflow-y-auto lg:pr-2 pb-24 lg:pb-4"
          style={{ scrollbarWidth: 'thin' }}
        >
          {renderMainContent()}
        </div>

        <div className="hidden lg:flex flex-col shrink-0">
          <div className="px-10">
            <DesignerTabsNew
              variant="sidebar"
              value={selectedTab}
              onChange={handleTabChange}
            />
          </div>
          <DesignerSidebar
            data={data}
            disabled={isDisabled}
            selectedTab={selectedTab}
            onCreateCalculator={openCreateCalculator}
            onCreateCondition={openCreateCondition}
          />
        </div>
      </div>

      {!isLogicFormOpen && (
        <BuilderFAB disabled={isDisabled} isQuestionnaireTab={isQuestionnaireTab} />
      )}

      <BuilderMobileBottomBar {...sidebarFormProps} {...publishProps} />

      <DesignerBottomSheet>
        <div className="flex flex-col w-full gap-3">
          <span className="text-[#6F6F6F] text-[13px] font-semibold px-5 py-2">
            {selectedTab == 0 ? "انتخاب منطق" : "انتخاب سوال"}
            </span>
          {mobileBottomSheetElements}</div>
      </DesignerBottomSheet>

      {isDesktop && isLogicFormOpen && (
        <LogicFormDialogs formState={logicFormState} onClose={closeLogicForm} />
      )}

      <ConfirmationPublishDialog
        open={publish.openConfirm}
        loading={publish.isPublishing}
        onClose={() => publish.setOpenConfirm(false)}
        onConfirm={publish.confirmPublish}
      />
    </div>
  );
});

export default Designer;