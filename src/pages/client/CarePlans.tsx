import { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText,
  Plus,
  Heart,
  Pill,
  Utensils,
  Activity,
  Brain,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Edit,
  Trash2,
  User
} from "lucide-react";

const careRecipients = [
  {
    id: 1,
    name: "Margaret Wilson",
    avatar: "/placeholder.svg",
    age: 78,
    relationship: "Mother",
    conditions: ["Dementia (Early Stage)", "Arthritis", "Diabetes Type 2"],
    primaryCarer: "Sarah Khan",
    lastUpdated: "2026-01-05"
  }
];

const carePlans = [
  {
    id: 1,
    recipientId: 1,
    title: "Morning Routine",
    category: "personal",
    icon: Calendar,
    tasks: [
      { id: 1, task: "Prompt for medication", time: "08:00", completed: false },
      { id: 2, task: "Prompt for personal care", time: "08:30", completed: false },
      { id: 3, task: "Prompt for Breakfast", time: "09:00", completed: false },
    ],
    progress: 0,
    priority: "high"
  },
  {
    id: 2,
    recipientId: 1,
    title: "Afternoon Routine",
    category: "personal",
    icon: Calendar,
    tasks: [
      { id: 1, task: "Prompt for medication", time: "12:00", completed: false },
      { id: 2, task: "Prompt for lunch", time: "12:30", completed: false },
      { id: 3, task: "Ground walk", time: "13:30", completed: false },
      { id: 4, task: "Community walk", time: "14:00", completed: false },
      { id: 5, task: "City walk", time: "14:30", completed: false },
      { id: 6, task: "Shop run", time: "15:00", completed: false },
    ],
    progress: 0,
    priority: "medium"
  },
  {
    id: 3,
    recipientId: 1,
    title: "Late Afternoon Routine",
    category: "personal",
    icon: Calendar,
    tasks: [
      { id: 1, task: "Prompt for medication", time: "16:00", completed: false },
      { id: 2, task: "Prompt for snacks", time: "16:30", completed: false },
    ],
    progress: 0,
    priority: "medium"
  },
  {
    id: 4,
    recipientId: 1,
    title: "Evening Routine",
    category: "personal",
    icon: Calendar,
    tasks: [
      { id: 1, task: "Prompt for dinner", time: "18:00", completed: false },
      { id: 2, task: "Prompt for medication", time: "18:30", completed: false },
    ],
    progress: 0,
    priority: "high"
  },
  {
    id: 5,
    recipientId: 1,
    title: "Bedtime Routine",
    category: "personal",
    icon: Calendar,
    tasks: [
      { id: 1, task: "Bedtime routine support", time: "21:00", completed: false },
    ],
    progress: 0,
    priority: "high"
  },
  {
    id: 6,
    recipientId: 1,
    title: "Activities",
    category: "cognitive",
    icon: Activity,
    tasks: [
      { id: 1, task: "Exercise", time: "10:00", completed: false },
      { id: 2, task: "Reading session", time: "11:00", completed: false },
      { id: 3, task: "Gardening", time: "14:00", completed: false },
      { id: 4, task: "Memory games or puzzles", time: "15:00", completed: false },
      { id: 5, task: "Art", time: "16:00", completed: false },
      { id: 6, task: "Music session", time: "17:00", completed: false },
      { id: 7, task: "Cooking", time: "17:30", completed: false },
    ],
    progress: 0,
    priority: "medium"
  }
];

const visitLogs = [
  {
    id: 1,
    date: "2026-01-08",
    carer: "Sarah Khan",
    duration: "3 hours",
    summary: "Morning routine completed. Margaret was in good spirits. Medication administered on time. Light walk in the garden.",
    tasksCompleted: 8,
    totalTasks: 9,
    mood: "Good",
    notes: "Margaret mentioned she'd like to video call her grandchildren this weekend."
  },
  {
    id: 2,
    date: "2026-01-07",
    carer: "Sarah Khan",
    duration: "3 hours",
    summary: "Assisted with personal care and breakfast. Some confusion in the morning but settled after medication.",
    tasksCompleted: 7,
    totalTasks: 9,
    mood: "Fair",
    notes: "Blood pressure slightly elevated. Recommended monitoring."
  },
  {
    id: 3,
    date: "2026-01-06",
    carer: "James O'Brien",
    duration: "3 hours",
    summary: "Companionship visit. Played card games and went through photo album. Margaret enjoyed reminiscing.",
    tasksCompleted: 5,
    totalTasks: 5,
    mood: "Excellent",
    notes: "Very engaged during cognitive activities."
  },
];

