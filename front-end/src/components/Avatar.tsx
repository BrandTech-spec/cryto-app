import { MessageCircle } from "lucide-react";

 export const MessageIconWithCounter = ({ count , size, onClick, className  }:{ count:number, size:number, onClick:()=> void, className:string }) => {
    const displayCount = count > 99 ? '99+' : count.toString();
    const hasMessages = count > 0;
  
    return (
      <div 
        className={`relative inline-block cursor-pointer ${className}`}
        onClick={onClick}
      >
        {/* Message Icon */}
        <MessageCircle 
          size={size} 
          className={`transition-colors ${
            hasMessages 
              ? 'text-blue-600 hover:text-blue-700' 
              : 'text-gray-500 hover:text-gray-600'
          }`}
        />
        
        {/* Counter Badge */}
        {hasMessages && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {displayCount}
          </div>
        )}
      </div>
    );
  };