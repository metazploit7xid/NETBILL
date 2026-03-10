import express from "express";
import { createServer as createViteServer } from "vite";
import db from "./src/lib/db.js";
import { RouterOSAPI } from "node-routeros";
import axios from "axios";
import dotenv from "dotenv";
import { getWaStatus, connectToWhatsApp, logoutWhatsApp, sendWaMessage } from "./src/lib/whatsapp.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Seed data if empty
const checkCustomers = db.prepare("SELECT COUNT(*) as count FROM customers").get() as any;
if (checkCustomers.count === 0) {
  console.log("Seeding database with mock data...");
  const insertCustomer = db.prepare("INSERT INTO customers (name, phone, pppoe_user, pppoe_password) VALUES (?, ?, ?, ?)");
  const insertInvoice = db.prepare("INSERT INTO invoices (customer_id, amount, status, due_date) VALUES (?, ?, ?, ?)");
  
  const c1 = insertCustomer.run("Budi Santoso", "6281234567890", "budi_pppoe", "pass123");
  const c2 = insertCustomer.run("Siti Aminah", "6289876543210", "siti_pppoe", "pass123");
  
  insertInvoice.run(c1.lastInsertRowid, 250000, "unpaid", "2026-03-15");
  insertInvoice.run(c2.lastInsertRowid, 350000, "overdue", "2026-03-01");
}

// --- MIKROTIK ROUTES ---
app.get("/api/routers", (req, res) => {
  const routers = db.prepare("SELECT * FROM routers").all();
  res.json(routers);
});

app.post("/api/routers", (req, res) => {
  const { name, host, port, username, password } = req.body;
  const stmt = db.prepare("INSERT INTO routers (name, host, port, username, password) VALUES (?, ?, ?, ?, ?)");
  const info = stmt.run(name, host, port || 8728, username, password);
  res.json({ id: info.lastInsertRowid, name, host, port, username });
});

