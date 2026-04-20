import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as bidService from '@/lib/services/bidService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    if (body.action === 'accept') {
      const bid = await bidService.acceptBid(id, body.project_id);
      return NextResponse.json(bid);
    } else if (body.action === 'reject') {
      const bid = await bidService.rejectBid(id);
      return NextResponse.json(bid);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error updating bid:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
