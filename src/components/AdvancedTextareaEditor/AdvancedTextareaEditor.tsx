const AdvancedTextareaEditor = () => {
    return (
        <div className="w-full max-w-4xl mx-auto p-6">

      <form className="space-y-6">
        <div className="flex flex-row-reverse pt-32">
          <div className="flex flex-col justify-center items-center">
            <span className="text-[#393939] text-sm">:نمایش بده</span>
            <button type="button"  className="w-20 h-8 text-[#1758BA] bg-[#E8EEF8] rounded-md font-medium text-xs m-2">
              افزودن متغییر
            </button>
          </div>

          <div
            dir="rtl"
            contentEditable
            suppressContentEditableWarning
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