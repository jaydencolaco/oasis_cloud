// app/api/sendProductRequest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';

AWS.config.update({
  region: 'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const sns = new AWS.SNS();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, phone, message, item } = body;

  const msg = `🟢 New Product Request:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nItem: ${item.name}\nMessage: ${message}`;

  const params = {
    Message: msg,
    Subject: 'Product Info Request',
    TopicArn: process.env.SNS_TOPIC_ARN,
  };

  try {
    await sns.publish(params).promise();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('SNS Publish Error:', err);
    return NextResponse.json({ error: 'Failed to send SNS message' }, { status: 500 });
  }
}
