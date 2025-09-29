import React from 'react';
import { MessageCircle, Phone, Mail, Clock, ArrowRight, Headphones } from 'lucide-react';
import { useUserContext } from '@/context/AuthProvider';
import { useNavigate } from 'react-router-dom';

const CustomerServicePage = () => {
    const navigate = useNavigate()
    const {user} = useUserContext()
  const handleChatNavigation = () => {
    // In a real React app with React Router, you would use:
   navigate(`/chat/${user.user_id}`);
    
    // For demonstration, we'll show an alert
    
    // In a real app, you would do:
    // window.location.href = '/chat';
  };

  const supportOptions = [
    {
      id: 1,
      title: 'Live Chat Support',
      description: 'Get instant help from our support team',
      icon: MessageCircle,
      action: handleChatNavigation,
      available: true,
      responseTime: 'Usually responds in 2-3 minutes',
      highlight: true
    },
 
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
     

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          

          {/* Support Options Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {supportOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div
                  key={option.id}
                  onClick={option.action}
                  className={`group cursor-pointer bg-slate-800/50 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl ${
                    option.highlight 
                      ? 'border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10 hover:border-blue-400' 
                      : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${
                      option.highlight 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-slate-700/50 text-slate-300'
                    } group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {option.available && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm font-medium">Online</span>
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {option.title}
                  </h4>
                  <p className="text-slate-400 mb-4 leading-relaxed">
                    {option.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span>{option.responseTime}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              );
            })}
          </div>

         
        </div>
      </div>
    </div>
  );
};

export default CustomerServicePage;