interface IErrorProps {
  title: string;
  message: string;
}

const ErrorDisplay = ({ title, message }: IErrorProps) => {
  return (
    <div className='flex flex-col absolute top-[250px] justify-center items-center'>
      <span className='text-red-500'>!!خطا در بارگذاری لیست {title}</span>
      <span>{message}</span>
    </div>
  );
};

export default ErrorDisplay;