app.delete("/api/routers/:id", (req, res) => {
  db.prepare("DELETE FROM routers WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Helper to connect to Mikrotik
async function connectToMikrotik(routerId: number) {
  const router = db.prepare("SELECT * FROM routers WHERE id = ?").get(routerId) as any;
  if (!router) throw new Error("Router not found");

  const conn = new RouterOSAPI({
    host: router.host,
    user: router.username,
    password: router.password,
    port: router.port,
  });
  await conn.connect();
  return conn;
}

// Get PPPoE Secrets per Mikrotik
app.get("/api/routers/:id/pppoe", async (req, res) => {
  let conn;
  try {
    conn = await connectToMikrotik(Number(req.params.id));
    const secrets = await conn.write("/ppp/secret/print");
    res.json(secrets);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    if (conn) conn.close();
  }
});

// Isolate/Enable PPPoE Secret (Manual Isolation)
app.post("/api/routers/:id/pppoe/isolate", async (req, res) => {
  const { pppoeId, disable } = req.body; // disable is boolean
  let conn;
  try {
    conn = await connectToMikrotik(Number(req.params.id));
    await conn.write("/ppp/secret/set", [
      `=.id=${pppoeId}`,
      `=disabled=${disable ? "yes" : "no"}`
    ]);
    res.json({ success: true, isolated: disable });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    if (conn) conn.close();
  }
});

// --- WHATSAPP ROUTES ---
app.get("/api/wa/status", (req, res) => {
  res.json(getWaStatus());
});

app.post("/api/wa/connect", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number is required" });
  
  try {
    await connectToWhatsApp(phone);
    res.json({ success: true, message: "Requesting pairing code..." });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/wa/logout", async (req, res) => {
  try {
    await logoutWhatsApp();
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Using Meta Cloud API or Baileys for WhatsApp
app.post("/api/invoices/:id/send-wa", async (req, res) => {
  const invoiceId = req.params.id;
  const invoice = db.prepare("SELECT * FROM invoices WHERE id = ?").get(invoiceId) as any;
  if (!invoice) return res.status(404).json({ error: "Invoice not found" });

  const customer = db.prepare("SELECT * FROM customers WHERE id = ?").get(invoice.customer_id) as any;
  if (!customer) return res.status(404).json({ error: "Customer not found" });

  const message = `Halo ${customer.name},\n\nIni adalah tagihan internet Anda sebesar Rp${invoice.amount.toLocaleString('id-ID')}.\nStatus: ${invoice.status.toUpperCase()}\nJatuh Tempo: ${invoice.due_date}\n\nMohon segera melakukan pembayaran. Terima kasih.`;

  const waStatus = getWaStatus();
  
  // Use Baileys if connected
  if (waStatus.status === 'connected') {
    try {
      await sendWaMessage(customer.phone, message);
      return res.json({ success: true, method: 'baileys' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  // Fallback to Meta Cloud API
  const waToken = process.env.WA_TOKEN;
  const waPhoneId = process.env.WA_PHONE_ID;

  if (!waToken || !waPhoneId) {
    return res.status(500).json({ error: "WhatsApp API credentials not configured in .env and Baileys is not connected" });
  }

  axios.post(
    `https://graph.facebook.com/v17.0/${waPhoneId}/messages`,
    {
      messaging_product: "whatsapp",
      to: customer.phone, // Phone number must include country code, e.g., 62812...
      type: "text",
      text: { body: message }
    },
    {
      headers: { Authorization: `Bearer ${waToken}` }
    }
  ).then(response => {
    res.json({ success: true, data: response.data, method: 'meta' });
  }).catch(error => {
    res.status(500).json({ error: error.response?.data || error.message });
  });
});

// --- CUSTOMERS & INVOICES ROUTES ---
app.get("/api/customers", (req, res) => {
  const customers = db.prepare("SELECT * FROM customers").all();
  res.json(customers);
});

app.post("/api/customers", (req, res) => {
  const { name, phone, router_id, pppoe_user, pppoe_password } = req.body;
  const stmt = db.prepare("INSERT INTO customers (name, phone, router_id, pppoe_user, pppoe_password) VALUES (?, ?, ?, ?, ?)");
  const info = stmt.run(name, phone, router_id, pppoe_user, pppoe_password);
  res.json({ id: info.lastInsertRowid, name, phone });
});

app.delete("/api/customers/:id", (req, res) => {
  db.prepare("DELETE FROM customers WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.get("/api/invoices", (req, res) => {
  const invoices = db.prepare(`
    SELECT invoices.*, customers.name as customer_name, customers.phone as customer_phone 
    FROM invoices 
    LEFT JOIN customers ON invoices.customer_id = customers.id
  `).all();
  res.json(invoices);
});

app.post("/api/invoices", (req, res) => {
  const { customer_id, amount, due_date } = req.body;
  const stmt = db.prepare("INSERT INTO invoices (customer_id, amount, due_date) VALUES (?, ?, ?)");
  const info = stmt.run(customer_id, amount, due_date);
  res.json({ id: info.lastInsertRowid, customer_id, amount, due_date });
});

app.put("/api/invoices/:id/status", (req, res) => {
  const { status } = req.body;
  db.prepare("UPDATE invoices SET status = ? WHERE id = ?").run(status, req.params.id);
  res.json({ success: true });
});

app.delete("/api/invoices/:id", (req, res) => {
  db.prepare("DELETE FROM invoices WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.get("/api/dashboard/stats", (req, res) => {
  const totalCustomers = db.prepare("SELECT COUNT(*) as count FROM customers").get() as any;
  const activeCustomers = db.prepare("SELECT COUNT(*) as count FROM customers WHERE status = 'active'").get() as any;
  
  const revenue = db.prepare("SELECT SUM(amount) as total FROM invoices WHERE status = 'paid'").get() as any;
  const pending = db.prepare("SELECT SUM(amount) as total FROM invoices WHERE status = 'unpaid' OR status = 'overdue'").get() as any;

  res.json({
    totalCustomers: totalCustomers.count,
    activeCustomers: activeCustomers.count,
    revenue: revenue.total || 0,
    pending: pending.total || 0
  });
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
