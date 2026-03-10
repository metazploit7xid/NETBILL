export type Plan = {
  id: string;
  name: string;
  speed: string;
  price: number;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  planId: string;
  status: "active" | "inactive";
  joinedAt: string;
};

export type Invoice = {
  id: string;
  customerId: string;
  planId: string;
  amount: number;
  status: "paid" | "unpaid" | "overdue";
  dueDate: string;
  issuedAt: string;
};

export const MOCK_PLANS: Plan[] = [
  { id: "p1", name: "Basic 10 Mbps", speed: "10 Mbps", price: 150000 },
  { id: "p2", name: "Standard 20 Mbps", speed: "20 Mbps", price: 250000 },
  { id: "p3", name: "Pro 50 Mbps", speed: "50 Mbps", price: 400000 },
  { id: "p4", name: "Ultra 100 Mbps", speed: "100 Mbps", price: 750000 },
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Budi Santoso",
    email: "budi@example.com",
    phone: "081234567890",
    address: "Jl. Merdeka No. 1, Jakarta",
    planId: "p2",
    status: "active",
    joinedAt: "2023-01-15",
  },
  {
    id: "c2",
    name: "Siti Aminah",
    email: "siti@example.com",
    phone: "081987654321",
    address: "Jl. Sudirman No. 45, Bandung",
    planId: "p1",
    status: "active",
    joinedAt: "2023-03-20",
  },
  {
    id: "c3",
    name: "Andi Wijaya",
    email: "andi@example.com",
    phone: "085612349876",
    address: "Jl. Gatot Subroto No. 88, Surabaya",
    planId: "p3",
    status: "inactive",
    joinedAt: "2022-11-05",
  },
  {
    id: "c4",
    name: "Rina Melati",
    email: "rina@example.com",
    phone: "082134567890",
    address: "Jl. Pahlawan No. 12, Semarang",
    planId: "p2",
    status: "active",
    joinedAt: "2023-06-10",
  },
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "INV-202310-001",
    customerId: "c1",
    planId: "p2",
    amount: 250000,
    status: "paid",
    dueDate: "2023-10-10",
    issuedAt: "2023-10-01",
  },
  {
    id: "INV-202310-002",
    customerId: "c2",
    planId: "p1",
    amount: 150000,
    status: "unpaid",
    dueDate: "2023-10-15",
    issuedAt: "2023-10-01",
  },
  {
    id: "INV-202310-003",
    customerId: "c4",
    planId: "p2",
    amount: 250000,
    status: "overdue",
    dueDate: "2023-10-05",
    issuedAt: "2023-10-01",
  },
  {
    id: "INV-202309-001",
    customerId: "c1",
    planId: "p2",
    amount: 250000,
    status: "paid",
    dueDate: "2023-09-10",
    issuedAt: "2023-09-01",
  },
];
