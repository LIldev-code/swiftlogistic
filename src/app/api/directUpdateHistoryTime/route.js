import Shipment from "@/models/Shipment";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export const POST = async (req, res) => {
  try {
    await dbConnect();

    // Get tracking number and history time from request
    const { trackingNumber, historyTime } = await req.json();
    
    console.log("Direct update request received:");
    console.log("Tracking Number:", trackingNumber);
    console.log("History Time to set:", historyTime);

    if (!trackingNumber) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Tracking number is required" }),
        { status: 400 }
      );
    }

    // Use direct MongoDB update operation
    const result = await Shipment.updateOne(
      { trackingNumber },
      { $set: { historyTime: historyTime || "12:00" } }
    );

    console.log("Direct update result:", result);

    if (result.matchedCount === 0) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Shipment not found" }),
        { status: 404 }
      );
    }

    // Verify the update by fetching the updated document
    const updatedShipment = await Shipment.findOne({ trackingNumber });
    console.log("Updated shipment historyTime:", updatedShipment.historyTime);

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "History time updated successfully",
        historyTime: updatedShipment.historyTime
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating history time:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
};
