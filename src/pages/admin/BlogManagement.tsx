import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Plus, Search, MoreVertical, Edit2, Trash2, FileText, Image as ImageIcon, Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminBlogManagement = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPost, setEditingPost] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        excerpt: "",
        content: "",
        author: "",
        category: "General",
        status: "Published",
        image_url: ""
    });

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
        if (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to fetch posts", variant: "destructive" });
        } else {
            setPosts(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        setUploading(true);
        try {
            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('blog-images')
                .getPublicUrl(filePath);

            setFormData({ ...formData, image_url: data.publicUrl });
            toast({
                title: "Image uploaded",
                description: "Image successfully uploaded",
            });
        } catch (error: any) {
            toast({
                title: "Upload failed",
                description: error.message || "Could not upload image",
                variant: "destructive",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.content) {
            toast({ title: "Validation Error", description: "Title and Content are required", variant: "destructive" });
            return;
        }

        const payload = { ...formData };

        let error;
        if (editingPost) {
            const { error: err } = await supabase.from('blog_posts').update(payload).eq('id', editingPost.id);
            error = err;
        } else {
            const { error: err } = await supabase.from('blog_posts').insert([payload]);
            error = err;
        }

        if (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
            toast({ title: "Success", description: `Post ${editingPost ? 'updated' : 'created'} successfully` });
            setIsDialogOpen(false);
            setEditingPost(null);
            setFormData({ title: "", excerpt: "", content: "", author: "", category: "General", status: "Published", image_url: "" });
            fetchPosts();
        }
    };

    const handleDelete = async (id: string) => {
        const { error } = await supabase.from('blog_posts').delete().eq('id', id);
        if (error) {
            toast({ title: "Error", description: "Failed to delete post", variant: "destructive" });
        } else {
            toast({ title: "Deleted", description: "Post deleted successfully" });
            fetchPosts();
        }
    };

    const openEdit = (post: any) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            excerpt: post.excerpt || "",
            content: post.content || "",
            author: post.author || "",
            category: post.category || "General",
            status: post.status || "Published",
            image_url: post.image_url || ""
        });
        setIsDialogOpen(true);
    };

    const openCreate = () => {
        setEditingPost(null);
        setFormData({ title: "", excerpt: "", content: "", author: "", category: "General", status: "Published", image_url: "" });
        setIsDialogOpen(true);
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#111827]">Blog Management</h1>
                        <p className="text-slate-500 font-medium tracking-tight">Manage your platform's thought leadership and insights.</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={openCreate} className="bg-[#1a9e8c] hover:bg-[#15806c] text-white rounded-xl font-bold h-11 px-6 shadow-xl shadow-[#1a9e8c]/20 flex items-center gap-2">
                                <Plus className="h-4 w-4" /> Create New Post
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingPost ? 'Edit Post' : 'Create New Post'}</DialogTitle>
                                <DialogDescription>Fill in the details for your blog post.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Featured Image</Label>
                                    <div className="flex items-center gap-4">
                                        {formData.image_url && (
                                            <img
                                                src={formData.image_url}
                                                alt="Preview"
                                                className="h-20 w-20 object-cover rounded-lg border border-border"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                            />
                                            {uploading && <p className="text-xs text-muted-foreground mt-1 flex items-center"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Uploading...</p>}
                                        </div>
                                    </div>
                                    <Label className="text-xs text-muted-foreground">Or enter URL directly</Label>
                                    <Input
                                        value={formData.image_url}
                                        onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Post Title" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Author</Label>
                                        <Input value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} placeholder="Author Name" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Category</Label>
                                        <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="Category" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Published">Published</SelectItem>
                                            <SelectItem value="Draft">Draft</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Excerpt</Label>
                                    <Textarea value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} placeholder="Short summary..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Content</Label>
                                    <Textarea className="min-h-[200px]" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} placeholder="Full content (HTML supported)..." />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleSubmit} disabled={uploading}>
                                    {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                                    {editingPost ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="border-black/5 rounded-[2.5rem] shadow-none overflow-hidden">
                    <CardHeader className="border-b border-black/5 p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle className="text-xl font-black">Platform Insights</CardTitle>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input placeholder="Search posts..." className="pl-10 h-10 w-full md:w-64 bg-slate-50 border-black/5 rounded-xl text-sm" />
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-black/5">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Post Details</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    {posts.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-8 text-center text-slate-500">No posts found. Create one to get started.</td>
                                        </tr>
                                    ) : (
                                        posts.map((post) => (
                                            <tr key={post.id} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        {post.image_url ? (
                                                            <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                                                <img src={post.image_url} alt={post.title} className="h-full w-full object-cover" />
                                                            </div>
                                                        ) : (
                                                            <div className="h-12 w-12 rounded-xl bg-[#111827] flex items-center justify-center shrink-0">
                                                                <FileText className="h-6 w-6 text-[#1a9e8c]" />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-bold text-[#111827] group-hover:text-[#1a9e8c] transition-colors line-clamp-1">{post.title}</p>
                                                            <p className="text-xs text-slate-400 font-medium">By {post.author} • {new Date(post.created_at).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <Badge variant="outline" className="border-black/5 text-slate-500 font-bold px-3 py-1 rounded-full uppercase text-[9px] tracking-widest">{post.category}</Badge>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-1.5 w-1.5 rounded-full ${post.status === "Published" ? "bg-emerald-500" : "bg-amber-500"}`} />
                                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{post.status}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-[#111827] hover:text-white transition-all">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48">
                                                            <DropdownMenuItem onClick={() => openEdit(post)} className="flex items-center gap-2">
                                                                <Edit2 className="h-4 w-4" /> Edit Post
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleDelete(post.id)} className="flex items-center gap-2 text-destructive focus:text-destructive">
                                                                <Trash2 className="h-4 w-4" /> Delete Post
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AdminBlogManagement;
