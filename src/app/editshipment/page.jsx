"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import style from "./page.module.css";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import Link from "next/link";

// Main component that wraps the content in Suspense
export default function EditShipment() {
  return (
    <Suspense fallback={<div className={style.loadingContainer}><div className={style.loader}></div><p>Loading...</p></div>}>
      <EditShipmentContent />
    </Suspense>
  );
}

// Component to handle the search params
function EditShipmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shipmentId = searchParams.get('id');
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [notyf, setNotyf] = useState(null);

  // Shipment form states
  const [sender, setSender] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [senderAddress, setSenderAddress] = useState("");
  
  // Receiver states
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiver, setReceiver] = useState("");
  const [receiverNumber, setReceiverNumber] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  
  // Shipment details
  const [shipmentType, setShipmentType] = useState("");
  const [weight, setWeight] = useState("");
  const [courier, setCourier] = useState("");
  const [packages, setPackages] = useState("");
  const [mode, setMode] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [totalFreight, setTotalFreight] = useState("");
  const [carrier, setCarrier] = useState("");
  const [carrierReferenceNo, setCarrierReferenceNo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [shipmentStatus, setShipmentStatus] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [comments, setComments] = useState("");
  const [heldInCountry, setHeldInCountry] = useState("");
  const [historyTime, setHistoryTime] = useState("12:00"); // Default to 12:00 for testing

  // List of countries for dropdown
  const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France",
    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary",
    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
    "Jamaica", "Japan", "Jordan",
    "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
    "Oman",
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar",
    "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
    "Yemen",
    "Zambia", "Zimbabwe"
  ];
  
  // Shipment status options
  const statusOptions = [
    "Out for Delivery",
    "Pending",
    "Pick Up",
    "On Hold",
    "In Transit",
    "En Route",
    "Cancelled",
    "Delivered",
    "Return",
    "Insurance",
    "City Permit",
    "Quarantine",
    "Crate",
    "Pending Delivery"
  ];
  
  // Payment method options
  const paymentMethods = [
    "Credit Card",
    "Cash",
    "Cheque",
    "BACS Bank Transfer",
    "Amazon Gift Card",
    "Western Union",
    "MoneyGram",
    "Steam Wallet Gift Card",
    "iTunes Gift Card",
    "RIA Money",
    "Bitcoin",
    "Cash App"
  ];

  useEffect(() => {
    // Initialize Notyf notification library
    if (typeof window !== 'undefined' && !notyf) {
      const notyfInstance = new Notyf({
        duration: 3000,
        position: { x: 'right', y: 'top' },
        types: [
          {
            type: 'success',
            background: '#28a745',
            icon: false
          },
          {
            type: 'error',
            background: '#dc3545',
            icon: false
          }
        ]
      });
      setNotyf(notyfInstance);
    }
  }, []);

  // Fetch shipment data when component mounts
  useEffect(() => {
    if (!shipmentId || shipmentId === 'undefined') {
      setError("No valid shipment ID provided");
      setIsLoading(false);
      return;
    }

    const fetchShipmentData = async () => {
      try {
        console.log("Fetching shipment data for ID:", shipmentId);
        
        // Clean up the tracking ID - remove any spaces or special characters
        const cleanTrackingId = shipmentId.trim();
        
        if (!cleanTrackingId) {
          throw new Error("Invalid tracking ID format");
        }
        
        const response = await fetch('/api/getShipment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trackingNumber: cleanTrackingId }),
        });

        const data = await response.json();
        console.log("API response:", data);

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch shipment data');
        }

        if (data.shipmentData) {
          const shipment = data.shipmentData;
          console.log("Shipment data loaded successfully:", shipment);
          
          // Populate form fields with shipment data
          setSender(shipment.sender || '');
          setSenderEmail(shipment.senderEmail || '');
          setSenderNumber(shipment.senderNumber || '');
          setSenderAddress(shipment.senderAddress || '');
          
          setReceiver(shipment.receiver || '');
          setReceiverEmail(shipment.receiverEmail || '');
          setReceiverNumber(shipment.receiverNumber || '');
          setReceiverAddress(shipment.receiverAddress || '');
          
          setShipmentType(shipment.shipmentType || '');
          setWeight(shipment.weight || '');
          setCourier(shipment.courier || '');
          setPackages(shipment.packages || '');
          setMode(shipment.mode || '');
          setProduct(shipment.product || '');
          setQuantity(shipment.quantity || '');
          setTotalFreight(shipment.totalFreight || '');
          setCarrier(shipment.carrier || '');
          setCarrierReferenceNo(shipment.carrierReferenceNo || '');
          // Handle departure date and time properly
          // Set departure date if it exists
          if (shipment.departureDate) {
            setDepartureDate(shipment.departureDate);
          } else if (shipment.departureTime && shipment.departureTime.includes('-')) {
            // Old format: departureTime contains the date
            setDepartureDate(shipment.departureTime);
          } else {
            setDepartureDate('');
          }
          
          // Always set departure time if it exists
          // Check if it's a time format (not containing date separators)
          if (shipment.departureTime && !shipment.departureTime.includes('-')) {
            setDepartureTime(shipment.departureTime);
          } else if (shipment.departureTime && shipment.departureTime.includes(':')) {
            // Extract time portion if it's in a datetime format
            const timePart = shipment.departureTime.split(' ')[1];
            if (timePart) setDepartureTime(timePart);
          }
          setOrigin(shipment.origin || '');
          setDestination(shipment.destination || '');
          setPaymentMethod(shipment.paymentMethod || '');
          setShipmentStatus(shipment.status || '');
          setPickupDate(shipment.pickupDate || '');
          setPickupTime(shipment.pickupTime || '');
          setExpectedDeliveryDate(shipment.estimatedDeliveryDate || '');
          setComments(shipment.comments || '');
          setHeldInCountry(shipment.heldInCountry || '');
          setHistoryTime(shipment.historyTime || '');
        } else {
          setError('Shipment not found');
          if (notyf) notyf.error('Shipment not found');
        }
      } catch (error) {
        console.error('Error fetching shipment:', error);
        setError('Failed to load shipment data. Please try again.');
        if (notyf) notyf.error('Failed to load shipment data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipmentData();
  }, [shipmentId, notyf]);

  const handleUpdateShipment = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!sender || !receiver || !origin || !destination) {
      setError("Please fill in all required fields (Sender, Receiver, Origin, Destination)");
      if (notyf) notyf.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      console.log("Preparing to update shipment:", shipmentId);
      
      // Prepare shipment data for update - send all form fields directly
      // Log the departure date to debug
      console.log('Submitting departure date:', departureDate);
      
      const shipmentData = {
        trackingNumber: shipmentId,
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
        departureDate: departureDate, // Explicitly set departure date
        departureTime,
        origin,
        destination,
        paymentMethod,
        status: shipmentStatus,
        pickupDate,
        pickupTime,
        expectedDeliveryDate: expectedDeliveryDate,
        heldInCountry,
        historyTime,
        comments
      };
      
      console.log("Sending update data:", shipmentData);
      console.log("History time being sent:", historyTime);
      
      // Ensure historyTime is explicitly set and not undefined
      if (shipmentData.historyTime === undefined || shipmentData.historyTime === null) {
        shipmentData.historyTime = "12:00"; // Default value for testing
        console.log("Setting default history time:", shipmentData.historyTime);
      }
      console.log("History time being sent:", historyTime);
      
      // Send update request to API
      const response = await fetch('/api/updateShipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipmentData),
      });
      
      // Also send a direct update for history time to ensure it's saved
      console.log("Sending direct history time update:", historyTime);
      const historyTimeResponse = await fetch('/api/directUpdateHistoryTime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackingNumber: shipmentId,
          historyTime: historyTime || "12:00"
        }),
      });
      
      const historyTimeResult = await historyTimeResponse.json();
      console.log("Direct history time update result:", historyTimeResult);
      
      const data = await response.json();
      console.log("Update response:", data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update shipment');
      }
      
      setSuccess('Shipment updated successfully');
      if (notyf) notyf.success('Shipment updated successfully');
      
      // Redirect back to admin page after a short delay
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
      
    } catch (error) {
      console.error('Error updating shipment:', error);
      setError(error.message || 'Failed to update shipment. Please try again.');
      if (notyf) notyf.error(error.message || 'Failed to update shipment');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={style.loadingContainer}>
        <div className={style.loader}></div>
        <p>Loading shipment data...</p>
      </div>
    );
  }

  return (
    <div className={style.editShipmentContainer}>
      <div className={style.header}>
        <h1>Edit Shipment</h1>
        <p>Tracking ID: {shipmentId}</p>
        <Link href="/admin" className={style.backButton}>
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </Link>
      </div>

      {error && (
        <div className={style.errorAlert}>
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className={style.successAlert}>
          <i className="fas fa-check-circle"></i>
          <p>{success}</p>
        </div>
      )}

      <form onSubmit={handleUpdateShipment} className={style.shipmentForm}>
        <div className={style.formSection}>
          <h3 className={style.sectionTitle}>
            <i className="fas fa-user"></i>
            Sender Information
          </h3>
          <div className={style.formGrid}>
            <div className={style.formGroup}>
              <label htmlFor="sender">Sender Name</label>
              <input
                type="text"
                id="sender"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                placeholder="Enter sender's full name"
                required
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="senderEmail">Email</label>
              <input
                type="email"
                id="senderEmail"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="Enter sender's email"
                required
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="senderNumber">Phone Number</label>
              <input
                type="tel"
                id="senderNumber"
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                placeholder="Enter sender's phone number"
                required
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="senderAddress">Address</label>
              <textarea
                id="senderAddress"
                value={senderAddress}
                onChange={(e) => setSenderAddress(e.target.value)}
                placeholder="Enter sender's complete address"
                required
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className={style.formSection}>
          <h3 className={style.sectionTitle}>
            <i className="fas fa-user-check"></i>
            Receiver Information
          </h3>
          <div className={style.formGrid}>
            <div className={style.formGroup}>
              <label htmlFor="receiver">Receiver Name</label>
              <input
                type="text"
                id="receiver"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="Enter receiver's full name"
                required
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="receiverEmail">Email</label>
              <input
                type="email"
                id="receiverEmail"
                value={receiverEmail}
                onChange={(e) => setReceiverEmail(e.target.value)}
                placeholder="Enter receiver's email"
                required
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="receiverNumber">Phone Number</label>
              <input
                type="tel"
                id="receiverNumber"
                value={receiverNumber}
                onChange={(e) => setReceiverNumber(e.target.value)}
                placeholder="Enter receiver's phone number"
                required
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="receiverAddress">Address</label>
              <textarea
                id="receiverAddress"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
                placeholder="Enter receiver's complete address"
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div className={style.formSection}>
          <h3 className={style.sectionTitle}>
            <i className="fas fa-box"></i>
            Shipment Details
          </h3>
          <div className={style.formGrid}>
            <div className={style.formGroup}>
              <label htmlFor="origin">Origin</label>
              <select
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
              >
                <option value="">Select Origin Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="destination">Destination</label>
              <select
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              >
                <option value="">Select Destination Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="shipmentType">Shipment Type</label>
              <input
                type="text"
                id="shipmentType"
                value={shipmentType}
                onChange={(e) => setShipmentType(e.target.value)}
                placeholder="e.g., Commercial, Personal"
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="weight">Weight</label>
              <input
                type="text"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 25kg"
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="mode">Shipping Mode</label>
              <input
                type="text"
                id="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                placeholder="e.g., Air Freight, Sea Freight"
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="courier">Courier</label>
              <input
                type="text"
                id="courier"
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                placeholder="Courier service name"
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="packages">Packages</label>
              <input
                type="text"
                id="packages"
                value={packages}
                onChange={(e) => setPackages(e.target.value)}
                placeholder="Number of packages"
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="product">Product</label>
              <input
                type="text"
                id="product"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="Product type"
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="quantity">Quantity</label>
              <input
                type="text"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="totalFreight">Total Freight</label>
              <input
                type="text"
                id="totalFreight"
                value={totalFreight}
                onChange={(e) => setTotalFreight(e.target.value)}
                placeholder="e.g., $350"
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="carrier">Carrier</label>
              <input
                type="text"
                id="carrier"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="Carrier name"
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="carrierReferenceNo">Carrier Reference No.</label>
              <input
                type="text"
                id="carrierReferenceNo"
                value={carrierReferenceNo}
                onChange={(e) => setCarrierReferenceNo(e.target.value)}
                placeholder="Reference number"
              />
            </div>
          </div>
        </div>

        <div className={style.formSection}>
          <h3 className={style.sectionTitle}>
            <i className="fas fa-calendar-alt"></i>
            Scheduling & Status
          </h3>
          <div className={style.formGrid}>
            <div className={style.formGroup}>
              <label htmlFor="departureDate">Departure Date</label>
              <input
                type="date"
                id="departureDate"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="departureTime">Departure Time</label>
              <input
                type="time"
                id="departureTime"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="pickupDate">Pickup Date</label>
              <input
                type="date"
                id="pickupDate"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="pickupTime">Pickup Time</label>
              <input
                type="time"
                id="pickupTime"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="expectedDeliveryDate">Expected Delivery Date</label>
              <input
                type="date"
                id="expectedDeliveryDate"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="shipmentStatus">Shipment Status</label>
              <select
                id="shipmentStatus"
                value={shipmentStatus}
                onChange={(e) => setShipmentStatus(e.target.value)}
                required
              >
                <option value="">Select Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="heldInCountry">
                Package Location
              </label>
              <select
                id="heldInCountry"
                value={heldInCountry}
                onChange={(e) => setHeldInCountry(e.target.value)}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="historyTime">History Time</label>
              <input
                type="time"
                id="historyTime"
                value={historyTime || ''}
                onChange={(e) => {
                  const newTime = e.target.value;
                  console.log('Setting history time:', newTime);
                  // Make sure we're setting a non-empty string
                  setHistoryTime(newTime || '');
                }}
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Select Payment Method</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
            </div>
            
            <div className={style.formGroup + ' ' + style.fullWidth}>
              <label htmlFor="comments">Comments</label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Additional notes or special instructions"
                rows="4"
              ></textarea>
            </div>
          </div>
        </div>

        <div className={style.formActions}>
          <Link href="/admin" className={style.cancelButton}>
            Cancel
          </Link>
          <button type="submit" className={style.submitButton} disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Shipment'}
          </button>
        </div>
      </form>
    </div>
  );
}
