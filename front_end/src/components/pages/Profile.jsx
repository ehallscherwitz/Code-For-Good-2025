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
  bio: "Welcome to Team IMPACT! Tell us about yourself...",
  location: "",
  email: "",
  phone: "",
  avatarUrl: null,
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

  // Initialize profile with Google user data
  useEffect(() => {
    if (user) {
      const googleProfile = {
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || "User",
        email: user.email || "",
        avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      };

      try {
        const raw = localStorage.getItem(STORAGE_INFO);
        const savedData = raw ? JSON.parse(raw) : {};
        
        // Merge Google data with saved data, prioritizing saved data for non-Google fields
        setData({ 
          ...DEFAULT_PROFILE, 
          ...googleProfile, 
          ...savedData,
          // Always use Google avatar if available, unless user has uploaded their own
          avatarUrl: savedData.avatarUrl || googleProfile.avatarUrl
        });
      } catch (_) {
        setData({ ...DEFAULT_PROFILE, ...googleProfile });
      }
    }
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

  const save = () => {
    setBusy(true);
    setTimeout(() => {
      setData(draft);
      try {
        localStorage.setItem(STORAGE_INFO, JSON.stringify(draft));
      } catch (_) {}
      setBusy(false);
      setEditing(false);
    }, 350);
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

  return (
    <div style={s.page}>
      <div style={s.card}>
        {/* Avatar (bigger) */}
        <div style={s.avatarWrap}>
          {editing ? (
            draft.avatarUrl ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <img src={draft.avatarUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={s.avatarFallback}>{initials(draft.name)}</div>
            )
          ) : data.avatarUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img src={data.avatarUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={s.avatarFallback}>{initialsText}</div>
          )}
        </div>

        {/* Name + Pronouns (bigger) */}
        <div style={s.titleRow}>
          {!editing ? (
            <>
              <h1 style={s.h1}>{data.name}</h1>
              {data.pronouns && <span style={s.pronouns}>{data.pronouns}</span>}
            </>
          ) : (
            <>
              <div style={s.inputRow}>
                <input
                  style={s.input}
                  value={draft.name}
                  onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Full name"
                />
                <input
                  style={{ ...s.input, ...s.inputSmall }}
                  value={draft.pronouns}
                  onChange={(e) => setDraft((p) => ({ ...p, pronouns: e.target.value }))}
                  placeholder="Pronouns"
                />
              </div>
              <label style={s.file}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => onAvatarFile(e.target.files?.[0])}
                />
                Upload new photo
              </label>
            </>
          )}
        </div>

        {/* Bio */}
        <div style={{ width: "100%", maxWidth: 680 }}>
          <div style={s.label}>Bio</div>
          {editing ? (
            <textarea
              rows={4}
              style={s.textarea}
              value={draft.bio}
              onChange={(e) => setDraft((p) => ({ ...p, bio: e.target.value }))}
              placeholder="Tell your story…"
            />
          ) : (
            <p style={s.bio}>{data.bio}</p>
          )}
        </div>

        {/* Email */}
        {data.email && (
          <div style={{ width: "100%", maxWidth: 680, textAlign: "center" }}>
            <div style={s.label}>Email</div>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 16px",
              borderRadius: 999,
              background: "rgba(29, 62, 123, 0.08)",
              border: "1px solid rgba(29, 62, 123, 0.2)",
              color: BRAND_NAVY,
              fontWeight: 600,
              fontSize: 16,
            }}>
              <span>✉️</span>
              {data.email}
            </div>
          </div>
        )}

        {/* Location (always visible, high contrast) */}
        <div style={{ width: "100%", maxWidth: 680, textAlign: "center" }}>
          <div style={s.label}>Current Location</div>
          {editing ? (
            <div style={s.inputRow}>
              <input
                style={s.input}
                value={draft.location}
                onChange={(e) => setDraft((p) => ({ ...p, location: e.target.value }))}
                placeholder="City, State"
              />
              <button
                type="button"
                style={s.btnSecondary}
                onClick={useMyLocation}
                disabled={busy}
              >
                Use my location
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={s.locationPill}>
                <span>📍</span>
                {data.location || "Add your location"}
              </div>
            </div>
          )}
          {geoErr && <div style={s.note}>{geoErr}</div>}
        </div>

        {/* Actions */}
        <div style={s.actions}>
          {!editing ? (
            <button style={s.btn} onClick={startEdit}>Edit Profile</button>
          ) : (
            <>
              <button style={s.btn} onClick={save} disabled={busy}>
                {busy ? "Saving…" : "Save"}
              </button>
              <button style={s.btnGhost} onClick={cancelEdit} disabled={busy}>
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
