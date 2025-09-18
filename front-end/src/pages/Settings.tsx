import { 
  User, 
  Shield, 
  Bell, 
  CreditCard, 
  HelpCircle, 
  FileText, 
  ChevronRight,
  Moon,
  Globe,
  Smartphone,
  ArrowUpRight,
  ArrowDownLeft,
  MessageCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface SettingItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  href?: string;
  action?: () => void;
}

const Settings = () => {
  const settingsGroups = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          title: "Profile",
          description: "View account balance and invitation code",
          href: "/profile"
        },
        
        
      ] as SettingItem[]
    },
    {
      title: "Wallet",
      items: [
        {
          icon: ArrowUpRight,
          title: "Withdraw",
          description: "Transfer funds to external wallet",
          href: "/withdrawal"
        },
        {
          icon: ArrowDownLeft,
          title: "Deposit",
          description: "Add funds to your account",
          href: "/deposit"
        }
      ] as SettingItem[]
    },
    {
      title: "Support",
      items: [
        {
          icon: MessageCircle,
          title: "Live Chat",
          description: "Chat with our support team",
          href: "/chat"
        },
        {
          icon: HelpCircle,
          title: "Help Center",
          description: "FAQs and support articles",
          action: () => console.log("Help")
        },
        
      ] as SettingItem[]
    }
  ];

  const SettingItemComponent = ({ item }: { item: SettingItem }) => {
    const content = (
      <Card className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300 hover:border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );

    if (item.href) {
      return (
        <Link to={item.href} className="block">
          {content}
        </Link>
      );
    }

    return (
      <button 
        onClick={item.action} 
        className="block w-full text-left"
      >
        {content}
      </button>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and preferences
        </p>
      </div>

      <div className="space-y-8">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              {group.title}
            </h2>
            <div className="space-y-3">
              {group.items.map((item) => (
                <SettingItemComponent key={item.title} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;