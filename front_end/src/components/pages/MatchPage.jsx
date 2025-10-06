import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Trophy, 
  Star, 
  Sparkles,
  Circle,
  GraduationCap,
  Users,
  MessageCircle
} from 'lucide-react';
import athleteHeadshot from '../../assets/athlete-headshot.jpg';

const MatchPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showMatch, setShowMatch] = useState(false);

  useEffect(() => {
    // Show loading for 4 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setShowMatch(true), 500);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          {/* Simple matching text */}
          <div className="mb-8">
            <div className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-[#1d3e7b] bg-clip-text text-transparent mb-4">
              Finding Your Buddy
            </div>
            <div className="text-xl text-gray-600">
              Analyzing preferences and compatibility...
            </div>
          </div>

          {/* Simple circle */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
              <Circle className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* Simple loading text */}
          <div className="text-sm text-gray-500 mt-2">Almost there...</div>
        </div>
      </div>
    );
  }

  if (!showMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600 mb-4 animate-pulse">
            🎉 Match Found!
          </div>
          <div className="text-lg text-gray-600">
            Preparing your perfect match...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-[#1d3e7b] bg-clip-text text-transparent mb-2">
            Your New Buddy
          </h1>
        </div>

        {/* Match Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-gradient-to-r from-blue-200 to-purple-200">
          {/* Card Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-[#1d3e7b] p-6 text-white relative">
            <div className="absolute top-4 right-4">
              <div className="bg-white/20 rounded-full p-2">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">🏀 Basketball Athlete</div>
              <div className="text-lg opacity-90">The University of Texas at Dallas</div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-48 h-48 rounded-full overflow-hidden shadow-xl border-8 border-white">
                  <img 
                    src={athleteHeadshot} 
                    alt="Marcus Johnson - Basketball Player"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-center text-white" style={{display: 'none'}}>
                    <div>
                      <Circle className="w-20 h-20 mx-auto mb-2" />
                      <div className="text-sm font-semibold">Basketball Player</div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-2 -left-2 bg-yellow-400 rounded-full p-3">
                  <Trophy className="w-6 h-6 text-yellow-800" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-400 rounded-full p-3">
                  <Star className="w-6 h-6 text-green-800 fill-current" />
                </div>
              </div>

              {/* Profile Details */}
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Marcus Johnson</h2>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="w-5 h-5 mr-2 text-red-500" />
                    <span className="text-lg">The University of Texas at Dallas, TX</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <GraduationCap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-800">2025</div>
                    <div className="text-sm text-blue-600">Graduation Year</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-800">3rd</div>
                    <div className="text-sm text-purple-600">Year Student</div>
                  </div>
                </div>

                {/* Interests */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-500" />
                    Shared Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['Basketball', 'Community Service', 'Mentoring', 'Sports', 'Teamwork'].map((interest, index) => (
                      <span key={index} className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-sm">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center">
                  <button className="bg-gradient-to-r from-blue-600 to-[#1d3e7b] text-white py-3 px-8 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Matched on {new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500 fill-current" />
                <span>95% Compatibility</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchPage;
