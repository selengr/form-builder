import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mime from 'mime';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const filename = url.searchParams.get('file');
  const folder = path.basename(url.searchParams.get('folder') || '');

  if (!filename) {
    return new NextResponse('Missing file param', { status: 400 });
  }

  const safeFilename = path.basename(filename);
  const imagePath = path.join(process.cwd(), 'src/images', folder, safeFilename);

  if (!fs.existsSync(imagePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  const fetchDest = req.headers.get('sec-fetch-dest');
  const acceptHeader = req.headers.get('accept') || '';

  const isImageRequest = fetchDest === 'image' || acceptHeader.includes('image/');

  if (!isImageRequest) {
    return new NextResponse('Unauthorized', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(imagePath);
  const contentType = mime.getType(imagePath) || 'application/octet-stream';

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': 'inline',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
