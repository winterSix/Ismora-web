import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const token = request.headers.get('x-revalidate-token');
  if (!token || token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ revalidated: false, message: 'Invalid token' }, { status: 401 });
  }

  const tag = request.nextUrl.searchParams.get('tag');
  if (!tag) {
    return NextResponse.json({ revalidated: false, message: 'Missing tag' }, { status: 400 });
  }

  revalidateTag(tag, { expire: 3600 });
  return NextResponse.json({ revalidated: true, tag });
}
