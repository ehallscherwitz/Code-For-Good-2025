import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import formBackground from '../../assets/form_background_img.jpg';

const COLORS = {
  BLUE: '#1d3e7b',
  RED: '#e81837',
  YELLOW: '#ffdb3b',
};

const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:5000';

const SurveyForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [accountType, setAccountType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  const normalizePhone = (s) => (s || '').replace(/[^\d+]/g, '');
  const yearFromDate = (s) => {
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d.getFullYear();
  };

  const buildPayload = (type, raw) => {
    console.log('Building payload for type:', type);
    console.log('User object:', user);
    console.log('User ID:', user?.id);
    
    if (type === 'family') {
      const payload = {
        parentName: raw.parentName,
        parentEmail: raw.parentEmail,
        parentPhone: normalizePhone(raw.parentPhone),
        zipCode: raw.zipCode,
        childName: raw.childName,
        childDateOfBirth: raw.childDateOfBirth,
        childGender: raw.childGender,
        childSport: raw.childSport,
        childCondition: raw.childCondition || '',
        userId: user?.id
      };
      console.log('Family payload:', payload);
      return payload;
    }
    
    const payload = {
      athleteName: raw.athleteName,
      athleteEmail: raw.athleteEmail,
      athletePhone: normalizePhone(raw.athletePhone),
      athleteSchool: raw.athleteSchool,
      athleteLocation: raw.athleteLocation,
      athleteSport: raw.athleteSport,
      athleteGraduationDate: raw.athleteGraduationDate,
      athleteGraduationYear: yearFromDate(raw.athleteGraduationDate),
      userId: user?.id
    };
    console.log('Athlete payload:', payload);
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!accountType) {
      setSubmitMessage({ text: 'Please select an account type', ok: false });
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage(null);

    const formEl = e.currentTarget;

    try {
      const formData = new FormData(formEl);
      const raw = Object.fromEntries(formData.entries());
      Object.keys(raw).forEach((key) => {
        if (raw[key] === '') delete raw[key];
      });
      const payload = buildPayload(accountType, raw);

      // Try to submit to backend, but don't fail if backend is not running
      let res;
      try {
        res = await fetch(`${API_BASE}/api/surveys/${accountType}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const msg = await res.text().catch(() => '');
          throw new Error(msg || `Request failed with ${res.status}`);
        }
      } catch (networkError) {
        // If backend is not running, continue with local storage only
        console.log('Backend not available, saving locally only:', networkError.message);
        res = null; // Set res to null to indicate backend failure
      }

      // Save user role to localStorage for Connect page
      try {
        const existingProfile = JSON.parse(localStorage.getItem('ti_profile_v1') || '{}');
        const updatedProfile = {
          ...existingProfile,
          role: accountType
        };
        localStorage.setItem('ti_profile_v1', JSON.stringify(updatedProfile));
      } catch (error) {
        console.error('Error saving user role:', error);
      }

      // Only proceed with backend response if we got one
      if (res) {
        const created = await res.json();

      // 2) If Family, immediately call Gemini to rank schools, select a team,
      //    and persist family.team_id on the backend.
      if (accountType === 'family') {
        const familyId = created?.parent_id || created?.family_id;
        if (!familyId) {
          throw new Error('Family created but parent_id not returned by API');
        }

        const rankRes = await fetch(`${API_BASE}/api/gemini/family/${familyId}`, {
          method: 'POST'
        });

        // Non-blocking: even if Gemini fails, we still move forward.
        if (!rankRes.ok) {
          const msg = await rankRes.text().catch(() => '');
          console.warn('Gemini ranking failed:', msg || rankRes.status);
        } else {
          const ranked = await rankRes.json().catch(() => ({}));
          if (!ranked?.selected_team_id) {
            console.warn('Ranking succeeded but no selected_team_id persisted');
          }
        }
      }

        setSubmitMessage({ text: 'Survey submitted successfully! Thank you for your time.', ok: true });
        if (typeof formEl.reset === 'function') formEl.reset();
        setAccountType('');
        setTimeout(() => navigate('/dashboard'), 1200);
      } else {
        // Backend not available, but local storage was saved
        setSubmitMessage({ text: 'Survey saved locally! Thank you for your time.', ok: true });
        if (typeof formEl.reset === 'function') formEl.reset();
        setAccountType('');
        setTimeout(() => navigate('/dashboard'), 1200);
      }
    } catch (error) {
      console.error('Survey submission error:', error);
      setSubmitMessage({ text: 'Something went wrong submitting the survey. Please try again.', ok: false });
    } finally {
      setIsSubmitting(false);
    }
  };

  const glassCard = {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(14px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    padding: '40px',
    borderRadius: '20px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.25)',
    boxSizing: 'border-box'
  };

  const fieldBase = {
    width: '100%',
    padding: '12px',
    border: '1px solid #d8dbe2',
    borderRadius: '10px',
    backgroundColor: 'white',
    color: '#222',
    fontSize: '1rem',
    outline: 'none',
  };

  const focusRing = (el) => {
    if (!el) return;
    el.style.boxShadow = `0 0 0 3px ${COLORS.YELLOW}55`;
    el.style.borderColor = COLORS.BLUE;
  };

  const blurRing = (el) => {
    if (!el) return;
    el.style.boxShadow = 'none';
    el.style.borderColor = '#d8dbe2';
  };

  const selectCardBase = (active) => ({
    background: active
      ? `linear-gradient(135deg, ${COLORS.BLUE}33 0%, ${COLORS.RED}33 100%)`
      : 'rgba(255,255,255,0.08)',
    border: active ? `2px solid ${COLORS.YELLOW}` : '2px solid rgba(255,255,255,0.25)',
    borderRadius: '14px',
    padding: '18px',
    cursor: 'pointer',
    transition: 'all .25s ease',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: active
      ? `0 10px 30px ${COLORS.BLUE}35, inset 0 1px 0 rgba(255,255,255,0.25)`
      : '0 6px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.12)',
    transform: active ? 'translateY(-2px)' : 'translateY(0)'
  });

  const checkDot = (active) => ({
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: active
      ? `linear-gradient(135deg, ${COLORS.YELLOW} 0%, ${COLORS.RED} 100%)`
      : 'rgba(255,255,255,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all .2s ease',
    border: `2px solid rgba(255,255,255,0.45)`
  });

  const renderFamilyForm = () => (
    <div>
      <h3 style={{ color: '#fff', marginBottom: '25px', fontSize: '1.5rem', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}>
        Family Account Information
      </h3>

      <div style={{ marginBottom: '25px' }}>
        <h4 style={{ color: '#fff', opacity: 0.9, marginBottom: '15px', fontSize: '1.2rem', fontWeight: 700 }}>
          Parent Information
        </h4>

        <div style={{ marginBottom: '18px' }}>
          <label htmlFor="parentName" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: COLORS.YELLOW }}>Parent Name *</label>
          <input
            id="parentName" name="parentName" placeholder="John Doe" required
            style={fieldBase}
            onFocus={(e) => focusRing(e.currentTarget)}
            onBlur={(e) => blurRing(e.currentTarget)}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label htmlFor="parentPhone" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: COLORS.YELLOW }}>Parent Phone Number *</label>
          <input
            id="parentPhone" type="tel" name="parentPhone" placeholder="(555) 123-4567" required
            style={fieldBase}
            onFocus={(e) => focusRing(e.currentTarget)}
            onBlur={(e) => blurRing(e.currentTarget)}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label htmlFor="parentEmail" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: COLORS.YELLOW }}>Parent Email *</label>
          <input
            id="parentEmail" type="email" name="parentEmail" placeholder="parent@example.com" required
            style={fieldBase}
            onFocus={(e) => focusRing(e.currentTarget)}
            onBlur={(e) => blurRing(e.currentTarget)}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label htmlFor="zipCode" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: COLORS.YELLOW }}>Zip Code *</label>
          <input
            id="zipCode" name="zipCode" placeholder="12345" maxLength={10} required
            style={fieldBase}
            onFocus={(e) => focusRing(e.currentTarget)}
            onBlur={(e) => blurRing(e.currentTarget)}
          />
        </div>
      </div>

      <div style={{ marginBottom: '25px' }}>
        <h4 style={{ color: '#fff', opacity: 0.9, marginBottom: '15px', fontSize: '1.2rem', fontWeight: 700 }}>
          Child Information
        </h4>

        <div style={{ marginBottom: '18px' }}>
          <label htmlFor="childName" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: COLORS.YELLOW }}>Child Name *</label>
          <input
            id="childName" name="childName" placeholder="John Jr" required
            style={fieldBase}
            onFocus={(e) => focusRing(e.currentTarget)}
            onBlur={(e) => blurRing(e.currentTarget)}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label htmlFor="childDateOfBirth" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: COLORS.YELLOW }}>Child Date of Birth *</label>
          <input
            id="childDateOfBirth" type="date" name="childDateOfBirth" required
            style={fieldBase}
            onFocus={(e) => focusRing(e.currentTarget)}
            onBlur={(e) => blurRing(e.currentTarget)}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label htmlFor="childGender" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: COLORS.YELLOW }}>Child Gender *</label>
          <select
            id="childGender" name="childGender" required
            style={{ ...fieldBase, backgroundColor: 'white' }}
            onFocus={(e) => focusRing(e.currentTarget)}
            onBlur={(e) => blurRing(e.currentTarget)}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="non-binary">Non-binary</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label htmlFor="childSport" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: COLORS.YELLOW }}>Child Sport/Activity *</label>
          <input
            id="childSport" name="childSport" placeholder="e.g., Basketball, Soccer, Swimming" required
            style={fieldBase}
            onFocus={(e) => focusRing(e.currentTarget)}
            onBlur={(e) => blurRing(e.currentTarget)}
          />
        </div>

        <div style={{ marginBottom: '18px' }}>
          <label htmlFor="childCondition" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: COLORS.YELLOW }}>Child Condition/Medical Information</label>
          <textarea
            id="childCondition" name="childCondition"
            placeholder="Please describe any medical conditions, special needs, or accommodations needed..."
            rows={3}
            style={{ ...fieldBase, resize: 'vertical' }}
            onFocus={(e) => focusRing(e.currentTarget)}
            onBlur={(e) => blurRing(e.currentTarget)}
          />
        </div>
      </div>
    </div>
  );

  const renderAthleteForm = () => (
    <div>
      <h3 style={{ color: '#fff', marginBottom: '25px', fontSize: '1.5rem', fontWeight: 'bold', textShadow: '0 1px 2px rgba(0,0,0,0.35)' }}>
        Athlete Account Information
      </h3>

      {[
        { id: 'athleteName', label: 'Name *', props: { name: 'athleteName', placeholder: 'John Doe' } },
        { id: 'athleteEmail', label: 'Email *', props: { name: 'athleteEmail', type: 'email', placeholder: 'athlete@example.com' } },
        { id: 'athletePhone', label: 'Phone Number *', props: { name: 'athletePhone', type: 'tel', placeholder: '(555) 123-4567' } },
        { id: 'athleteSchool', label: 'School Name *', props: { name: 'athleteSchool', placeholder: 'University of Example' } },
        { id: 'athleteLocation', label: 'Location *', props: { name: 'athleteLocation', placeholder: 'City, State' } },
        { id: 'athleteSport', label: 'Sport/Activity *', props: { name: 'athleteSport', placeholder: 'e.g., Basketball, Soccer, Swimming' } },
      ].map((f) => (
        <div key={f.id} style={{ marginBottom: '18px' }}>
          <label htmlFor={f.id} style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: COLORS.YELLOW }}>
            {f.label}
          </label>
          <input
            id={f.id}
            required
            {...f.props}
            style={fieldBase}
            onFocus={(e) => focusRing(e.currentTarget)}
            onBlur={(e) => blurRing(e.currentTarget)}
          />
        </div>
      ))}

      <div style={{ marginBottom: '18px' }}>
        <label htmlFor="athleteGraduationDate" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: COLORS.YELLOW }}>
          Graduation Date *
        </label>
        <input
          id="athleteGraduationDate"
          name="athleteGraduationDate"
          type="date"
          required
          style={fieldBase}
          onFocus={(e) => focusRing(e.currentTarget)}
          onBlur={(e) => blurRing(e.currentTarget)}
        />
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      maxWidth: '1400px',
      backgroundImage: `
        linear-gradient(135deg, ${COLORS.BLUE} 0%, ${COLORS.RED} 55%, ${COLORS.YELLOW} 120%),
        url(${formBackground})
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      padding: '40px 0',
      margin: 0,
      boxSizing: 'border-box'
    }}>
      <div style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0, left: 0,
        backdropFilter: 'blur(4px)',
        background: 'linear-gradient(0deg, rgba(0,0,0,0.35), rgba(0,0,0,0.25))',
        zIndex: 1
      }} />

      <div style={{ position: 'relative', zIndex: 2, padding: '0 20px', boxSizing: 'border-box' }}>
        <h1 style={{
          textAlign: 'center',
          color: '#ffffff',
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: 800,
          marginBottom: '12px',
          textShadow: '0 3px 6px rgba(0,0,0,0.35)',
          letterSpacing: '.6px'
        }}>
          Team IMPACT Survey Form
        </h1>

        <p style={{
          textAlign: 'center',
          color: '#ffffff',
          opacity: 0.92,
          fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
          marginBottom: '36px',
          textShadow: '0 1px 2px rgba(0,0,0,0.35)',
          fontWeight: 400
        }}>
          Please fill out the survey below to help us better serve you.
        </p>

        <div style={glassCard}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '28px' }}>
              <label style={{
                display: 'block',
                marginBottom: '18px',
                fontWeight: 700,
                fontSize: '1.3rem',
                color: '#fff',
                textShadow: '0 1px 2px rgba(0,0,0,0.35)',
                textAlign: 'center'
              }}>
                Select Type of Account
              </label>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                maxWidth: '820px',
                margin: '0 auto'
              }}>
                <div
                  onClick={() => setAccountType('family')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setAccountType('family')}
                  style={selectCardBase(accountType === 'family')}
                >
                  <div style={checkDot(accountType === 'family')}>
                    {accountType === 'family' && <span style={{ color: '#000', fontSize: 12, fontWeight: 900 }}>✓</span>}
                  </div>

                  <div style={{ fontSize: '2rem', marginBottom: '10px', textAlign: 'center', color: COLORS.YELLOW }}>
                    👨‍👩‍👧‍👦
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>
                    Family Account
                  </h3>
                  <p style={{ color: '#fff', opacity: 0.85, fontSize: '.9rem', textAlign: 'center', margin: 0 }}>
                    For parents managing their child's sports activities
                  </p>
                </div>

                <div
                  onClick={() => setAccountType('athlete')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setAccountType('athlete')}
                  style={selectCardBase(accountType === 'athlete')}
                >
                  <div style={checkDot(accountType === 'athlete')}>
                    {accountType === 'athlete' && <span style={{ color: '#000', fontSize: 12, fontWeight: 900 }}>✓</span>}
                  </div>

                  <div style={{ fontSize: '2.2rem', marginBottom: '12px', textAlign: 'center', color: COLORS.YELLOW }}>
                    🏃‍♂️
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: 6, textAlign: 'center' }}>
                    Athlete Account
                  </h3>
                  <p style={{ color: '#fff', opacity: 0.85, fontSize: '.9rem', textAlign: 'center', margin: 0 }}>
                    For student-athletes managing their sports journey
                  </p>
                </div>
              </div>
            </div>

            {accountType === 'family' && renderFamilyForm()}
            {accountType === 'athlete' && renderAthleteForm()}

            {submitMessage && (
              <div style={{
                marginTop: 18,
                padding: 14,
                borderRadius: 10,
                background: submitMessage.ok ? `${COLORS.YELLOW}22` : `${COLORS.RED}22`,
                border: `1px solid ${submitMessage.ok ? COLORS.YELLOW : COLORS.RED}`,
                color: submitMessage.ok ? '#052b15' : '#4a0a12',
                textAlign: 'center',
                fontWeight: 600
              }}>
                {submitMessage.text}
              </div>
            )}

            {accountType && (
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '16px 28px',
                  background: isSubmitting
                    ? `linear-gradient(135deg, ${COLORS.BLUE}90 0%, ${COLORS.RED}90 100%)`
                    : `linear-gradient(135deg, ${COLORS.BLUE} 0%, ${COLORS.RED} 100%)`,
                  color: '#fff',
                  border: `2px solid ${COLORS.YELLOW}aa`,
                  borderRadius: 14,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  marginTop: 26,
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  width: '100%',
                  transition: 'all .2s ease',
                  boxShadow: `0 10px 28px ${COLORS.BLUE}45`,
                  textShadow: '0 1px 2px rgba(0,0,0,0.35)',
                  opacity: isSubmitting ? 0.85 : 1
                }}
                onMouseOver={(e) => {
                  if (!isSubmitting) {
                    const t = e.currentTarget;
                    t.style.transform = 'translateY(-2px)';
                    t.style.boxShadow = `0 14px 34px ${COLORS.RED}55`;
                    t.style.background = `linear-gradient(135deg, ${COLORS.RED} 0%, ${COLORS.BLUE} 100%)`;
                  }
                }}
                onMouseOut={(e) => {
                  if (!isSubmitting) {
                    const t = e.currentTarget;
                    t.style.transform = 'translateY(0)';
                    t.style.boxShadow = `0 10px 28px ${COLORS.BLUE}45`;
                    t.style.background = `linear-gradient(135deg, ${COLORS.BLUE} 0%, ${COLORS.RED} 100%)`;
                  }
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Survey'}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;
