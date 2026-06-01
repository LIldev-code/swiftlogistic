'use client';

import { useState } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

export default function FixHistoryTime() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [historyTime, setHistoryTime] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Initialize Notyf for notifications
  let notyf;
  if (typeof window !== 'undefined') {
    notyf = new Notyf({
      duration: 3000,
      position: { x: 'right', y: 'top' },
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    
    try {
      console.log('Submitting fix request for:', trackingNumber, historyTime);
      
      // First try the direct MongoDB fix
      const directFixResponse = await fetch('/api/fixHistoryTime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackingNumber,
        }),
      });
      
      const directFixResult = await directFixResponse.json();
      console.log('Direct fix result:', directFixResult);
      
      if (!directFixResponse.ok) {
        throw new Error(directFixResult.message || 'Failed to fix history time');
      }
      
      // Also try the API endpoint approach
      const apiResponse = await fetch('/api/directUpdateHistoryTime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackingNumber,
          historyTime,
        }),
      });
      
      const apiResult = await apiResponse.json();
      console.log('API endpoint result:', apiResult);
      
      setResult({
        directFix: directFixResult,
        apiEndpoint: apiResult,
      });
      
      if (notyf) notyf.success('History time fix attempted. Check results below.');
      
      // Now verify by getting the shipment data
      const verifyResponse = await fetch('/api/getShipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackingNumber,
        }),
      });
      
      const verifyData = await verifyResponse.json();
      console.log('Verification data:', verifyData);
      
      if (verifyResponse.ok && verifyData.shipmentData) {
        setResult(prev => ({
          ...prev,
          verification: {
            success: true,
            shipment: verifyData.shipmentData,
          }
        }));
      } else {
        setResult(prev => ({
          ...prev,
          verification: {
            success: false,
            message: verifyData.message || 'Failed to verify shipment data',
          }
        }));
      }
      
    } catch (error) {
      console.error('Error fixing history time:', error);
      setError(error.message || 'Failed to fix history time');
      if (notyf) notyf.error(error.message || 'Failed to fix history time');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fix History Time</h1>
      <p className="mb-4">Use this tool to fix the history time for a shipment.</p>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="trackingNumber" className="block mb-2">Tracking Number:</label>
          <input
            type="text"
            id="trackingNumber"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="historyTime" className="block mb-2">History Time:</label>
          <input
            type="time"
            id="historyTime"
            value={historyTime}
            onChange={(e) => setHistoryTime(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          {loading ? 'Processing...' : 'Fix History Time'}
        </button>
      </form>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}
      
      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-bold mb-2">Results</h2>
          
          <div className="mb-4">
            <h3 className="font-bold">Direct MongoDB Fix:</h3>
            <pre className="bg-white p-2 rounded overflow-auto">
              {JSON.stringify(result.directFix, null, 2)}
            </pre>
          </div>
          
          <div className="mb-4">
            <h3 className="font-bold">API Endpoint Result:</h3>
            <pre className="bg-white p-2 rounded overflow-auto">
              {JSON.stringify(result.apiEndpoint, null, 2)}
            </pre>
          </div>
          
          {result.verification && (
            <div className="mb-4">
              <h3 className="font-bold">Verification:</h3>
              <p className="mb-2">Success: {result.verification.success ? 'Yes' : 'No'}</p>
              {result.verification.success ? (
                <>
                  <p className="mb-2">History Time: <strong>{result.verification.shipment.historyTime || 'Not set'}</strong></p>
                  <p className="mb-2">Departure Time: <strong>{result.verification.shipment.departureTime || 'Not set'}</strong></p>
                  <pre className="bg-white p-2 rounded overflow-auto">
                    {JSON.stringify(result.verification.shipment, null, 2)}
                  </pre>
                </>
              ) : (
                <p>{result.verification.message}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
