import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";
import { useCompanyScope } from "@/lib/roleFilter";
import { storage } from "@/lib/storage";
import { Download, FileText, Printer, Search } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";

function downloadInvoicePDF(
  invoice: ReturnType<typeof storage.getSubscriptionInvoices>[number],
  userName: string,
  userRole: string,
) {
  import("jspdf").then(({ default: jsPDF }) => {
    const doc = new jsPDF();
    const green = [34, 139, 34] as [number, number, number];
    const darkGreen = [22, 101, 52] as [number, number, number];

    // Header box
    doc.setFillColor(...green);
    doc.rect(0, 0, 210, 35, "F");

    // Logo area
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(10, 7, 22, 22, 3, 3, "F");
    doc.setTextColor(...green);
    doc.setFontSize(18);
    doc.text("🐔", 13, 22);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("POULTRIX", 38, 18);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("FARM MANAGEMENT", 38, 25);
    doc.text("Smart Automation for Poultry Business", 38, 31);

    doc.setTextColor(...darkGreen);
    doc.setFontSize(8);
    doc.text("India | support@poultrix.com", 10, 44);

    // INVOICE title
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("INVOICE", 140, 50);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice No: ${invoice.invoiceNumber}`, 140, 58);
    doc.text(`Date: ${invoice.invoiceDate}`, 140, 64);
    doc.text(`Period: ${invoice.period}`, 140, 70);

    // Client
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 10, 58);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(userName, 10, 65);
    doc.text(`Role: ${userRole}`, 10, 71);

    // Separator
    doc.setDrawColor(...green);
    doc.setLineWidth(0.5);
    doc.line(10, 78, 200, 78);

    // Table header
    doc.setFillColor(...green);
    doc.rect(10, 80, 190, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Description", 14, 86);
    doc.text("Birds", 100, 86);
    doc.text("Rate (₹/bird)", 125, 86);
    doc.text("Amount (₹)", 162, 86);

    // Row
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Monthly Subscription", 14, 97);
    doc.text(String(invoice.totalBirds), 100, 97);
    doc.text(`₹${invoice.perBirdRate.toFixed(2)}`, 125, 97);
    doc.text(`₹${invoice.calculatedAmount.toFixed(2)}`, 162, 97);

    if (invoice.finalAmount > invoice.calculatedAmount) {
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`* Minimum plan applied: ₹${invoice.minimumAmount}`, 14, 105);
    }

    // Total box
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(130, 110, 70, 18, 3, 3, "F");
    doc.setDrawColor(...green);
    doc.roundedRect(130, 110, 70, 18, 3, 3, "D");
    doc.setTextColor(...darkGreen);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("TOTAL", 138, 120);
    doc.text(`₹${invoice.finalAmount.toFixed(2)}`, 170, 120);

    // Status badge
    doc.setFillColor(...green);
    doc.roundedRect(10, 112, 30, 10, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("PAID", 19, 119);

    // Footer
    doc.setDrawColor(...green);
    doc.line(10, 275, 200, 275);
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for using Poultrix", 75, 282);

    doc.save(`invoice-${invoice.invoiceNumber}.pdf`);
  });
}

export default function SubscriptionInvoices() {
  const { currentUser } = useAuth();
  const { isSuperAdmin } = useCompanyScope();
  const [search, setSearch] = useState("");

  const isAdmin = isSuperAdmin || currentUser?.role === "CompanyAdmin";
  const allUsers = storage.getUsers();

  let invoices = storage.getSubscriptionInvoices();
  if (!isAdmin && currentUser) {
    invoices = invoices.filter((inv) => inv.userId === currentUser.id);
  }
  if (search) {
    invoices = invoices.filter((inv) => {
      const user = allUsers.find((u) => u.id === inv.userId);
      return (
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        user?.name?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }

  function handleExcelDownload(inv: (typeof invoices)[number]) {
    const user = allUsers.find((u) => u.id === inv.userId);
    const ws = XLSX.utils.aoa_to_sheet([
      ["POULTRIX FARM MANAGEMENT"],
      ["India | support@poultrix.com"],
      [],
      ["Invoice Number", inv.invoiceNumber],
      ["Invoice Date", inv.invoiceDate],
      ["Period", inv.period],
      ["Client", user?.name ?? ""],
      ["Role", user?.role ?? ""],
      [],
      ["Description", "Birds", "Rate (₹/bird)", "Calculated (₹)", "Final (₹)"],
      [
        "Monthly Subscription",
        inv.totalBirds,
        inv.perBirdRate,
        inv.calculatedAmount,
        inv.finalAmount,
      ],
      [],
      ["Total", "", "", "", inv.finalAmount],
      ["Status", "PAID"],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoice");
    XLSX.writeFile(wb, `invoice-${inv.invoiceNumber}.xlsx`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Download and manage billing invoices
          </p>
        </div>
      </div>

      <div className="relative max-w-xs">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search invoices…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-ocid="billing.invoices.search_input"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-muted-foreground"
              data-ocid="billing.invoices.empty_state"
            >
              <FileText size={40} className="mb-3 opacity-30" />
              <p className="font-medium">No invoices yet</p>
              <p className="text-sm">
                Invoices are auto-generated when a payment is verified.
              </p>
            </div>
          ) : (
            <Table data-ocid="billing.invoices.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  {isAdmin && <TableHead>Client</TableHead>}
                  <TableHead>Period</TableHead>
                  <TableHead>Birds</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Calculated</TableHead>
                  <TableHead>Final (₹)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv, idx) => {
                  const user = allUsers.find((u) => u.id === inv.userId);
                  return (
                    <TableRow
                      key={inv.id}
                      data-ocid={`billing.invoices.item.${idx + 1}`}
                    >
                      <TableCell className="font-medium font-mono">
                        {inv.invoiceNumber}
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">
                              {user?.name ?? "—"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user?.role}
                            </p>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>{inv.period}</TableCell>
                      <TableCell>{inv.totalBirds.toLocaleString()}</TableCell>
                      <TableCell>₹{inv.perBirdRate.toFixed(2)}</TableCell>
                      <TableCell>₹{inv.calculatedAmount.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{inv.finalAmount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          Paid
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {inv.invoiceDate}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            data-ocid={`billing.invoices.pdf.button.${idx + 1}`}
                            onClick={() =>
                              downloadInvoicePDF(
                                inv,
                                user?.name ?? "Client",
                                user?.role ?? "",
                              )
                            }
                            title="Download PDF"
                          >
                            <Download size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            data-ocid={`billing.invoices.excel.button.${idx + 1}`}
                            onClick={() => handleExcelDownload(inv)}
                            title="Download Excel"
                          >
                            <FileText size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            data-ocid={`billing.invoices.print.button.${idx + 1}`}
                            onClick={() => window.print()}
                            title="Print"
                          >
                            <Printer size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