export default function CarePlans() {
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [recipient, setRecipient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCareData() {
      try {
        const { data: { user } } = await import("@/integrations/supabase/client").then(m => m.supabase.auth.getUser());
        if (!user) return;

        // Fetch generic profile
        const { data: profile } = await import("@/integrations/supabase/client").then(m => m.supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single());

        // Fetch client specific details
        const { data: clientDetails } = await import("@/integrations/supabase/client").then(m => m.supabase
          .from('client_details')
          .select('*')
          .eq('id', user.id)
          .single());

        // Fetch a recent booking to find an assigned carer
        const { data: lastBooking } = await import("@/integrations/supabase/client").then(m => m.supabase
          .from('bookings')
          .select('carer:profiles!carer_id(full_name)')
          .eq('client_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single());

        // Construct recipient object
        setRecipient({
          name: profile?.full_name || "Client",
          avatar: profile?.avatar_url,
          age: 78, // Placeholder as DOB might not be in profile yet
          relationship: "Self", // Default to Self for now
          conditions: clientDetails?.medical_notes ? [clientDetails.medical_notes] : ["No specific conditions listed"], // Use medical notes if available
          primaryCarer: lastBooking?.carer?.full_name || "No Carer Assigned",
          lastUpdated: new Date().toISOString()
        });

      } catch (error) {
        console.error("Failed to load care data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCareData();
  }, []);

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
  }

  // Fallback if load failed
  const displayRecipient = recipient || {
    name: "Loading...",
    avatar: "",
    age: 0,
    relationship: "",
    conditions: [],
    primaryCarer: "",
    lastUpdated: new Date().toISOString()
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        {/* ... existing header code ... */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Care Portal</h1>
          <p className="text-sm text-muted-foreground font-medium">Coordinate routines and monitor wellbeing.</p>
        </div>
        <Dialog open={isAddingPlan} onOpenChange={setIsAddingPlan}>
          <DialogTrigger asChild>
            <Button className="h-10 px-6 rounded-xl font-bold shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              New Protocol
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            {/* ... existing dialog content ... */}
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">New Care Protocol</DialogTitle>
              <DialogDescription className="text-sm">Define a new routine for your recipient.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Title</Label>
                <Input className="h-10 rounded-lg border-black/5" placeholder="e.g., Physiotherapy Routine" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
                  <Select>
                    <SelectTrigger className="h-10 rounded-lg border-black/5 text-xs">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal" className="text-xs">Personal Care</SelectItem>
                      <SelectItem value="medication" className="text-xs">Medication</SelectItem>
                      <SelectItem value="nutrition" className="text-xs">Nutrition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Priority</Label>
                  <Select>
                    <SelectTrigger className="h-10 rounded-lg border-black/5 text-xs">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high" className="text-xs">High</SelectItem>
                      <SelectItem value="medium" className="text-xs">Medium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Notes</Label>
                <Textarea className="rounded-lg border-black/5 min-h-[100px] text-xs" placeholder="Specific instructions..." />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="ghost" className="h-10 rounded-lg text-xs font-bold" onClick={() => setIsAddingPlan(false)}>Cancel</Button>
              <Button className="h-10 rounded-lg text-xs font-bold" onClick={() => setIsAddingPlan(false)}>Create Protocol</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Care Recipient Card */}
      <Card className="rounded-2xl border-black/5 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-5 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-14 w-14 rounded-2xl border-2 border-white shadow-sm">
                  <AvatarImage src={displayRecipient.avatar || ""} />
                  <AvatarFallback className="text-lg font-bold">{displayRecipient.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight">{displayRecipient.name}</h2>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  {/* Hardcoded age for now as DOB isn't in core profile schema yet, can be updated later */}
                  <span>{displayRecipient.age}y</span>
                  <span>•</span>
                  <span>{displayRecipient.relationship}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 md:border-l border-black/5 md:pl-6">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Conditions/Diagnosis</p>
              <div className="flex flex-wrap gap-1.5">
                {displayRecipient.conditions.map((condition: string) => (
                  <Badge key={condition} className="bg-primary/5 text-primary border-none text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="md:text-right md:border-l border-black/5 md:pl-6 min-w-[150px]">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Assigned Carer</p>
              <p className="text-sm font-bold text-foreground">{displayRecipient.primaryCarer}</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-1">Sync: {new Date(displayRecipient.lastUpdated).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="plans" className="space-y-6">
        <TabsList className="bg-slate-100/80 p-1 rounded-xl h-10 w-fit border border-black/5">
          <TabsTrigger value="plans" className="h-8 px-5 rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">Care Protocols</TabsTrigger>
          <TabsTrigger value="logs" className="h-8 px-5 rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs">Activity Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
          {/* Today's Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-black/5 shadow-sm">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Queue</p>
              <p className="text-xl font-bold">27 Tasks</p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 shadow-sm">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Done</p>
              <p className="text-xl font-bold text-emerald-600">4 Done</p>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 shadow-sm">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Remaining</p>
              <p className="text-xl font-bold text-amber-600">23 Left</p>
            </div>
            <div className="p-4 rounded-2xl bg-primary text-white shadow-md shadow-primary/10">
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Daily Cap</p>
              <p className="text-xl font-bold">15%</p>
            </div>
          </div>

          {/* Care Plans */}
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {carePlans.map((plan) => {
              const Icon = plan.icon;
              return (
                <Card key={plan.id} className="rounded-2xl border-black/5 shadow-sm hover:border-primary/20 transition-all group bg-white">
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${plan.category === 'medication' ? 'bg-rose-50 text-rose-500' :
                          plan.category === 'nutrition' ? 'bg-amber-50 text-amber-500' :
                            plan.category === 'mobility' ? 'bg-blue-50 text-blue-500' :
                              plan.category === 'cognitive' ? 'bg-indigo-50 text-indigo-500' :
                                'bg-primary/5 text-primary'
                          }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-bold tracking-tight">{plan.title}</CardTitle>
                          <p className="text-[10px] font-medium text-muted-foreground">{plan.tasks.length} items scheduled</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge className={`${plan.priority === 'high' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-600 border-slate-100'} border text-[9px] font-bold py-0 h-5 px-2 rounded-md uppercase tracking-wider`}>
                          {plan.priority}
                        </Badge>
                        <Button size="icon" variant="ghost" className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 pt-0">
                    <div className="space-y-2.5 mb-5 mt-2">
                      {plan.tasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center gap-2.5 group/task">
                          <Checkbox
                            checked={task.completed}
                            className="h-4 w-4 rounded-md border-slate-200 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium truncate ${task.completed ? 'line-through text-muted-foreground/60' : 'text-foreground/80'}`}>
                              {task.task}
                            </p>
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1 shrink-0 opacity-60">
                            <Clock className="h-3 w-3" />
                            {task.time}
                          </span>
                        </div>
                      ))}
                      {plan.tasks.length > 3 && (
                        <p className="text-[10px] font-bold text-primary px-7">
                          + {plan.tasks.length - 3} additional tasks
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5 pt-4 border-t border-black/5">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <span>Progress</span>
                        <span className="text-primary">{plan.progress}%</span>
                      </div>
                      <Progress value={plan.progress} className="h-1.5 bg-slate-100" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
          <Card className="rounded-2xl border-black/5 shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold">Session Insights</CardTitle>
              <CardDescription className="text-xs">Latest updates from your care team.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-black/5">
                {visitLogs.map((log) => (
                  <div key={log.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 rounded-xl shadow-sm border border-white">
                          <AvatarFallback className="text-xs font-bold bg-primary/5 text-primary">SC</AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold">{log.carer}</p>
                          <p className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {new Date(log.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} • {log.duration}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className={`text-[9px] font-bold py-0 h-5 px-2 rounded-md ${log.mood === 'Excellent' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                          log.mood === 'Good' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                          }`}>
                          Mood: {log.mood}
                        </Badge>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground px-2 h-5 bg-slate-50 rounded-md border border-slate-100">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          {log.tasksCompleted}/{log.totalTasks}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-foreground/70 font-medium mb-3">{log.summary}</p>
                    {log.notes && (
                      <div className="p-3 bg-slate-50/50 rounded-xl border border-black/5 text-[11px] font-medium text-muted-foreground italic">
                        <span className="font-bold text-foreground/60 not-italic mr-2">Clinician Notes:</span>
                        "{log.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
