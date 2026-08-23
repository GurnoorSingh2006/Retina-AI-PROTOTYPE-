import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'UP',
      service: 'RetinaAI Next.js Frontend',
      timestamp: new Date().toISOString(),
      message: 'Frontend is awake and operational on Render'
    },
    { status: 200 }
  );
}
