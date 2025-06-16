import { InvoiceItemProps } from "@/types/shoppingCart";

function InvoiceItem({ detail, index }: InvoiceItemProps) {
    const product = detail.purchaseOrderProductModels?.[0];
    const title = product?.title || "محصول";
    const description = detail.description;

    return (
        <div className="bg-[#F7F7FF] rounded-2xl p-4 flex flex-col gap-1">
            <div className="text-xs text-[#393939]">
                <span className="font-medium text-[#161616]">{title}</span>
            </div>
            {description && (
                <span className="text-xs text-[#404040] truncate max-w-[200px]">
          {description}
        </span>
            )}
        </div>
    );
}

export default InvoiceItem;
