import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
    redirectTo?: string;
}

// Cache for user role to avoid repeated queries
let cachedRole: string | null = null;
let cachedUserId: string | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Check if cache is valid
const isCacheValid = () => {
    return cachedRole && cachedUserId && (Date.now() - cacheTimestamp) < CACHE_DURATION;
};

/**
 * RoleGuard - Protects routes based on user role (Optimized - No Flash)
 */
export default function RoleGuard({ children, allowedRoles, redirectTo }: RoleGuardProps) {
    // Start with authorized if we have valid cache that matches allowed roles
    const initialAuthorized = isCacheValid() && allowedRoles.includes(cachedRole!);

    const [loading, setLoading] = useState(!initialAuthorized);
    const [authorized, setAuthorized] = useState(initialAuthorized);
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();
    const hasChecked = useRef(initialAuthorized);

    const checkAuthorization = useCallback(async (signal?: AbortSignal) => {
        // Skip if already checked or we have valid cached auth
        if (hasChecked.current && authorized) return;
        hasChecked.current = true;

        try {
            // Use getSession() - faster than getUser() as it doesn't validate with server
            const { data: { session } } = await supabase.auth.getSession();

            if (signal?.aborted) return;

            if (!session?.user) {
                setAuthorized(false);
                setLoading(false);
                navigate("/login", { state: { from: location.pathname } });
                return;
            }

            const user = session.user;
            let userRole: string | null = null;

            // Check cache first
            if (isCacheValid() && cachedUserId === user.id) {
                userRole = cachedRole;
            } else {
                // First try user metadata (instant, no API call)
                userRole = user.user_metadata?.role || null;

                // Only query profiles if metadata doesn't have role
                if (!userRole) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user.id)
                        .single();

                    if (signal?.aborted) return;
                    userRole = profile?.role || null;
                }

                // Update cache
                if (userRole) {
                    cachedRole = userRole;
                    cachedUserId = user.id;
                    cacheTimestamp = Date.now();
                }
            }

            if (!userRole) {
                toast({
                    title: "Authorization Error",
                    description: "Could not verify your access permissions. Please contact support.",
                    variant: "destructive",
                });
                setAuthorized(false);
                navigate("/login");
                return;
            }

            if (!allowedRoles.includes(userRole)) {
                toast({
                    title: "Access Denied",
                    description: `This area is restricted to ${allowedRoles.join(', ')} users.`,
                    variant: "destructive",
                });

                const roleRedirects: Record<string, string> = {
                    client: "/client/dashboard",
                    carer: "/carer/dashboard",
                    organisation: "/organisation/dashboard",
                    admin: "/admin/dashboard",
                };

                setAuthorized(false);
                navigate(redirectTo || roleRedirects[userRole] || "/");
                return;
            }

            setAuthorized(true);
        } catch (error: any) {
            if (error.name === 'AbortError' || error.message?.includes('aborted')) {
                return;
            }
            console.error("Auth check error:", error);
            setAuthorized(false);
            navigate("/login");
        } finally {
            setLoading(false);
        }
    }, [allowedRoles, authorized, location.pathname, navigate, redirectTo, toast]);

    useEffect(() => {
        const abortController = new AbortController();
        checkAuthorization(abortController.signal);

        return () => {
            abortController.abort();
        };
    }, [checkAuthorization]);

    // Always render children if authorized (either cached or verified)
    if (authorized) {
        return <>{children}</>;
    }

    // Only show loading if not authorized and still loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return null;
}

// Export function to clear cache on logout
export function clearRoleCache() {
    cachedRole = null;
    cachedUserId = null;
    cacheTimestamp = 0;
}

/**
 * useRoleCheck - Hook to check user role
 */
export function useRoleCheck() {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkRole = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setLoading(false);
                    return;
                }

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                // Use profile role if available, otherwise fallback to metadata
                const userRole = profile?.role || user.user_metadata?.role || null;
                setRole(userRole);
            } catch (error) {
                console.error("Role check error:", error);
            } finally {
                setLoading(false);
            }
        };

        checkRole();
    }, []);

    const redirectToDashboard = () => {
        const roleRedirects: Record<string, string> = {
            client: "/client/dashboard",
            carer: "/carer/dashboard",
            organisation: "/organisation/dashboard",
            admin: "/admin/dashboard",
        };

        if (role) {
            navigate(roleRedirects[role] || "/");
        }
    };

    return { role, loading, redirectToDashboard };
}
