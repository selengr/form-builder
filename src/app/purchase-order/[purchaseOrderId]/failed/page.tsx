"use client"
import Image from 'next/image';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import FailedIcon from '@/../public/images/purchase-order/failed.svg';

export default function PaymentFailedPage() {
  const { push } = useRouter()

  const handleCalcel = () => {
    push('/');
  }

  return (
    <div className='w-full'>
      <div className="bg-white w-f flex flex-col items-center justify-center rounded-lg shadow-lg m-4 p-8 w-[calc(100%-32px)] h-[calc(100%-32px)]">
        <h1 className="text-lg font-semibold text-gray-800 mb-8">صفحه پرداخت</h1>

        <div className='bg-[#F7F7FF] rounded-3xl py-10 px-6 w-full justify-center flex flex-col max-w-[450px]'>
          <div className="text-center mb-8">


            <div className="relative mb-6 mt-2">
              <div className="relative w-28 h-28  rounded-full mx-auto flex items-center justify-center">
                <Image src={FailedIcon} alt='success'
                  width={80} height={80}
                  className='w-28 h-28'
                       unoptimized
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold text-[#FA4D56] mb-8">پرداخت ناموفق</h2>
          </div>

          <div className="space-y-4 mb-8">
            <div className="border-t-2 border-dashed border-[#1758BA] pt-4">
              {/* <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">مبلغ سبد خرید</span>
                <span className="font-semibold">۲,۰۰۰,۰۰۰ تومان</span>
              </div> */}

            </div>
          </div>



          <div className='flex flex-row w-full justify-center gap-4'>
            <Button
              onClick={handleCalcel}
              type='submit'
              variant='contained'
              sx={{
                backgroundColor: '#1758BA',
                borderRadius: '8px',
                height: '50px',
                '&.MuiButtonBase-root:hover': {
                  backgroundColor: '#1758BA',
                },
                minWidth: 160,
              }}>
              بازگشت به صفحه اصلی
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}