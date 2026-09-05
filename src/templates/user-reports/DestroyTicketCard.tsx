import React from 'react';

type TError = {
  message: string;
} | null;
interface ITicket {
  ticket: string;
  adminTicket: boolean;
  registrarInformation: string;
  formBuilderName: string;
}

interface IProps {
  data: ITicket[];
  loading: boolean;
  error: TError;
}

const DestroyTicketCard: React.FC<IProps> = ({ data, loading, error }) => {
  if (loading) {
    return <TicketSkeleton />;
  }
  if (error) {
    return <TicketError error={error} />;
  }

  return (
    <div className="min-h-[200px] sm:min-h-[320px]">
      <div className="mx-auto flex w-full flex-col items-center justify-start gap-4 rounded-xl bg-white">
        <div className="w-full max-w-[500px] space-y-3 sm:space-y-4">
          {data?.map((event: ITicket, indx) => (
            <EventCard key={indx} indx={indx} data={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

const EventCard = ({ indx, data }: { indx: number; data: ITicket }) => {
  return (
    <div className="flex w-full justify-between rounded-lg border border-blue-600 bg-white p-2.5">
      <div className="flex min-w-0 flex-row items-start gap-2.5 p-1.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
          <span className="text-sm text-gray-900">{indx + 1}</span>
        </div>

        <div className="flex min-w-0 flex-col gap-2 pt-1">
          <p className="break-words text-justify text-sm font-medium text-gray-900">{data?.ticket}</p>
          <span className="break-words text-sm text-gray-600">{data.registrarInformation}</span>
        </div>
      </div>
    </div>
  );
};

const TicketSkeleton = () => {
  return (
    <div className="flex min-h-[200px] sm:min-h-[320px] w-full items-start justify-center">
      <div className="animate-pulse flex w-full max-w-[520px] flex-col overflow-hidden">
        <div dir="rtl" className="flex w-full flex-col gap-1 rounded-lg bg-[#F7F7FF] p-1 sm:p-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="mb-2 flex rounded-lg bg-[#F7F7FF]">
              <div className="flex w-full justify-between rounded-lg border border-[#1758BA] bg-white p-2.5">
                <div className="flex flex-row items-center justify-start gap-2.5 pl-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-white">
                    <div className="h-4 w-4 rounded-full bg-gray-300" />
                  </div>

                  <div className="flex flex-col items-center justify-center gap-2.5 py-2">
                    <div className="h-4 w-28 rounded bg-gray-300 sm:w-44" />
                    <div className="h-4 w-28 rounded bg-gray-300 sm:w-44" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TicketError = ({ error }: { error: TError }) => {
  return (
    <div className="flex min-h-[200px] sm:min-h-[320px] w-full items-center justify-center px-2">
      <div className="flex flex-col items-center justify-center text-center">
        <span className="text-red-500">!!خطا در بارگذاری</span>
        <span className="break-words text-sm">{error?.message}</span>
      </div>
    </div>
  );
};

export default DestroyTicketCard;
