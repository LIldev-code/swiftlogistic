import Shipment from "@/models/Shipment";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function generateNumericId(length) {
  let result = "";
  const characters = "0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const POST = async (req) => {
  try {
    await dbConnect();

    const {
      sender,
      senderEmail,
      senderNumber,
      senderAddress,
      receiver,
      receiverEmail,
      receiverNumber,
      receiverAddress,
      shipmentType, // Ensure it matches the schema
      weight,
      courier,
      packages,
      mode,
      product,
      quantity,
      totalFreight,
      carrier,
      carrierReferenceNo,
      departureTime,
      origin,
      destination,
      paymentMethod,
      pickupDate,
      pickupTime,
      estimatedDeliveryDate,
      comments,
      productQuantity,
      productType,
      description,
      length,
      width,
      height,
      productWeight,
      status,
      heldInCountry,
    } = await req.json();

    console.log(
      sender,
      senderEmail,
      senderNumber,
      senderAddress,
      receiver,
      receiverEmail,
      receiverNumber,
      receiverAddress,
      shipmentType,
      weight,
      courier,
      packages,
      mode,
      product,
      quantity,
      totalFreight,
      carrier,
      carrierReferenceNo,
      departureTime,
      origin,
      destination,
      paymentMethod,
      pickupDate,
      pickupTime,
      estimatedDeliveryDate,
      comments,
      productQuantity,
      productType,
      description,
      length,
      width,
      height,
      productWeight,
      status
    );

    const trackingNumber = `SW-${generateNumericId(14)}`;

    const foundShipment = await Shipment.findOne({ trackingNumber });
    if (foundShipment) {
      return new NextResponse(
        JSON.stringify({ message: "Shipment for this sender already exists" }),
        { status: 400 }
      );
    }

    const shipmentData = {
      sender,
      senderEmail,
      senderNumber,
      senderAddress,
      receiver,
      receiverEmail,
      receiverNumber,
      receiverAddress,
      shipmentType,
      weight,
      courier,
      packages,
      mode,
      product,
      quantity,
      totalFreight,
      carrier,
      carrierReferenceNo,
      departureTime,
      origin,
      destination,
      paymentMethod,
      pickupDate,
      pickupTime,
      estimatedDeliveryDate,
      comments,
      productQuantity,
      productType,
      description,
      length,
      width,
      height,
      productWeight,
      status,
      heldInCountry,
    };

    if (!shipmentData.departureDate && shipmentData.departureTime && shipmentData.departureTime.includes('-')) {
      // If departureTime contains a date format, move it to departureDate
      shipmentData.departureDate = shipmentData.departureTime;
      shipmentData.departureTime = '';
      console.log('Moved date from departureTime to departureDate:', shipmentData.departureDate);
    }

    const newShipment = new Shipment({
      ...shipmentData,
      packages,
      mode,
      product,
      quantity,
      totalFreight,
      carrier,
      carrierReferenceNo,
      departureTime,
      origin,
      destination,
      paymentMethod,
      pickupDate,
      pickupTime,
      expectedDeliveryDate: estimatedDeliveryDate, // Ensure this matches the schema
      comments,
      productQuantity,
      productType,
      description,
      length,
      width,
      height,
      productWeight,
      trackingNumber,
      status: status || "Out for Delivery", // Use status from request or default
      currentPosition: [0, 0], // Set initial position
    });

    await newShipment.save();

    // Nodemailer configuration
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: `"SwiftCargo" <${process.env.EMAIL_USER}>`,
      to: receiverEmail,
      subject: `Your Shipment has been Created - Tracking Number ${trackingNumber}`,
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 10px;">
        <h1 style="color: #333;">Your shipment has been successfully created!</h1>
        <p style="font-size: 16px; color: #555;">Your tracking number is: <span id="trackingNumber" style="font-weight: bold; color: #000;">${trackingNumber}</span></p>
        <p><a href="https://swiftcargo.com" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Track your shipment</a></p>
        <p style="font-size: 14px; font-weight: 400; margin-top: 20px; color: #555;">Thanks for shipping with us!</p>
      </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }

    return new NextResponse(JSON.stringify(newShipment), { status: 201 });
  } catch (error) {
    console.error("Error creating shipment:", error);
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
};
