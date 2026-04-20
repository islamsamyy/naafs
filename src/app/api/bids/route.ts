import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as bidService from '@/lib/services/bidService';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const bid = await bidService.submitBid({
      project_id: body.project_id,
      freelancer_id: user.id,
      amount: body.amount,
      delivery_time: body.delivery_time,
      message: body.message,
    });

    return NextResponse.json(bid, { status: 201 });
  } catch (error) {
    console.error('Error submitting bid:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('project_id');

    if (!projectId) {
      return NextResponse.json(
        { error: 'project_id query parameter required' },
        { status: 400 }
      );
    }

    const bids = await bidService.getBidsForProject(projectId);
    return NextResponse.json(bids);
  } catch (error) {
    console.error('Error fetching bids:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
