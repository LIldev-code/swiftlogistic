import Shipment from "@/models/Shipment";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const POST = async (req, res) => {
  try {
    await dbConnect();

    // Get all data from request - the form now sends all fields directly
    const data = await req.json();
    const { trackingNumber } = data;

    console.log("Updating shipment with tracking number:", trackingNumber);
    console.log("Update data:", data);

    const shipment = await Shipment.findOne({ trackingNumber });

    if (!shipment) {
      return new NextResponse(
        JSON.stringify({ message: "Shipment not found" }),
        { status: 404 }
      );
    }

    // Check if the status has changed
    const statusChanged = shipment.status !== data.status;

    // Update all fields from the form
    // Remove trackingNumber from the data to prevent changing it
    const { trackingNumber: _, ...updateData } = data;
    
    // Ensure departureDate is properly set
    if (updateData.departureDate) {
      console.log('Setting departure date:', updateData.departureDate);
    } else if (updateData.departureTime && updateData.departureTime.includes('-')) {
      // If departureTime contains a date format, move it to departureDate
      updateData.departureDate = updateData.departureTime;
      updateData.departureTime = '';
      console.log('Moved date from departureTime to departureDate:', updateData.departureDate);
    }
    
    // Ensure historyTime is properly set and logged
    console.log('History time in update data:', updateData.historyTime);
    
    // Exclude historyTime and historyDate to set them explicitly after Object.assign
    const { historyTime: historyTimeValue, historyDate: historyDateValue, ...otherUpdateData } = updateData;
    Object.assign(shipment, otherUpdateData);

    const timeToSet = (historyTimeValue !== undefined && historyTimeValue !== null) ? String(historyTimeValue) : '';
    const dateToSet = (historyDateValue !== undefined && historyDateValue !== null) ? String(historyDateValue) : '';

    shipment.set('historyTime', timeToSet);
    shipment.set('historyDate', dateToSet);
    shipment.markModified('historyTime');
    shipment.markModified('historyDate');
    await shipment.save();

    // Send email notification if the status has changed
    if (statusChanged) {
      try {
        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        console.log("Email configuration:", process.env.EMAIL_USER);

        let mailOptions = {
          from: `"SwiftCargo" <${process.env.EMAIL_USER || 'noreply@swiftcargo.com'}>`,
          to: shipment.receiverEmail,
          subject: `Shipment Status Update for Tracking Number ${trackingNumber}`,
          html: ` <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
          <h1 style="font-size: 16px; font-weight: 600; color: #333;">Shipment Status Update</h1>
          <h2 style="font-size: 14px; font-weight: 600; margin-top: 10px;">The status of your shipment with tracking number <span style="color: #007bff; text-decoration: underline; cursor: pointer;">${trackingNumber}</span> has been updated to: ${data.status}.</h2>
          <p style="font-size: 14px; margin-top: 5px;">Comment: ${data.comments || 'No additional comments'}</p>
          <p style="font-size: 14px; font-weight: 400; margin-top: 20px; color: #555;">Thanks for shipping with us!</p>
        </div>`,
        };
        console.log("Sending email to:", shipment.receiverEmail);

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
      } catch (emailError) {
        // Don't fail the whole update if email sending fails
        console.error("Error sending email notification:", emailError);
      }
    }

    return new NextResponse(JSON.stringify({ shipmentData: shipment }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating shipment:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
