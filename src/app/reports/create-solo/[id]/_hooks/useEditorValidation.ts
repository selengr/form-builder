import {useCallback} from "react"
import {IDropdownItem} from "@/components/AdvancedTextareaEditor/types"

interface IUseEditorValidationProps {
  setValidationErrors: (errors: string[]) => void
}

export function useEditorValidation({ setValidationErrors }: IUseEditorValidationProps) {
  const validateEditor = useCallback(
    (unselectedDropdowns: IDropdownItem[]): boolean => {
      if (unselectedDropdowns.length > 0) {

        setValidationErrors(unselectedDropdowns.map((d) => d.id))

        const firstUnselected = document.querySelector(`[data-dropdown-id="${unselectedDropdowns[0].id}"]`)
        if (firstUnselected) {
          firstUnselected.scrollIntoView({ behavior: "smooth", block: "center" })
        }

        return false 
      }

      setValidationErrors([])
      return true 
    },
    [setValidationErrors],
  )


  return {
    validateEditor,
  }
}
