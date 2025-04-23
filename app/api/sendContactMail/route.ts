import { createTransport } from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: any) {
  const emailPassword = process.env.EMAIL_PASSWORD;
  const transporter = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "sli.luminaires@gmail.com",
      pass: emailPassword,
    },
  });
  const req = await request.json();
  console.log(req);

  const mailData = {
    from: '"Oasis Luminaires" <sli.luminaires@gmail.com>',
    to: "info@oasisluminaires.com",
    // to: "jaydencolaco20@gmail.com",
    subject: "Contact Request - Oasis Website",
    html: `
    <div>
    You have recieved a new <b>Message</b> on your website<br/>
    Email - ${req.email}<br/>
    Name - ${req.name}<br/>
    Phone No. - ${req.phone}<br/>
    Message - ${req.message}<br/>
    </div>`,
  };

  try {
    const mail = await transporter.sendMail(mailData);
    console.log("Success: " + mail);
    return NextResponse.json({
      status: 200,
      body: { success: true, message: "Message Sent" },
    });
  } catch (error) {
    console.error("Error: " + error);
    return NextResponse.json({
      status: 500,
      body: { success: false, message: "Error" },
    });
  }
}
