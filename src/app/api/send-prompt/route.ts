import { NextResponse } from 'next/server';
import getOpenAIInstance from '../api';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const prompt = body.prompt;
        const openai = getOpenAIInstance();

        const stream = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: 'You must answer in json responses only' },{ role: "user", content: prompt }],
            stream: true,
        });

        // Convert OpenAI stream to ReadableStream for NextResponse
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        if (chunk.choices[0]?.delta?.content) {
                            controller.enqueue(chunk.choices[0].delta.content);
                        }
                    }
                    controller.close();
                } catch (err) {
                    controller.error(err);
                    console.error('Stream error:', err);
                }
            }
        });

        return new NextResponse(readableStream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.error();
    }
}
