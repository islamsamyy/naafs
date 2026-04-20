'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Trophy, 
  Users, 
  TrendingUp,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { Project, Bid, SubmitBidArgs } from '@/types/marketplace';
import LiveTicker from '@/components/bidding/LiveTicker';
import PlaceBidForm from '@/components/bidding/PlaceBidForm';
import BidSelectionList from '@/components/bidding/BidSelectionList';
import EscrowBadge from '@/components/lifecycle/EscrowBadge';
import DeliveryUploadForm from '@/components/lifecycle/DeliveryUploadForm';
import ClientReviewPanel from '@/components/lifecycle/ClientReviewPanel';
import MilestoneTracker from '@/components/lifecycle/MilestoneTracker';
import DeliverablesList from '@/components/lifecycle/DeliverablesList';
import ProjectTimeline from '@/components/lifecycle/ProjectTimeline';

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [deliverables, setDeliverables] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Get current user session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
    };
    checkUser();

    // Initial fetch
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            client:profiles!projects_client_id_fkey(name, avatar_url),
            bids(*)
          `)
          .eq('id', projectId)
          .single();

        if (error) throw error;
        setProject(data as Project);

        // Fetch milestones
        const { data: milestonesData } = await supabase
          .from('project_milestones')
          .select('*')
          .eq('project_id', projectId)
          .order('order_index', { ascending: true });
        setMilestones(milestonesData || []);

        // Fetch deliverables
        const { data: deliverablesData } = await supabase
          .from('project_deliverables')
          .select('*, submitted_by:profiles(name, avatar_url)')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false });
        setDeliverables(deliverablesData || []);

        // Fetch activities
        const { data: activitiesData } = await supabase
          .from('project_activities')
          .select('*, user:profiles(name, avatar_url)')
          .eq('project_id', projectId)
          .order('created_at', { ascending: false })
          .limit(20);
        setActivities(activitiesData || []);
      } catch (err: any) {
        console.error('Error fetching project:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();

    // Subscribe to project changes for status updates
    const projectSub = supabase
      .channel(`project-detail-${projectId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'projects', filter: `id=eq.${projectId}` },
        (payload) => {
          setProject(prev => prev ? { ...prev, ...payload.new } : null);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectSub);
    };
  }, [projectId]);

  const handleBidSubmit = async (args: SubmitBidArgs) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('bids')
        .insert({
          project_id: projectId,
          freelancer_id: currentUser.id,
          amount: args.p_amount,
          delivery_time: `${args.p_days} days`,
          message: args.p_proposal,
          status: 'pending'
        });

      if (error) throw error;
      
      // Notify client (optional but good)
      await supabase.from('notifications').insert({
        user_id: project?.client_id,
        type: 'new_bid',
        title: 'عرض جديد!',
        body: `تلقيت عرضاً جديداً على مشروعك: ${project?.title}`,
        link: `/projects/${projectId}`
      });

      toast.success('تم إرسال عرضك بنجاح!');
      // Give some time for the toast to be seen before reload
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error('Error submitting bid:', err);
      toast.error('خطأ في إرسال العرض: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#1A4FD6] mb-4" />
        <h2 className="text-xl font-black text-[#0A0E1A]">جاري تحميل البيانات...</h2>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-red-50 rounded-3xl border border-red-100 p-8">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-black text-red-700 mb-2">عذراً، حدث خطأ ما</h2>
        <p className="text-red-600">{error || 'لم يتم العثور على المشروع'}</p>
      </div>
    );
  }

  const isClient = currentUser?.id === project.client_id;
  const hasWinningBid = !!project.awarded_freelancer_id;

  return (
    <div className="space-y-8 rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* ── Header Segment ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] p-8 border border-[#E8ECF4] shadow-sm">
            <div className="flex flex-wrap items-center gap-3 mb-6">
               <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide ${
                  project.status === 'open' ? 'bg-[#E6FAF8] text-[#00C2A8]' :
                  project.status === 'in_progress' ? 'bg-[#FFF2E6] text-[#FF8A00]' :
                  'bg-[#F0F3FA] text-[#3D4560]'
               }`}>
                 {project.status === 'open' ? 'نشط للمنافسة' : project.status}
               </span>
               <div className="flex items-center gap-1.5 text-xs text-[#8892A4] font-bold">
                 <Calendar className="w-3.5 h-3.5" />
                 {new Date(project.created_at).toLocaleDateString('ar-EG')}
               </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-[#0A0E1A] mb-6 leading-tight">
              {project.title}
            </h1>

            <p className="text-lg text-[#3D4560] leading-relaxed mb-8 whitespace-pre-wrap">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2.5">
              {project.skills?.map(skill => (
                <span key={skill} className="px-4 py-2 rounded-xl text-sm font-bold bg-[#F8FAFF] text-[#1A4FD6] border border-[#E1E8F7]">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Client Specific Views: Manage Bids */}
          {isClient && project.status === 'open' && (
             <div className="bg-white rounded-[2rem] p-8 border border-[#E8ECF4] shadow-sm">
               <h2 className="text-xl font-black text-[#0A0E1A] mb-6">إدارة العروض المقدمة</h2>
               <BidSelectionList bids={project?.bids || []} isClient={isClient} allowAccept={project.status === 'open'} onAccept={async (bidId) => {
                  try {
                    const acceptedBid = project?.bids?.find(b => b.id === bidId);
                    if (!acceptedBid) throw new Error('العرض غير موجود');

                    // 1. Accept the selected bid
                    const { error: bidError } = await supabase
                      .from('bids')
                      .update({ status: 'accepted' })
                      .eq('id', bidId);
                    if (bidError) throw bidError;

                    // 2. Reject all other bids on this project
                    const otherBidIds = (project?.bids || [])
                      .filter(b => b.id !== bidId)
                      .map(b => b.id);
                    if (otherBidIds.length > 0) {
                      await supabase
                        .from('bids')
                        .update({ status: 'rejected' })
                        .in('id', otherBidIds);
                    }

                    // 3. Update project: set status to in_progress and awarded_freelancer_id
                    const { error: projError } = await supabase
                      .from('projects')
                      .update({
                        status: 'in_progress',
                        awarded_freelancer_id: acceptedBid.freelancer_id,
                      })
                      .eq('id', projectId);
                    if (projError) throw projError;

                    // 4. Create escrow ledger entry
                    await supabase.from('escrow_ledger').insert({
                      project_id: projectId,
                      amount: acceptedBid.amount,
                      status: 'held',
                      milestone_title: 'الدفعة الأولية - ضمان المشروع',
                    }).then(res => {
                      if (res.error) console.warn('Escrow ledger insert skipped (table may not exist):', res.error.message);
                    });

                    // 5. Notify the freelancer
                    await supabase.from('notifications').insert({
                      user_id: acceptedBid.freelancer_id,
                      type: 'bid_accepted',
                      title: 'تم قبول عرضك! 🎉',
                      body: `تهانينا! تم قبول عرضك على مشروع "${project?.title}". يمكنك البدء بالعمل الآن.`,
                      link: `/projects/${projectId}`,
                    }).then(res => {
                      if (res.error) console.warn('Notification insert skipped:', res.error.message);
                    });

                    toast.success('تم قبول العرض بنجاح! سيبدأ المشروع الآن.');
                    setTimeout(() => window.location.reload(), 1500);
                  } catch (err: any) {
                    console.error('Error accepting bid:', err);
                    toast.error('فشل في قبول العرض: ' + (err.message || 'خطأ غير متوقع'));
                  }
                }} />
             </div>
          )}

          {/* Lifecycle Actions */}
          {project.status === 'in_progress' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[2rem] p-8 border border-[#E8ECF4] shadow-sm">
                <h2 className="text-xl font-black text-[#0A0E1A] mb-6">مرحلة التنفيذ</h2>
                <div className="flex flex-col gap-6">
                  <EscrowBadge status="held" amount={project?.budget_min} />
                  {!isClient && <DeliveryUploadForm projectId={projectId} onSubmit={async () => {}} />}
                  {isClient && <p className="text-sm text-[#8892A4] text-center italic">بانتظار قيام المستقل برفع مخرجات المشروع...</p>}
                </div>
              </div>

              {/* Milestone Tracker */}
              {milestones.length > 0 && (
                <MilestoneTracker
                  milestones={milestones}
                  isFreelancer={!isClient}
                  onMilestoneClick={(milestone) => console.log('Clicked milestone:', milestone)}
                />
              )}

              {/* Deliverables */}
              {(deliverables.length > 0 || !isClient) && (
                <DeliverablesList
                  deliverables={deliverables}
                  isFreelancer={!isClient}
                  isClient={isClient}
                  onAddDeliverable={() => toast.info('Implement deliverable upload')}
                  onApprove={async (id) => { toast.success(`Approved: ${id}`); }}
                  onReject={async (id) => { toast.error(`Rejected: ${id}`); }}
                  onDelete={async (id) => { toast.warning(`Deleted: ${id}`); }}
                />
              )}

              {/* Activity Timeline */}
              {activities.length > 0 && (
                <ProjectTimeline activities={activities} projectTitle={project.title} />
              )}
            </div>
          )}

          {project.status === 'completed' && (
             <div className="bg-white rounded-[2rem] p-8 border border-[#E8ECF4] shadow-sm">
               <h2 className="text-xl font-black text-[#0A0E1A] mb-6">مراجعة المخرجات</h2>
               <ClientReviewPanel deliveryNote="المخرجات المسلمة" onApprove={async () => {}} onRequestRevision={async () => {}} />
             </div>
          )}
        </div>

        {/* Sidebar: Bidding & Stats */}
        <div className="space-y-6">
          {/* Real-time Ticker */}
          <LiveTicker projectId={projectId} />

          {/* Financial Card */}
          <div className="bg-white rounded-[2rem] p-8 border border-[#E8ECF4] shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#1A4FD6]/5 rounded-bl-full pointer-events-none" />
            <div className="relative text-right">
              <p className="text-xs font-black text-[#8892A4] uppercase tracking-widest mb-2">نطاق الميزانية</p>
              <h3 className="text-3xl font-black text-[#1A4FD6] mb-6">
                ${project.budget_min?.toLocaleString()} - ${project.budget_max?.toLocaleString()}
              </h3>
              
              <div className="space-y-4 pt-6 border-t border-[#F0F3FA]">
                <div className="flex items-center justify-between flex-row-reverse">
                  <span className="text-sm text-[#8892A4] font-bold">الضمان المالي</span>
                  <span className="flex items-center gap-1.5 text-sm font-black text-[#00C2A8]">
                    <ShieldCheck className="w-4 h-4" />
                    محمي عبر نافس
                  </span>
                </div>
                <div className="flex items-center justify-between flex-row-reverse">
                  <span className="text-sm text-[#8892A4] font-bold">الموعد النهائي</span>
                  <span className="text-sm font-black text-[#0A0E1A]">
                    {project.deadline ? new Date(project.deadline).toLocaleDateString('ar-EG') : 'غير محدد'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bid Form (For Freelancers) */}
          {!isClient && project.status === 'open' && (
            <div className="bg-white rounded-[2rem] p-8 border border-[#1A4FD6]/20 shadow-xl shadow-[#1A4FD6]/5">
              <div className="flex items-center gap-2 mb-6 flex-row-reverse">
                <Trophy className="w-5 h-5 text-[#FF8A00]" />
                <h3 className="text-xl font-black text-[#0A0E1A]">قدم عرضك الآن</h3>
              </div>
              <PlaceBidForm 
                projectId={projectId} 
                onSubmit={handleBidSubmit} 
                isSubmitting={isSubmitting}
                budgetMin={project.budget_min}
                budgetMax={project.budget_max}
              />
            </div>
          )}

          {/* Project Client Info */}
          <div className="bg-[#FAF9FF] rounded-[2rem] p-6 border border-[#E1E8F7]">
             <div className="flex items-center gap-4 flex-row-reverse">
               <img 
                 src={project.client?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(project.client?.name || '')}&background=1A4FD6&color=fff`} 
                 className="w-14 h-14 rounded-2xl border-2 border-white shadow-sm"
                 alt={project.client?.name}
               />
               <div className="text-right">
                 <p className="text-xs font-bold text-[#8892A4] mb-0.5">صاحب المشروع</p>
                 <h4 className="text-lg font-black text-[#0A0E1A]">{project.client?.name}</h4>
                 <p className="text-[10px] font-black text-[#1A4FD6] mt-1 bg-[#1A4FD6]/10 px-2 py-0.5 rounded-md inline-block">عميل موثوق</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
