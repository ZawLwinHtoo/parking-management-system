import { useState } from "react";
import axios from "axios";

function KeyEntry() {
  const [slotId, setSlotId] = useState("");
  const [userId, setUserId] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/parking/verify-key", {
        userId: Number(userId),
        slotId: Number(slotId),
        key
      });
      setResult(res.data);
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || err.message });
    }
  };

  return (
    <div className="key-entry-container">
      <h2>Enter Slot Key to Unlock Barrier</h2>
      <form onSubmit={handleVerify}>
        <input placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} required />
        <input placeholder="Slot ID" value={slotId} onChange={e => setSlotId(e.target.value)} required />
        <input placeholder="One-Time Key" value={key} onChange={e => setKey(e.target.value)} required maxLength={4}/>
        <button type="submit">Unlock Slot</button>
      </form>
      {result && (
        <div className={result.success ? "success" : "error"}>
          {result.message}
        </div>
      )}
    </div>
  );
}

export default KeyEntry;
