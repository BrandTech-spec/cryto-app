import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Settings,
  TrendingUp,
  AlignHorizontalDistributeCenter,
  History,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COLLECTION_ID_MESSAGES, DATABASE_ID, databases } from '@/lib/appwrite/appWriteConfig';
import { Query } from 'appwrite';
import { useUserContext } from '@/context/AuthProvider';

const Navigation = () => {
  const [activeTab, setActiveTab] = useState('Trades');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(window.scrollY);
  const [count, setCount] = useState(0)
  const {user} = useUserContext()
  const timerRef = useRef(null);
 const {pathname} = useLocation()

  const navigationItems = [
    {
      id: '/buy',
      label: 'Trades',
      icon: TrendingUp,
      active: pathname.includes('/buy')
    },
    {
      id: '/chart',
      label: 'Signals',
      icon: AlignHorizontalDistributeCenter,
      active: pathname.includes('/chart')
    },
    {
      id: '/history',
      label: 'History',
      icon: History,
      active: pathname.includes('/history')
    },
    {
      id: '/chat',
      label: 'Messages',
      icon: MessageCircle,
      active: pathname.includes('/chat'),
      hasNotification: true,
      notificationCount: count || 0
    },
    {
      id: '/settings',
      label: 'Settings',
      icon: Settings,
      active: pathname.includes('/settings'),
    }
  ];

  const navigate = useNavigate();

  const handleTabPress = (path) => {
    navigate(path);
    setActiveTab(path); // optional: update activeTab if needed
  };

  // Auto-hide after 5 seconds
  useEffect(() => {
    startHideTimer();

    // Cleanup on unmount
    return () => {
      clearTimeout(timerRef.current);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const startHideTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 5000); // 5 seconds
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY < lastScrollY.current) {
      // Scrolling up
      setIsVisible(true);
      startHideTimer();
    }

    lastScrollY.current = currentScrollY;
  };

    const getMessages = async () => {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_MESSAGES,
        [
          Query.orderDesc('$createdAt'),
          Query.limit(100),
          Query.equal("reciever_id", user?.user_id)
        ]
      )
      console.log(response.documents)
      setCount(response?.documents?.length)
    }
useEffect(() => {
  getMessages()
}, [])

  return (
    <div
      className={`fixed bottom-3 w-[90%] max-w-md lg:hidden left-5 z-50 rounded-full transition-all duration-500 ease-in-out ${pathname.includes("/chat") && "hidden" } ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 border-t rounded-3xl">
        <div className="flex justify-between items-center px-2 py-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabPress(item.id)}
                className="flex flex-col items-center justify-center min-w-0 flex-1 py-1 px-1 group"
              >
                <div
                  className={`relative p-1 rounded-lg mb-1 transition-colors ${
                    item.active ? 'bg-blue-500' : 'group-hover:bg-gray-700/50'
                  }`}
                >
                  <IconComponent
                    className={`w-6 h-6 transition-colors ${
                      item.active ? 'text-blue-400 text-gray-200' : 'text-gray-400 group-hover:text-gray-300'
                    }`}
                  />
                  {item.hasNotification && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-gray-900">
                      {item.notificationCount}
                    </div>
                  )}
                </div>
                <span
                  className={`text-xs font-medium transition-colors truncate max-w-full ${
                    item.active ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
