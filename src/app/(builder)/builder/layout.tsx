import { ReactNode, Suspense } from "react";
import DesignerContextProvider from "@/context/DesignerContext";

export default function BuilderPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Suspense>
      <DesignerContextProvider>{children}</DesignerContextProvider>
    </Suspense>
  );
}
