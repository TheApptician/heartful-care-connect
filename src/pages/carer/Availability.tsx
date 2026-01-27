import { useState } from "react";

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
  XCircle,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { format } from "date-fns";

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
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  const { toast } = useToast();

  const [weeklySchedule, setWeeklySchedule] = useState({
    Monday: { enabled: true, start: "08:00", end: "18:00" },
    Tuesday: { enabled: true, start: "08:00", end: "18:00" },
    Wednesday: { enabled: true, start: "08:00", end: "18:00" },
    Thursday: { enabled: true, start: "08:00", end: "18:00" },
    Friday: { enabled: true, start: "08:00", end: "16:00" },
    Saturday: { enabled: false, start: "09:00", end: "14:00" },
    Sunday: { enabled: false, start: "09:00", end: "14:00" },
  });

  useEffect(() => {
    fetchAvailabilityData();
  }, []);

  const fetchAvailabilityData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch Carer Details for preferences
      const { data: carerData } = await supabase
        .from("carer_details")
        .select("*")
        .eq("id", user.id)
        .single();

      if (carerData) {
        setInstantBooking(carerData.instant_booking ?? true);
        setEmergencyAvailable(carerData.emergency_availability ?? false);
        setTravelRadius(carerData.travel_radius?.toString() || "10");
      }

      // Fetch real bookings
      const { data: bookingsData } = await supabase
        .from("bookings")
        .select(`
          *,
          client:profiles!bookings_client_id_fkey(full_name)
        `)
        .eq("carer_id", user.id)
        .gte("start_time", new Date().toISOString())
        .order("start_time", { ascending: true });

      setBookings(bookingsData || []);

    } catch (error: any) {
      console.error("Error fetching availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (field: string, value: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("carer_details")
        .update({ [field]: value })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Preferences Updated",
        description: "Your booking preferences have been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleDay = (day: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: { ...prev[day as keyof typeof prev], enabled: !prev[day as keyof typeof prev].enabled }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Availability</h1>
          <p className="text-muted-foreground">Manage your schedule and booking preferences</p>
        </div>
        <Dialog open={isAddingSlot} onOpenChange={setIsAddingSlot}>
          <DialogTrigger asChild>
            <Button size="sm" className="sm:size-default whitespace-nowrap">
              <Plus className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Add Time Block</span>
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
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => setIsAddingSlot(false)}>Cancel</Button>
              <Button className="w-full sm:w-auto" onClick={() => setIsAddingSlot(false)}>Save Block</Button>
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
                  {bookings
                    .filter(b => b.start_time?.split('T')[0] === selectedDate?.toISOString().split('T')[0])
                    .map(booking => (
                      <div
                        key={booking.id}
                        className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">{booking.client?.full_name || 'Client'}</p>
                            <p className="text-sm text-muted-foreground">{booking.service_type || 'Care Service'}</p>
                            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {format(new Date(booking.start_time), 'HH:mm')} - {format(new Date(booking.end_time), 'HH:mm')}
                            </div>
                          </div>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="capitalize">
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  }
                  {bookings.filter(b => b.start_time?.split('T')[0] === selectedDate?.toISOString().split('T')[0]).length === 0 && (
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
                <Switch
                  checked={instantBooking}
                  onCheckedChange={(val) => {
                    setInstantBooking(val);
                    updatePreference("instant_booking", val);
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Emergency Available</Label>
                  <p className="text-xs text-muted-foreground">Accept short-notice bookings</p>
                </div>
                <Switch
                  checked={emergencyAvailable}
                  onCheckedChange={(val) => {
                    setEmergencyAvailable(val);
                    updatePreference("emergency_availability", val);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Travel Radius
                </Label>
                <Select
                  value={travelRadius}
                  onValueChange={(val) => {
                    setTravelRadius(val);
                    updatePreference("travel_radius", parseInt(val));
                  }}
                >
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
            {bookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No upcoming bookings found</p>
              </div>
            ) : (
              bookings.slice(0, 5).map(booking => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{booking.client?.full_name || 'Client'}</p>
                      <p className="text-sm text-muted-foreground">{booking.service_type || 'Care'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6">
                    <div className="sm:text-right">
                      <p className="font-medium text-sm sm:text-base">
                        {format(new Date(booking.start_time), 'EEE, dd MMM')}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {format(new Date(booking.start_time), 'HH:mm')}
                      </p>
                    </div>

                    <div className="flex items-center justify-end sm:justify-start gap-3">
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="capitalize">
                        {booking.status}
                      </Badge>
                      <Button size="sm" variant="outline" className="hidden sm:inline-flex">View</Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
