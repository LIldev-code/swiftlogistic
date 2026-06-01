"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import style from "./page.module.css";
import ShipmentContext from "@/contexts/ShipmentContext";
import Link from "next/link";
import Image from "next/image";


export default function Admin() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, setUser } = useContext(ShipmentContext);
  
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
  const [shipmentStatus, setShipmentStatus] = useState("Out for Delivery");
  const [heldInCountry, setHeldInCountry] = useState("");
  
  // Package details
  const [packageType, setPackageType] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [packageLength, setPackageLength] = useState("");
  const [packageWidth, setPackageWidth] = useState("");
  const [packageHeight, setPackageHeight] = useState("");
  const [packageWeight, setPackageWeight] = useState("");
  
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
  
  // Package type options
  const packageTypes = [
    "Pallet",
    "Carton",
    "Crate",
    "Loose",
    "Others"
  ];
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [comments, setComments] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Shipment data for dashboard
  const [recentShipments, setRecentShipments] = useState([]);
  
  const [dashboardStats, setDashboardStats] = useState({
    totalShipments: 1248,
    activeShipments: 427,
    completedShipments: 821,
    revenue: '$287,492.00',
    customerSatisfaction: '96%',
    onTimeDelivery: '94.3%'
  });

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      
      // Check if user exists in context
      if (!user) {
        // Try to get from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsLoading(false);
        } else {
          // No user found, redirect to login
          router.push('/login');
        }
      } else {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router, setUser, user]);

  // Initialize dashboard data and load shipments from backend
  useEffect(() => {
    const fetchShipments = async () => {
      setIsLoading(true);
      
      try {
        // Fetch shipments from the backend API
        const response = await fetch('/api/getShipment');
        
        if (!response.ok) {
          throw new Error('Failed to fetch shipments');
        }
        
        const data = await response.json();
        
        if (data.success && data.shipments) {
          // Format shipments for display
          const formattedShipments = data.shipments.map(shipment => ({
            id: shipment.trackingNumber || shipment._id, // Use trackingNumber or fallback to _id
            customer: shipment.sender,
            origin: shipment.origin,
            destination: shipment.destination,
            status: shipment.status,
            date: new Date(shipment.createdAt).toISOString().split('T')[0],
            details: {
              sender: {
                name: shipment.sender,
                email: shipment.senderEmail,
                phone: shipment.senderNumber,
                address: shipment.senderAddress
              },
              receiver: {
                name: shipment.receiver,
                email: shipment.receiverEmail,
                phone: shipment.receiverNumber,
                address: shipment.receiverAddress
              },
              shipment: {
                type: shipment.shipmentType,
                weight: shipment.weight,
                courier: shipment.courier,
                packages: shipment.packages,
                mode: shipment.mode,
                product: shipment.product,
                quantity: shipment.quantity,
                totalFreight: shipment.totalFreight,
                carrier: shipment.carrier,
                referenceNo: shipment.carrierReferenceNo,
                departureTime: shipment.departureTime,
                paymentMethod: shipment.paymentMethod,
                pickupDate: shipment.pickupDate,
                pickupTime: shipment.pickupTime,
                expectedDelivery: shipment.estimatedDeliveryDate,
                comments: shipment.comments
              }
            }
          }));
          
          // Update recent shipments with data from API
          setRecentShipments(formattedShipments);
          
          // Update dashboard stats based on shipments
          const activeCount = formattedShipments.filter(s => s.status !== 'Delivered').length;
          const completedCount = formattedShipments.filter(s => s.status === 'Delivered').length;
          
          setDashboardStats(prev => ({
            ...prev,
            totalShipments: formattedShipments.length,
            activeShipments: activeCount,
            completedShipments: completedCount,
            revenue: `$${(formattedShipments.reduce((sum, s) => {
              const freight = parseFloat(s.details?.shipment?.totalFreight || '0');
              return sum + (isNaN(freight) ? 0 : freight);
            }, 0)).toFixed(2)}`
          }));
        }
      } catch (error) {
        console.error('Error fetching shipments:', error);
        setError('Failed to load shipments. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchShipments();
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    router.push("/login");
  };

  const handleDeleteShipment = async (trackingId) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      setIsLoading(true);
      try {
        // Clean up the tracking ID
        const cleanTrackingId = trackingId.trim();
        
        if (!cleanTrackingId) {
          throw new Error("Invalid tracking ID format");
        }
        
        console.log('Deleting shipment with ID:', cleanTrackingId);
        const response = await fetch('/api/getShipment', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ trackingNumber: cleanTrackingId }),
        });

        const data = await response.json();
        console.log('Delete response:', data);

        if (response.ok) {
          // Remove the deleted shipment from the state
          setRecentShipments(prev => prev.filter(shipment => shipment.id !== trackingId));
          setSuccess('Shipment deleted successfully');
          
          // Update dashboard stats
          setDashboardStats(prev => ({
            ...prev,
            totalShipments: prev.totalShipments - 1,
            activeShipments: prev.activeShipments - 1,
          }));

          // Show success message
          alert('Shipment deleted successfully');
        } else {
          setError(data.message || 'Failed to delete shipment');
          alert(data.message || 'Failed to delete shipment');
        }
      } catch (error) {
        console.error('Error deleting shipment:', error);
        setError('Failed to delete shipment. Please try again.');
        alert('Failed to delete shipment. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddShipment = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!sender || !receiver || !origin || !destination) {
      setError("Please fill in all required fields (Sender, Receiver, Origin, Destination)");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Generate a unique reference number if not provided
      const generatedRefNo = 'SC-' + Math.floor(100000 + Math.random() * 900000);
      
      // Calculate estimated delivery date (7 days from now) if not provided
      const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Prepare shipment data for API with comprehensive default values
      const shipmentData = {
        // Sender information
        sender: sender || '',
        senderEmail: senderEmail || '',
        senderNumber: senderNumber || '',
        senderAddress: senderAddress || '',
        
        // Receiver information
        receiver: receiver || '',
        receiverEmail: receiverEmail || '',
        receiverNumber: receiverNumber || '',
        receiverAddress: receiverAddress || '',
        
        // Shipment details
        shipmentType: shipmentType || '',
        weight: weight || '',
        courier: courier || '',
        packages: packages || '',
        mode: mode || '',
        product: product || '',
        quantity: quantity || '',
        totalFreight: totalFreight || '',
        carrier: carrier || '',
        carrierReferenceNo: carrierReferenceNo || generatedRefNo, // Keeping reference number for tracking
        departureDate: departureDate || '',
        departureTime: departureTime || '',
        origin: origin || '',
        destination: destination || '',
        
        // Payment and scheduling
        paymentMethod: paymentMethod || '',
        pickupDate: pickupDate || '',
        pickupTime: pickupTime || '',
        estimatedDeliveryDate: expectedDeliveryDate || '',
        comments: comments || '',
        
        // Product specifications
        productQuantity: '',
        productType: packageType || '',
        description: packageDescription || '',
        length: packageLength || '',
        width: packageWidth || '',
        height: packageHeight || '',
        productWeight: packageWeight || '',
        
        // Additional shipping details
        shippingMethod: mode || '',
        insurance: '',
        insuranceValue: '',
        customsClearance: '',
        dangerousGoods: '',
        specialInstructions: '',
        status: shipmentStatus,
        heldInCountry: heldInCountry,
        
        // Package details
        packageQty: '',
        packagePrice: '',
        packageType: packageType || 'Commercial',
        packageDescription: packageDescription || 'GOOD'
      };
      
      // Send data to backend API
      const response = await fetch('/api/createShipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipmentData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create shipment');
      }
      
      // The API returns the shipment data directly, not wrapped in a success property
      if (response.ok) {
        // Get the tracking ID from the response
        const trackingId = data.trackingNumber;
        
        // Format the new shipment for display
        const newShipment = {
          id: trackingId,
          customer: sender,
          origin: origin,
          destination: destination,
          status: shipmentStatus,
          date: new Date().toISOString().split('T')[0],
          details: {
            sender: {
              name: sender,
              email: senderEmail,
              phone: senderNumber,
              address: senderAddress
            },
            receiver: {
              name: receiver,
              email: receiverEmail,
              phone: receiverNumber,
              address: receiverAddress
            },
            shipment: {
              type: shipmentType,
              weight: weight,
              courier: courier,
              packages: packages,
              mode: mode,
              product: product,
              quantity: quantity,
              totalFreight: totalFreight,
              carrier: carrier,
              referenceNo: carrierReferenceNo,
              departureDate: departureDate || '',
              departureTime: departureTime || '',
              paymentMethod: paymentMethod,
              pickupDate: pickupDate,
              pickupTime: pickupTime,
              expectedDelivery: expectedDeliveryDate,
              comments: comments
            }
          }
        };
        
        // Update recent shipments list with the new shipment at the top
        const updatedShipments = [newShipment, ...recentShipments];
        setRecentShipments(updatedShipments);
        
        // Update dashboard stats
        setDashboardStats(prev => ({
          ...prev,
          totalShipments: prev.totalShipments + 1,
          activeShipments: prev.activeShipments + 1
        }));
        
        setSuccess(`Shipment added successfully! Tracking ID: ${trackingId}`);
        
        // Reset form fields
        setSender("");
        setSenderEmail("");
        setSenderNumber("");
        setSenderAddress("");
        setReceiver("");
        setReceiverEmail("");
        setReceiverNumber("");
        setReceiverAddress("");
        setShipmentType("");
        setPackageType("");
        setPackageDescription("");
        setProduct("");
        setQuantity("");
        setTotalFreight("");
        setCarrier("");
        setCarrierReferenceNo("");
        setDepartureDate("");
        setDepartureTime("");
        setOrigin("");
        setDestination("");
        setPaymentMethod("");
        setPickupDate("");
        setPickupTime("");
        setExpectedDeliveryDate("");
        setComments("");
        
        // Switch to dashboard view to show the new shipment
        setActiveSection("dashboard");
      } else {
        throw new Error(data.message || 'Failed to create shipment');
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
      setError(error.message || "Failed to add shipment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderShipments = () => (
    <div className={style.dashboardContent}>
      <div className={style.dashboardHeader}>
        <h2>Shipments Management</h2>
        <div className={style.dashboardActions}>
          <div className={style.dateFilter}>
            <i className="fas fa-calendar"></i>
            <span>May 1 - May 8, 2025</span>
          </div>
          <button className={style.refreshButton}>
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>
      </div>

      <div className={style.tableContainer} style={{ marginTop: '20px' }}>
        <table className={style.shipmentsTable}>
          <thead>
            <tr>
              <th>Tracking ID</th>
              <th>Customer</th>
              <th>Route</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentShipments.length > 0 ? (
              recentShipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td className={style.trackingId}>{shipment.id}</td>
                  <td>{shipment.customer}</td>
                  <td>{shipment.origin} to {shipment.destination}</td>
                  <td>
                    <span className={`${style.statusBadge} ${style[shipment.status.toLowerCase().replace(/\s+/g, '')]}`}>
                      {shipment.status}
                    </span>
                  </td>
                  <td>{shipment.date}</td>
                  <td>
                    <div className={style.actionButtons}>
                      <button className={style.actionButton} title="View Details">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className={style.actionButton} title="Edit">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className={style.actionButton} title="Delete">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                  No shipments found. Create a new shipment to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className={style.dashboardContent}>
      <div className={style.dashboardHeader}>
        <h2>Dashboard Overview</h2>
        <div className={style.dashboardActions}>
          <div className={style.dateFilter}>
            <i className="fas fa-calendar"></i>
            <span>May 1 - May 8, 2025</span>
          </div>
          <button className={style.refreshButton}>
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>
      </div>

      <div className={style.statsGrid}>
        <div className={`${style.statCard} ${style.primary}`}>
          <div className={style.statIcon}>
            <i className="fas fa-box"></i>
          </div>
          <div className={style.statInfo}>
            <h3>Total Shipments</h3>
            <p>{dashboardStats.totalShipments}</p>
          </div>
        </div>
        
        <div className={`${style.statCard} ${style.warning}`}>
          <div className={style.statIcon}>
            <i className="fas fa-truck-loading"></i>
          </div>
          <div className={style.statInfo}>
            <h3>Active Shipments</h3>
            <p>{dashboardStats.activeShipments}</p>
          </div>
        </div>
        
        <div className={`${style.statCard} ${style.success}`}>
          <div className={style.statIcon}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className={style.statInfo}>
            <h3>Completed</h3>
            <p>{dashboardStats.completedShipments}</p>
          </div>
        </div>
        
        <div className={`${style.statCard} ${style.info}`}>
          <div className={style.statIcon}>
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className={style.statInfo}>
            <h3>Revenue</h3>
            <p>{dashboardStats.revenue}</p>
          </div>
        </div>
      </div>
      
      <div className={style.dashboardRow}>
        <div className={style.recentShipmentsCard}>
          <div className={style.cardHeader}>
            <h3>All Shipments</h3>
          </div>
          <div className={style.tableContainer}>
            <table className={style.shipmentsTable}>
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Customer</th>
                  <th>Route</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentShipments.map((shipment) => (
                  <tr key={shipment.id}>
                    <td className={style.trackingId}>{shipment.id}</td>
                    <td>{shipment.customer}</td>
                    <td>{shipment.origin} to {shipment.destination}</td>
                    <td>
                      <span className={`${style.statusBadge} ${style[shipment.status.toLowerCase().replace(' ', '')]}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td>{shipment.date}</td>
                    <td>
                      <div className={style.actionButtons}>
                        <button className={style.actionButton} title="View Details">
                          <i className="fas fa-eye"></i>
                        </button>
                        <Link href={`/editshipment?id=${encodeURIComponent(shipment.id)}`}>
                          <button className={style.actionButton} title="Edit">
                            <i className="fas fa-edit"></i>
                          </button>
                        </Link>
                        <button 
                          className={style.actionButton} 
                          title="Delete" 
                          onClick={() => handleDeleteShipment(shipment.id)}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className={style.performanceCard}>
          <div className={style.cardHeader}>
            <h3>Performance Metrics</h3>
          </div>
          <div className={style.performanceMetrics}>
            <div className={style.metricItem}>
              <div className={style.metricInfo}>
                <h4>Customer Satisfaction</h4>
                <p>{dashboardStats.customerSatisfaction}</p>
              </div>
              <div className={style.progressContainer}>
                <div className={style.progressBar} style={{ width: '96%' }}></div>
              </div>
            </div>
            
            <div className={style.metricItem}>
              <div className={style.metricInfo}>
                <h4>On-Time Delivery</h4>
                <p>{dashboardStats.onTimeDelivery}</p>
              </div>
              <div className={style.progressContainer}>
                <div className={style.progressBar} style={{ width: '94.3%' }}></div>
              </div>
            </div>
            
            <div className={style.metricItem}>
              <div className={style.metricInfo}>
                <h4>Processing Speed</h4>
                <p>89.7%</p>
              </div>
              <div className={style.progressContainer}>
                <div className={style.progressBar} style={{ width: '89.7%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddShipment = () => (
    <div className={style.formContent}>
      <div className={style.formHeader}>
        <h2>Add New Shipment</h2>
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
      
      <form onSubmit={handleAddShipment} className={style.shipmentForm}>
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
              <label htmlFor="shipmentType">Shipment Type</label>
              <select
                id="shipmentType"
                value={shipmentType}
                onChange={(e) => setShipmentType(e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="Document">Document</option>
                <option value="Parcel">Parcel</option>
                <option value="Heavy Freight">Heavy Freight</option>
                <option value="Package">Package</option>
              </select>
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight in kg"
                required
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="packages">Number of Packages</label>
              <input
                type="number"
                id="packages"
                value={packages}
                onChange={(e) => setPackages(e.target.value)}
                placeholder="Enter number of packages"
                required
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="mode">Shipping Mode</label>
              <select
                id="mode"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                required
              >
                <option value="">Select Mode</option>
                <option value="Flight">Flight</option>
                <option value="Sea">Sea</option>
                <option value="Land">Land</option>
                <option value="Express">Express</option>
              </select>
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="origin">Origin Country</label>
              <select
                id="origin"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={`origin-${country}`} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="destination">Destination Country</label>
              <select
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
              >
                <option value="">Select Payment Method</option>
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="departureDate">Departure Date</label>
              <input
                type="date"
                id="departureDate"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="departureTime">Departure Time</label>
              <input
                type="time"
                id="departureTime"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                required
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="pickupDate">Pickup Date</label>
              <input
                type="date"
                id="pickupDate"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                required
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="expectedDeliveryDate">Expected Delivery Date</label>
              <input
                type="date"
                id="expectedDeliveryDate"
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                required
              />
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="pickupTime">Pickup Time</label>
              <input
                type="time"
                id="pickupTime"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                required
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
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Package Held In dropdown - always visible */}
            <div className={style.formGroup}>
              <label htmlFor="heldInCountry">Package Location</label>
              <select
                id="heldInCountry"
                value={heldInCountry}
                onChange={(e) => setHeldInCountry(e.target.value)}
                required={shipmentStatus === "On Hold"}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={`held-${country}`} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="comments">Additional Comments</label>
              <textarea
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter any additional information"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className={style.formSection}>
          <h3 className={style.sectionTitle}>
            <i className="fas fa-box"></i>
            Package Details
          </h3>
          <div className={style.formGrid}>
            {/* Quantity and Price fields removed as requested */}
            
            <div className={style.formGroup}>
              <label htmlFor="packageType">Type</label>
              <select
                id="packageType"
                value={packageType}
                onChange={(e) => setPackageType(e.target.value)}
                required
              >
                <option value="">Select Package Type</option>
                {packageTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="packageDescription">Description</label>
              <textarea
                id="packageDescription"
                value={packageDescription}
                onChange={(e) => setPackageDescription(e.target.value)}
                placeholder="Enter package description"
              ></textarea>
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="packageLength">Length (cm)</label>
              <div className={style.numberInputWrapper}>
                <input
                  type="number"
                  id="packageLength"
                  value={packageLength}
                  onChange={(e) => setPackageLength(e.target.value)}
                  placeholder="Enter length in cm"
                  step="1"
                />
                <div className={style.numberControls}>
                  <button 
                    type="button" 
                    className={style.numberControl} 
                    onClick={() => setPackageLength(prev => Number(prev || 0) + 1)}
                  >
                    <i className="fas fa-chevron-up"></i>
                  </button>
                  <button 
                    type="button" 
                    className={style.numberControl} 
                    onClick={() => setPackageLength(prev => Number(prev || 0) - 1)}
                  >
                    <i className="fas fa-chevron-down"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="packageWidth">Width (cm)</label>
              <div className={style.numberInputWrapper}>
                <input
                  type="number"
                  id="packageWidth"
                  value={packageWidth}
                  onChange={(e) => setPackageWidth(e.target.value)}
                  placeholder="Enter width in cm"
                  step="1"
                />
                <div className={style.numberControls}>
                  <button 
                    type="button" 
                    className={style.numberControl} 
                    onClick={() => setPackageWidth(prev => Number(prev || 0) + 1)}
                  >
                    <i className="fas fa-chevron-up"></i>
                  </button>
                  <button 
                    type="button" 
                    className={style.numberControl} 
                    onClick={() => setPackageWidth(prev => Number(prev || 0) - 1)}
                  >
                    <i className="fas fa-chevron-down"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="packageHeight">Height (cm)</label>
              <div className={style.numberInputWrapper}>
                <input
                  type="number"
                  id="packageHeight"
                  value={packageHeight}
                  onChange={(e) => setPackageHeight(e.target.value)}
                  placeholder="Enter height in cm"
                  step="1"
                />
                <div className={style.numberControls}>
                  <button 
                    type="button" 
                    className={style.numberControl} 
                    onClick={() => setPackageHeight(prev => Number(prev || 0) + 1)}
                  >
                    <i className="fas fa-chevron-up"></i>
                  </button>
                  <button 
                    type="button" 
                    className={style.numberControl} 
                    onClick={() => setPackageHeight(prev => Number(prev || 0) - 1)}
                  >
                    <i className="fas fa-chevron-down"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div className={style.formGroup}>
              <label htmlFor="packageWeight">Weight (kg)</label>
              <div className={style.numberInputWrapper}>
                <input
                  type="number"
                  id="packageWeight"
                  value={packageWeight}
                  onChange={(e) => setPackageWeight(e.target.value)}
                  placeholder="Enter weight in kg"
                  step="0.1"
                />
                <div className={style.numberControls}>
                  <button 
                    type="button" 
                    className={style.numberControl} 
                    onClick={() => setPackageWeight(prev => (Number(prev || 0) + 0.1).toFixed(1))}
                  >
                    <i className="fas fa-chevron-up"></i>
                  </button>
                  <button 
                    type="button" 
                    className={style.numberControl} 
                    onClick={() => setPackageWeight(prev => (Number(prev || 0) - 0.1).toFixed(1))}
                  >
                    <i className="fas fa-chevron-down"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={style.formActions}>
          <button type="button" className={style.cancelButton} onClick={() => setActiveSection("dashboard")}>
            Cancel
          </button>
          <button type="submit" className={style.submitButton} disabled={isLoading}>
            {isLoading ? (
              <>
                <div className={style.spinnerContainer}>
                  <div className={style.spinner}></div>
                </div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <i className="fas fa-plus-circle"></i>
                <span>Add Shipment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className={style.adminContainer}>
      {isLoading && (
        <div className={style.loadingOverlay}>
          <div className={style.loader}>
            <svg className={style.loaderCircle} viewBox="25 25 50 50">
              <circle className={style.loaderCirclePath} cx="50" cy="50" r="20" fill="none" />
            </svg>
            <div className={style.loaderText}>SC</div>
          </div>
        </div>
      )}
      
      <aside className={`${style.sidebar} ${showSidebar ? style.expanded : style.collapsed}`}>
        <div className={style.sidebarHeader}>
          <div className={style.logoContainer}>
            <Image
              src="/images/swiftargo.png" 
              alt="SwiftCargo Logo"
              width={200}
              height={50}
              className={style.logo}
            />
            {showSidebar && <h2 className={style.logoText}>SwiftCargo</h2>}
          </div>
          <button 
            className={style.toggleButton} 
            onClick={() => setShowSidebar(!showSidebar)}
            aria-label={showSidebar ? "Collapse sidebar" : "Expand sidebar"}
          >
            <i className={`fas fa-chevron-${showSidebar ? 'left' : 'right'}`}></i>
          </button>
        </div>
        
        <nav className={style.sidebarNav}>
          <ul className={style.navList}>
            <li className={`${style.navItem} ${activeSection === "dashboard" ? style.active : ""}`}>
              <button onClick={() => setActiveSection("dashboard")}>
                <i className="fas fa-tachometer-alt"></i>
                {showSidebar && <span>Dashboard</span>}
              </button>
            </li>
            
            <li className={`${style.navItem} ${activeSection === "add-shipment" ? style.active : ""}`}>
              <button onClick={() => setActiveSection("add-shipment")}>
                <i className="fas fa-plus-circle"></i>
                {showSidebar && <span>Add Shipment</span>}
              </button>
            </li>
            
            <li className={`${style.navItem} ${activeSection === "shipments" ? style.active : ""}`}>
              <button onClick={() => setActiveSection("shipments")}>
                <i className="fas fa-boxes"></i>
                {showSidebar && <span>Shipments</span>}
              </button>
            </li>
            
            <li className={`${style.navItem} ${activeSection === "customers" ? style.active : ""}`}>
              <button onClick={() => setActiveSection("customers")}>
                <i className="fas fa-users"></i>
                {showSidebar && <span>Customers</span>}
              </button>
            </li>
            
            <li className={`${style.navItem} ${activeSection === "reports" ? style.active : ""}`}>
              <button onClick={() => setActiveSection("reports")}>
                <i className="fas fa-chart-bar"></i>
                {showSidebar && <span>Reports</span>}
              </button>
            </li>
            
            <li className={`${style.navItem} ${activeSection === "settings" ? style.active : ""}`}>
              <button onClick={() => setActiveSection("settings")}>
                <i className="fas fa-cog"></i>
                {showSidebar && <span>Settings</span>}
              </button>
            </li>
          </ul>
        </nav>
        
        <div className={style.sidebarFooter}>
          <button className={style.logoutButton} onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            {showSidebar && <span>Logout</span>}
          </button>
        </div>
      </aside>
      
      <main className={style.mainContent}>
        <header className={style.mainHeader}>
          <div className={style.headerLeft}>
            <h1 className={style.pageTitle}>
              {activeSection === "dashboard" && "Dashboard"}
              {activeSection === "add-shipment" && "Add New Shipment"}
              {activeSection === "shipments" && "Manage Shipments"}
              {activeSection === "customers" && "Customer Management"}
              {activeSection === "reports" && "Reports & Analytics"}
              {activeSection === "settings" && "System Settings"}
            </h1>
          </div>
          
          <div className={style.headerRight}>
            <div className={style.searchContainer}>
              <i className="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search..." 
                className={style.searchInput}
              />
            </div>
            
            <div className={style.notificationContainer}>
              <button className={style.notificationButton}>
                <i className="fas fa-bell"></i>
                <span className={style.notificationBadge}>3</span>
              </button>
            </div>
            
            <div className={style.userContainer}>
              <div className={style.userAvatar}>
                <span>A</span>
              </div>
              <div className={style.userInfo}>
                <p className={style.userName}>Admin User</p>
                <p className={style.userRole}>Administrator</p>
              </div>
            </div>
          </div>
        </header>
        
        <div className={style.contentWrapper}>
          {activeSection === "dashboard" && renderDashboard()}
          {activeSection === "add-shipment" && renderAddShipment()}
          {activeSection === "shipments" && renderShipments()}
          {activeSection === "customers" && (
            <div className={style.placeholderContent}>
              <i className="fas fa-users"></i>
              <h2>Customer Management</h2>
              <p>This section is under development.</p>
            </div>
          )}
          {activeSection === "reports" && (
            <div className={style.placeholderContent}>
              <i className="fas fa-chart-bar"></i>
              <h2>Reports & Analytics</h2>
              <p>This section is under development.</p>
            </div>
          )}
          {activeSection === "settings" && (
            <div className={style.placeholderContent}>
              <i className="fas fa-cog"></i>
              <h2>System Settings</h2>
              <p>This section is under development.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
