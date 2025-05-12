import { ImSpinner2 } from "react-icons/im";

function PreviewLoading() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <ImSpinner2 className="animate-spin h-12 w-12" />
    </div>
  );
}

export default PreviewLoading;
