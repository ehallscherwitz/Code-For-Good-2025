import { CreateEventForm } from "../createEventForm";

export default function CreateEventPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative bg-secondary text-secondary-foreground">
        <div className="absolute inset-0 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-10-03%20at%2011.44.10%20PM-fB4RPWXbqC9OENe4MiKx7lz2bXskCz.png')] bg-cover bg-center opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
              Create a New Event
            </h1>
            <p className="mt-4 text-lg text-secondary-foreground/90 max-w-2xl mx-auto text-pretty">
              coming game or special moment with your Team IMPACT family.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <CreateEventForm />
      </div>
    </div>
  );
}
