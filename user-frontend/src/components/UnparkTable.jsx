import React, { useMemo, useState } from "react";
import { Button, Modal, Form, Badge, Spinner } from "react-bootstrap";
import { paymentCheckout, getActiveById } from "../api/parking";

export default function UnparkTable({ activeList, onUnpark }) {
  const [selected, setSelected] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [keyModal, setKeyModal] = useState({ show: false, code: null, expiresAt: null });
  const [feeLoading, setFeeLoading] = useState(false);
  const [q, setQ] = useState("");
  const [receipt, setReceipt] = useState(null);

  const list = activeList || [];
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return list;
    return list.filter((x) => {
      const car = String(x.carNumber || "").toLowerCase();
      const slot = String(x.slotNumber || "").toLowerCase();
      const bldg = String(x.buildingName || "").toLowerCase();
      return car.includes(t) || slot.includes(t) || bldg.includes(t);
    });
  }, [q, list]);

  const fmtDate = (ts) => (ts ? new Date(ts).toLocaleString() : "-");
  const fmtMoney = (n) => (n == null ? "-" : `${Number(n).toLocaleString()} MMK`);

  const handleUnparkClick = async (car) => {
    setPayError("");
    setFeeLoading(true);
    try {
      const res = await getActiveById(car.parkedId);
      setSelected(res.data);
    } catch {
      setSelected({ ...car, fee: null });
      setPayError("Could not load latest info");
    } finally {
      setShowPayModal(true);
      setFeeLoading(false);
    }
  };

  const handlePayNow = async () => {
    if (!selected) return;
    setIsPaying(true);
    setPayError("");
    try {
      const res = await paymentCheckout(selected.parkedId);
      const code = res?.data?.code ?? res?.data?.key ?? null;
      const expiresAt = res?.data?.expiresAt ?? res?.data?.expires_at ?? null;
      const fee = res?.data?.fee ?? selected.fee;

      // keep data for receipt export
      const exitIso = new Date().toISOString();
      setReceipt({
        parkedId: selected.parkedId,
        carNumber: selected.carNumber,
        slotNumber: selected.slotNumber,
        buildingName: selected.buildingName,
        entryTime: selected.entryTime,
        exitTime: exitIso,
        fee,
      });

      // show unlock code
      setKeyModal({ show: true, code, expiresAt });

      // close pay modal; DO NOT refresh list yet (prevents unmount)
      setShowPayModal(false);
    } catch (err) {
      setPayError(err?.response?.data?.message || "Payment failed");
    } finally {
      setIsPaying(false);
    }
  };

  // Refresh only after the user closes the key modal so the component stays mounted while showing it
  const handleCloseKeyModal = () => {
    setKeyModal({ show: false, code: null, expiresAt: null });
    setSelected(null);
    onUnpark && onUnpark();
  };

  // --- receipt export (unchanged) ---
  const buildReceiptCanvas = async (rec, width = 900, height = 600) => {
    const pad = 36, line = 34;
    const canvas = document.createElement("canvas");
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext("2d");

    const grd = ctx.createLinearGradient(0, 0, width, height);
    grd.addColorStop(0, "#1f2233"); grd.addColorStop(1, "#2b365b");
    ctx.fillStyle = grd; ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(pad, pad, width - pad * 2, height - pad * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 2;
    ctx.strokeRect(pad + 1, pad + 1, width - pad * 2 - 2, height - pad * 2 - 2);

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 28px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillText("Parking Receipt", pad * 2, pad * 2 + 10);

    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.moveTo(pad * 2, pad * 2 + 24);
    ctx.lineTo(width - pad * 2, pad * 2 + 24);
    ctx.stroke();

    ctx.font = "500 18px system-ui, -apple-system, Segoe UI, Roboto";
    let y = pad * 2 + 60;
    const row = (label, value) => {
      ctx.fillStyle = "rgba(255,255,255,0.7)"; ctx.fillText(label, pad * 2, y);
      ctx.fillStyle = "#ffffff"; ctx.fillText(String(value || "-"), pad * 2 + 180, y);
      y += line;
    };

    row("Car Number:", rec.carNumber);
    row("Building:", rec.buildingName);
    row("Slot:", rec.slotNumber);
    row("Entry Time:", fmtDate(rec.entryTime));
    row("Exit Time:", fmtDate(rec.exitTime));
    row("Fee Paid:", fmtMoney(rec.fee));

    y = height - pad * 2;
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "14px system-ui, -apple-system, Segoe UI, Roboto";
    ctx.fillText(`Receipt #${rec.parkedId} • Generated ${fmtDate(new Date().toISOString())}`, pad * 2, y);

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
      const { jsPDF } = await import("jspdf");
      const canvas = await buildReceiptCanvas(receipt, 1000, 700);
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: [canvas.width, canvas.height] });
      pdf.addImage(img, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`parking-receipt-${receipt.parkedId}.pdf`);
    } catch {
      alert("PDF export needs jsPDF. Run: npm i jspdf");
    }
  };

  const total = list.length;
  const shown = filtered.length;

  return (
    <>
      {/* Toolbar stays mounted */}
      <div className="d-flex align-items-center justify-content-between mb-2">
        <Form className="d-flex gap-2 w-100" onSubmit={(e) => e.preventDefault()}>
          <Form.Control
            size="sm"
            placeholder="Search by car, slot, or building…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-dark text-light"
          />
          {q && (
            <Button size="sm" variant="outline-light" onClick={() => setQ("")}>
              Clear
            </Button>
          )}
        </Form>
        <div className="ms-3">
          <Badge bg="secondary">{shown}/{total}</Badge>
        </div>
      </div>

      {/* Content area: show either table or empty state, but DO NOT early return */}
      <div className="table-responsive" style={{ maxHeight: 420 }}>
        {total === 0 ? (
          <div className="alert alert-info text-center mb-0">No cars currently parked.</div>
        ) : (
          <table className="table table-dark table-striped table-hover table-bordered table-sm align-middle mb-0">
            <thead
              style={{
                position: "sticky",
                top: 0,
                zIndex: 1,
                background: "rgba(33,37,41,0.98)",
                backdropFilter: "blur(4px)",
              }}
            >
              <tr>
                <th style={{ whiteSpace: "nowrap" }}>Car Number</th>
                <th>Building</th>
                <th>Slot</th>
                <th style={{ minWidth: 160 }}>Entry Time</th>
                <th style={{ width: 120 }} className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.parkedId}>
                  <td className="fw-semibold">{item.carNumber}</td>
                  <td className="text-secondary">{item.buildingName || "—"}</td>
                  <td>{item.slotNumber}</td>
                  <td>{fmtDate(item.entryTime)}</td>
                  <td className="text-center">
                    <Button size="sm" variant="success" className="px-3" onClick={() => handleUnparkClick(item)}>
                      Unpark
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center">No matches.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Payment Modal (always mounted) */}
      <Modal
        show={showPayModal}
        onHide={() => setShowPayModal(false)}
        centered
        data-bs-theme="dark"
        contentClassName="bg-dark text-light border-0 rounded-4"
      >
        <Modal.Header
          closeButton
          className="border-0"
          style={{ background: "linear-gradient(120deg, #26273a 80%, #344a7b 100%)" }}
        >
          <Modal.Title>Parking Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <div className="mb-3 small">
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Car Number</span>
                <span className="text-light fw-semibold">{selected.carNumber}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Building</span>
                <span className="text-light">{selected.buildingName || "—"}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Slot</span>
                <span className="text-light">{selected.slotNumber}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-secondary">Entry Time</span>
                <span className="text-light">{fmtDate(selected.entryTime)}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top border-secondary">
                <span className="text-secondary">Fee</span>
                <span className="text-light">
                  {feeLoading ? (
                    <span className="d-inline-flex align-items-center gap-2">
                      <Spinner size="sm" animation="border" /> Calculating…
                    </span>
                  ) : selected.fee != null ? (
                    <span className="fw-bold">{fmtMoney(selected.fee)}</span>
                  ) : (
                    "Calculated at exit"
                  )}
                </span>
              </div>
            </div>
          )}

          <Button
            variant="primary"
            onClick={handlePayNow}
            disabled={isPaying || feeLoading}
            className="w-100"
          >
            {isPaying ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Processing…
              </>
            ) : (
              "Pay Now"
            )}
          </Button>

          {payError && <div className="text-danger text-center mt-2">{payError}</div>}
        </Modal.Body>
      </Modal>

      {/* Key Modal (always mounted) */}
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
          <Modal.Title className="text-info fw-bold">Barrier Unlock Code</Modal.Title>
        </Modal.Header>

        <Modal.Body className="text-center">
          <div className="display-5 fw-bold text-primary" style={{ letterSpacing: "8px" }}>
            {keyModal.code ?? "—"}
          </div>
          <div className="my-2 text-secondary small">
            Expires: {keyModal.expiresAt ? fmtDate(keyModal.expiresAt) : "-"}
          </div>

          <div className="my-3 text-warning fw-semibold">
            This key is valid for 5 minutes only.
          </div>
          <p className="mb-3 text-secondary">
            Enter this code at the barrier to exit the parking.
          </p>

          {receipt && (
            <div className="mt-4 text-start small">
              <div className="mb-2 fw-bold text-light">Download Receipt</div>
              <div className="d-flex gap-2">
                <Button variant="outline-light" size="sm" onClick={downloadPDF}>PDF</Button>
                <Button variant="outline-light" size="sm" onClick={downloadPNG}>PNG</Button>
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
