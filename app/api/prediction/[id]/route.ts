import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN || '',
    });

    const prediction = await replicate.predictions.get(params.id);

    return NextResponse.json({
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
    });
  } catch (error: any) {
    console.error('Error fetching prediction:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch prediction status' },
      { status: 500 }
    );
  }
}
