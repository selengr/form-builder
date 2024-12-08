import { ReactNode } from "react";
import { PreviewProvider } from "@/context/PreviewContext";

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return (
    <div className="w-full min-h-screen">
      <PreviewProvider>{children}</PreviewProvider>
    </div>
  );
}
