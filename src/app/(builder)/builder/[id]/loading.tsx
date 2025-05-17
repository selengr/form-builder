import {ImSpinner2} from "react-icons/im";

export default function BuilderLoading() {
  return (
    <div className="flex items-center justify-center w-full min-h-screen">
      <ImSpinner2 className="animate-spin h-12 w-12"/>
    </div>
  );
}
