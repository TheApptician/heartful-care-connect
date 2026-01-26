import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Calendar } from "lucide-react";
import { format } from "date-fns";

const BlogPost = () => {
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;
            const { data, error } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('id', id)
                .single();

            if (data) setPost(data);
            setLoading(false);
        };
        fetchPost();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
    if (!post) return <div className="min-h-screen bg-white flex items-center justify-center">Post not found</div>;

    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main className="pt-24 lg:pt-32 pb-24">
                <article className="container mx-auto px-6 lg:px-12 max-w-4xl">
                    <Button variant="ghost" asChild className="mb-8 pl-0 hover:bg-transparent hover:text-[#1a9e8c]">
                        <Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Insights</Link>
                    </Button>

                    <Badge className="mb-6 bg-[#1a9e8c]/10 text-[#1a9e8c] border-none py-1 px-4 text-xs font-black uppercase tracking-widest">{post.category || 'Insight'}</Badge>
                    <h1 className="text-4xl lg:text-5xl font-black text-[#111827] mb-8 leading-tight">{post.title}</h1>

                    <div className="flex items-center gap-6 mb-12 py-6 border-y border-black/5 text-sm font-bold text-slate-500">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{post.author || 'Heems Team'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : 'Date'}</span>
                        </div>
                    </div>

                    {post.image_url && (
                        <div className="mb-12 rounded-[2rem] overflow-hidden aspect-video shadow-xl shadow-black/5">
                            <img
                                src={post.image_url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:text-[#111827] prose-p:text-slate-600 prose-a:text-[#1a9e8c]">
                        {/* Simple rendering for now, can be upgraded to Markdown or HTML */}
                        <div className="whitespace-pre-wrap">{post.content}</div>
                    </div>
                </article>
            </main>
            <Footer />
        </div>
    );
};

export default BlogPost;
