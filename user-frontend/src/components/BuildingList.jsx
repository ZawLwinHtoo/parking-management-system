// import React, { useEffect, useState } from "react";
// import { getBuildings } from "../api/parking";

// export default function BuildingList() {
//   const [buildings, setBuildings] = useState([]);
//   useEffect(() => {
//     getBuildings().then(res => setBuildings(res.data || []));
//   }, []);
//   return (
//     <div className="row g-4">
//       {buildings.map(building => (
//         <div className="col-12 col-md-6 col-lg-4" key={building.id}>
//           <div className="card shadow-sm border-0 h-100 bg-gradient" style={{
//             background: "linear-gradient(135deg, #23253c 80%, #3856a1 100%)",
//             color: "#fff",
//             borderRadius: 17
//           }}>
//             <div className="card-body">
//               <h5 className="fw-bold">{building.name}</h5>
//               <div className="text-secondary mb-2">{building.address || ''}</div>
//               <div>Floors: {building.floors || 3}</div>
//               <div>ID: {building.id}</div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
