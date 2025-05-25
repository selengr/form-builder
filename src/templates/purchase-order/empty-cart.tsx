import Image from "next/image";

const EmptyCart = () => {
  return (
    <div className="w-full h-[80%] justify-center items-center flex flex-col">
      <Image
        src="/images/home-page/empty-shopping-cart.svg"
        alt="empty"
        width={200}
        height={200}
        className="w-full h-full max-h-[400px]"
      />
      <span className="text-[#404040] font-bold text-[15px] -mt-20">
        در حال حاضر سبد خرید شما خالی است
      </span>
    </div>
  );
};

export default EmptyCart;
