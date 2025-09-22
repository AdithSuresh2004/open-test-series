import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function LoadingSpinner({ size = 24, className = "" }) {
  return (
    <div className={`flex items-center justify-center min-h-full ${className}`}>
      <AiOutlineLoading3Quarters 
        className="animate-spin text-blue-600" 
        size={size} 
      />
    </div>
  );
}