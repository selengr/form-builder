import Image from 'next/image';
import FailedIcon from '@/../public/images/purchase-order/failed.svg';

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">

        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold text-gray-800 mb-8">پرداخت</h1>


          <div className="relative mb-6">
            <div className="w-24 h-24 bg-red-100 rounded-full mx-auto flex items-center justify-center">
              <Image src={FailedIcon} alt='delete' width={240} height={240} />
            </div>
            <div className="absolute -bottom-1 -right-8 w-3 h-3 bg-red-400 rounded-full"></div>
          </div>

          <h2 className="text-xl font-semibold text-red-600 mb-8">پرداخت ناموفق</h2>
        </div>

        <div className="mb-8">
          <div className="border-t-2 border-dashed border-blue-300 pt-6">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">کد رهگیری در سامانه:</span>
              <span className="font-semibold text-blue-600">۲۵۶۹۸F۵</span>
            </div>
          </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700">بازگشت به صفحه اصلی</button>
      </div>
    </div>
  )
}