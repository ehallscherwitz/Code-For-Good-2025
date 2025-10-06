# Team 24
# Team IMPACT - Empowering all kids and teams to bond, grow, and win — together.

## Overview

Team IMPACT is a comprehensive web application designed to connect children with serious illnesses and disabilities with college athletes, creating meaningful relationships and lasting friendships. The platform serves as a digital hub for managing the entire Team IMPACT ecosystem, from initial family registration to event coordination and memory sharing.

## Where we Fit

Team IMPACT has an established working model that successfully connects children with serious illnesses and disabilities to college athletic teams, creating meaningful relationships and lasting friendships. However, the organization faces several operational challenges that impact their ability to scale and maintain engagement:

### Current Pain Points

**Manual Matching Process**: The organization currently relies on manual processes to match each child with appropriate college athletes and teams. Whlie this works, this time-intensive approach requires staff resources and this time could be reallocated elsewhere and also lead to suboptimal matches based on limited information processing capacity 

**Inactivity and Retention Issues**: Maintaining long-term engagement between families and athletes proves challenging, with many relationships losing momentum over time. The lack of interactive features and ongoing connection opportunities leads to decreased participation and retention rates.

**Communication Limitations**: A major operational challenge is Team IMPACT's heavy reliance on email communication for coordinating between families, athletes, and staff. This creates bottlenecks in information flow, delayed responses, and fragmented communication threads that can impact the quality and timeliness of support. While we attempted to implement a Twilio API-based messaging system to address this issue, the verification process required several days and could not be completed within our development timeline. However, this represents a critical future enhancement that would significantly improve real-time communication and coordination across the platform.

### Our Solution

**AI-Powered Matching**: We leverage Google Gemini AI to automate and optimize the matching process. The system analyzes comprehensive family data, child preferences, medical conditions, location, and sport interests to provide intelligent recommendations for the best school and team matches. This eliminates manual guesswork and ensures more compatible, successful pairings.

**Interactive Engagement Features**: To address retention challenges, we've implemented dynamic features including:
- **Digital Scrapbook**: A photo-sharing platform where families and athletes can upload and organize memories, creating a lasting digital record of their journey together
- **Picture Carousels**: Interactive dashboards that showcase recent activities, achievements, and shared moments, keeping the community engaged and connected
- **Event Management**: Streamlined event creation and participation tracking to maintain regular interaction opportunities
- **Alumni Network**: Long-term relationship maintenance that extends beyond graduation

These innovations transform Team IMPACT from a manual, resource-intensive operation into an efficient, scalable platform that maximizes successful matches while maintaining high engagement levels throughout the entire relationship lifecycle.

## Key Features

### 🏠 **Child Management**
- Comprehensive child/family registration and survey system
- Child information tracking (medical conditions, interests, sports preferences)
- Location-based matching with nearby schools and teams
- AI-powered school recommendations using Google Gemini

### 🏃‍♂️ **Athlete & Team Management**
- Athlete profile creation and management
- Team organization and sport categorization
- Graduation tracking and alumni promotion
- Performance and participation analytics

### 🏫 **School & Institution Management**
- School database with location and contact information
- Team registration and management
- Coach contact information and assignment
- Institution-specific event coordination

### 📅 **Event Management**
- Event creation and scheduling
- Family and athlete event participation tracking
- Event status management (upcoming, completed, cancelled)
- Location and time coordination

### 📸 **Digital Scrapbook**
- Photo upload and sharing system
- Memory preservation and organization
- Community-driven content curation
- Fallback placeholder system for failed uploads

### 🔗 **Connection & Networking**
- Alumni network maintenance
- Family-athlete relationship tracking
- Community building features
- Communication facilitation

## Technical Architecture

### Frontend (React + Vite)
- **Framework**: React 19.1.1 with React Router for navigation
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Supabase Auth with Google OAuth integration
- **State Management**: React Context API for authentication state
- **UI Components**: Custom components with Lucide React icons

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express.js framework
- **Database**: Supabase with real-time capabilities and storage features
- **Authentication**: Supabase Auth middleware
- **AI Integration**: Google Gemini API for intelligent recommendations
- **Security**: Helmet.js for security headers, CORS configuration
- **Logging**: Morgan for request logging

### Database Schema
The application uses a comprehensive schema with the following main entities:

- **SCHOOL**: Educational institutions with location data
- **COACH**: Athletic coaches with contact information
- **TEAM**: Athletic teams linked to schools and coaches
- **ATHLETE**: Student-athletes with graduation tracking
- **FAMILY**: Parent/guardian information with child details
- **ALUMNI**: Former participants maintaining community connections
- **EVENT**: Community events with participant tracking

## How It Works

### 1. **User Onboarding**
- Users authenticate via Google OAuth through Supabase
- Role-based survey system determines user type (family, athlete, coach)
- Comprehensive data collection through structured forms

### 2. **AI-Powered Matching**
- Google Gemini AI analyzes family preferences and child information
- Location-based filtering for optimal school recommendations
- Sport interest matching for team selection
- Safety and compatibility considerations (medical conditions, allergies)

### 3. **Event Coordination**
- Event creation with participant targeting
- Automated notifications and reminders
- Attendance tracking and follow-up
- Photo and memory collection

### 4. **Community Building**
- Digital scrapbook for memory sharing
- Alumni network maintenance
- Connection facilitation between families and athletes
- Long-term relationship tracking

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Supabase account and project
- Google OAuth credentials
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Team-24
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../front_end
   npm install
   ```

4. **Environment Setup**
   - Create `.env` file in backend directory with:
     ```
     SUPABASE_URL=your_supabase_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
     GEMINI_API_KEY=your_gemini_api_key
     PORT=5000
     ```
   - Create `.env` file in front_end directory with:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     VITE_API_BASE=http://localhost:5000
     ```

5. **Database Setup**
   - Run the SQL schema from `backend/database/schema.sql` in your Supabase project
   - Set up Supabase Storage bucket for scrapbook images

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd front_end
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## API Endpoints

The backend provides a comprehensive REST API:

- **Authentication**: `/api/auth/*`
- **Surveys**: `/api/surveys/*`
- **Schools**: `/api/schools/*`
- **Teams**: `/api/teams/*`
- **Athletes**: `/api/athletes/*`
- **Families**: `/api/families/*`
- **Alumni**: `/api/alumni/*`
- **Events**: `/api/events/*`
- **AI Recommendations**: `/api/gemini/*`

## Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **AI/ML**: Google Gemini API
- **Storage**: Supabase Storage
- **Deployment**: Vercel/Netlify (frontend), Railway/Heroku (backend)

## Contributing

This project was developed as part of JPM Code for Good hackathon for the nonprofit Team IMPACT. The codebase is organized with clear separation between frontend and backend concerns, making it easy to extend and maintain.

## License

This project is developed for Team IMPACT, a non-profit organization dedicated to improving the quality of life for children facing serious illnesses and disabilities through the power of team.

---

*Built to connect kids with college athletes to inspire, empower, and build lasting friendships.*
