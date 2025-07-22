"use client"

import {useCallback} from "react"

interface DropdownItem {
  id: string
  value: string
  unique_name: string
  placeholder: string
}

interface UseFormValidationProps {
  setValidationErrors: (errors: string[]) => void
}

export function useFormValidation({ setValidationErrors }: UseFormValidationProps) {
  const validateAndHandleErrors = useCallback(
    (unselectedDropdowns: DropdownItem[]): boolean => {
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
    validateAndHandleErrors
  }
}
