import axios from "axios";
export function checkoutAndGenerateKey(parkedId) {
  return axios.post("/api/parking/payment/checkout", { parkedId });
}
