import clsx from 'clsx';
import {ImSpinner2} from "react-icons/im";

interface IProps {
  text? : string
  calssName : string
}
export default function CircleLoading({ text, calssName = ""}:IProps) {
  return (
    <div className={clsx('"flex items-center justify-center w-full flex-col',calssName)}>
      <ImSpinner2 className="animate-spin h-12 w-12"/>
      {text && <span className="mr-2 mt-4">{text}</span>}
    </div>
  );
}
