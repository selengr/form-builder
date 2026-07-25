import { NextRequest, NextResponse } from 'next/server';
import packageJson from '@/../package.json';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const app = url.searchParams.get('app') || packageJson.name;

  const versions: any = {
    default: packageJson.version,
  };

  const version = versions[app] || versions.default;

  return NextResponse.json({ app, version });
}
