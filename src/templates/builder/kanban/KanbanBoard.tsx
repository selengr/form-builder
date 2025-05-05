"use client";
import {
  useMemo,
  startTransition,
  useState,
  Fragment,
  useCallback,
  memo,
} from "react";
import QuestionGroup from "./QuestionGroup";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  useDndMonitor,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import useDesigner from "@/hooks/useDesigner";
import {
  ElementsType,
  FormElementInstance,
  FormElements,
} from "@/types/FormElements";
import { useParams } from "next/navigation";
import {
  IChangeOrMovePositionApi,
  IFormElementConstructor,
} from "@/types/bulider";
import { idGenerator } from "@/lib/idGenerator";
import useElements from "@/hooks/useElements";
import useActionOpenDialog from "@/hooks/useActionOpenDialog";
import useActionElements from "@/hooks/useActionElements";
import useActionSelectedElement from "@/hooks/useActionSelectedElement";
import AxiosApi from "@/services/axios/AxiosApi";
import { toast } from "sonner";
import CreateGroupBtn from "./CreateGroupBtn";

const KanbanBoard = memo(function KanbanBoard() {
  const elements = useElements();
  const setOpenDialog = useActionOpenDialog();
  const setElements = useActionElements();
  const setSelectedElement = useActionSelectedElement();
  const {questionGroups, formSetting} = useDesigner();
  const [snapshot, setSnapshot] = useState<[] | FormElementInstance[]>([]);
  const itemsByGroup = useMemo(() => {
    return elements?.reduce((acc: any, question: any) => {
      if (!acc[question.questionGroupId]) {
        acc[question.questionGroupId] = [];
      }
      acc[question.questionGroupId].push(question);
      return acc;
    }, {});
  }, [elements]);
  const { id } = useParams();

  const changeOrMovePositionApiReducer = useCallback(
    async (
      payload: IChangeOrMovePositionApi,
      activeElement: FormElementInstance,
      snapshot: FormElementInstance[]
    ) => {
      try {
        await AxiosApi.post("/question/change-position-or-move", payload);
        setElements((allQuestions) => {
          const targetQuestion = allQuestions.find(
            (que) => que.questionId === activeElement?.questionId
          );
          delete targetQuestion?.draft;

          return allQuestions;
        });
      } catch (error) {
        setElements(snapshot);
        toast.error("عملیات ناموفق بود مجددا تلاش کنید");
        console.error(error);
      }
    },
    []
  );

  useDndMonitor({
    onDragStart: (event: DragStartEvent) => {
      const { active } = event;

      if (!active) return;

      setSnapshot(elements);

      const isSidebarBtn = active.data?.current?.isSidebarBtnElement;
      const designerBtnType: ElementsType = active?.data?.current?.type;

      if (isSidebarBtn) {
        const newElement = FormElements[designerBtnType].construct({
          questionId: idGenerator(),
          questionGroupId: null,
          formId: Number(id),
          title: "",
          position: null,
        } as IFormElementConstructor);
        newElement.temp = true;

        setElements((prev) => [...prev, newElement]);
      } else if (active?.data?.current?.type === "question") {
        setElements((questions: any) => {
          const activeQuestionId = active?.data?.current?.question?.questionId;
          const newOnes = questions.map((que: any) => {
            if (que.questionId === activeQuestionId) {
              return {
                ...que,
                draft: {
                  prevGroup: que.questionGroupId,
                  prevPosition: que.position,
                },
              };
            } else {
              return que;
            }
          });
          return newOnes;
        });
      }
    },
    onDragOver: (event: DragOverEvent) => {
      const { active, over } = event;

      if (!active) return;

      setElements((questions) => {
        const tempElement = questions?.find((q) => q?.temp);

        if (tempElement && !over) {
          tempElement.questionGroupId = null;
          return [tempElement, ...questions.filter((q) => !q?.temp)];
        }

        return questions;
      });

      if (!over) return;

      const activeId = active.id;
      const overId = over.id;

      if (activeId === overId) return;

      const isSidebarBtn = active.data?.current?.isSidebarBtnElement;
      const isOverMyQuestion = over.data?.current?.type === "question";
      const isOverGroup = over.data?.current?.type === "question-group";

      if (isSidebarBtn && isOverMyQuestion) {
        startTransition(() => {
          setElements((questions) => {
            const activeIndex = questions.findIndex((t) => t?.temp);
            const overIndex = questions.findIndex(
              (t) => t.questionId === overId
            );

            if (
              questions[activeIndex].questionGroupId !==
              questions[overIndex].questionGroupId
            ) {
              questions[activeIndex].questionGroupId =
                questions[overIndex].questionGroupId;
              return arrayMove(questions, activeIndex, overIndex);
            } else {
              return arrayMove(questions, activeIndex, overIndex);
            }
          });
        });

        return;
        // ^ Evaluate this more
      } else if (isSidebarBtn && isOverGroup) {
        const overGroup = over?.data?.current?.group;
        if (!elements?.some((el) => el.questionGroupId === overGroup)) {
          startTransition(() => {
            setElements((questions) => {
              const activeIndex = questions.findIndex((t) => t?.temp);

              questions[activeIndex].questionGroupId = overGroup;
              return arrayMove(questions, activeIndex, 0);
            });
          });
        }
        return;
      }

      const isActiveQuestion = active.data.current?.type === "question";
      const isOverQuestion = over.data.current?.type === "question";

      if (!isActiveQuestion) return;

      // Im dropping a Question over another Question
      if (isActiveQuestion && isOverQuestion) {
        startTransition(() => {
          setElements((questions) => {
            const activeIndex = questions.findIndex(
              (t) => t.questionId === activeId
            );
            const overIndex = questions.findIndex(
              (t) => t.questionId === overId
            );

            if (
              questions[activeIndex].questionGroupId !==
              questions[overIndex].questionGroupId
            ) {
              questions[activeIndex].questionGroupId =
                questions[overIndex].questionGroupId;
              return arrayMove(questions, activeIndex, overIndex - 1);
            } else {
              return arrayMove(questions, activeIndex, overIndex);
            }
          });
        });

        return;
      }

      // Im dropping a Question over a Question Group
      if (isActiveQuestion && isOverGroup) {
        startTransition(() => {
          setElements((questions) => {
            const activeIndex = questions.findIndex(
              (t) => t?.questionId === activeId
            );

            questions[activeIndex].questionGroupId = Number(overId);
            return arrayMove(questions, activeIndex, activeIndex);
          });
        });
      }
    },
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      // if (!over) return;

      if (
        elements.length &&
        over &&
        active?.data?.current?.isSidebarBtnElement
        // active?.data?.current?.type !== "question-group"
      ) {
        const droppedTempElIndex = elements?.findIndex((t: any) => t?.temp);
        const droppedEl = elements?.find((t: any) => t?.temp);

        if (droppedEl?.questionGroupId !== over?.data?.current?.group) {
          const elTemp = elements[droppedTempElIndex];

          if (elTemp?.temp) {
            elements[droppedTempElIndex].questionGroupId =
              over?.data?.current?.group;
            setOpenDialog(true);
            setSelectedElement({
              fieldElement: elements[droppedTempElIndex],
              position: null,
            });
          }
        } else if (droppedTempElIndex !== -1) {
          const group = elements.filter(
            (el) =>
              el.questionGroupId ===
              elements[droppedTempElIndex].questionGroupId
          );
          const index = group.findIndex(
            (gro) => gro.questionId === elements[droppedTempElIndex].questionId
          );

          setOpenDialog(true);
          setSelectedElement({
            fieldElement: elements[droppedTempElIndex],
            position: {
              apiPosition: index,
              realPosition: droppedTempElIndex,
            },
          });
        }

        setSnapshot([]);

        setElements((prev) => {
          return prev.filter((p) => !p?.temp);
        });
      }

      setSnapshot([]);

      setElements((prev) => {
        return prev.filter((p) => !p?.temp);
      });

      const activeEl = active?.data?.current;

      if (activeEl?.type === "question") {
        const currentQuestion = activeEl?.question;
        if (
          currentQuestion?.questionGroupId !== currentQuestion?.draft?.prevGroup
        ) {
          const data: IChangeOrMovePositionApi = {
            formBuilderId: Number(id),
            questionId: currentQuestion?.questionId,
            questionGroupId: currentQuestion?.draft?.prevGroup,
            targetQuestionGroupId: currentQuestion?.questionGroupId,
            newPosition: currentQuestion?.position,
          };
          changeOrMovePositionApiReducer(
            data,
            activeEl?.question as FormElementInstance,
            snapshot
          );
        } else if (
          currentQuestion?.position !== currentQuestion?.draft?.prevPosition
        ) {
          const data: IChangeOrMovePositionApi = {
            formBuilderId: Number(id),
            questionId: currentQuestion?.questionId,
            questionGroupId: currentQuestion?.questionGroupId,
            targetQuestionGroupId: null,
            newPosition: currentQuestion?.position,
          };
          changeOrMovePositionApiReducer(
            data,
            activeEl?.question as FormElementInstance,
            snapshot
          );
        } else {
          console.log("no change in group or position");
          return;
        }
      }
    },
    onDragCancel() {
      setSnapshot([]);
      setElements((prev) => {
        return prev.filter((p) => !p?.temp);
      });
    },
  });

  return (
    <Fragment>
      <div className="flex flex-col w-full gap-4 box-border">
        {questionGroups?.map((group: any) => (
          <QuestionGroup
            key={group}
            group={group}
            questions={itemsByGroup[group]}
            disabled={formSetting.formStatus !== "CREATE"}
          />
        ))}
      </div>
      {/*<CreateGroupBtn />*/}
    </Fragment>
  );
});

export default KanbanBoard;
