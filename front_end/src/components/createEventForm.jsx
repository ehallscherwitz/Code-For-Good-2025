"use client";
import { useState } from "react";
import { Calendar, MapPin, Users, Trophy, Heart, PartyPopper, CalendarDays } from "lucide-react";

export function CreateEventForm() {
  const [userType, setUserType] = useState("");
  const [eventType, setEventType] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Event created!");
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* Step 1 */}
      <div className="rounded-xl border p-6 bg-card text-card-foreground">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">1</div>
          <h2 className="text-lg font-semibold">Who are you?</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Let us know if you're creating this event as a family member or student athlete
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all hover:bg-accent ${userType==='family' ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <input className="sr-only" type="radio" name="userType" value="family"
                   checked={userType==="family"} onChange={()=>setUserType("family")} />
            <Heart className={`h-12 w-12 ${userType==='family' ? 'text-primary' : 'text-muted-foreground'}`} />
            <div className="text-center">
              <div className="font-semibold">Family Member</div>
              <div className="text-sm text-muted-foreground">Parent or guardian of a Team IMPACT child</div>
            </div>
          </label>

          <label className={`flex cursor-pointer flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all hover:bg-accent ${userType==='athlete' ? 'border-primary bg-primary/5' : 'border-border'}`}>
            <input className="sr-only" type="radio" name="userType" value="athlete"
                   checked={userType==="athlete"} onChange={()=>setUserType("athlete")} />
            <Trophy className={`h-12 w-12 ${userType==='athlete' ? 'text-primary' : 'text-muted-foreground'}`} />
            <div className="text-center">
              <div className="font-semibold">Student Athlete</div>
              <div className="text-sm text-muted-foreground">College athlete matched with a child</div>
            </div>
          </label>
        </div>
      </div>

      {/* Step 2 */}
      {userType && (
        <div className="rounded-xl border p-6 bg-card text-card-foreground">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">2</div>
            <h2 className="text-lg font-semibold">Event Details</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Tell us about your event so everyone knows what to expect</p>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="event-type" className="font-medium">Event Type</label>
              <select id="event-type" value={eventType} onChange={(e)=>setEventType(e.target.value)}
                      className="w-full rounded-lg border bg-background px-3 py-2">
                <option value="" disabled>Select event type</option>
                <option value="game">Game/Match</option>
                <option value="practice">Practice Session</option>
                <option value="meetup">Team Meetup</option>
                <option value="celebration">Celebration</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="title" className="font-medium">Event Title</label>
              <input id="title" required placeholder="e.g., Home Basketball Game vs. State University"
                     className="w-full rounded-lg border bg-background px-3 py-2" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="date" className="font-medium">
                  <Calendar className="inline h-4 w-4 mr-1" /> Date
                </label>
                <input id="date" type="date" required className="w-full rounded-lg border bg-background px-3 py-2" />
              </div>
              <div className="space-y-2">
                <label htmlFor="time" className="font-medium">
                  <CalendarDays className="inline h-4 w-4 mr-1" /> Time
                </label>
                <input id="time" type="time" required className="w-full rounded-lg border bg-background px-3 py-2" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="font-medium">
                <MapPin className="inline h-4 w-4 mr-1" /> Location
              </label>
              <input id="location" required placeholder="e.g., University Stadium, 123 College Ave"
                     className="w-full rounded-lg border bg-background px-3 py-2" />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="font-medium">Description</label>
              <textarea id="description" rows={4} required
                        placeholder="Share more details, parking info, etc."
                        className="w-full rounded-lg border bg-background px-3 py-2" />
            </div>

            <div className="space-y-2">
              <label htmlFor="attendees" className="font-medium">
                <Users className="inline h-4 w-4 mr-1" /> Who Can Attend?
              </label>
              <select id="attendees" defaultValue="matched"
                      className="w-full rounded-lg border bg-background px-3 py-2">
                <option value="matched">My Matched Family/Athlete</option>
                <option value="team">My Entire Team IMPACT Network</option>
                <option value="public">Open to All</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {userType && eventType && (
        <div className="rounded-xl border p-6 bg-card text-card-foreground">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">3</div>
            <h2 className="text-lg font-semibold">Additional Information</h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="special-notes" className="font-medium">Special Notes</label>
              <textarea id="special-notes" rows={3} className="w-full rounded-lg border bg-background px-3 py-2"
                        placeholder="Any special instructions or accessibility info?" />
            </div>

            <div className="space-y-2">
              <label htmlFor="contact" className="font-medium">Contact Email (optional)</label>
              <input id="contact" type="email" className="w-full rounded-lg border bg-background px-3 py-2"
                     placeholder="your.email@example.com" />
            </div>
          </div>
        </div>
      )}

      {userType && eventType && (
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <p className="text-sm text-muted-foreground">
            <PartyPopper className="inline h-4 w-4 mr-1" />
            Your event will be visible to your Team IMPACT network immediately
          </p>
          <div className="flex gap-3">
            <button type="button" className="rounded-full border px-5 py-3">Save as Draft</button>
            <button type="submit" className="rounded-full px-5 py-3 bg-primary text-primary-foreground hover:opacity-90">
              Publish Event
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
