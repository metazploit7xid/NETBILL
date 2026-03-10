/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Invoices from "./pages/Invoices";
import Settings from "./pages/Settings";
import Routers from "./pages/Routers";
import Billing from "./pages/Billing";
import Payments from "./pages/Payments";
import Collector from "./pages/Collector";
import WABot from "./pages/WABot";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="billing" element={<Billing />} />
          <Route path="customers" element={<Customers />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="payments" element={<Payments />} />
          <Route path="collector" element={<Collector />} />
          <Route path="settings" element={<Settings />} />
          <Route path="routers" element={<Routers />} />
          <Route path="wa-bot" element={<WABot />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
