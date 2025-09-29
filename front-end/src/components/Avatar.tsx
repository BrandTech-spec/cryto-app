import { LucideProps, MessageCircle, MessageCircleMore } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { useLocation } from "react-router-dom";

export const MessageIconWithCounter = ({ to, count, size = 24, onClick, className, Icon }: { count: number, size?: number, onClick?: (p: string) => void, className?: string, Icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>; to:string }) => {
   const  {pathname} = useLocation()
  const displayCount = count > 99 ? '99+' : count.toString();
  const hasMessages = count > 0;

  return (
    <div
      className={`relative inline-block cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Message Icon */}
      <Icon
        size={size}
        className={`transition-colors ${pathname.includes(to)
            ? 'text-blue-600 hover:text-blue-700'
            : 'text-gray-500 hover:text-gray-600'
          }`}
      />

      {/* Counter Badge */}

   <div className="absolute -top-1 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {count}
        </div>
      


    </div>
  );
};