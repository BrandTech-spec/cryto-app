import React, { useState, useRef } from 'react';
import { X, Upload, User, Mail, Lock, DollarSign, Hash, Camera, Phone, Locate } from 'lucide-react';

export default function UserDialogPreview({ setOpen}:{ setOpen:(p:boolean)=> void}) {
  const [formData, setFormData] = useState({
    user_name: 'john_doe',
    email: 'john.doe@example.com',
    phone: '',
    address: '',
    image_url: null
  });
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);


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
            {/* Image Upload Section */}
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
                  onClick={handleImageUpload}
                  disabled={isUploading}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-500/50 text-white rounded-full transition-all hover:shadow-md disabled:cursor-not-allowed"
                >
                  <Upload size={16} />
                  <span>{isUploading ? 'Uploading...' : 'Upload New Image'}</span>
                </button>
              )}

              {isUploading && (
                <div className="w-full max-w-xs bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
                </div>
              )}
            </div>

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