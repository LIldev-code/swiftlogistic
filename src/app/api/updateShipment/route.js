import Shipment from "@/models/Shipment";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";

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
