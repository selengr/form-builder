import React from "react";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
};

const PageContainer = ({
  children,
  className = "",
  innerClassName = "",
}: PageContainerProps) => {
  return (
    <div className={`w-full flex flex-col overflow-hidden h-[calc(100dvh-76px)] md:h-screen p-2 sm:p-3 ${className}`}>
      <div className={`flex flex-col bg-white rounded-xl overflow-hidden h-full shadow-sm ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
