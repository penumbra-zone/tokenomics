import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

const UPLOAD_SECRET = process.env.UPLOAD_SECRET_TOKEN;

export async function POST(
  req: NextRequest,
  { params }: { params: { sectionId: string } }
) {
  // Check for our custom secret token for API access
  const requestToken = req.headers.get('X-Upload-Token');
  if (!UPLOAD_SECRET || requestToken !== UPLOAD_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sectionId } = params;

  if (!sectionId) {
    return NextResponse.json({ error: 'sectionId is required' }, { status: 400 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    const fileExtension = file.name.split('.').pop() || 'png';
    const blobFilename = `og-images/${sectionId}.${fileExtension}`;

    const blob = await put(blobFilename, file, {
      access: 'public',
      allowOverwrite: true,
      contentType: file.type,
      cacheControlMaxAge: 31536000,
    });

    return NextResponse.json({
      message: 'Image uploaded successfully to Vercel Blob',
      filename: blobFilename,
      url: blob.url,
      path: new URL(blob.url).pathname,
    });

  } catch (error) {
    console.error('Error uploading image to Vercel Blob:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: 'Failed to upload image', details: errorMessage }, { status: 500 });
  }
}
