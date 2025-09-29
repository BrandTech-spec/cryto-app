import { Camera, Edit, Mail, Phone, MapPin, Calendar, Shield, Verified, User, Upload, Check, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import UserDialogPreview from "@/components/UpdateProfile";
import { useRef, useState } from "react";
import { COLLECTION_ID_STORAGE, ID, storage } from "@/lib/appwrite/appWriteConfig";
import { useCurrentUser, useUpdateUser } from "@/lib/query/api";
import { useUserContext } from "@/context/AuthProvider";
import { toast } from "sonner";



const Profile = () => {

  const [formData, setFormData] = useState({
    user_name: 'john_doe',
    email: 'john.doe@example.com',
    phone: '',
    address: '',
    image_url: null
  });
  const [copied, setCopied] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useUserContext()
  const { mutateAsync: updateUser, isPending:isUploading } = useUpdateUser()
  const { data } = useCurrentUser()

  const userStats = [
    { label: "Account Balance", value: data?.available_balance },
    { label: "Total Trades", value: "0" },
  ];

  const copyAddress = () => {
    navigator.clipboard.writeText(data?.passcode);
    setCopied(true);
    toast.success("Referal copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = () => {
    if (selectedImage) {
      setIsUploading(true);
      // Simulate upload
      setTimeout(() => {
        setIsUploading(false);
        setFormData(prev => ({ ...prev, image_url: imagePreview }));
        setSelectedImage(null);
      }, 2000);
    }
  };

  async function uploadFile(file: File) {
    try {
      const uploadedFile = await storage.createFile(
        COLLECTION_ID_STORAGE,
        ID.unique(),
        file
      );

      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
  }

  // ============================== GET FILE URL
  function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        COLLECTION_ID_STORAGE,
        fileId,
        2000,
        2000,
        "top",
        100
      );

      if (!fileUrl) throw Error;

      return fileUrl;
    } catch (error) {
      console.log(error);
    }
  }

  // ============================== DELETE FILE
  async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(COLLECTION_ID_STORAGE, fileId);

      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
  }


  // Handle form submission
  // ============================== CREATE POST
  async function createPost() {
    try {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(imagePreview);

      if (!uploadedFile) return toast.error('failed to upload file please try again');

      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        return toast.error('failed to get preview please try again');
      }

      const formData = {
        userId:user?.$id,
        payload:{
            avatar:fileUrl
        }
      }

     const updatrInfo = await updateUser(formData)

     if (!updatrInfo) return toast.error('failed to update profile picture');

    } catch (error) {
      console.log(error);
    }
  }


  const invitationCode = "CRYPTO2024XYZ";

  const date = formatIsoDate(user?.$createdAt)
  const ChangeUserInfo = () => {
    const [open, setOpen] = useState(false)
    return (
      <AlertDialog open={open} onOpenChange={setOpen} >
        <AlertDialogTrigger>
          <Button variant="outline" className="w-full sm:w-auto">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>

          <UserDialogPreview setOpen={setOpen} />


        </AlertDialogContent>
      </AlertDialog>
    )
  }

  function formatIsoDate(isoString: string): string {
    const date = new Date(isoString);
  
   
  
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="container bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Profile
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your account information
        </p>
      </div>

      {/* Profile Header */}
      <Card className="bg-slate-800 border border-border/50 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="flex flex-col items-center space-y-4 py-4">
              <div className="relative group">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="User preview"
                    className="w-28 h-28 rounded-full object-cover border-4 border-gray-600 shadow-lg ring-2 ring-blue-500/30"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center border-4 border-gray-600 shadow-lg">
                    <User size={40} className="text-gray-400" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all hover:scale-105 group-hover:shadow-xl"
                >
                  <Camera size={18} />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {selectedImage && (
                <button
                  type="button"
                  onClick={createPost}
                  disabled={isUploading}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-500/50 text-white rounded-full transition-all hover:shadow-md disabled:cursor-not-allowed"
                >
                  <Upload size={16} />
                  <span>{isUploading ? 'Uploading...' : 'Upload New Image'}</span>
                </button>
              )}

              {isUploading && (
                <div className="w-full max-w-xs bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                <h2 className="text-2xl font-bold text-foreground">{data?.user_name}</h2>
                <Badge className="bg-crypto-green/10 text-crypto-green">
                  <Verified className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-muted-foreground mb-3">Premium Member since { date }</p>
              < ChangeUserInfo />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {userStats.map((stat, index) => (
          <Card key={index} className="bg-slate-800 border border-border/50">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Personal Information */}
      <Card className="bg-slate-800 border border-border/50 mb-6">
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
                <span className="text-foreground">{data?.email}</span>
                <Badge className="bg-crypto-green/10 text-crypto-green text-xs">
                  Verified
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Phone</label>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{data?.phone || "unset"}</span>
                {/*<Badge className="bg-crypto-green/10 text-crypto-green text-xs">
                  Verified
                </Badge>*/}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Location</label>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{data?.address || 'unset'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Member Since</label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{ date }</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invitation Code */}
      <Card className="bg-slate-800 border border-border/50 mb-6">
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
              <p className="text-lg font-mono font-bold text-foreground">{data?.passcode}</p>
            </div>
            <Button
              onClick={copyAddress}
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-crypto-green" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default Profile;