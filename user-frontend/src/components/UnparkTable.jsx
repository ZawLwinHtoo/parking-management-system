import React, { useMemo, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { paymentCheckout, getActiveById } from "../api/parking";

export default function UnparkTable({ activeList, onUnpark }) {
  const [selected, setSelected] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [keyModal, setKeyModal] = useState({ show: false, code: null, expiresAt: null });
  const [feeLoading, setFeeLoading] = useState(false);
  const [q, setQ] = useState("");

  // ✅ store receipt details after successful payment
  const [receipt, setReceipt] = useState(null);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return activeList || [];
    return (activeList || []).filter(
      (x) =>
        String(x.carNumber || "").toLowerCase().includes(t) ||
        String(x.slotNumber || "").toLowerCase().includes(t)
    );
  }, [q, activeList]);

  const handleUnparkClick = async (car) => {
    setPayError("");
    setFeeLoading(true);
    try {
      const res = await getActiveById(car.parkedId);
      setSelected(res.data);
      setShowPayModal(true);
    } catch (err) {
      setSelected({ ...car, fee: null });
      setPayError("Could not load latest info");
      setShowPayModal(true);
    }
    setFeeLoading(false);
  };

  const handlePayNow = async () => {
    if (!selected) return;
    setIsPaying(true);
    setPayError("");
    try {
      const res = await paymentCheckout(selected.parkedId);
      const exitIso = new Date().toISOString();

      // Save receipt data for export
      setReceipt({
        parkedId: selected.parkedId,
        carNumber: selected.carNumber,
        slotNumber: selected.slotNumber,
        buildingName: selected.buildingName,
        entryTime: selected.entryTime,
        exitTime: exitIso,           // backend sets exitTime≈now; we mirror that
        fee: res?.data?.fee ?? selected.fee,
      });

      // Show the one-time key
      setKeyModal({
        show: true,
        code: res.data.code,
        expiresAt: res.data.expiresAt,
      });

      setShowPayModal(false);
      onUnpark(); // refresh lists
    } catch (err) {
      setPayError(err?.response?.data?.message || "Payment failed");
    }
    setIsPaying(false);
  };

  const handleCloseKeyModal = () => {
    setKeyModal({ show: false, code: null, expiresAt: null });
    setSelected(null);
    // keep `receipt` so user can still download if they reopen a new payment shortly after
    onUnpark();
  };

  // ---------- Receipt helpers ----------
  const fmtDate = (ts) =>
    ts ? new Date(ts).toLocaleString() : "-";
  const fmtMoney = (n) =>
    n == null ? "-" : `${Number(n).toLocaleString()} MMK`;

  // Build a crisp canvas receipt (no deps)
  const buildReceiptCanvas = async (rec, width = 900, height = 600) => {
    const pad = 36;
    const line = 34;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Background
    const grd = ctx.createLinearGradient(0, 0, width, height);
    grd.addColorStop(0, "#1f2233");
    grd.addColorStop(1, "#2b365b");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    // Card
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(pad, pad, width - pad * 2, height - pad * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    ctx.strokeRect(pad + 1, pad + 1, width - pad * 2 - 2, height - pad * 2 - 2);

    // Title
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 28px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillText("Parking Receipt", pad * 2, pad * 2 + 10);

    // Divider
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad * 2, pad * 2 + 24);
    ctx.lineTo(width - pad * 2, pad * 2 + 24);
    ctx.stroke();

    // Body
    ctx.font = "500 18px system-ui, -apple-system, Segoe UI, Roboto";
    let y = pad * 2 + 60;
    const drawRow = (label, value) => {
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(label, pad * 2, y);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(String(value || "-"), pad * 2 + 180, y);
      y += line;
    };

    drawRow("Car Number:", rec.carNumber);
    drawRow("Building:", rec.buildingName);
    drawRow("Slot:", rec.slotNumber);
    drawRow("Entry Time:", fmtDate(rec.entryTime));
    drawRow("Exit Time:", fmtDate(rec.exitTime));
    drawRow("Fee Paid:", fmtMoney(rec.fee));

    // Footer
    y = height - pad * 2;
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "14px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillText(
      `Receipt #${rec.parkedId}  •  Generated ${fmtDate(new Date().toISOString())}`,
      pad * 2,
      y
    );

    return canvas;
  };

  const downloadPNG = async () => {
    if (!receipt) return;
    const canvas = await buildReceiptCanvas(receipt);
    const link = document.createElement("a");
    link.download = `parking-receipt-${receipt.parkedId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadPDF = async () => {
    if (!receipt) return;
    try {
      // lazy-load jsPDF (install once: npm i jspdf)
      const { jsPDF } = await import("jspdf");
      const canvas = await buildReceiptCanvas(receipt, 1000, 700);
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`parking-receipt-${receipt.parkedId}.pdf`);
    } catch (e) {
      console.error(e);
      alert('PDF export needs jsPDF. Run:  npm i jspdf');
    }
  };
  // -------------------------------------

  if (!activeList || activeList.length === 0) {
    return <div className="alert alert-info text-center mb-0">No cars currently parked.</div>;
  }

  return (
    <>
      {/* small toolbar */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <Form className="w-100" onSubmit={(e) => e.preventDefault()}>
          <Form.Control
            size="sm"
            placeholder="Filter by car number or slot…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-dark text-light"
          />
        </Form>
      </div>

      <div className="table-responsive">
        <table className="table table-dark table-striped table-bordered table-sm align-middle mb-0">
          <thead>
            <tr>
              <th style={{ whiteSpace: "nowrap" }}>Car Number</th>
              <th>Slot</th>
              <th style={{ minWidth: 160 }}>Entry Time</th>
              <th style={{ width: 110 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.parkedId}>
                <td>{item.carNumber}</td>
                <td>{item.slotNumber}</td>
                <td>{new Date(item.entryTime).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm w-100"
                    onClick={() => handleUnparkClick(item)}
                  >
                    Unpark
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center">
                  No matches.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      <Modal show={showPayModal} onHide={() => setShowPayModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Parking Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <div className="mb-2">
              <div><b>Car Number:</b> {selected.carNumber}</div>
              <div><b>Slot:</b> {selected.slotNumber}</div>
              <div><b>Entry Time:</b> {new Date(selected.entryTime).toLocaleString()}</div>
              <div>
                <b>Fee:</b>{" "}
                {feeLoading
                  ? "Loading..."
                  : selected.fee !== undefined && selected.fee !== null
                    ? `${selected.fee} MMK`
                    : "Calculated at exit"}
              </div>
            </div>
          )}
          <Button
            variant="primary"
            onClick={handlePayNow}
            disabled={isPaying || feeLoading}
            className="w-100"
          >
            {isPaying ? "Processing..." : "Pay Now"}
          </Button>
          {payError && <div className="text-danger text-center mt-2">{payError}</div>}
        </Modal.Body>
      </Modal>

      {/* One-Time Key + Receipt actions */}
      <Modal
        show={keyModal.show}
        onHide={handleCloseKeyModal}
        centered
        contentClassName="bg-dark text-light rounded-4 shadow-lg border-0"
      >
        <Modal.Header
          closeButton
          className="border-0"
          style={{ background: "linear-gradient(120deg, #26273a 80%, #344a7b 100%)" }}
        >
          <Modal.Title className="text-info fw-bold">
            Barrier Unlock Code
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <h1 className="display-4 fw-bold text-primary" style={{ letterSpacing: "8px" }}>
            {keyModal.code}
          </h1>
          <div className="my-3 text-warning fw-bold">
            This key is valid for 5 minutes only!
          </div>
          <p className="mb-3 text-secondary">
            Enter this code at the barrier to exit the parking.
          </p>

          {receipt && (
            <div className="mt-4 text-start small">
              <div className="mb-2 fw-bold text-light">Download Receipt</div>
              <div className="d-flex gap-2">
                <Button variant="outline-light" size="sm" onClick={downloadPDF}>
                  PDF
                </Button>
                <Button variant="outline-light" size="sm" onClick={downloadPNG}>
                  PNG
                </Button>
              </div>
              <div className="text-secondary mt-2">
                Includes Car, Entry, Exit, Building, Slot, and Fee.
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={handleCloseKeyModal} className="px-4">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
