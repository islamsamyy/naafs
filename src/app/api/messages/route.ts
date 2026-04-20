import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import * as messagingService from '@/lib/services/messagingService';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const message = await messagingService.sendMessage({
      sender_id: user.id,
      receiver_id: body.receiver_id,
      content: body.content,
      project_id: body.project_id,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const conversationType = searchParams.get('type');

    if (conversationType === 'list') {
      const conversations = await messagingService.getConversations(user.id);
      return NextResponse.json(conversations);
    }

    const partnerId = searchParams.get('partner_id');
    if (!partnerId) {
      return NextResponse.json(
        { error: 'partner_id query parameter required' },
        { status: 400 }
      );
    }

    const messages = await messagingService.getConversation(user.id, partnerId);
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
