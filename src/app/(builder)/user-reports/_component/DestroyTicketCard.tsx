import React from 'react';

interface EventItem {
  id: number;
  text: string;
  date: string;
}

const DestroyTicketCard = ({data}:any) => {
  const events: EventItem[] = [
    {
      id: 1,
      text: "به این دلیل فرم رو معلق کردیم",
      date: "۱۴۰۴/۰۳/۱۸"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-4">
      <div className="mx-auto flex w-full min-w-screen flex-col items-center justify-start gap-4 rounded-xl bg-white p-3 md:container">
        <div className="w-full max-w-[450px] space-y-4">
          {events.map((event) => (
            <EventCard
              key={event.id}
              index={event.id}
              text={event.text}
              date={event.date}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface EventCardProps {
  index: number;
  text: string;
  date: string;
}

const EventCard = ({ index, text, date }: EventCardProps) => {
  return (
    <div className="flex w-full justify-between rounded-lg border border-blue-600 bg-white p-2.5">
      <div className="flex flex-row items-start gap-2.5 p-1.5">
        <div className="flex h-8 w-8 min-w-8 items-center justify-center rounded-lg bg-indigo-50">
          <span className="text-sm text-gray-900">{index}</span>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-justify text-sm font-medium text-gray-900">
            {text}
          </p>
          <span className="text-sm text-gray-600">{date}</span>
        </div>
      </div>
    </div>
  );
};

export default DestroyTicketCard;