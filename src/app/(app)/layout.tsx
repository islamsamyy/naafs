"use client";

import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { createClient } from "@/lib/supabase/client";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userRole, setUserRole] = useState<"freelancer" | "client" | "admin" | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setUserRole("freelancer"); // fallback
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("role, name, avatar_url, title")
          .eq("id", user.id)
          .single();

        if (profile) {
          // Map business_owner to client for sidebar
          const sidebarRole = profile.role === "business_owner" ? "client" : (profile.role || "freelancer");
          setUserRole(sidebarRole as "freelancer" | "client" | "admin");
          setUserProfile(profile);
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        setUserRole("freelancer"); // fallback
      }
    };

    fetchUserRole();
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <AppHeader />
      <AppSidebar
        userRole={userRole || "freelancer"}
        userName={userProfile?.name}
        userTitle={userProfile?.title}
        userImage={userProfile?.avatar_url}
      />
      {/* Main Content Area - Offset for sidebar and header */}
      <main className="lg:pr-64 pt-[68px] pb-8 px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
