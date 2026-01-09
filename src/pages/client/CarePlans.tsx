import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
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
    title: "Daily Care Routine",
    category: "personal",
    icon: Heart,
    tasks: [
      { id: 1, task: "Assist with morning wash and dressing", time: "08:00", completed: true },
      { id: 2, task: "Administer morning medications", time: "08:30", completed: true },
      { id: 3, task: "Prepare and assist with breakfast", time: "09:00", completed: false },
      { id: 4, task: "Light exercises and stretching", time: "10:00", completed: false },
      { id: 5, task: "Assist with lunch", time: "12:30", completed: false },
      { id: 6, task: "Afternoon rest and monitoring", time: "14:00", completed: false },
      { id: 7, task: "Evening meal preparation", time: "17:30", completed: false },
      { id: 8, task: "Administer evening medications", time: "18:00", completed: false },
      { id: 9, task: "Assist with evening routine", time: "20:00", completed: false },
    ],
    progress: 22,
    priority: "high"
  },
  {
    id: 2,
    recipientId: 1,
    title: "Medication Schedule",
    category: "medication",
    icon: Pill,
    tasks: [
      { id: 1, task: "Metformin 500mg (Diabetes)", time: "08:00", completed: true },
      { id: 2, task: "Blood pressure medication", time: "08:00", completed: true },
      { id: 3, task: "Vitamin D supplement", time: "12:00", completed: false },
      { id: 4, task: "Arthritis medication", time: "18:00", completed: false },
      { id: 5, task: "Evening blood pressure check", time: "20:00", completed: false },
    ],
    progress: 40,
    priority: "high"
  },
  {
    id: 3,
    recipientId: 1,
    title: "Nutrition Plan",
    category: "nutrition",
    icon: Utensils,
    tasks: [
      { id: 1, task: "Low sugar breakfast", time: "09:00", completed: false },
      { id: 2, task: "Mid-morning snack", time: "10:30", completed: false },
      { id: 3, task: "Balanced lunch with vegetables", time: "12:30", completed: false },
      { id: 4, task: "Afternoon tea and light snack", time: "15:00", completed: false },
      { id: 5, task: "Diabetic-friendly dinner", time: "17:30", completed: false },
    ],
    progress: 0,
    priority: "medium"
  },
  {
    id: 4,
    recipientId: 1,
    title: "Mobility & Exercise",
    category: "mobility",
    icon: Activity,
    tasks: [
      { id: 1, task: "Gentle morning stretches", time: "10:00", completed: false },
      { id: 2, task: "Supervised walk in garden", time: "11:00", completed: false },
      { id: 3, task: "Hand exercises for arthritis", time: "14:30", completed: false },
      { id: 4, task: "Evening leg exercises", time: "16:00", completed: false },
    ],
    progress: 0,
    priority: "medium"
  },
  {
    id: 5,
    recipientId: 1,
    title: "Cognitive Activities",
    category: "cognitive",
    icon: Brain,
    tasks: [
      { id: 1, task: "Memory games or puzzles", time: "10:30", completed: false },
      { id: 2, task: "Reading session", time: "14:00", completed: false },
      { id: 3, task: "Photo album review (memory stimulation)", time: "15:30", completed: false },
      { id: 4, task: "Music therapy / favourite songs", time: "16:30", completed: false },
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
  const selectedRecipient = careRecipients[0];

  return (
    <DashboardLayout role="client">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Care Plans</h1>
            <p className="text-muted-foreground">Manage care routines and track progress</p>
          </div>
          <Dialog open={isAddingPlan} onOpenChange={setIsAddingPlan}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Care Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Care Plan</DialogTitle>
                <DialogDescription>Add a new care plan for your loved one</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Plan Title</Label>
                  <Input placeholder="e.g., Weekly Exercise Routine" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal Care</SelectItem>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="nutrition">Nutrition</SelectItem>
                      <SelectItem value="mobility">Mobility & Exercise</SelectItem>
                      <SelectItem value="cognitive">Cognitive Activities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the care plan..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingPlan(false)}>Cancel</Button>
                <Button onClick={() => setIsAddingPlan(false)}>Create Plan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Care Recipient Card */}
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedRecipient.avatar} />
                  <AvatarFallback className="text-xl">MW</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{selectedRecipient.name}</h2>
                  <p className="text-muted-foreground">{selectedRecipient.age} years old • {selectedRecipient.relationship}</p>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {selectedRecipient.conditions.map(condition => (
                    <Badge key={condition} variant="outline">{condition}</Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Primary Carer</p>
                <p className="font-medium">{selectedRecipient.primaryCarer}</p>
                <p className="text-xs text-muted-foreground">Last updated: {new Date(selectedRecipient.lastUpdated).toLocaleDateString('en-GB')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="plans">
          <TabsList>
            <TabsTrigger value="plans">Care Plans</TabsTrigger>
            <TabsTrigger value="logs">Visit Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="space-y-6 mt-6">
            {/* Today's Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today's Care Overview
                </CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                    <p className="text-2xl font-bold">27</p>
                  </div>
                  <div className="p-4 rounded-lg bg-emerald-500/10">
                    <p className="text-sm text-emerald-600">Completed</p>
                    <p className="text-2xl font-bold text-emerald-600">4</p>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-500/10">
                    <p className="text-sm text-amber-600">Pending</p>
                    <p className="text-2xl font-bold text-amber-600">23</p>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10">
                    <p className="text-sm text-primary">Progress</p>
                    <p className="text-2xl font-bold text-primary">15%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Care Plans */}
            <div className="grid md:grid-cols-2 gap-6">
              {carePlans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <Card key={plan.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            plan.category === 'medication' ? 'bg-red-500/10 text-red-500' :
                            plan.category === 'nutrition' ? 'bg-amber-500/10 text-amber-500' :
                            plan.category === 'mobility' ? 'bg-blue-500/10 text-blue-500' :
                            plan.category === 'cognitive' ? 'bg-purple-500/10 text-purple-500' :
                            'bg-primary/10 text-primary'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{plan.title}</CardTitle>
                            <CardDescription>{plan.tasks.length} tasks</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={plan.priority === 'high' ? 'destructive' : 'secondary'}>
                            {plan.priority}
                          </Badge>
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-4">
                        {plan.tasks.slice(0, 4).map((task) => (
                          <div key={task.id} className="flex items-center gap-3">
                            <Checkbox checked={task.completed} />
                            <div className="flex-1">
                              <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {task.task}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.time}
                            </span>
                          </div>
                        ))}
                        {plan.tasks.length > 4 && (
                          <p className="text-sm text-muted-foreground">
                            +{plan.tasks.length - 4} more tasks
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{plan.progress}%</span>
                        </div>
                        <Progress value={plan.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Visit Logs</CardTitle>
                <CardDescription>Records from carer visits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {visitLogs.map((log) => (
                    <div key={log.id} className="p-4 rounded-lg border">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{log.carer}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(log.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} • {log.duration}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            log.mood === 'Excellent' ? 'default' :
                            log.mood === 'Good' ? 'secondary' : 'outline'
                          }>
                            Mood: {log.mood}
                          </Badge>
                          <Badge variant="outline">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {log.tasksCompleted}/{log.totalTasks}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm mb-2">{log.summary}</p>
                      {log.notes && (
                        <div className="p-2 bg-muted rounded text-sm">
                          <span className="font-medium">Notes: </span>{log.notes}
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
    </DashboardLayout>
  );
}
