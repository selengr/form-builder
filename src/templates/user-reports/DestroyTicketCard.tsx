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
    <div className='min-h-[400px]'>
      <div className='mx-auto flex w-full min-w-screen flex-col items-center justify-start gap-4 rounded-xl bg-white p-3 md:container'>
        <div className='w-full max-w-[500px] space-y-4'>
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
    <div className='flex w-full justify-between rounded-lg border border-blue-600 bg-white p-2.5'>
      <div className='flex flex-row items-start gap-2.5 p-1.5'>
        <div className='flex h-8 w-8 min-w-8 items-center justify-center rounded-lg bg-indigo-50'>
          <span className='text-sm text-gray-900'>{indx + 1}</span>
        </div>

        <div className='flex flex-col gap-2 pt-1'>
          <p className='text-justify text-sm font-medium text-gray-900'>{data?.ticket}</p>
          <span className='text-sm text-gray-600'>{data.registrarInformation}</span>
        </div>
      </div>
    </div>
  );
};

const TicketSkeleton = () => {
  return (
    <div className='min-h-[400px] min-w-screen flex justify-center items-start'>
      <div className='animate-pulse w-full max-w-[520px] flex flex-col overflow-hidden'>
        <div dir='rtl' className='bg-[#F7F7FF] rounded-lg p-3 w-full flex flex-col gap-1'>
          {[...Array(3)].map((_, index) => (
            <div key={index} className={`bg-[#F7F7FF] rounded-lg flex mb-2`}>
              <div className='rounded-lg p-[10px] flex justify-between w-full cursor-pointer border-[1px] border-[#1758BA] bg-[#fff]'>
                <div className='flex flex-row justify-start items-center gap-[10px] pl-[10px]'>
                  <div className='bg-white h-8 w-8 rounded-[10px] flex justify-center items-center'>
                    <div className='bg-gray-300 h-4 w-4 rounded-full'></div>
                  </div>

                  <div className='flex flex-col justify-center items-center gap-[10px] py-2'>
                    <div className='bg-gray-300 h-4 w-32 md:w-44 rounded'></div>
                    <div className='bg-gray-300 h-4 w-32 md:w-44 rounded'></div>
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
    <div className='min-h-[400px] min-w-screen flex justify-center items-center'>
      <div className='flex flex-col justify-center items-center'>
        <span className='text-red-500'>!!خطا در بارگذاری</span>
        <span>{error?.message}</span>
      </div>
    </div>
  );
};

export default DestroyTicketCard;
