import React, { useState, useRef } from 'react';
import { X, Upload, User, Mail, Lock, DollarSign, Hash, Camera, Phone, Locate } from 'lucide-react';
import { toast } from 'sonner';
import { COLLECTION_ID_STORAGE, DATABASE_ID, databases, ID, storage } from '@/lib/appwrite/appWriteConfig';
import { useUserContext } from '@/context/AuthProvider';
import { useUpdateUser } from '@/lib/query/api';

export default function UserDialogPreview({ setOpen}:{ setOpen:(p:boolean)=> void}) {
  const [formData, setFormData] = useState({
    user_name: 'john_doe',
    email: 'john.doe@example.com',
    phone: '',
    address: '',
  
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false)

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate form submission
    setTimeout(() => {
      setIsProcessing(false);
      alert('User saved successfully!');
    }, 2000);
  };

  const { user } = useUserContext()
  const { mutateAsync: updateUser, isPending:isUploading } = useUpdateUser()
  //const { data } = useCurrentUser()
  
// ============================== UPLOAD FILE
async function createPost() {
  try {

   const   data = {
    userId:user?.$id,
    formData
   }
  
   const updatrInfo = await updateUser(data)

   if (!updatrInfo) return toast.error('failed to update profile picture');

  } catch (error) {
    console.log(error);
  }
}

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      {/* Dialog */}
      <div className="bg-transparent rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ">
        {/* Header */}
        <div className="flex items-center justify-between p-6  ">
          <div>
            <h2 className="text-xl font-bold text-white">Edit User Profile</h2>
            <p className="text-sm text-gray-400 mt-1">Update user information and preferences</p>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-700 rounded-full">
            <X onClick={() => setOpen(false)} size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <div className="space-y-6">
           
            {/* Form Fields */}
            <div className="grid grid-cols-1  gap-6">
              {/* Username */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-300">
                  <User size={16} className="mr-2 text-blue-400" />
                  Username
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="user_name"
                  value={formData.user_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-500 placeholder-gray-400"
                  placeholder="Enter username"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-300">
                  <Mail size={16} className="mr-2 text-blue-400" />
                  Email Address
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-500 placeholder-gray-400"
                  placeholder="Enter email address"
                />
              </div>

              {/* phone */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-300">
                  <Phone size={16} className="mr-2 text-blue-400" />
                  phone
                  <span className="text-xs text-gray-500 ml-2">(leave empty to keep current)</span>
                </label>
                <input
                  type="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-500 placeholder-gray-400"
                  placeholder="Enter new phone"
                />
              </div>

              {/* address */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-300">
                  <Locate size={16} className="mr-2 text-blue-400" />
                  Security address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-500 placeholder-gray-400"
                  placeholder="Enter security address"
                />
              </div>

         

            </div>


            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
             
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isProcessing}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-blue-500/50 disabled:to-indigo-600/50 text-white rounded-lg transition-all hover:shadow-lg disabled:cursor-not-allowed font-medium flex items-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}