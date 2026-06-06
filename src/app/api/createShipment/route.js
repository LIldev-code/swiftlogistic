import Shipment from "@/models/Shipment";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";
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
