import React from 'react';
import ParkForm from '../components/ParkForm';
import UnparkForm from '../components/UnparkTable';

export default function ParkPage() {
  return (
    <div>
      <h1>Park Your Vehicle</h1>
      <ParkForm userId={123} onSuccess={() => alert('Successfully parked!')} />
      
      <h2>Unpark Your Vehicle</h2>
      <UnparkForm onSuccess={() => alert('Successfully unparked!')} />
    </div>
  );
}
