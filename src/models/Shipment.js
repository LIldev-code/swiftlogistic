import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: false,
    },
    receiver: {
      type: String,
      required: false,
    },
    senderEmail: {
      type: String,
      required: false,
    },
    senderNumber: {
      type: String,
      required: false,
    },
    senderAddress: {
      type: String,
      required: false,
    },
    receiverEmail: {
      type: String,
      required: false,
    },
    receiverNumber: {
      type: String,
      required: false,
    },
    receiverAddress: {
      type: String,
      required: false,
    },
    shipmentType: {
      type: String,
      required: false,
    },
    weight: {
      type: String,
      required: false,
    },
    courier: {
      type: String,
      required: false,
    },
    packages: {
      type: String,
      required: false,
    },
    mode: {
      type: String,
      required: false,
    },
    product: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: false,
    },

    paymentMethod: {
      type: String,
      required: false,
    },
    totalFreight: {
      type: String,
      required: false,
    },
    carrier: {
      type: String,
      required: false,
    },
    carrierReferenceNo: {
      type: String,
      required: false,
    },
    departureDate: {
      type: String,
      required: false,
    },
    departureTime: {
      type: String,
      required: false,
    },
    origin: {
      type: String,
      required: false,
    },
    destination: {
      type: String,
      required: false,
    },
    pickupDate: {
      type: String,
      required: false,
    },
    pickupTime: {
      type: String,
      required: false,
    },
    expectedDeliveryDate: {
      type: String,
      required: false,
    },
    comments: {
      type: String,
      required: false,
    },
    productQuantity: {
      type: Number,
      required: false,
    },
    productType: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    length: {
      type: String,
      required: false,
    },
    width: {
      type: String,
      required: false,
    },
    height: {
      type: String,
      required: false,
    },
    productWeight: {
      type: String,
      required: false,
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    historyTime: {
      type: String,
      required: false,
      default: "",
    },
    historyDate: {
      type: String,
      required: false,
      default: "",
    },
    heldInCountry: {
      type: String,
      required: false,
    },
    currentPosition: {
      type: [Number],
      default: [0, 0],
    },
    currentStep: {
      type: Number,
      default: 0, // Initialize currentStep to 0
    },
  },
  {
    timestamps: true,
  }
);

const Shipment =
  mongoose.models.Shipment || mongoose.model("Shipment", ShipmentSchema);
export default Shipment;
