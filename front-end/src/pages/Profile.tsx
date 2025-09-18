import { Camera, Edit, Mail, Phone, MapPin, Calendar, Shield, Verified } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const userStats = [
    { label: "Account Balance", value: "$12,543.67", change: "+5.2%" },
    { label: "Total Trades", value: "127", change: "+12 this month" },
    { label: "Verification Level", value: "Level 3", change: "Verified" }
  ];

  const invitationCode = "CRYPTO2024XYZ";

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account information
        </p>
      </div>

      {/* Profile Header */}
      <Card className="bg-gradient-card border-border/50 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                <AvatarFallback className="text-xl bg-primary/10 text-primary">
                  JD
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-primary hover:bg-primary/90"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                <h2 className="text-2xl font-bold text-foreground">John Doe</h2>
                <Badge className="bg-crypto-green/10 text-crypto-green">
                  <Verified className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-muted-foreground mb-3">Premium Member since 2023</p>
              <Button variant="outline" className="w-full sm:w-auto">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {userStats.map((stat, index) => (
          <Card key={index} className="bg-gradient-card border-border/50">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-crypto-green">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Personal Information */}
      <Card className="bg-gradient-card border-border/50 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">john.doe@example.com</span>
                <Badge className="bg-crypto-green/10 text-crypto-green text-xs">
                  Verified
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">+1 (555) 123-4567</span>
                <Badge className="bg-crypto-green/10 text-crypto-green text-xs">
                  Verified
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Location</label>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">New York, USA</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">March 15, 2023</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invitation Code */}
      <Card className="bg-gradient-card border-border/50 mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Invitation Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your referral code</p>
              <p className="text-lg font-mono font-bold text-foreground">{invitationCode}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(invitationCode);
              }}
            >
              Copy Code
            </Button>
          </div>
        </CardContent>
      </Card>
     
    </div>
  );
};

export default Profile;