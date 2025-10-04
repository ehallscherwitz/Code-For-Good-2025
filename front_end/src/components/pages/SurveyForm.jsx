import React, { useState } from 'react';
import formBackground from '../../assets/form_background_img.jpg';

const SurveyForm = () => {
  const [accountType, setAccountType] = useState('');

  const renderFamilyForm = () => (
    <div>
      <h3 style={{ color: 'rgba(255, 255, 255, 0.95)', marginBottom: '25px', fontSize: '1.5rem', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>Family Account Information</h3>
      
      {/* Parent Information */}
      <div style={{ marginBottom: '25px' }}>
        <h4 style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '15px', fontSize: '1.2rem', fontWeight: '600' }}>Parent Information</h4>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Parent Name *</label>
          <input 
            type="text" 
            name="parentName"
            placeholder="John Doe"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ccc', 
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '1rem'
            }} 
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Parent Phone Number *</label>
          <input 
            type="tel" 
            name="parentPhone"
            placeholder="(555) 123-4567"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ccc', 
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '1rem'
            }} 
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Parent Email *</label>
          <input 
            type="email" 
            name="parentEmail"
            placeholder="parent@example.com"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ccc', 
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '1rem'
            }} 
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Zip Code *</label>
          <input 
            type="text" 
            name="zipCode"
            placeholder="12345"
            maxLength="5"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ccc', 
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '1rem'
            }} 
          />
        </div>
      </div>

      {/* Child Information */}
      <div style={{ marginBottom: '25px' }}>
        <h4 style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '15px', fontSize: '1.2rem', fontWeight: '600' }}>Child Information</h4>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem', placeholder: 'John Jr' }}>Child Name *</label>
          <input 
            type="text" 
            name="childName"
            placeholder="John Jr"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ccc', 
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '1rem'
            }} 
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Child Date of Birth *</label>
          <input 
            type="date" 
            name="childDateOfBirth"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ccc', 
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '1rem'
            }} 
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Child Gender *</label>
          <select 
            name="childGender"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ccc', 
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '1rem'
            }}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Child Sport/Activity *</label>
          <input 
            type="text" 
            name="childSport"
            placeholder="e.g., Basketball, Soccer, Swimming"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ccc', 
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '1rem'
            }} 
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Child Condition/Medical Information</label>
          <textarea 
            name="childCondition"
            placeholder="Please describe any medical conditions, special needs, or accommodations needed..."
            rows="3"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ccc', 
              borderRadius: '8px',
              backgroundColor: 'white',
              color: '#333',
              fontSize: '1rem',
              resize: 'vertical'
            }}
          />
        </div>
      </div>
    </div>
  );

  const renderAthleteForm = () => (
    <div>
      <h3 style={{ color: 'rgba(255, 255, 255, 0.95)', marginBottom: '25px', fontSize: '1.5rem', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>Athlete Account Information</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Name *</label>
        <input 
          type="text" 
          name="athleteName"
          placeholder="John Doe"
          style={{ 
            width: '100%', 
            padding: '12px', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            backgroundColor: 'white',
            color: '#333',
            fontSize: '1rem'
          }} 
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Email *</label>
        <input 
          type="email" 
          name="athleteEmail"
          placeholder="athlete@example.com"
          style={{ 
            width: '100%', 
            padding: '12px', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            backgroundColor: 'white',
            color: '#333',
            fontSize: '1rem'
          }} 
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Phone Number *</label>
        <input 
          type="tel" 
          name="athletePhone"
          placeholder="(555) 123-4567"
          style={{ 
            width: '100%', 
            padding: '12px', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            backgroundColor: 'white',
            color: '#333',
            fontSize: '1rem'
          }} 
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Location *</label>
        <input 
          type="text" 
          name="athleteLocation"
          placeholder="City, State"
          style={{ 
            width: '100%', 
            padding: '12px', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            backgroundColor: 'white',
            color: '#333',
            fontSize: '1rem'
          }} 
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Sport/Activity *</label>
        <input 
          type="text" 
          name="athleteSport"
          placeholder="e.g., Basketball, Soccer, Swimming"
          style={{ 
            width: '100%', 
            padding: '12px', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            backgroundColor: 'white',
            color: '#333',
            fontSize: '1rem'
          }} 
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Graduation Date *</label>
        <input 
          type="date" 
          name="athleteGraduationDate"
          style={{ 
            width: '100%', 
            padding: '12px', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            backgroundColor: 'white',
            color: '#333',
            fontSize: '1rem'
          }} 
        />
      </div>
    </div>
  );

  const renderCoachForm = () => (
    <div>
      <h3 style={{ color: 'rgba(255, 255, 255, 0.95)', marginBottom: '25px', fontSize: '1.5rem', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>Coach Account Information</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Name *</label>
        <input 
          type="text" 
          name="coachName"
          placeholder="John Doe"
          style={{ 
            width: '100%', 
            padding: '12px', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            backgroundColor: 'white',
            color: '#333',
            fontSize: '1rem'
          }} 
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Email *</label>
        <input 
          type="email" 
          name="coachEmail"
          placeholder="coach@example.com"
          style={{ 
            width: '100%', 
            padding: '12px', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            backgroundColor: 'white',
            color: '#333',
            fontSize: '1rem'
          }} 
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>Phone Number *</label>
        <input 
          type="tel" 
          name="coachPhone"
          placeholder="(555) 123-4567"
          style={{ 
            width: '100%', 
            padding: '12px', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            backgroundColor: 'white',
            color: '#333',
            fontSize: '1rem'
          }} 
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: 'rgba(255, 255, 255, 0.95)', fontSize: '1rem' }}>School Name *</label>
        <input 
          type="text" 
          name="coachSchool"
          placeholder="University of Example"
          style={{ 
            width: '100%', 
            padding: '12px', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            backgroundColor: 'white',
            color: '#333',
            fontSize: '1rem'
          }} 
        />
      </div>
    </div>
  );

  return (
    /* 
    <div style={{ 
      minHeight: '100vh',
      width: '100vw',
      backgroundImage: `url(${formBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'fixed',
      top: 0,
      left: 0,
      padding: '40px 0',
      margin: 0,
      boxSizing: 'border-box',
      overflowY: 'auto',

    }}>
      */
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      maxWidth: '1400px',
      backgroundImage: `url(${formBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
         /* drop backgroundAttachment (mobile bug bait) */
      position: 'relative',
      padding: '40px 0',
      margin: 0,
      boxSizing: 'border-box'
      }}>      {/* Blur overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backdropFilter: 'blur(5px)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1
      }}></div>
      
      {/* Content */}
      <div style={{ 
        position: 'relative', 
        zIndex: 2,
        padding: '0 20px',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#ffffff', 
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
          fontWeight: '700',
          marginBottom: '15px',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          letterSpacing: '0.5px'
        }}>
          Team IMPACT Survey Form
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: 'rgba(255, 255, 255, 0.9)', 
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          marginBottom: '40px',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          fontWeight: '300'
        }}>
          Please fill out the survey below to help us better serve you.
        </p>
        
        <div style={{
          width: '100%',
          //maxWidth: '1200px',
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
          boxSizing: 'border-box'
        }}>
          <form>
            <div style={{ marginBottom: '30px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '25px', 
                fontWeight: '600', 
                fontSize: '1.4rem',
                color: '#ffffff',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                letterSpacing: '0.3px',
                textAlign: 'center'
              }}>
                Select Type of Account
              </label>
              
              {/* Modern Card-based Account Type Selector */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                marginBottom: '20px',
                maxWidth: '800px',
                margin: '0 auto 20px auto'
              }}>
                {/* Family Account Card */}
                <div 
                  onClick={() => setAccountType('family')}
                  style={{
                    background: accountType === 'family' 
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: accountType === 'family' 
                      ? '2px solid rgba(102, 126, 234, 0.8)'
                      : '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '18px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: accountType === 'family' 
                      ? '0 8px 32px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      : '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    transform: accountType === 'family' ? 'translateY(-2px)' : 'translateY(0)'
                  }}
                  onMouseEnter={(e) => {
                    if (accountType !== 'family' && e.target === e.currentTarget) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (accountType !== 'family' && e.target === e.currentTarget) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                    }
                  }}
                >
                  {/* Selection indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: accountType === 'family' 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    {accountType === 'family' && (
                      <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                    )}
                  </div>
                  
                  {/* Icon */}
                  <div style={{
                    fontSize: '2rem',
                    marginBottom: '10px',
                    textAlign: 'center',
                    color: accountType === 'family' ? '#667eea' : 'rgba(255, 255, 255, 0.8)',
                    transition: 'color 0.3s ease'
                  }}>
                    👨‍👩‍👧‍👦
                  </div>
                  
                  {/* Title */}
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '6px',
                    textAlign: 'center',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}>
                    Family Account
                  </h3>
                  
                  {/* Description */}
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    lineHeight: '1.3',
                    margin: 0
                  }}>
                    For parents managing their child's sports activities
                  </p>
                </div>

                {/* Athlete Account Card */}
                <div 
                  onClick={() => setAccountType('athlete')}
                  style={{
                    background: accountType === 'athlete' 
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: accountType === 'athlete' 
                      ? '2px solid rgba(102, 126, 234, 0.8)'
                      : '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '18px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: accountType === 'athlete' 
                      ? '0 8px 32px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      : '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    transform: accountType === 'athlete' ? 'translateY(-2px)' : 'translateY(0)'
                  }}
                  onMouseEnter={(e) => {
                    if (accountType !== 'athlete' && e.target === e.currentTarget) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (accountType !== 'athlete' && e.target === e.currentTarget) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                    }
                  }}
                >
                  {/* Selection indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: accountType === 'athlete' 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    {accountType === 'athlete' && (
                      <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                    )}
                  </div>
                  
                  {/* Icon */}
                  <div style={{
                    fontSize: '2.5rem',
                    marginBottom: '15px',
                    textAlign: 'center',
                    color: accountType === 'athlete' ? '#667eea' : 'rgba(255, 255, 255, 0.8)',
                    transition: 'color 0.3s ease'
                  }}>
                    🏃‍♂️
                  </div>
                  
                  {/* Title */}
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '6px',
                    textAlign: 'center',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}>
                    Athlete Account
                  </h3>
                  
                  {/* Description */}
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    lineHeight: '1.3',
                    margin: 0
                  }}>
                    For student-athletes managing their sports journey
                  </p>
                </div>

                {/* Coach Account Card */}
                <div 
                  onClick={() => setAccountType('coach')}
                  style={{
                    background: accountType === 'coach' 
                      ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)'
                      : 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: accountType === 'coach' 
                      ? '2px solid rgba(102, 126, 234, 0.8)'
                      : '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '18px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: accountType === 'coach' 
                      ? '0 8px 32px rgba(102, 126, 234, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                      : '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    transform: accountType === 'coach' ? 'translateY(-2px)' : 'translateY(0)'
                  }}
                  onMouseEnter={(e) => {
                    if (accountType !== 'coach' && e.target === e.currentTarget) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (accountType !== 'coach' && e.target === e.currentTarget) {
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                    }
                  }}
                >
                  {/* Selection indicator */}
                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: accountType === 'coach' 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    border: '2px solid rgba(255, 255, 255, 0.3)'
                  }}>
                    {accountType === 'coach' && (
                      <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                    )}
                  </div>
                  
                  {/* Icon */}
                  <div style={{
                    fontSize: '2.5rem',
                    marginBottom: '15px',
                    textAlign: 'center',
                    color: accountType === 'coach' ? '#667eea' : 'rgba(255, 255, 255, 0.8)',
                    transition: 'color 0.3s ease'
                  }}>
                    🏆
                  </div>
                  
                  {/* Title */}
                  <h3 style={{
                    color: '#ffffff',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginBottom: '6px',
                    textAlign: 'center',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}>
                    Coach Account
                  </h3>
                  
                  {/* Description */}
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    lineHeight: '1.3',
                    margin: 0
                  }}>
                    For coaches and sports program administrators
                  </p>
                </div>
              </div>
            </div>

            {accountType === 'family' && renderFamilyForm()}
            {accountType === 'athlete' && renderAthleteForm()}
            {accountType === 'coach' && renderCoachForm()}

            {accountType && (
              <button 
                type="submit" 
                style={{ 
                  padding: '18px 30px', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  marginTop: '30px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  width: '100%',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                }}
              >
                Submit Survey
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;
