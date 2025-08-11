import Image from 'next/image';
import SuccessIcon from '@/../public/images/purchase-order/success.svg';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
  
        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold text-gray-800 mb-8">صفحه پرداخت</h1>


          <div className="relative mb-6">
            <div className="w-full h-full bg-green-100 rounded-full mx-auto flex items-center justify-center">
            <Image src={SuccessIcon} alt='delete'
             width={240} height={240}
             className='w-full' />
            </div>
            <div className="absolute -bottom-1 -right-8 w-3 h-3 bg-green-400 rounded-full"></div>
          </div>

          <h2 className="text-xl font-semibold text-green-600 mb-8">پرداخت موفق</h2>
        </div>

        <div className="space-y-4 mb-8">
          <div className="border-t-2 border-dashed border-blue-300 pt-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">مبلغ سبد خرید</span>
              <span className="font-semibold">۲,۰۰۰,۰۰۰ تومان</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">اعتبار ام حساب عادی:</span>
              <span className="font-semibold">۲۰۰,۰۰۰ تومان</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">اعتبار ام حساب اهدایی:</span>
              <span className="font-semibold">۱,۰۰۰,۰۰۰ تومان</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">اعتبار ام حساب بن اهدایی:</span>
              <span className="font-semibold">۵۰۰,۰۰۰ تومان</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">اعتبار ام تسهیم:</span>
              <span className="font-semibold">۲,۵۰۰,۰۰۰ تومان</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">اعتبار ام تسهیم:</span>
              <span className="font-semibold">۸۰۰,۰۰۰ تومان</span>
            </div>

            <div className="flex justify-between items-center py-2 border-t border-gray-200 mt-4 pt-4">
              <span className="text-gray-600">تاریخ :</span>
              <span className="font-semibold">۱۴۰۱/۰۵/۲۱</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">کد رهگیری در سامانه:</span>
              <span className="font-semibold text-blue-600">۲۵۶۹۸F۵</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="flex-1 bg-transparent">
            انصراف
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700">تکمیل فرآیند خرید</button>
        </div>
      </div>
    </div>
  )
}