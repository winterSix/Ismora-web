import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const token = req.headers.get('x-revalidate-token');
    const tag = req.nextUrl.searchParams.get('tag');

    if (token !== process.env.REVALIDATE_TOKEN) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!tag) {
        return NextResponse.json({ error: 'Missing tag' }, { status: 400 });
    }

    revalidateTag(tag, 'max');
    return NextResponse.json({ revalidated: true, tag });
}
