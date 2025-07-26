import React from 'react';

interface ITicket {
  ticket: string;
  adminTicket: boolean;
  registrarInformation: string;
  formBuilderName: string;
}

const DestroyTicketCard = ({ data }: { data: ITicket[] }) => {

  return (
    <div className="min-h-[500px]">
      <div className="mx-auto flex w-full min-w-screen flex-col items-center justify-start gap-4 rounded-xl bg-white p-3 md:container">
        <div className="w-full max-w-[500px] space-y-4">
          {data?.map((event: ITicket, indx) => (
            <EventCard
              key={indx}
              indx={indx}
              data={event}
            />
          ))}
        </div>
      </div>
    </div>
  );
};


const EventCard = ({ indx, data }: { indx: number, data: ITicket }) => {

  return (
    <div className="flex w-full justify-between rounded-lg border border-blue-600 bg-white p-2.5">
      <div className="flex flex-row items-start gap-2.5 p-1.5">
        <div className="flex h-8 w-8 min-w-8 items-center justify-center rounded-lg bg-indigo-50">
          <span className="text-sm text-gray-900">{indx + 1}</span>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <p className="text-justify text-sm font-medium text-gray-900">
            {data?.ticket}
          </p>
          <span className="text-sm text-gray-600">{data.registrarInformation}</span>
        </div>
      </div>
    </div>
  );
};

export default DestroyTicketCard;