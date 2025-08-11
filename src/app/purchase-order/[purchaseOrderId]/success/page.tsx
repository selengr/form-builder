import Image from 'next/image';
import SuccessIcon from '@/../public/images/purchase-order/success.svg';
import { Button, Typography } from '@mui/material';

export default function PaymentSuccessPage() {
  return (
    <div className='w-full'>
      {/* <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4"> */}
        <div className="bg-white w-f flex flex-col items-center justify-center rounded-lg shadow-lg m-4 p-8 w-[calc(100%-32px)] h-[calc(100%-32px)]">
          <h1 className="text-lg font-semibold text-gray-800 mb-8">صفحه پرداخت</h1>

          <div className='bg-[#F7F7FF] rounded-3xl py-10 px-6 w-full max-w-[450px]'>
            <div className="text-center mb-8">


              <div className="relative mb-6 mt-2">
                <div className="relative w-28 h-28 bg-green-100 rounded-full mx-auto flex items-center justify-center">
                  <Image src={SuccessIcon} alt='success'
                    width={80} height={80}
                    className='w-24 h-24 absolute -right-3 -top-1' />
                  <div className="absolute bottom-11 -right-1 w-2 h-2 bg-[#FFB800] rounded-full"></div>
                  <div className="absolute bottom-9 right-0 w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
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

    

               <Button
        // disabled={isLoading}
        type='submit'
        variant='contained'
        sx={{
          backgroundColor: '#1758BA',
          borderRadius: '8px',
          height: '50px',
          '&.MuiButtonBase-root:hover': {
            backgroundColor: '#1758BA',
          },
          minWidth: 113,
        }}>
        <Typography variant='body2' component={'p'} py={0.5} sx={{ color: '#fff', fontWeight: 500 }}>
       
       
        </Typography>
      </Button>
      <Button
        // onClick={handleClose}
        type='button'
        variant='outlined'
        sx={{
          height: '50px',
          minWidth: 113,
          borderRadius: '8px',
          borderColor: '#1758BA',
          background: '#F7F7FF',
        }}>
        <Typography variant='body2' component={'p'} py={0.5} color={'#1758BA'} sx={{ fontWeight: 500 }}>
          انصراف
        </Typography>
      </Button>

            
          </div>

        </div>
      {/* </div> */}
    </div>
  )
}