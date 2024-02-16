import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const transporter = nodemailer.createTransport({
    host: "smtp.mail.me.com",
    port: 587,
    auth: {
      user: process.env.GMAILUSER,
      pass: process.env.GMAILPASSWORD,
    },
  });
  const body = await request.json();
  const toHostMailData = {
    from: process.env.GMAILUSER,
    to: "tkd120pg@gmail.com",
    subject: `【お問い合わせ】${body.name}様より`,
    text: body.message + " | Sent from: " + body.email,
    html: `
      <p>【名前】</p>
      <p>${body.name}</p>
      <p>【メッセージ】</p>
      <p>${body.message}</p>
      <p>【メールアドレス】</p>
      <p>${body.email}</p>
    `,
  };

  const mailOptions = {
    from: process.env.GMAILUSER,
    to: body.email,
    subject: "【自動返信】返信をお待ちください。",
    text: `${body.name}様\n\nお問い合わせありがとうございました。\n\n返信までしばらくお待ちください。\n\nお問い合わせ内容\n\n${body.message}`,
  };
  await transporter.sendMail(toHostMailData);
  await transporter.sendMail(mailOptions);

  return NextResponse.json(body);
}
