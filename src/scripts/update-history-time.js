// Script to directly update historyTime field in MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Define a simple Shipment schema for this script
const shipmentSchema = new mongoose.Schema({
  trackingNumber: String,
  historyTime: String
});

const Shipment = mongoose.model('Shipment', shipmentSchema);

// Update function
const updateHistoryTime = async () => {
  try {
    // Get tracking number from command line arguments
    const trackingNumber = process.argv[2];
    const historyTime = process.argv[3] || '12:00'; // Default to 12:00 if not provided
    
    if (!trackingNumber) {
      console.error('Please provide a tracking number as the first argument');
      process.exit(1);
    }
    
    console.log(`Updating shipment ${trackingNumber} with history time ${historyTime}`);
    
    // Find the shipment and update it
    const result = await Shipment.updateOne(
      { trackingNumber },
      { $set: { historyTime } },
      { upsert: false }
    );
    
    console.log('Update result:', result);
    
    if (result.matchedCount === 0) {
      console.log('No shipment found with that tracking number');
    } else if (result.modifiedCount === 0) {
      console.log('Shipment found but no changes were made');
    } else {
      console.log('Shipment updated successfully');
    }
    
    // Verify the update
    const updatedShipment = await Shipment.findOne({ trackingNumber });
    console.log('Updated shipment:', updatedShipment);
    
  } catch (error) {
    console.error('Error updating shipment:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
};

// Run the script
connectDB().then(() => {
  updateHistoryTime();
});
