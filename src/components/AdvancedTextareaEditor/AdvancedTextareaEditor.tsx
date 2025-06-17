"use client";

import type React from "react";

import { useState, useRef, useCallback, useEffect } from "react";

import styles from './advancedTextareaEditor.module.css'

interface DropdownItem {
  id: string;
  value: string;
  unique_name : string;
  placeholder: string;
}
const AdvancedTextareaEditor = () => {
      const [dropdowns, setDropdowns] = useState<DropdownItem[]>([]);
  const [dropdownCounter, setDropdownCounter] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);



  


  const handleInput = () => {}
  
    const addDropdown = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || !editorRef.current) return;

    const newDropdown: DropdownItem = {
      id: `dropdown-${dropdownCounter}`,
      value: "",
      unique_name: "",
      placeholder: "انتخاب كنيد",
    };

    setDropdowns((prev) => [...prev, newDropdown]);

    const dropdownContainer = document.createElement("span");
    dropdownContainer.className = "dropdown-container";
    dropdownContainer.setAttribute("data-dropdown-id", newDropdown.id);
    dropdownContainer.contentEditable = "false";
    dropdownContainer.style.cssText = `
      display: inline-block;
      margin: 0 2px;
      vertical-align: middle;
    `;


    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(dropdownContainer);


    range.setStartAfter(dropdownContainer);
    range.setEndAfter(dropdownContainer);
    selection.removeAllRanges();
    selection.addRange(range);

    setDropdownCounter((prev) => prev + 1);
    editorRef.current.focus();
  }, [dropdownCounter]);


  const generateFormData = useCallback(() => {
    if (!editorRef.current) return { content: "", contentWithIds: "", dropdowns: [] }

    let finalText = ""
    let finalTextWithIds = ""
    const dropdownData: Array<{ id: string; value: string; unique_name: string; position: number }> = []

    const walker = document.createTreeWalker(editorRef.current, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          let parent = node.parentNode
          while (parent && parent !== editorRef.current) {
            if ((parent as Element).classList?.contains("dropdown-container")) {
              return NodeFilter.FILTER_REJECT
            }
            parent = parent.parentNode
          }
          return NodeFilter.FILTER_ACCEPT
        }
        if (node.nodeType === Node.ELEMENT_NODE && (node as Element).classList.contains("dropdown-container")) {
          return NodeFilter.FILTER_ACCEPT
        }
        return NodeFilter.FILTER_SKIP
      },
    })

    let node
    while ((node = walker.nextNode())) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        finalText += node.textContent
        finalTextWithIds += node.textContent
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element
        const dropdownId = element.getAttribute("data-dropdown-id")
        if (dropdownId) {
          const dropdown = dropdowns.find((d) => d.id === dropdownId)
          const selectedValue = dropdown?.value || `[${dropdown?.placeholder || "Unselected"}]`

          dropdownData.push({
            id: dropdownId,
            value: dropdown?.value || "",
            unique_name: dropdown?.unique_name || "",
            position: finalText.length,
          })


          finalText += selectedValue

          finalTextWithIds += `${dropdown.unique_name}`
        }
      }
    }

    const result = {
        content: finalText,
        contentWithIds: finalTextWithIds,
        dropdowns: dropdownData,
      }


    return result
  }, [dropdowns])

   const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const formData = generateFormData()
      console.log("Form Data:", formData)
    },
    [generateFormData],
  )

   const updateDropdownValue = useCallback(
    (dropdownId: string, value: string, unique_name : string) => {
      setDropdowns((prev) =>
        prev.map((dropdown) =>
          dropdown.id === dropdownId ? { ...dropdown, value, unique_name } : dropdown
        )
      );
      
      const optionsContainer = document.querySelector(`[data-id="${dropdownId}"] .${styles.optionsContainer}`) as HTMLElement;
    if (optionsContainer) {
      optionsContainer.style.display = 'none';
    }

    const dropdownButton = document.querySelector(`[data-id="${dropdownId}"] .${styles.customDropdown}`) as HTMLElement;
    if (dropdownButton) {
      dropdownButton.setAttribute('data-type', 'down');
    }
    },
    []
  );

    return (
        <div className="w-full max-w-4xl mx-auto p-6">

     
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-row-reverse pt-32">
          <div className="flex flex-col justify-center items-center">
            <span className="text-[#393939] text-sm">:نمایش بده</span>
            <button type="button" onClick={addDropdown} className="w-20 h-8 text-[#1758BA] bg-[#E8EEF8] rounded-md font-medium text-xs m-2">
              افزودن متغییر
            </button>
          </div>

          <div
            dir="rtl"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            className="min-h-[110px] focus:outline-none w-full leading-relaxed text-gray-900 relative rounded-lg px-4 py-2 border-[1px] border-[#DDE1E6]"
            style={{
              lineHeight: "2.5",
              fontSize: "14px",
            }}
          />
        
        </div>
     
                <button type="submit" className="w-full">
              {/* <Send className="h-4 w-4 mr-2" /> */}
              Submit Form
            </button>
        </form>
    </div>
    );
}

export default AdvancedTextareaEditor;