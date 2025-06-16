import Image from "next/image";

const EmptyCart = () => {
    return (
        <div dir="rtl" className="min-w-full mx-auto px-4 py-6">
            <div
                className="w-full bg-white rounded-2xl p-6 flex flex-col items-center justify-center min-h-[calc(100vh-50px)] shadow-sm">
                <Image
                    src="/images/home-page/empty-shopping-cart.svg"
                    alt="empty"
                    width={400}
                    height={400}
                    loading="lazy"
                    draggable={false}
                    className="max-w-xs max-h-[600px] object-contain mb-0"
                />
                <span className="text-[#404040] font-bold text-base text-center">
          در حال حاضر سبد خرید شما خالی است
        </span>
            </div>
        </div>
    );
};

export default EmptyCart;
