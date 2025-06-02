import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob'; // Import the put function from Vercel Blob SDK

export const runtime = 'nodejs'; // Can remain nodejs, or switch to 'edge' if preferred and no other Node.js specific APIs are used.

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

    // Construct the filename for Vercel Blob (e.g., og-images/summary.png)
    // You can include subdirectories in the pathname if desired.
    const fileExtension = file.name.split('.').pop() || 'png';
    const blobFilename = `og-images/${sectionId}.${fileExtension}`;

    // Upload the file to Vercel Blob
    // The BLOB_READ_WRITE_TOKEN environment variable will be used automatically by the SDK.
    const blob = await put(blobFilename, file, {
      access: 'public', // Make the blob publicly accessible
      // addRandomSuffix: false, // Optional: set to false if you want exact filenames, true by default to prevent overwrites
      contentType: file.type, // Optional: Vercel Blob usually infers this, but good to set
      cacheControlMaxAge: 31536000, // Optional: set cache control for a year (same as before)
    });

    // The `blob.url` will be the public URL of the uploaded file
    return NextResponse.json({
      message: 'Image uploaded successfully to Vercel Blob',
      filename: blobFilename, // This is the path in the blob store
      url: blob.url, // The publicly accessible URL
      path: new URL(blob.url).pathname, // For consistency if your client expects a 'path' field
    });

  } catch (error) {
    console.error('Error uploading image to Vercel Blob:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: 'Failed to upload image', details: errorMessage }, { status: 500 });
  }
}
