import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises'; // Using promises version for async/await
import { mkdirSync } from 'fs';

export const runtime = 'nodejs'; // Required for file system access

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'og-images');
const UPLOAD_SECRET = process.env.UPLOAD_SECRET_TOKEN;

// Ensure the upload directory exists
try {
  mkdirSync(UPLOAD_DIR, { recursive: true });
} catch (error) {
  console.error('Failed to create upload directory:', UPLOAD_DIR, error);
  // Depending on the setup, you might want to throw an error here
  // or handle it if the server should still start.
}

export async function POST(
  req: NextRequest,
  { params }: { params: { sectionId: string } }
) {
  // Check for secret token
  const token = req.headers.get('X-Upload-Token');
  if (!UPLOAD_SECRET || token !== UPLOAD_SECRET) {
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

    // Basic validation (you MUST add more robust validation in production)
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    // Determine file extension
    const fileExtension = file.name.split('.').pop() || 'png'; // Default to png if no extension
    const filename = `${sectionId}.${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, filename);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      message: 'Image uploaded successfully',
      filename,
      path: `/og-images/${filename}`,
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: 'Failed to upload image', details: errorMessage }, { status: 500 });
  }
} 