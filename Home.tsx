import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Clock, Plus, Trash2, Calendar, Mail, Bell, Zap, Code, CreditCard } from "lucide-react";
import { useState } from "react";
import { getLoginUrl } from "@/const";

/**
 * CalSync Design System
 * - Forest Green Primary: oklch(0.45 0.15 142) for actions and hierarchy
 * - Sage Green Secondary: oklch(0.65 0.08 142) for hover states
 * - Cream Background: oklch(0.97 0.01 70) for warmth and approachability
 * - Slate Text: oklch(0.235 0.015 65) for readability
 * - Rounded corners: 12px (0.75rem) for organic feel
 * - Soft shadows: 0 4px 12px rgba(0,0,0,0.08) for depth
 * - Typography: Poppins (bold headings), Inter (body text)
 */

interface AppointmentType {
  id: string;
  name: string;
  duration: number;
  color: string;
}

interface TimeSlot {
  id: string;
  day: string;
  time: string;
  type: string;
  duration: number;
}

interface UpcomingAppointment {
  id: string;
  clientName: string;
  type: string;
  time: string;
  date: string;
  reminder: boolean;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 10 }, (_, i) => `${i + 8}:00`);

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  const [appointmentTypes, setAppointmentTypes] = useState<AppointmentType[]>([
    { id: "1", name: "Consultation", duration: 30, color: "#2D5016" },
    { id: "2", name: "Follow-up", duration: 15, color: "#8BA888" },
  ]);

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: "1", day: "Mon", time: "9:00", type: "Consultation", duration: 30 },
    { id: "2", day: "Wed", time: "14:00", type: "Follow-up", duration: 15 },
  ]);

  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([
    { id: "1", clientName: "Sarah Johnson", type: "Consultation", time: "9:30 AM", date: "Today", reminder: true },
    { id: "2", clientName: "Michael Chen", type: "Follow-up", time: "2:00 PM", date: "Tomorrow", reminder: false },
    { id: "3", clientName: "Emma Davis", type: "Consultation", time: "11:00 AM", date: "Friday", reminder: true },
  ]);

  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeDuration, setNewTypeDuration] = useState("30");
  const [currentWeek, setCurrentWeek] = useState(0);

  const addAppointmentType = () => {
    if (newTypeName.trim()) {
      setAppointmentTypes([
        ...appointmentTypes,
        {
          id: Date.now().toString(),
          name: newTypeName,
          duration: parseInt(newTypeDuration),
          color: "#2D5016",
        },
      ]);
      setNewTypeName("");
      setNewTypeDuration("30");
    }
  };

  const removeAppointmentType = (id: string) => {
    setAppointmentTypes(appointmentTypes.filter((t) => t.id !== id));
  };

  const toggleReminder = (id: string) => {
    setUpcomingAppointments(
      upcomingAppointments.map((a) =>
        a.id === id ? { ...a, reminder: !a.reminder } : a
      )
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">CalSync</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
            <Button variant="ghost" size="sm">
              Settings
            </Button>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-foreground/70">{user?.name}</span>
                <Button size="sm" variant="outline" onClick={() => logout()}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => window.location.href = getLoginUrl()}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-foreground leading-tight">
              Scheduling Made Simple
            </h2>
            <p className="text-lg text-foreground/70">
              Manage bookings, availability, and client appointments all in one place. CalSync streamlines your scheduling workflow with an intuitive interface and powerful integrations.
            </p>
            <div className="flex gap-4 pt-4">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663736326654/SPvnuj2w7rQuJyySjPYrfa/hero-background-EqM77mExK5LTqmjJkCAwCB.webp"
              alt="CalSync Hero"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-16 space-y-16">
        {/* Weekly Calendar View */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold text-foreground">Weekly Calendar</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeek(currentWeek - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium text-foreground/70 min-w-32 text-center">
                Week {currentWeek + 1}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeek(currentWeek + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full">
                {/* Day Headers */}
                <div className="grid gap-0 border-b border-border" style={{ gridTemplateColumns: `80px repeat(7, 1fr)` }}>
                  <div className="p-4 bg-muted/50 font-semibold text-foreground/70 text-sm">Time</div>
                  {DAYS.map((day) => (
                    <div key={day} className="p-4 bg-muted/50 font-semibold text-foreground text-center border-l border-border">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="grid gap-0 border-b border-border hover:bg-muted/30 transition-colors"
                    style={{ gridTemplateColumns: `80px repeat(7, 1fr)` }}
                  >
                    <div className="p-4 bg-muted/30 text-sm font-medium text-foreground/70 border-r border-border">
                      {hour}
                    </div>
                    {DAYS.map((day) => {
                      const slot = timeSlots.find((s) => s.day === day && s.time === hour);
                      return (
                        <div
                          key={`${day}-${hour}`}
                          className="p-2 border-l border-border min-h-16 flex items-center justify-center"
                        >
                          {slot && (
                            <div
                              className="w-full h-full rounded-lg flex items-center justify-center text-white text-xs font-medium cursor-move hover:shadow-md transition-shadow"
                              style={{ backgroundColor: slot.type === "Consultation" ? "#2D5016" : "#8BA888" }}
                              title={`${slot.type} (${slot.duration}m)`}
                            >
                              {slot.type}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-foreground/60">
            💡 Drag and drop appointments to reschedule. Click to edit details.
          </p>
        </div>

        {/* Two Column Layout: Configurator + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Appointment Type Configurator */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-foreground">Appointment Types</h3>

            <Card className="p-6 bg-white border border-border rounded-2xl shadow-sm space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="type-name" className="text-sm font-medium text-foreground">
                    Type Name
                  </Label>
                  <Input
                    id="type-name"
                    placeholder="e.g., Strategy Session"
                    value={newTypeName}
                    onChange={(e) => setNewTypeName(e.target.value)}
                    className="mt-2 rounded-lg border-border focus:ring-primary"
                  />
                </div>

                <div>
                  <Label htmlFor="type-duration" className="text-sm font-medium text-foreground">
                    Duration (minutes)
                  </Label>
                  <Select value={newTypeDuration} onValueChange={setNewTypeDuration}>
                    <SelectTrigger id="type-duration" className="mt-2 rounded-lg border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="90">1.5 hours</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={addAppointmentType}
                  className="w-full bg-primary hover:bg-primary/90 rounded-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Type
                </Button>
              </div>

              <div className="border-t border-border pt-6 space-y-3">
                {appointmentTypes.map((type) => (
                  <div
                    key={type.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      <div>
                        <p className="font-medium text-foreground text-sm">{type.name}</p>
                        <p className="text-xs text-foreground/60">{type.duration} minutes</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAppointmentType(type.id)}
                      className="p-1 hover:bg-destructive/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Client Booking Page Preview */}
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-foreground">Booking Page Preview</h3>

            <Card className="p-8 bg-white border border-border rounded-2xl shadow-sm space-y-6">
              <div className="text-center space-y-2">
                <h4 className="text-2xl font-bold text-foreground">Schedule a Meeting</h4>
                <p className="text-sm text-foreground/60">
                  Select an appointment type and choose your preferred time
                </p>
              </div>

              <div className="space-y-3 border-t border-border pt-6">
                {appointmentTypes.map((type) => (
                  <Dialog key={type.id}>
                    <DialogTrigger asChild>
                      <button className="w-full p-4 text-left rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground">{type.name}</p>
                            <p className="text-sm text-foreground/60 flex items-center gap-1 mt-1">
                              <Clock className="w-3 h-3" />
                              {type.duration} minutes
                            </p>
                          </div>
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: type.color }}
                          />
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="rounded-2xl">
                      <DialogHeader>
                        <DialogTitle>{type.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-foreground/70">
                          Duration: {type.duration} minutes
                        </p>
                        <div className="bg-muted/50 p-4 rounded-lg text-center">
                          <p className="text-sm font-medium text-foreground">
                            Available times will appear here
                          </p>
                        </div>
                        <Button className="w-full bg-primary hover:bg-primary/90">
                          Continue Booking
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>

              <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                <p className="text-xs text-foreground/70">
                  ✓ This is how your clients see your booking page. Fully customizable colors and branding.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-foreground">Upcoming Appointments</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingAppointments.map((apt) => (
              <Card
                key={apt.id}
                className="p-6 bg-white border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">{apt.clientName}</p>
                  <p className="text-sm text-foreground/60">{apt.type}</p>
                </div>

                <div className="space-y-2 border-t border-border pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-foreground">{apt.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-foreground/70">{apt.date}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleReminder(apt.id)}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                    apt.reminder
                      ? "bg-primary/10 text-primary"
                      : "bg-muted/50 text-foreground/60 hover:bg-muted"
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {apt.reminder ? "Reminder Set" : "Set Reminder"}
                  </span>
                </button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Subscriptions Section */}
      <section className="bg-gradient-to-r from-primary/5 to-accent/5 border-t border-border py-16">
        <div className="container space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold text-foreground">Simple, Transparent Pricing</h3>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Choose the perfect plan for your business. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "$29", desc: "Perfect for solo practitioners", features: ["Up to 5 appointment types", "Basic calendar sync", "Email reminders"] },
              { name: "Professional", price: "$79", desc: "For growing teams", features: ["Unlimited appointment types", "Advanced integrations", "Team management", "Priority support"], highlight: true },
              { name: "Enterprise", price: "Custom", desc: "For large organizations", features: ["Everything in Professional", "Custom integrations", "Dedicated account manager", "SLA guarantee"] },
            ].map((plan) => (
              <Card
                key={plan.name}
                className={`p-8 rounded-2xl border-2 transition-all ${
                  plan.highlight
                    ? "border-primary bg-white shadow-lg scale-105"
                    : "border-border bg-white hover:shadow-md"
                }`}
              >
                <div className="space-y-4">
                  <div>
                    <h4 className="text-2xl font-bold text-foreground">{plan.name}</h4>
                    <p className="text-sm text-foreground/60 mt-1">{plan.desc}</p>
                  </div>

                  <div className="py-4 border-t border-border">
                    <p className="text-4xl font-bold text-primary">{plan.price}</p>
                    <p className="text-sm text-foreground/60 mt-1">/month</p>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-foreground">
                        <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full rounded-lg mt-6 ${
                      plan.highlight
                        ? "bg-primary hover:bg-primary/90"
                        : "border border-primary text-primary hover:bg-primary/5"
                    }`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Get Started
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Calendar Integrations Footer */}
      <section className="bg-gradient-to-r from-primary/5 to-accent/5 border-t border-border mt-20">
        <div className="container py-16 space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold text-foreground">Integrations</h3>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Sync CalSync with your favorite calendar platforms. Your availability stays up-to-date across all services.
            </p>
          </div>

          <div className="relative">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663736326654/SPvnuj2w7rQuJyySjPYrfa/integrations-pattern-A7nKHjh5cByxEEa8uPcgC4.webp"
              alt="Calendar Integrations"
              className="w-full h-64 object-cover rounded-2xl shadow-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Google Calendar", icon: "📅", desc: "Sync your Google Calendar events" },
              { name: "Outlook", icon: "📧", desc: "Connect your Outlook calendar" },
              { name: "Apple Calendar", icon: "🍎", desc: "Integrate with Apple Calendar" },
            ].map((integration) => (
              <Card
                key={integration.name}
                className="p-6 bg-white border border-border rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center space-y-4"
              >
                <div className="text-4xl">{integration.icon}</div>
                <h4 className="font-semibold text-foreground">{integration.name}</h4>
                <p className="text-sm text-foreground/60">{integration.desc}</p>
                <Button variant="outline" size="sm" className="w-full rounded-lg">
                  Connect
                </Button>
              </Card>
            ))}
          </div>

          <div className="bg-white border border-border rounded-2xl p-8 space-y-6">
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                API & Webhooks
              </h4>
              <p className="text-foreground/70">
                Build custom integrations with our powerful REST API and webhook support.
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary/90 rounded-lg">
              <Zap className="w-4 h-4 mr-2" />
              View API Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background border-t border-border py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold">CalSync</span>
              </div>
              <p className="text-sm text-background/70">
                Scheduling made simple for modern businesses.
              </p>
            </div>

            {[
              { title: "Product", links: ["Features", "Pricing", "Security"] },
              { title: "Company", links: ["About", "Blog", "Careers"] },
              { title: "Resources", links: ["Docs", "API", "Support"] },
            ].map((col) => (
              <div key={col.title} className="space-y-4">
                <h4 className="font-semibold">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-background/70 hover:text-background transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-background/60">
            <p>&copy; 2026 CalSync. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-background transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-background transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-background transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
