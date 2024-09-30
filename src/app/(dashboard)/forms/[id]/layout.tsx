import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return <div className="flex w-full flex-col flex-grow mx-auto">{children}</div>;
}

export default layout;
