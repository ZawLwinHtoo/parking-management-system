// src/api/slot.js
import axios from 'axios'
export function getSlots(buildingId) {
  return axios.get('http://localhost:8080/api/slots/by-building', { params: { buildingId } })
}

// In your backend/api/slot.js or wherever you confirm parking:

const KEYS = {}; // Simple in-memory store, migrate to DB later if needed

// Utility: Generate 4-digit key
function generateKey() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// When a user reserves a slot:
app.post('/api/slot/park', (req, res) => {
  const { slotId, userId } = req.body;
  // Your reservation logic...
  // If successful:
  const key = generateKey();
  const expiry = Date.now() + 5 * 60 * 1000; // 5 mins from now

  // Store: KEYS[userId_slotId] = { key, expiry, used: false }
  KEYS[`${userId}_${slotId}`] = { key, expiry, used: false };

  // Respond with the generated key!
  res.json({ success: true, key });
});

app.post('/api/slot/verify-key', async (req, res) => {
  const { slotId, userId, key: inputKey } = req.body;

  const [rows] = await db.query(
    'SELECT * FROM slot_keys WHERE user_id = ? AND slot_id = ? AND key_code = ? ORDER BY id DESC LIMIT 1',
    [userId, slotId, inputKey]
  );

  const keyData = rows[0];
  if (!keyData)
    return res.json({ success: false, message: 'No key found for this slot.' });

  if (keyData.used)
    return res.json({ success: false, message: 'Key already used.' });

  if (new Date() > new Date(keyData.expires_at))
    return res.json({ success: false, message: 'Key expired.' });

  // Mark key as used
  await db.query('UPDATE slot_keys SET used = 1 WHERE id = ?', [keyData.id]);

  return res.json({ success: true, message: 'Slot unlocked. Welcome!' });
});
