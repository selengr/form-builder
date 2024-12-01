import { ReactNode } from "react";
import { Toaster } from "sonner";
import DesignerContextProvider from "@/context/DesignerContext";

export default function BuilderPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <DesignerContextProvider>{children}</DesignerContextProvider>
      <Toaster />
    </>
  );
}
