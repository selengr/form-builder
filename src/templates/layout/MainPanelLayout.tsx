import { type ReactNode } from "react";

type TProps = {
  children: ReactNode;
};

export default function MainPanelLayout({ children }: TProps) {
  return (
    <div className="flex flex-col">
      <div className="w-32 h-full bg-slate-500"></div>
      <div className="w-32 h-full bg-slate-500"></div>
      <div className="bg-slate-800 h-full">{children}</div>
    </div>
  );
}
