import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Minimal Team IMPACT-style profile (vertical)
 * - Bigger avatar + headings
 * - High-contrast location pill (inline styles so it’s visible without CSS)
 * - Edit / Save / Cancel
 */

const STORAGE_INFO = "ti_profile_v1";

const DEFAULT_PROFILE = {
  role: "family",
  name: "User",
  pronouns: "",
  bio: "Welcome to Team IMPACT! Tell us about yourself and what you're looking for in the community.",
  location: "Add your location",
  email: "",
  phone: "Add phone number",
  avatarUrl: null,
  graduationYear: "",
  sport: "",
  children: {},
};

const BRAND_NAVY = "#1d3e7b";

function initials(name = "") {
  return name
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(DEFAULT_PROFILE);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(DEFAULT_PROFILE);
  const [busy, setBusy] = useState(false);
  const [geoErr, setGeoErr] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Initialize profile with backend data
  useEffect(() => {
    if (!user) return;

    const fetchUserProfile = async () => {
      try {
        // First try to get Google profile data as fallback
        const googleProfile = {
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "User",
          email: user.email || "",
          avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        };

        // Try to fetch from backend first using user_id
        let backendData = null;
        
        // Try athlete endpoint first
        try {
          console.log('Fetching athlete data for user_id:', user.id);
          const athleteResponse = await fetch(`http://localhost:5000/api/athletes/user/${user.id}`);
          console.log('Athlete response status:', athleteResponse.status);
          
          if (athleteResponse.ok) {
            const userAthlete = await athleteResponse.json();
            console.log('Athlete data found:', userAthlete);
            
            if (userAthlete) {
              // Format athlete data nicely
              const graduationYear = userAthlete.graduation_year;
              const currentYear = new Date().getFullYear();
              const yearsToGraduation = graduationYear ? graduationYear - currentYear : null;
              
              let bioText = `College athlete passionate about making a difference in the community.`;
              if (graduationYear) {
                bioText += ` Graduating in ${graduationYear}${yearsToGraduation > 0 ? ` (${yearsToGraduation} year${yearsToGraduation > 1 ? 's' : ''} remaining)` : ''}.`;
              }
              if (userAthlete.sport) {
                bioText += ` Playing ${userAthlete.sport}.`;
              }
              
              backendData = {
                role: "athlete",
                name: userAthlete.athlete_name || googleProfile.name,
                email: userAthlete.athlete_email || googleProfile.email,
                phone: userAthlete.phone_number || "",
                location: userAthlete.athlete_address || "",
                bio: bioText,
                avatarUrl: googleProfile.avatarUrl,
                graduationYear: userAthlete.graduation_year,
                sport: userAthlete.sport || ""
              };
              console.log('Backend data set for athlete:', backendData);
            }
          } else {
            console.log('No athlete data found, status:', athleteResponse.status);
          }
        } catch (error) {
          console.log('Error fetching athlete data:', error);
        }

        // If not found as athlete, try family endpoint
        if (!backendData) {
          try {
            console.log('Fetching family data for user_id:', user.id);
            const familyResponse = await fetch(`http://localhost:5000/api/families/user/${user.id}`);
            console.log('Family response status:', familyResponse.status);
            
            if (familyResponse.ok) {
              const userFamily = await familyResponse.json();
              console.log('Family data found:', userFamily);
              
              if (userFamily) {
                // Format location properly
                let location = "";
                if (typeof userFamily.location === 'object') {
                  if (userFamily.location.zip_code) {
                    location = `ZIP: ${userFamily.location.zip_code}`;
                  } else {
                    location = `${userFamily.location.city || ''}, ${userFamily.location.state || ''}`.trim().replace(/^,\s*|,\s*$/g, '');
                  }
                } else if (userFamily.location) {
                  location = userFamily.location;
                }

                // Format children information nicely for bio
                let childrenInfo = "";
                if (userFamily.children && typeof userFamily.children === 'object') {
                  const child = userFamily.children;
                  const currentYear = new Date().getFullYear();
                  const birthYear = child.birth_date ? new Date(child.birth_date).getFullYear() : null;
                  const age = birthYear ? currentYear - birthYear : 'Unknown';
                  
                  childrenInfo = `Proud parent of ${child.name || 'my child'} (${age} years old) who plays ${child.sport || 'sports'}. ${child.medical_conditions ? `Special considerations: ${child.medical_conditions}.` : ''}`;
                }

                backendData = {
                  role: "family",
                  name: userFamily.parent_name || googleProfile.name,
                  email: userFamily.parent_email || googleProfile.email,
                  phone: userFamily.parent_phone_number || "",
                  location: location,
                  bio: `Family member passionate about supporting young athletes. ${childrenInfo}`,
                  avatarUrl: googleProfile.avatarUrl,
                  children: userFamily.children || {}
                };
                console.log('Backend data set for family:', backendData);
              }
            } else {
              console.log('No family data found, status:', familyResponse.status);
            }
          } catch (error) {
            console.log('Error fetching family data:', error);
          }
        }

        console.log('Final backend data:', backendData);

        // Merge with local storage data
        try {
          const raw = localStorage.getItem(STORAGE_INFO);
          const savedData = raw ? JSON.parse(raw) : {};
          
          console.log('Local storage data:', savedData);
          console.log('Backend data:', backendData);
          console.log('Google profile:', googleProfile);
          
          // Priority: backendData > savedData > googleProfile > DEFAULT_PROFILE
          const mergedData = { 
            ...DEFAULT_PROFILE, 
            ...googleProfile, 
            ...savedData,
            ...(backendData || {}), // Backend data should override localStorage
            // Always preserve user-uploaded avatar if exists
            avatarUrl: savedData.avatarUrl || (backendData?.avatarUrl) || googleProfile.avatarUrl
          };
          
          console.log('Final merged data:', mergedData);
          setData(mergedData);
        } catch (error) {
          console.log('Error with localStorage, using backend data only');
          // If localStorage fails, use backend or google data
          const fallbackData = { 
            ...DEFAULT_PROFILE, 
            ...googleProfile, 
            ...(backendData || {})
          };
          console.log('Fallback data:', fallbackData);
          setData(fallbackData);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to Google data only
        const googleProfile = {
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "User",
          email: user.email || "",
          avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
        };
        setData({ ...DEFAULT_PROFILE, ...googleProfile });
      }
    };
    
    fetchUserProfile();
  }, [user]);

  // sync draft on edit
  useEffect(() => {
    if (editing) setDraft(data);
  }, [editing, data]);

  const initialsText = useMemo(() => initials(data.name), [data.name]);

  const onAvatarFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((p) => ({ ...p, avatarUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const startEdit = () => setEditing(true);
  const cancelEdit = () => {
    setEditing(false);
    setGeoErr("");
  };

  const save = async () => {
    setBusy(true);
    
    try {
      localStorage.setItem(STORAGE_INFO, JSON.stringify(draft));
      setData(draft);
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setData(draft);
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  async function useMyLocation() {
    setGeoErr("");
    if (!navigator.geolocation) {
      setGeoErr("Geolocation not supported by this browser.");
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            { headers: { "User-Agent": "team-impact-hackathon" } }
          );
          const j = await r.json();
          const city =
            j.address?.city ||
            j.address?.town ||
            j.address?.village ||
            j.address?.hamlet ||
            "";
          const state = j.address?.state || j.address?.region || "";
          const label =
            city && state
              ? `${city}, ${state}`
              : j.display_name || `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;
          setDraft((p) => ({ ...p, location: label }));
        } catch {
          setGeoErr("Couldn't look up your city; using coordinates instead.");
          setDraft((p) => ({
            ...p,
            location: `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
          }));
        } finally {
          setBusy(false);
        }
      },
      (err) => {
        setBusy(false);
        setGeoErr(err.message || "Location permission denied.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5"
      }}>
        <div style={{
          textAlign: "center",
          padding: "40px",
          background: "white",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #6d8db3ff",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 20px"
          }}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Inline styles to avoid relying on external CSS right now
  const s = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(1200px 600px at 20% -10%, #eef2f7, #f9fafb 40%), #f2f5fa",
      padding: "24px",
    },
    card: {
      maxWidth: 720, // more vertical, less horizontal
      margin: "0 auto",
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: 24,
      boxShadow: "0 8px 28px rgba(16,24,40,.06)",
      padding: 24,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
      minHeight: "70vh", // fill the page to kill awkward whitespace
    },
    avatarWrap: {
      width: 152,
      height: 152,
      borderRadius: "999px",
      overflow: "hidden",
      border: "6px solid #fff",
      boxShadow: "0 2px 14px rgba(0,0,0,.12)",
    },
    avatarFallback: {
      width: "100%",
      height: "100%",
      display: "grid",
      placeItems: "center",
      background: "#eef2ff",
      color: "#4338ca",
      fontWeight: 800,
      fontSize: 42,
    },
    titleRow: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
      justifyContent: "center",
      textAlign: "center",
    },
    h1: { margin: 0, fontSize: 44, fontWeight: 900, color: "#0f172a" },
    pronouns: {
      background: "#e9ecff",
      color: "#3b3b9a",
      padding: "6px 10px",
      borderRadius: 999,
      fontWeight: 600,
      fontSize: 14,
    },
    label: {
      fontSize: 12,
      textTransform: "uppercase",
      letterSpacing: ".03em",
      color: "#526581",
      textAlign: "center",
      marginTop: 8,
      marginBottom: 6,
    },
    bio: {
      color: "#4b5563",
      lineHeight: 1.6,
      fontSize: 18,
      textAlign: "center",
      maxWidth: 640,
    },
    locationPill: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "12px 16px",
      borderRadius: 999,
      background: "rgba(29, 62, 123, 0.12)", // navy tint
      border: "1px solid rgba(29, 62, 123, 0.28)",
      color: BRAND_NAVY,
      fontWeight: 700,
      fontSize: 16,
    },
    input: {
      width: "100%",
      padding: "12px 14px",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      outline: "none",
      fontSize: 16,
    },
    inputRow: { display: "flex", gap: 8, width: "100%", flexWrap: "wrap" },
    inputSmall: { maxWidth: 180 },
    textarea: {
      width: "100%",
      padding: "12px 14px",
      border: "1px solid #e5e7eb",
      borderRadius: 12,
      outline: "none",
      fontSize: 16,
      resize: "vertical",
    },
    file: {
      marginTop: 8,
      color: BRAND_NAVY,
      fontWeight: 600,
      cursor: "pointer",
      display: "inline-block",
    },
    actions: { marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" },
    btn: {
      padding: "12px 18px",
      borderRadius: 12,
      border: "1px solid transparent",
      background: BRAND_NAVY,
      color: "#fff",
      fontWeight: 800,
      cursor: "pointer",
      fontSize: 16,
    },
    btnGhost: {
      padding: "12px 18px",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      background: "transparent",
      color: "#0f172a",
      fontWeight: 700,
      cursor: "pointer",
      fontSize: 16,
    },
    btnSecondary: {
      padding: "12px 18px",
      borderRadius: 12,
      border: "1px solid #e5e7eb",
      background: "#f8fafc",
      color: "#0f172a",
      fontWeight: 700,
      cursor: "pointer",
      fontSize: 16,
    },
    note: {
      marginTop: 6,
      padding: "10px 12px",
      borderRadius: 12,
      background: "#fff7ed",
      color: "#9a3412",
      border: "1px solid #fed7aa",
      width: "100%",
      textAlign: "center",
    },
  };

  // Card styles
  const cardStyles = {
    card: {
      backgroundColor: '#ffffff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      marginBottom: '24px',
    },
    cardHeader: {
      padding: '24px 24px 0 24px',
    },
    cardContent: {
      padding: '24px',
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#111827',
      margin: '0 0 8px 0',
    },
    cardDescription: {
      fontSize: '14px',
      color: '#6b7280',
      margin: '0',
    },
  };

  return (
    <div style={s.page}>
      <div style={{ maxWidth: '896px', margin: '0 auto' }}>
        {/* Profile Header Card */}
        <div style={cardStyles.card}>
          <div style={cardStyles.cardContent}>
            <div style={{ 
              display: 'flex', 
              flexDirection: window.innerWidth < 768 ? 'column' : 'row',
              gap: '24px', 
              alignItems: 'flex-start' 
            }}>
              {/* Avatar */}
              <div style={{ position: 'relative' }}>
                <div style={s.avatarWrap}>
                  {editing ? (
                    draft.avatarUrl ? (
                      <img src={draft.avatarUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={s.avatarFallback}>{initials(draft.name)}</div>
                    )
                  ) : data.avatarUrl ? (
                    <img src={data.avatarUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={s.avatarFallback}>{initialsText}</div>
                  )}
                </div>
                {editing && (
                  <label style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#f3f4f6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '18px',
                  }}>
                    📷
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => onAvatarFile(e.target.files?.[0])}
                    />
                  </label>
                )}
              </div>

              {/* Profile Info */}
              <div style={{ flex: 1 }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                  justifyContent: 'space-between', 
                  alignItems: window.innerWidth < 768 ? 'flex-start' : 'center',
                  gap: '16px',
                  marginBottom: '16px' 
                }}>
                  <div>
                    <h1 style={s.h1}>{editing ? draft.name : data.name}</h1>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <span style={s.pronouns}>
                        {data.role === "athlete" ? "Athlete" : "Family Member"}
                      </span>
                      {data.pronouns && <span style={s.pronouns}>{data.pronouns}</span>}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {!editing ? (
                      <button style={s.btn} onClick={startEdit}>Edit Profile</button>
                    ) : (
                      <>
                        <button style={s.btnGhost} onClick={cancelEdit} disabled={busy}>
                          Cancel
                        </button>
                        <button style={s.btn} onClick={save} disabled={busy}>
                          💾 {busy ? "Saving..." : "Save Changes"}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Profile Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                    <span>📍</span>
                    <span>{data.location || "Add your location"}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                    <span>✉️</span>
                    <span>{data.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                    <span>📞</span>
                    <span>{data.phone || "Add phone number"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div style={cardStyles.card}>
          <div style={cardStyles.cardHeader}>
            <h2 style={cardStyles.cardTitle}>About</h2>
            <p style={cardStyles.cardDescription}>Tell others about yourself and what you're looking for</p>
          </div>
          <div style={cardStyles.cardContent}>
            {editing ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ ...s.label, display: 'block', marginBottom: '8px' }}>Full Name</label>
                  <input
                    style={s.input}
                    value={draft.name}
                    onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label style={{ ...s.label, display: 'block', marginBottom: '8px' }}>Bio</label>
                  <textarea
                    rows={4}
                    style={s.textarea}
                    value={draft.bio}
                    onChange={(e) => setDraft((p) => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            ) : (
              <p style={{ color: '#374151', lineHeight: '1.6', margin: '0' }}>{data.bio}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div style={cardStyles.card}>
          <div style={cardStyles.cardHeader}>
            <h2 style={cardStyles.cardTitle}>Contact Information</h2>
            <p style={cardStyles.cardDescription}>How others can reach you</p>
          </div>
          <div style={cardStyles.cardContent}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ ...s.label, display: 'block', marginBottom: '8px' }}>Email</label>
                <input
                  type="email"
                  style={{ ...s.input, opacity: editing ? 1 : 0.7 }}
                  value={editing ? draft.email : data.email}
                  onChange={(e) => editing && setDraft((p) => ({ ...p, email: e.target.value }))}
                  disabled={!editing}
                />
              </div>
              <div>
                <label style={{ ...s.label, display: 'block', marginBottom: '8px' }}>Phone</label>
                <input
                  type="tel"
                  style={{ ...s.input, opacity: editing ? 1 : 0.7 }}
                  value={editing ? draft.phone : data.phone}
                  onChange={(e) => editing && setDraft((p) => ({ ...p, phone: e.target.value }))}
                  disabled={!editing}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <label style={{ ...s.label, display: 'block', marginBottom: '8px' }}>Location</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    style={{ ...s.input, opacity: editing ? 1 : 0.7 }}
                    value={editing ? draft.location : data.location}
                    onChange={(e) => editing && setDraft((p) => ({ ...p, location: e.target.value }))}
                    disabled={!editing}
                    placeholder="City, State"
                  />
                  {editing && (
                    <button
                      type="button"
                      style={s.btnSecondary}
                      onClick={useMyLocation}
                      disabled={busy}
                    >
                      📍
                    </button>
                  )}
                </div>
                {geoErr && <div style={s.note}>{geoErr}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div style={cardStyles.card}>
          <div style={cardStyles.cardHeader}>
            <h2 style={cardStyles.cardTitle}>Personal Information</h2>
            <p style={cardStyles.cardDescription}>Additional details about yourself</p>
          </div>
          <div style={cardStyles.cardContent}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ ...s.label, display: 'block', marginBottom: '8px' }}>Pronouns</label>
                <input
                  style={{ ...s.input, opacity: editing ? 1 : 0.7 }}
                  value={editing ? draft.pronouns : data.pronouns}
                  onChange={(e) => editing && setDraft((p) => ({ ...p, pronouns: e.target.value }))}
                  disabled={!editing}
                  placeholder="they/them, she/her, he/him"
                />
              </div>
              <div>
                <label style={{ ...s.label, display: 'block', marginBottom: '8px' }}>Role</label>
                <select
                  style={{ ...s.input, opacity: editing ? 1 : 0.7 }}
                  value={editing ? draft.role : data.role}
                  onChange={(e) => editing && setDraft((p) => ({ ...p, role: e.target.value }))}
                  disabled={!editing}
                >
                  <option value="family">Family Member</option>
                  <option value="athlete">Athlete</option>
                </select>
              </div>
              {(data.role === "athlete" || draft.role === "athlete") && (
                <>
                  <div>
                    <label style={{ ...s.label, display: 'block', marginBottom: '8px' }}>Sport</label>
                    <input
                      style={{ ...s.input, opacity: editing ? 1 : 0.7 }}
                      value={editing ? draft.sport : data.sport}
                      onChange={(e) => editing && setDraft((p) => ({ ...p, sport: e.target.value }))}
                      disabled={!editing}
                      placeholder="Basketball, Football, etc."
                    />
                  </div>
                  <div>
                    <label style={{ ...s.label, display: 'block', marginBottom: '8px' }}>Graduation Year</label>
                    <input
                      type="number"
                      style={{ ...s.input, opacity: editing ? 1 : 0.7 }}
                      value={editing ? draft.graduationYear : data.graduationYear}
                      onChange={(e) => editing && setDraft((p) => ({ ...p, graduationYear: e.target.value }))}
                      disabled={!editing}
                      placeholder="2025"
                      min="2020"
                      max="2030"
                    />
                  </div>
                </>
              )}
              {/* Family Children Information */}
              {(data.role === "family" || draft.role === "family") && data.children && Object.keys(data.children).length > 0 && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ ...s.label, display: 'block', marginBottom: '8px' }}>Children Information</label>
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb'
                  }}>
                    {(() => {
                      const child = data.children;
                      if (child && typeof child === 'object') {
                        const currentYear = new Date().getFullYear();
                        const birthYear = child.birth_date ? new Date(child.birth_date).getFullYear() : null;
                        const age = birthYear ? currentYear - birthYear : 'Unknown';
                        
                        return (
                          <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                            <div style={{ marginBottom: '8px' }}>
                              <strong>Name:</strong> {child.name || 'Not specified'}
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                              <strong>Age:</strong> {age} years old
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                              <strong>Sport:</strong> {child.sport || 'Not specified'}
                            </div>
                            <div style={{ marginBottom: '8px' }}>
                              <strong>Gender:</strong> {child.gender || 'Not specified'}
                            </div>
                            {child.medical_conditions && (
                              <div style={{ marginBottom: '8px' }}>
                                <strong>Special Needs:</strong> {child.medical_conditions}
                              </div>
                            )}
                            {child.birth_date && (
                              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                <strong>Birth Date:</strong> {new Date(child.birth_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        );
                      }
                      return <div>No children information available</div>;
                    })()}
                  </div>
                </div>
              )}

              {/* Athlete Information */}
              {(data.role === "athlete" || draft.role === "athlete") && (data.sport || data.graduationYear) && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ ...s.label, display: 'block', marginBottom: '8px' }}>Athlete Information</label>
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #e0f2fe'
                  }}>
                    <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
                      {data.sport && (
                        <div style={{ marginBottom: '8px' }}>
                          <strong>Sport:</strong> {data.sport}
                        </div>
                      )}
                      {data.graduationYear && (
                        <div style={{ marginBottom: '8px' }}>
                          <strong>Graduation Year:</strong> {data.graduationYear}
                          {(() => {
                            const currentYear = new Date().getFullYear();
                            const yearsToGraduation = data.graduationYear - currentYear;
                            if (yearsToGraduation > 0) {
                              return ` (${yearsToGraduation} year${yearsToGraduation > 1 ? 's' : ''} remaining)`;
                            } else if (yearsToGraduation === 0) {
                              return ' (Graduating this year!)';
                            } else {
                              return ' (Graduated)';
                            }
                          })()}
                        </div>
                      )}
                      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                        <strong>Status:</strong> Active Team IMPACT athlete
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
