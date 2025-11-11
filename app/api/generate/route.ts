import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN || '',
    });

    // Using a video generation model - Luma AI or similar
    const prediction = await replicate.predictions.create({
      version: "fbacf3c4d4ee831748d6af7f1ba4dd56c6ac2eb01c5c8e3d1e9c7c1ad6e08781",
      input: {
        prompt: prompt,
        num_frames: 48,
        num_inference_steps: 30,
        guidance_scale: 7.5,
      },
    });

    return NextResponse.json({
      id: prediction.id,
      status: prediction.status
    });
  } catch (error: any) {
    console.error('Error generating video:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate video' },
      { status: 500 }
    );
  }
}
