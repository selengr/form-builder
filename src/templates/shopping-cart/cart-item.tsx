interface InvoiceItemProps {
  index: number;
  item: {
    title: string;
    quantity: number;
    price: number;
    type?: string;
  };
}

export function InvoiceItem({ index, item }: InvoiceItemProps) {
  return (
    <div className="bg-[#F7F7FF] rounded-2xl p-3">
      <span className="text-xs text-[#393939] block">
        ردیف {new Intl.NumberFormat("fa-IR").format(index)}:{" "}
        <span className="font-bold">
          {new Intl.NumberFormat("fa-IR").format(item.quantity)} عدد{" "}
          {item.type || ""} بابت {item.title}
        </span>
      </span>
      <span className="font-bold text-[#393939] block text-left mt-1">
        {new Intl.NumberFormat("fa-IR").format(item.price / 1000)} هزار تومان
      </span>
    </div>
  );
}
