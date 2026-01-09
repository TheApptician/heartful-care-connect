import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  MapPin,
  Settings,
  CheckCircle2,
  XCircle
} from "lucide-react";

const timeSlots = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
  "20:00", "21:00", "22:00"
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const scheduledBookings = [
  { id: 1, date: "2026-01-10", time: "09:00 - 12:00", client: "Margaret Wilson", type: "Personal Care", status: "confirmed" },
  { id: 2, date: "2026-01-10", time: "14:00 - 16:00", client: "James Thompson", type: "Companionship", status: "confirmed" },
  { id: 3, date: "2026-01-11", time: "10:00 - 13:00", client: "Patricia Brown", type: "Medication Support", status: "pending" },
  { id: 4, date: "2026-01-12", time: "08:00 - 11:00", client: "Robert Davis", type: "Personal Care", status: "confirmed" },
];

export default function CarerAvailability() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [instantBooking, setInstantBooking] = useState(true);
  const [emergencyAvailable, setEmergencyAvailable] = useState(false);
  const [travelRadius, setTravelRadius] = useState("10");
  const [isAddingSlot, setIsAddingSlot] = useState(false);

  const [weeklySchedule, setWeeklySchedule] = useState({
    Monday: { enabled: true, start: "08:00", end: "18:00" },
    Tuesday: { enabled: true, start: "08:00", end: "18:00" },
    Wednesday: { enabled: true, start: "08:00", end: "18:00" },
    Thursday: { enabled: true, start: "08:00", end: "18:00" },
    Friday: { enabled: true, start: "08:00", end: "16:00" },
    Saturday: { enabled: false, start: "09:00", end: "14:00" },
    Sunday: { enabled: false, start: "09:00", end: "14:00" },
  });

  const toggleDay = (day: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], enabled: !prev[day as keyof typeof prev].enabled }
    }));
  };

  return (
    <DashboardLayout role="carer">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Availability</h1>
            <p className="text-muted-foreground">Manage your schedule and booking preferences</p>
          </div>
          <Dialog open={isAddingSlot} onOpenChange={setIsAddingSlot}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Time Block
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Availability Block</DialogTitle>
                <DialogDescription>
                  Block out specific times when you're available or unavailable
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time</Label>
                    <Select defaultValue="09:00">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>End Time</Label>
                    <Select defaultValue="17:00">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Block Type</Label>
                  <Select defaultValue="available">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="unavailable">Unavailable</SelectItem>
                      <SelectItem value="preferred">Preferred Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingSlot(false)}>Cancel</Button>
                <Button onClick={() => setIsAddingSlot(false)}>Save Block</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                Schedule Calendar
              </CardTitle>
              <CardDescription>View and manage your upcoming bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
                <div className="flex-1 space-y-4">
                  <h3 className="font-semibold text-lg">
                    {selectedDate?.toLocaleDateString('en-GB', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long' 
                    })}
                  </h3>
                  <div className="space-y-3">
                    {scheduledBookings
                      .filter(b => b.date === selectedDate?.toISOString().split('T')[0])
                      .map(booking => (
                        <div 
                          key={booking.id}
                          className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{booking.client}</p>
                              <p className="text-sm text-muted-foreground">{booking.type}</p>
                              <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {booking.time}
                              </div>
                            </div>
                            <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    }
                    {scheduledBookings.filter(b => b.date === selectedDate?.toISOString().split('T')[0]).length === 0 && (
                      <p className="text-muted-foreground text-sm">No bookings scheduled for this day</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Booking Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Instant Booking</Label>
                    <p className="text-xs text-muted-foreground">Allow clients to book without approval</p>
                  </div>
                  <Switch checked={instantBooking} onCheckedChange={setInstantBooking} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Emergency Available</Label>
                    <p className="text-xs text-muted-foreground">Accept short-notice bookings</p>
                  </div>
                  <Switch checked={emergencyAvailable} onCheckedChange={setEmergencyAvailable} />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Travel Radius
                  </Label>
                  <Select value={travelRadius} onValueChange={setTravelRadius}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 miles</SelectItem>
                      <SelectItem value="10">10 miles</SelectItem>
                      <SelectItem value="15">15 miles</SelectItem>
                      <SelectItem value="20">20 miles</SelectItem>
                      <SelectItem value="30">30 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Schedule</CardTitle>
                <CardDescription>Set your regular working hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {weekDays.map(day => (
                    <div key={day} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <Switch 
                          checked={weeklySchedule[day as keyof typeof weeklySchedule].enabled}
                          onCheckedChange={() => toggleDay(day)}
                        />
                        <span className="text-sm font-medium w-24">{day}</span>
                      </div>
                      {weeklySchedule[day as keyof typeof weeklySchedule].enabled ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          {weeklySchedule[day as keyof typeof weeklySchedule].start} - {weeklySchedule[day as keyof typeof weeklySchedule].end}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <XCircle className="h-3 w-3" />
                          Unavailable
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upcoming Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
            <CardDescription>Your confirmed and pending appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledBookings.map(booking => (
                <div 
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <CalendarIcon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{booking.client}</p>
                      <p className="text-sm text-muted-foreground">{booking.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</p>
                    <p className="text-sm text-muted-foreground">{booking.time}</p>
                  </div>
                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                    {booking.status}
                  </Badge>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">View</Button>
                    {booking.status === 'pending' && (
                      <>
                        <Button size="sm" variant="default">Accept</Button>
                        <Button size="sm" variant="ghost">Decline</Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
