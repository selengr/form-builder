export default function CalculatorPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div dir="ltr" className="flex w-full flex-grow mx-auto h-full">
      <main className="flex flex-col w-full">
        <div className="flex w-full items-start justify-center relative h-full bg-[#f7f7f7]">
          {children}
        </div>
      </main>
    </div>
  );
}
