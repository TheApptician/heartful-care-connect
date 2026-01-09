import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Phone,
  MessageSquare,
  Star,
  Plus,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Navigation
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const bookings = [
  {
    id: 1,
    carer: { name: "Sarah Khan", avatar: "/placeholder.svg", rating: 4.9, phone: "+44 7700 900123" },
    careRecipient: "Margaret Wilson",
    date: "2026-01-10",
    time: "09:00 - 12:00",
    duration: "3 hours",
    type: "Personal Care",
    status: "confirmed",
    location: "123 High Street, Manchester, M1 1AA",
    amount: 75,
    notes: "Please bring medications list"
  },
  {
    id: 2,
    carer: { name: "James O'Brien", avatar: "/placeholder.svg", rating: 4.8, phone: "+44 7700 900456" },
    careRecipient: "Margaret Wilson",
    date: "2026-01-11",
    time: "14:00 - 17:00",
    duration: "3 hours",
    type: "Companionship",
    status: "pending",
    location: "123 High Street, Manchester, M1 1AA",
    amount: 66,
    notes: ""
  },
  {
    id: 3,
    carer: { name: "Priya Patel", avatar: "/placeholder.svg", rating: 5.0, phone: "+44 7700 900789" },
    careRecipient: "Margaret Wilson",
    date: "2026-01-12",
    time: "10:00 - 14:00",
    duration: "4 hours",
    type: "Personal Care",
    status: "in_progress",
    location: "123 High Street, Manchester, M1 1AA",
    amount: 112,
    notes: "Weekly visit"
  },
  {
    id: 4,
    carer: { name: "Sarah Khan", avatar: "/placeholder.svg", rating: 4.9, phone: "+44 7700 900123" },
    careRecipient: "Margaret Wilson",
    date: "2026-01-05",
    time: "09:00 - 12:00",
    duration: "3 hours",
    type: "Personal Care",
    status: "completed",
    location: "123 High Street, Manchester, M1 1AA",
    amount: 75,
    notes: ""
  },
  {
    id: 5,
    carer: { name: "Michael Johnson", avatar: "/placeholder.svg", rating: 4.7, phone: "+44 7700 900321" },
    careRecipient: "Margaret Wilson",
    date: "2026-01-03",
    time: "14:00 - 16:00",
    duration: "2 hours",
    type: "Medication Support",
    status: "cancelled",
    location: "123 High Street, Manchester, M1 1AA",
    amount: 48,
    notes: "Client rescheduled"
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-emerald-500"><CheckCircle2 className="h-3 w-3 mr-1" />Confirmed</Badge>;
    case "pending":
      return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    case "in_progress":
      return <Badge className="bg-blue-500"><Navigation className="h-3 w-3 mr-1" />In Progress</Badge>;
    case "completed":
      return <Badge variant="outline"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
    case "cancelled":
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export default function ClientBookings() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isNewBooking, setIsNewBooking] = useState(false);

  const upcomingBookings = bookings.filter(b => ["confirmed", "pending", "in_progress"].includes(b.status));
  const pastBookings = bookings.filter(b => ["completed", "cancelled"].includes(b.status));

  return (
    <DashboardLayout role="client">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
            <p className="text-muted-foreground">Manage your care appointments</p>
          </div>
          <Dialog open={isNewBooking} onOpenChange={setIsNewBooking}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Booking</DialogTitle>
                <DialogDescription>Schedule a care visit with one of your carers</DialogDescription>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Carer</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a carer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sarah">Sarah Khan</SelectItem>
                        <SelectItem value="james">James O'Brien</SelectItem>
                        <SelectItem value="priya">Priya Patel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Care Recipient</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="margaret">Margaret Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Care Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal Care</SelectItem>
                        <SelectItem value="companionship">Companionship</SelectItem>
                        <SelectItem value="medication">Medication Support</SelectItem>
                        <SelectItem value="mobility">Mobility Assistance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Time</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Start" />
                        </SelectTrigger>
                        <SelectContent>
                          {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"].map(t => (
                            <SelectItem key={t} value={t}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hour</SelectItem>
                          <SelectItem value="2">2 hours</SelectItem>
                          <SelectItem value="3">3 hours</SelectItem>
                          <SelectItem value="4">4 hours</SelectItem>
                          <SelectItem value="6">6 hours</SelectItem>
                          <SelectItem value="8">8 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes for Carer</Label>
                    <Textarea placeholder="Any special instructions or requirements..." />
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewBooking(false)}>Cancel</Button>
                <Button onClick={() => setIsNewBooking(false)}>Create Booking</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingBookings.filter(b => b.status === 'confirmed').length}</p>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingBookings.filter(b => b.status === 'pending').length}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Navigation className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingBookings.filter(b => b.status === 'in_progress').length}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({upcomingBookings.length})</TabsTrigger>
            <TabsTrigger value="past">Past Bookings ({pastBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Carer Info */}
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={booking.carer.avatar} />
                        <AvatarFallback>{booking.carer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{booking.carer.name}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          {booking.carer.rating}
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Date & Time</p>
                        <p className="font-medium flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-sm flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {booking.time}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Care Type</p>
                        <p className="font-medium">{booking.type}</p>
                        <p className="text-sm text-muted-foreground">{booking.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">For</p>
                        <p className="font-medium">{booking.careRecipient}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {booking.location.split(',')[0]}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-bold text-lg">£{booking.amount}</p>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex items-center gap-3">
                      {getStatusBadge(booking.status)}
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Reschedule</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Cancel Booking</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                  {booking.notes && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <p className="text-sm"><span className="font-medium">Notes:</span> {booking.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="past" className="space-y-4 mt-6">
            {pastBookings.map((booking) => (
              <Card key={booking.id} className="opacity-75">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={booking.carer.avatar} />
                        <AvatarFallback>{booking.carer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{booking.carer.name}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          {booking.carer.rating}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Date & Time</p>
                        <p className="font-medium">
                          {new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-sm">{booking.time}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Care Type</p>
                        <p className="font-medium">{booking.type}</p>
                        <p className="text-sm text-muted-foreground">{booking.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">For</p>
                        <p className="font-medium">{booking.careRecipient}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-bold text-lg">£{booking.amount}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {getStatusBadge(booking.status)}
                      {booking.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <Star className="h-4 w-4 mr-2" />
                          Leave Review
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Book Again
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
