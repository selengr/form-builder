import Image from 'next/image';
import Link from 'next/link';

const EmptyCart = () => {
  return (
    <div className='w-full min-full h-full flex flex-col items-center justify-center p-6 text-center'>
      <Image
        src={"images/home-page/empty-shopping-cart.svg"}
        alt='سبد خرید خالی است'
        width={0}
        height={0}
        priority={true}
        draggable={false}
        className='max-w-[400px] w-full h-auto object-contain'
      />

      <div className="space-y-4">
        <h2 className='text-[#404040] font-bold text-md md:text-lg'>
          در حال حاضر سبد خرید شما خالی است
        </h2>

        <p className="text-gray-500 text-sm">برای ساخت و انتشار فرم میتواند به فرم ساز سر بزنید.</p>

        <Link
          href="/builder"
          className="inline-block mt-4 px-8 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          فرم‌های من
        </Link>
      </div>
    </div>
  );
};

export default EmptyCart;
