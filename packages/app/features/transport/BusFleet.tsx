import React, { useState } from 'react';
import { useInteraction, LiveBus } from '../../provider/InteractionContext';
import { SovereignButton, SovereignTable, SovereignBadge, SovereignInput, StatCard, PageHeader, Column } from '../../components/SovereignComponents';
import { ActionModal } from '../../components/ActionModal';
import { Bus, MapPin, Fuel, UserPlus, PlayCircle, StopCircle } from 'lucide-react';

export const BusFleet = () => {
  const { buses, updateBusStatus, assignBusDriver, addExpense } = useInteraction();
  
  const [driverModalOpen, setDriverModalOpen] = useState(false);
  const [fuelModalOpen, setFuelModalOpen] = useState(false);
  
  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [driverForm, setDriverForm] = useState('');
  const [fuelForm, setFuelForm] = useState({ liters: '', amount: '' });

  const activeBuses = buses.filter(b => b.status === 'ON_ROUTE').length;

  // Actions
  const handleAssignDriver = () => {
    if (selectedBusId && driverForm) {
      assignBusDriver(selectedBusId, driverForm);
      setDriverModalOpen(false);
      setDriverForm('');
    }
  };

  const handleLogFuel = () => {
    if (selectedBusId && fuelForm.amount) {
      addExpense({
        category: 'MAINTENANCE',
        amount: parseFloat(fuelForm.amount),
        description: `Fuel for ${buses.find(b => b.id === selectedBusId)?.plateNumber}: ${fuelForm.liters}L`
      });
      setFuelModalOpen(false);
      setFuelForm({ liters: '', amount: '' });
      alert("Fuel expense logged to Finance Ledger.");
    }
  };

  const toggleTrip = (bus: LiveBus) => {
    if (bus.status === 'ON_ROUTE') {
      updateBusStatus(bus.id, 'IDLE');
    } else {
      updateBusStatus(bus.id, 'ON_ROUTE');
    }
  };

  const openDriverModal = (id: string) => {
    setSelectedBusId(id);
    setDriverModalOpen(true);
  };

  const openFuelModal = (id: string) => {
    setSelectedBusId(id);
    setFuelModalOpen(true);
  };

  const columns: Column<LiveBus>[] = [
    { header: "Bus No", accessor: "plateNumber" },
    { header: "Route", accessor: "routeId" },
    { header: "Driver", accessor: (row: LiveBus) => (
        <div className="flex items-center justify-between">
           <span>{row.driverName || 'Unassigned'}</span>
           <button onClick={() => openDriverModal(row.id)} className="text-gray-400 hover:text-indigo-600"><UserPlus className="w-3 h-3"/></button>
        </div>
    )},
    { header: "Live Speed", accessor: (row: LiveBus) => <span className="font-mono">{row.speed} km/h</span> },
    { header: "Status", accessor: (row: LiveBus) => <SovereignBadge status={row.status === 'ON_ROUTE' ? 'success' : 'neutral'}>{row.status.replace('_', ' ')}</SovereignBadge> }
  ];

  const actions = (row: LiveBus) => (
    <div className="flex gap-2">
      <button 
        onClick={() => toggleTrip(row)}
        className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded border transition-colors ${
           row.status === 'ON_ROUTE' 
           ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
           : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
        }`}
      >
        {row.status === 'ON_ROUTE' ? <><StopCircle className="w-3 h-3"/> End Trip</> : <><PlayCircle className="w-3 h-3"/> Start Trip</>}
      </button>
      <button 
         onClick={() => openFuelModal(row.id)}
         className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold border border-gray-200 hover:bg-gray-200"
      >
        <Fuel className="w-3 h-3"/>
      </button>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader title="Fleet Management" subtitle="Live Tracking & Logistics" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Fleet" value={buses.length} icon={<Bus className="w-5 h-5"/>} />
        <StatCard title="Active Trips" value={activeBuses} icon={<MapPin className="w-5 h-5 text-green-600"/>} trend={{ value: (activeBuses/buses.length)*100, isPositive: true }} />
        <StatCard title="Maintenance" value={buses.filter(b => b.status === 'MAINTENANCE').length} icon={<Fuel className="w-5 h-5 text-orange-600"/>} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
         <SovereignTable data={buses} columns={columns} actions={actions} />
      </div>

      {/* Driver Modal */}
      <ActionModal 
        isOpen={driverModalOpen} 
        onClose={() => setDriverModalOpen(false)} 
        title="Assign Driver"
        onConfirm={handleAssignDriver}
        confirmLabel="Assign"
      >
        <div className="space-y-4">
           <SovereignInput label="Driver Name" value={driverForm} onChange={e => setDriverForm(e.target.value)} placeholder="e.g. Rajesh Kumar" />
        </div>
      </ActionModal>

      {/* Fuel Modal */}
      <ActionModal 
        isOpen={fuelModalOpen} 
        onClose={() => setFuelModalOpen(false)} 
        title="Log Fuel Entry"
        onConfirm={handleLogFuel}
        confirmLabel="Record Expense"
      >
        <div className="space-y-4">
           <div className="p-3 bg-gray-50 text-xs text-gray-500 rounded border">
             This will automatically create a "MAINTENANCE" expense in the Finance Ledger.
           </div>
           <SovereignInput label="Liters Filled" type="number" value={fuelForm.liters} onChange={e => setFuelForm({...fuelForm, liters: e.target.value})} />
           <SovereignInput label="Total Cost (₹)" type="number" value={fuelForm.amount} onChange={e => setFuelForm({...fuelForm, amount: e.target.value})} />
        </div>
      </ActionModal>
    </div>
  );
};