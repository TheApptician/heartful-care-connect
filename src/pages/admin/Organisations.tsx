import { useState, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreVertical,
  Building2,
  MapPin,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Organisation {
  id: string;
  company_name: string;
  registration_number: string | null;
  postcode: string | null;
  service_radius_miles: number | null;
  is_verified: boolean;
  created_at: string;
  profile?: {
    full_name: string;
  };
}

const AdminOrganisations = () => {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [filteredOrganisations, setFilteredOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchOrganisations();
  }, []);

  useEffect(() => {
    filterOrganisations();
  }, [organisations, searchQuery, statusFilter]);

  const fetchOrganisations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organisation_details')
        .select(`
          *,
          profile:profiles!organisation_details_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrganisations(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching organisations",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterOrganisations = () => {
    let filtered = organisations;

    if (searchQuery) {
      filtered = filtered.filter(org =>
        org.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.postcode?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      if (statusFilter === "verified") {
        filtered = filtered.filter(org => org.is_verified);
      } else if (statusFilter === "unverified") {
        filtered = filtered.filter(org => !org.is_verified);
      }
    }

    setFilteredOrganisations(filtered);
  };

  const handleToggleVerification = async (org: Organisation) => {
    try {
      const { error } = await supabase
        .from('organisation_details')
        .update({ is_verified: !org.is_verified })
        .eq('id', org.id);

      if (error) throw error;

      toast({
        title: org.is_verified ? "Organisation unverified" : "Organisation verified",
        description: `${org.company_name} has been ${org.is_verified ? "unverified" : "verified"}.`,
      });

      fetchOrganisations();
    } catch (error: any) {
      toast({
        title: "Error updating verification",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csv = [
      ['Company Name', 'Registration Number', 'Postcode', 'Service Radius', 'Verified', 'Created'].join(','),
      ...filteredOrganisations.map(org => [
        org.company_name,
        org.registration_number || 'N/A',
        org.postcode || 'N/A',
        org.service_radius_miles ? `${org.service_radius_miles} miles` : 'N/A',
        org.is_verified ? 'Yes' : 'No',
        new Date(org.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `organisations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();

    toast({
      title: "Export successful",
      description: `Exported ${filteredOrganisations.length} organisations to CSV.`,
    });
  };

  const stats = {
    total: organisations.length,
    verified: organisations.filter(o => o.is_verified).length,
    pending: organisations.filter(o => !o.is_verified).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Organisation Management</h1>
          <p className="text-muted-foreground">Manage all platform organisations</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Organisations</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.verified}</p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search organisations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Organisations Table */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Registration Number</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Service Radius</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrganisations.map((org) => (
                <TableRow key={org.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{org.company_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {org.profile?.full_name || 'No contact'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{org.registration_number || 'Not set'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {org.postcode || 'Not set'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {org.service_radius_miles ? `${org.service_radius_miles} miles` : 'Not set'}
                  </TableCell>
                  <TableCell>
                    {org.is_verified ? (
                      <Badge className="bg-green-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-500 text-amber-600">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleToggleVerification(org)}>
                          {org.is_verified ? (
                            <>
                              <AlertCircle className="h-4 w-4 mr-2" />
                              Unverify
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Verify
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredOrganisations.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-semibold">No organisations found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOrganisations;
