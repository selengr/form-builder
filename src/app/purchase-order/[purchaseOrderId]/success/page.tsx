"use client"
import Image from 'next/image';
import { Button } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import SuccessIcon from '@/../public/images/purchase-order/success.svg';

export default function PaymentSuccessPage() {
  const { purchaseOrderId } = useParams()
  const { push } = useRouter()


  const handleRedirect = () => {
    push(`/purchase-order/${purchaseOrderId}/gateway`);
  }
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
            <div className="border-t-2 border-dashed border-[#1758BA] pt-4">


              {/* <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">کد رهگیری در سامانه:</span>
                <span className="font-semibold text-blue-600">----</span>
              </div> */}
            </div>
          </div>



          <div className='flex flex-row w-full justify-center gap-4'>
            <Button
              onClick={handleRedirect}
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
              تکمیل فرآیند خریـد
            </Button>
            <Button
              onClick={handleCalcel}
              type='button'
              variant='outlined'
              sx={{
                height: '50px',
                minWidth: 113,
                borderRadius: '8px',
                borderColor: '#1758BA',
                background: '#F7F7FF',
              }}>
              انصراف

            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}