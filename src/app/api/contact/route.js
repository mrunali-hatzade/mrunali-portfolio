import prisma from "@/lib/prisma";
import { sendContactEmail } from "@/lib/email";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Simple validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Save message to SQLite database
    const savedMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || null,
        message
      }
    });

    // Send email notification
    let emailResult = { success: false, reason: "Not sent" };
    try {
      emailResult = await sendContactEmail({ name, email, subject, message });
    } catch (emailErr) {
      console.error("Failed to send email notification:", emailErr);
      // We do not fail the request if the database save succeeded,
      // but we log it and can return email status.
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Message saved successfully!", 
        data: savedMessage,
        emailNotification: emailResult 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Error in contact API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error. Could not save message." },
      { status: 500 }
    );
  }
}

