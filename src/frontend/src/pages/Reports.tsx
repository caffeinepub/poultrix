import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { storage } from "@/lib/storage";
import { Download, FileSpreadsheet, FileText, Printer } from "lucide-react";
import { useState } from "react";

type Row = Record<string, string | number>;

function downloadCSV(rows: Row[], filename: string) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => `"${r[h]}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

async function downloadExcel(rows: Row[], filename: string) {
  const XLSX = await import("xlsx");
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");
  XLSX.writeFile(wb, filename);
}

async function downloadPDF(rows: Row[], title: string, filename: string) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(title, 14, 16);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 24);
  if (rows.length) {
    autoTable(doc, {
      startY: 30,
      head: [Object.keys(rows[0])],
      body: rows.map((r) => Object.values(r).map(String)),
    });
  }
  doc.save(filename);
}

function ReportTable({
  rows,
  title,
  filename,
}: { rows: Row[]; title: string; filename: string }) {
  const cols = rows.length ? Object.keys(rows[0]) : [];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" data-ocid="reports.export.section">
        <Button
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
          onClick={() => downloadExcel(rows, `${filename}.xlsx`)}
          data-ocid="reports.excel.button"
        >
          <FileSpreadsheet size={14} className="mr-1" />
          Excel
        </Button>
        <Button
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => downloadPDF(rows, title, `${filename}.pdf`)}
          data-ocid="reports.pdf.button"
        >
          <FileText size={14} className="mr-1" />
          PDF
        </Button>
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => downloadCSV(rows, `${filename}.csv`)}
          data-ocid="reports.csv.button"
        >
          <Download size={14} className="mr-1" />
          CSV
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => window.print()}
          data-ocid="reports.print.button"
        >
          <Printer size={14} className="mr-1" />
          Print
        </Button>
      </div>
      {rows.length === 0 ? (
        <Card data-ocid="reports.empty_state">
          <CardContent className="p-6 text-center text-muted-foreground">
            No data available for this report.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto print:overflow-visible">
          <table
            className="w-full text-sm border-collapse"
            data-ocid="reports.data.table"
          >
            <thead>
              <tr className="border-b bg-muted/50">
                {cols.map((c) => (
                  <th key={c} className="text-left p-2 font-medium">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={JSON.stringify(r).slice(0, 32)}
                  className="border-b hover:bg-muted/30 even:bg-muted/10"
                >
                  {cols.map((c) => (
                    <td key={c} className="p-2">
                      {String(r[c])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function Reports() {
  const batches = storage.getBatches();
  const farms = storage.getFarms();
  const dailyEntries = storage.getDailyEntries();
  const feedPurchases = storage.getFeedPurchases();
  const birdSales = storage.getBirdSales();
  const payments = storage.getPayments();
  const receipts = storage.getReceipts();

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [batchFilter, setBatchFilter] = useState("");

  const dailyRows = (
    batchFilter
      ? dailyEntries.filter((e) => e.batchId === batchFilter)
      : dailyEntries
  )
    .filter(
      (e) =>
        (!dateFrom || e.entryDate >= dateFrom) &&
        (!dateTo || e.entryDate <= dateTo),
    )
    .map((e) => ({
      Date: e.entryDate,
      Batch: batches.find((b) => b.id === e.batchId)?.batchNumber || "-",
      "Birds Alive": e.birdsAlive,
      Mortality: e.mortalityCount,
      "Cull Birds": e.cullBirds,
      "Feed (g)": e.feedIntakeGrams,
      "Weight (g)": e.bodyWeightGrams,
      FCR: e.fcr,
      "Mortality%": e.mortalityPct,
      Medicine: e.medicineUsed || "-",
      Vaccine: e.vaccineUsed || "-",
      Remarks: e.remarks || "-",
    }));

  const mortalityRows = dailyEntries
    .filter(
      (e) =>
        (!dateFrom || e.entryDate >= dateFrom) &&
        (!dateTo || e.entryDate <= dateTo),
    )
    .map((e) => ({
      Date: e.entryDate,
      Batch: batches.find((b) => b.id === e.batchId)?.batchNumber || "-",
      Farm:
        farms.find(
          (f) => f.id === batches.find((b) => b.id === e.batchId)?.farmId,
        )?.name || "-",
      Mortality: e.mortalityCount,
      "Cull Birds": e.cullBirds,
      "Total Dead": e.mortalityCount + e.cullBirds,
      "Mortality%": e.mortalityPct,
    }));

  const fcrRows = batches.map((b) => {
    const ents = dailyEntries.filter((e) => e.batchId === b.id);
    const avgFCR = ents.length
      ? (ents.reduce((s, e) => s + e.fcr, 0) / ents.length).toFixed(2)
      : "N/A";
    return {
      Batch: b.batchNumber,
      Farm: farms.find((f) => f.id === b.farmId)?.name || "-",
      "Chicks Placed": b.chicksQty,
      "Birds Alive": b.birdsAlive,
      "Avg FCR": avgFCR,
      Status: b.status,
    };
  });

  const feedConsRows = dailyEntries
    .filter(
      (e) =>
        (!dateFrom || e.entryDate >= dateFrom) &&
        (!dateTo || e.entryDate <= dateTo),
    )
    .map((e) => ({
      Date: e.entryDate,
      Batch: batches.find((b) => b.id === e.batchId)?.batchNumber || "-",
      "Feed Intake (g)": e.feedIntakeGrams,
      "Cumulative Feed (g)": e.cumulativeFeed,
      "Water (L)": e.waterConsumptionLiters,
    }));

  const feedPurchaseRows = feedPurchases
    .filter(
      (p) =>
        (!dateFrom || p.purchaseDate >= dateFrom) &&
        (!dateTo || p.purchaseDate <= dateTo),
    )
    .map((p) => ({
      Date: p.purchaseDate,
      Supplier: p.supplierName,
      "Feed Type": p.feedType,
      Bags: p.quantityBags,
      "Rate/Bag": p.ratePerBag,
      Discount: p.discountAmount,
      "Total PKR": p.totalAmount,
    }));

  const chicksRows = batches
    .filter(
      (b) =>
        (!dateFrom || b.placementDate >= dateFrom) &&
        (!dateTo || b.placementDate <= dateTo),
    )
    .map((b) => ({
      Date: b.placementDate,
      Batch: b.batchNumber,
      Farm: farms.find((f) => f.id === b.farmId)?.name || "-",
      Hatchery: b.hatcheryName,
      Breed: b.breedType,
      "Chicks Qty": b.chicksQty,
      "Chicks Rate": b.chicksRate,
      Transport: b.transportCost,
      "Total Cost PKR": b.totalPlacementCost,
    }));

  const salesRows = birdSales
    .filter(
      (s) =>
        (!dateFrom || s.dispatchDate >= dateFrom) &&
        (!dateTo || s.dispatchDate <= dateTo),
    )
    .map((s) => ({
      Date: s.dispatchDate,
      Batch: batches.find((b) => b.id === s.batchId)?.batchNumber || "-",
      Farm: farms.find((f) => f.id === s.farmId)?.name || "-",
      "Birds Qty": s.birdsQty,
      "Avg Wt(kg)": s.avgWeightKg,
      "Rate/kg": s.ratePerKg,
      "Total Wt(kg)": s.totalWeightKg,
      "Amount PKR": s.totalAmount,
      Trader: s.traderName,
      Vehicle: s.vehicleNumber,
    }));

  const paymentRows = payments
    .filter(
      (p) => (!dateFrom || p.date >= dateFrom) && (!dateTo || p.date <= dateTo),
    )
    .map((p) => ({
      Date: p.date,
      Farm: farms.find((f) => f.id === p.farmId)?.name || "-",
      "Amount PKR": p.amount,
      Type: p.paymentType,
      Description: p.description || "-",
      "Entered By": p.enteredBy || "-",
    }));

  const receiptRows = receipts
    .filter(
      (r) => (!dateFrom || r.date >= dateFrom) && (!dateTo || r.date <= dateTo),
    )
    .map((r) => ({
      Date: r.date,
      Farm: farms.find((f) => f.id === r.farmId)?.name || "-",
      "Amount PKR": r.amount,
      Type: r.paymentType,
      Notes: r.notes || "-",
      "Entered By": r.enteredBy || "-",
    }));

  const financialSummaryRows = farms.map((f) => {
    const farmPayments = payments
      .filter((p) => p.farmId === f.id)
      .reduce((s, p) => s + p.amount, 0);
    const farmReceipts = receipts
      .filter((r) => r.farmId === f.id)
      .reduce((s, r) => s + r.amount, 0);
    return {
      Farm: f.name,
      "Total Payments PKR": farmPayments,
      "Total Receipts PKR": farmReceipts,
      "Net Balance PKR": farmReceipts - farmPayments,
    };
  });

  return (
    <div className="space-y-6" data-ocid="reports.page">
      <h2 className="text-2xl font-bold">Reports</h2>
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <Label>From Date</Label>
              <Input
                data-ocid="reports.date_from.input"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-36"
              />
            </div>
            <div>
              <Label>To Date</Label>
              <Input
                data-ocid="reports.date_to.input"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-36"
              />
            </div>
            <div>
              <Label>Batch</Label>
              <select
                data-ocid="reports.batch.select"
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">All Batches</option>
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.batchNumber}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
                setBatchFilter("");
              }}
              data-ocid="reports.clear.button"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="daily" data-ocid="reports.tab">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="daily" data-ocid="reports.daily.tab">
            Daily Performance
          </TabsTrigger>
          <TabsTrigger value="mortality" data-ocid="reports.mortality.tab">
            Mortality
          </TabsTrigger>
          <TabsTrigger value="fcr" data-ocid="reports.fcr.tab">
            FCR
          </TabsTrigger>
          <TabsTrigger value="feedcons" data-ocid="reports.feedcons.tab">
            Feed Consumption
          </TabsTrigger>
          <TabsTrigger
            value="feedpurchase"
            data-ocid="reports.feedpurchase.tab"
          >
            Feed Purchase
          </TabsTrigger>
          <TabsTrigger value="chicks" data-ocid="reports.chicks.tab">
            Chicks Purchase
          </TabsTrigger>
          <TabsTrigger value="sales" data-ocid="reports.sales.tab">
            Bird Sales
          </TabsTrigger>
          <TabsTrigger value="payments" data-ocid="reports.payments.tab">
            Payments
          </TabsTrigger>
          <TabsTrigger value="receipts" data-ocid="reports.receipts.tab">
            Receipts
          </TabsTrigger>
          <TabsTrigger value="financial" data-ocid="reports.financial.tab">
            Financial Summary
          </TabsTrigger>
        </TabsList>
        <TabsContent value="daily" className="mt-4">
          <ReportTable
            rows={dailyRows}
            title="Daily Farm Performance"
            filename="daily_performance"
          />
        </TabsContent>
        <TabsContent value="mortality" className="mt-4">
          <ReportTable
            rows={mortalityRows}
            title="Mortality Report"
            filename="mortality_report"
          />
        </TabsContent>
        <TabsContent value="fcr" className="mt-4">
          <ReportTable
            rows={fcrRows}
            title="FCR Report"
            filename="fcr_report"
          />
        </TabsContent>
        <TabsContent value="feedcons" className="mt-4">
          <ReportTable
            rows={feedConsRows}
            title="Feed Consumption Report"
            filename="feed_consumption"
          />
        </TabsContent>
        <TabsContent value="feedpurchase" className="mt-4">
          <ReportTable
            rows={feedPurchaseRows}
            title="Feed Purchase Report"
            filename="feed_purchase"
          />
        </TabsContent>
        <TabsContent value="chicks" className="mt-4">
          <ReportTable
            rows={chicksRows}
            title="Chicks Purchase Report"
            filename="chicks_purchase"
          />
        </TabsContent>
        <TabsContent value="sales" className="mt-4">
          <ReportTable
            rows={salesRows}
            title="Bird Sales Report"
            filename="bird_sales"
          />
        </TabsContent>
        <TabsContent value="payments" className="mt-4">
          <ReportTable
            rows={paymentRows}
            title="Payment Report"
            filename="payment_report"
          />
        </TabsContent>
        <TabsContent value="receipts" className="mt-4">
          <ReportTable
            rows={receiptRows}
            title="Receipt Report"
            filename="receipt_report"
          />
        </TabsContent>
        <TabsContent value="financial" className="mt-4">
          <ReportTable
            rows={financialSummaryRows}
            title="Farm Financial Summary"
            filename="financial_summary"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
