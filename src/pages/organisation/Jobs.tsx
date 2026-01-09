import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { 
  Plus, 
  MapPin, 
  Clock, 
  PoundSterling,
  Users,
  Calendar as CalendarIcon,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Copy
} from "lucide-react";

const jobs = [
  {
    id: 1,
    title: "Personal Care Assistant",
    location: "Manchester City Centre, M1",
    type: "Full-time",
    shift: "Days",
    hourlyRate: 15,
    hours: "40 hrs/week",
    startDate: "2026-01-15",
    status: "active",
    applications: 12,
    requirements: ["Personal Care", "Medication Support"],
    description: "We are looking for a compassionate care assistant to join our team...",
    urgent: false,
    postedDate: "2026-01-02"
  },
  {
    id: 2,
    title: "Dementia Care Specialist",
    location: "Salford, M5",
    type: "Part-time",
    shift: "Evenings",
    hourlyRate: 18,
    hours: "20 hrs/week",
    startDate: "2026-01-20",
    status: "active",
    applications: 8,
    requirements: ["Dementia Care", "Elderly Care"],
    description: "Specialist role for experienced dementia care professionals...",
    urgent: true,
    postedDate: "2026-01-05"
  },
  {
    id: 3,
    title: "Live-in Carer",
    location: "Trafford, M16",
    type: "Live-in",
    shift: "24/7",
    hourlyRate: 120,
    hours: "Per day",
    startDate: "2026-02-01",
    status: "draft",
    applications: 0,
    requirements: ["Personal Care", "Companionship", "Meal Preparation"],
    description: "Live-in position providing comprehensive care...",
    urgent: false,
    postedDate: ""
  },
  {
    id: 4,
    title: "Night Care Worker",
    location: "Stockport, SK1",
    type: "Part-time",
    shift: "Nights",
    hourlyRate: 16,
    hours: "24 hrs/week",
    startDate: "2026-01-10",
    status: "closed",
    applications: 15,
    requirements: ["Personal Care", "Mobility Assistance"],
    description: "Night shift position in care home setting...",
    urgent: false,
    postedDate: "2025-12-15"
  },
];

const careTypes = [
  "Personal Care",
  "Dementia Care",
  "Palliative Care",
  "Mental Health Support",
  "Learning Disabilities",
  "Physical Disabilities",
  "Elderly Care",
  "Companionship",
  "Medication Support",
  "Mobility Assistance",
  "Meal Preparation",
  "Light Housekeeping",
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-emerald-500">Active</Badge>;
    case "draft":
      return <Badge variant="secondary">Draft</Badge>;
    case "closed":
      return <Badge variant="outline">Closed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export default function OrganisationJobs() {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);

  const toggleRequirement = (req: string) => {
    setSelectedRequirements(prev =>
      prev.includes(req) ? prev.filter(r => r !== req) : [...prev, req]
    );
  };

  const activeJobs = jobs.filter(j => j.status === 'active');
  const draftJobs = jobs.filter(j => j.status === 'draft');
  const closedJobs = jobs.filter(j => j.status === 'closed');

  return (
    <DashboardLayout role="organisation">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Job Postings</h1>
            <p className="text-muted-foreground">Create and manage care job listings</p>
          </div>
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Post New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Job Posting</DialogTitle>
                <DialogDescription>Fill in the details for your new care position</DialogDescription>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input placeholder="e.g., Personal Care Assistant" />
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input placeholder="e.g., Manchester, M1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Job Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="live-in">Live-in</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Shift Pattern</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="evenings">Evenings</SelectItem>
                          <SelectItem value="nights">Nights</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Hourly Rate (£)</Label>
                      <Input type="number" placeholder="e.g., 15" />
                    </div>
                    <div className="space-y-2">
                      <Label>Hours per Week</Label>
                      <Input type="number" placeholder="e.g., 40" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Job Description</Label>
                    <Textarea 
                      placeholder="Describe the role, responsibilities, and ideal candidate..."
                      className="min-h-[120px]"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="urgent" />
                    <Label htmlFor="urgent">Mark as Urgent</Label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Required Skills</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto border rounded-lg p-3">
                      {careTypes.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox 
                            id={type}
                            checked={selectedRequirements.includes(type)}
                            onCheckedChange={() => toggleRequirement(type)}
                          />
                          <Label htmlFor={type} className="text-sm">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreating(false)}>Save as Draft</Button>
                <Button onClick={() => setIsCreating(false)}>Publish Job</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{jobs.length}</p>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeJobs.length}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{jobs.reduce((sum, j) => sum + j.applications, 0)}</p>
                  <p className="text-sm text-muted-foreground">Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{jobs.filter(j => j.urgent).length}</p>
                  <p className="text-sm text-muted-foreground">Urgent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active ({activeJobs.length})</TabsTrigger>
            <TabsTrigger value="drafts">Drafts ({draftJobs.length})</TabsTrigger>
            <TabsTrigger value="closed">Closed ({closedJobs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4 mt-6">
            {activeJobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        {job.urgent && (
                          <Badge variant="destructive">Urgent</Badge>
                        )}
                        {getStatusBadge(job.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.type} • {job.shift}
                        </span>
                        <span className="flex items-center gap-1">
                          <PoundSterling className="h-4 w-4" />
                          £{job.hourlyRate}/hr
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          Starts {new Date(job.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map(req => (
                          <Badge key={req} variant="outline">{req}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{job.applications}</p>
                        <p className="text-sm text-muted-foreground">Applications</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="drafts" className="space-y-4 mt-6">
            {draftJobs.map((job) => (
              <Card key={job.id} className="opacity-75">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        {getStatusBadge(job.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <PoundSterling className="h-4 w-4" />
                          £{job.hourlyRate}/hr
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm">
                        Publish
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="closed" className="space-y-4 mt-6">
            {closedJobs.map((job) => (
              <Card key={job.id} className="opacity-60">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        {getStatusBadge(job.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span>{job.applications} applications received</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </Button>
                      <Button variant="ghost" size="sm">
                        View
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
