import { ImSpinner2 } from 'react-icons/im';

interface IProps {
  className?: string; 
}

const BuilderLoading: React.FC<IProps> = ({ className }) => {
  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      <ImSpinner2 className='animate-spin h-12 w-12' />
    </div>
  );
};

export default BuilderLoading;
