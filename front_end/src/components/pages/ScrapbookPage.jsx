import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Camera, 
  Upload, 
  Heart, 
  Trophy, 
  Star, 
  Sparkles,
  Image as ImageIcon,
  RefreshCw,
  Plus
} from 'lucide-react';

const ScrapbookPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    fetchRandomImages();
  }, []);

  const fetchRandomImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('scrapbook_images')
        .select('*')
        .order('uploaded_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Shuffle and take 5 random images
      const shuffled = data.sort(() => 0.5 - Math.random());
      const randomImages = shuffled.slice(0, 5);
      setImages(randomImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadMessage('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadMessage('File size must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setUploadMessage('');

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('scrapbook-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('scrapbook-images')
        .getPublicUrl(filePath);

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('scrapbook_images')
        .insert({
          file_name: fileName,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          description: `Uploaded by ${new Date().toLocaleDateString()}`
        });

      if (dbError) throw dbError;

      setUploadMessage('Image uploaded successfully! 🎉');
      setTimeout(() => {
        setUploadMessage('');
        fetchRandomImages(); // Refresh the scrapbook
      }, 2000);

    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadMessage('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const ImageCard = ({ image, index }) => {
    const getImageUrl = () => {
      return supabase.storage
        .from('scrapbook-images')
        .getPublicUrl(image.file_path).data.publicUrl;
    };

    const rotations = ['rotate-1', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-3'];
    const colors = ['bg-pink-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100', 'bg-purple-100'];
    const rotation = rotations[index % rotations.length];
    const color = colors[index % colors.length];

    return (
      <div className={`relative group ${rotation} hover:scale-105 transition-transform duration-300`}>
        <div className={`${color} p-4 rounded-2xl shadow-lg border-4 border-white`}>
          <div className="relative">
            <img
              src={getImageUrl()}
              alt="Scrapbook memory"
              className="w-full h-48 object-cover rounded-xl shadow-md"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
              }}
            />
            <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1">
              <Heart className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600 font-medium">
              {image.description || 'Team IMPACT Memory'}
            </p>
            <div className="flex justify-center mt-2 space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-2 -left-2 bg-yellow-200 rounded-full p-2">
          <Trophy className="w-4 h-4 text-yellow-600" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-pink-200 rounded-full p-2">
          <Sparkles className="w-4 h-4 text-pink-600" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-pink-400 to-blue-400 rounded-full p-3 mr-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                Team IMPACT Scrapbook
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              📸 Capture precious moments and memories that connect our kids with their amazing athletes! 
              Every photo tells a story of friendship, teamwork, and joy.
            </p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Plus className="w-6 h-6 mr-2 text-green-500" />
              Share a Memory
            </h2>
            <p className="text-gray-600 mb-6">
              Upload a photo to add to our shared scrapbook! Let's create beautiful memories together.
            </p>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`inline-flex items-center px-8 py-4 rounded-full text-white font-semibold shadow-lg transition-all duration-300 ${
                  uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 hover:shadow-xl hover:scale-105'
                }`}
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Choose Photo
                  </>
                )}
              </label>
            </div>
            
            {uploadMessage && (
              <div className={`mt-4 p-3 rounded-lg ${
                uploadMessage.includes('successfully') 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {uploadMessage}
              </div>
            )}
          </div>
        </div>

        {/* Scrapbook Grid */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 mr-3 text-purple-500" />
              Our Shared Memories
            </h2>
            <p className="text-gray-600">
              Here are some of our favorite moments together! 💕
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="w-12 h-12 text-pink-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading precious memories...</p>
              </div>
            </div>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {images.map((image, index) => (
                <ImageCard key={image.id} image={image} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <Camera className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No memories yet</h3>
              <p className="text-gray-500 mb-6">
                Be the first to share a precious moment! Upload a photo to start our scrapbook.
              </p>
              <button
                onClick={() => document.getElementById('image-upload').click()}
                className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-blue-600 transition-all duration-300"
              >
                <Upload className="w-5 h-5 mr-2 inline" />
                Upload First Photo
              </button>
            </div>
          )}

          {/* Refresh Button */}
          {images.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={fetchRandomImages}
                className="bg-white/60 hover:bg-white/80 text-gray-700 px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <RefreshCw className="w-5 h-5 mr-2 inline" />
                Show Different Memories
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-20 left-10 opacity-20">
        <Trophy className="w-16 h-16 text-yellow-400" />
      </div>
      <div className="fixed top-40 right-20 opacity-20">
        <Star className="w-12 h-12 text-pink-400 fill-current" />
      </div>
      <div className="fixed bottom-20 left-20 opacity-20">
        <Heart className="w-14 h-14 text-red-400" />
      </div>
      <div className="fixed bottom-40 right-10 opacity-20">
        <Sparkles className="w-10 h-10 text-purple-400" />
      </div>
    </div>
  );
};

export default ScrapbookPage;
