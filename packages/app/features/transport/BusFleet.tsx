import React, { useState } from 'react';
import { Bus } from '../../../../types';

// Mock Data
const MOCK_BUSES: Bus[] = [
  { id: 'b1', plateNumber: 'KA-01-F-1234', driverName: 'Ramesh Singh', capacity: 40, routeId: 'R1', insuranceExpiry: '2024-12-01' },
  { id: 'b2', plateNumber: 'KA-05-A-9988', driverName: 'Suresh Kumar', capacity: 32, routeId: 'R2', insuranceExpiry: '2023-10-30' },
];

export const BusFleet = () => {
  const [buses, setBuses] = useState<Bus[]>(MOCK_BUSES);

  // Helper to check insurance expiry
  const checkExpiry = (dateStr: string) => {
    const today = new Date();
    const expiry = new Date(dateStr);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'EXPIRED', color: 'text-red-600 font-bold' };
    if (diffDays < 30) return { status: `Expiring in ${diffDays} days`, color: 'text-orange-600' };
    return { status: 'Valid', color: 'text-green-600' };
  };

  const handleAssignRoute = (busId: string) => {
    // In prod: Open modal to assign route & trigger Fee calculation for students on that route
    console.log(`[Sovereign Transport] Re-calculating transport fees for students on Bus ${busId}...`);
    alert("Route update synced. Transport fees will be updated in next billing cycle.");
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-gray-800">Sovereign Fleet Manager</h2>
          <p className="text-xs text-gray-500">Manage Buses, Drivers & Insurance</p>
        </div>
        <button className="bg-gray-900 text-white px-3 py-1.5 rounded text-sm hover:bg-gray-800">
          + Add Vehicle
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insurance</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {buses.map((bus) => {
              const insuranceStatus = checkExpiry(bus.insuranceExpiry);
              return (
                <tr key={bus.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">{bus.plateNumber}</div>
                    <div className="text-xs text-gray-500">{bus.capacity} Seater</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {bus.driverName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 border border-blue-100">
                      Route {bus.routeId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={insuranceStatus.color}>
                      {insuranceStatus.status}
                    </span>
                    <div className="text-[10px] text-gray-400">{bus.insuranceExpiry}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleAssignRoute(bus.id)}
                      className="text-indigo-600 hover:text-indigo-900 hover:underline"
                    >
                      Edit Route
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
