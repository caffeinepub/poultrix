import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Download, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function FarmerSettlementReport() {
  const { farms: scopedFarms } = useCompanyScope();

  const farms = scopedFarms;

  const [filterFarm, setFilterFarm] = useState("all");
  const [filterBatch, setFilterBatch] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [generated, setGenerated] = useState(false);

  const batches = useMemo(() => {
    const all = storage.getBatches();
    if (filterFarm !== "all") return all.filter((b) => b.farmId === filterFarm);

    const farmIdSet = new Set(farms.map((f) => f.id));
    return all.filter((b) => farmIdSet.has(b.farmId));
  }, [filterFarm, farms]);

  const settlements = useMemo(() => {
    if (!generated) return [];
    let list = storage
      .getPendingSettlements()
      .filter((s) => s.status === "confirmed");
    const farmIdSet = new Set(farms.map((f) => f.id));
    list = list.filter((s) => farmIdSet.has(s.farmId));
    if (filterFarm !== "all")
      list = list.filter((s) => s.farmId === filterFarm);
    if (filterBatch !== "all")
      list = list.filter((s) => s.batchId === filterBatch);
    if (fromDate) list = list.filter((s) => s.closedAt >= fromDate);
    if (toDate) list = list.filter((s) => s.closedAt <= `${toDate}T23:59:59`);
    return list;
  }, [generated, filterFarm, filterBatch, fromDate, toDate, farms]);

  const approvedExpenses = storage
    .getExpenses()
    .filter((e) => e.status === "approved");

  const reportRows = useMemo(() => {
    return settlements.map((s) => {
      const farm = farms.find((f) => f.id === s.farmId);
      const medicineDeduction = approvedExpenses
        .filter(
          (e) =>
            e.farmId === s.farmId &&
            (e.batchId === s.batchId || !e.batchId) &&
            e.type === "Medicine Cost",
        )
        .reduce((a, e) => a + e.amount, 0);
      const feedDeduction = 0; // feed cost rates not stored; set to 0
      const otherDeductions = approvedExpenses
        .filter(
          (e) =>
            e.farmId === s.farmId &&
            (e.batchId === s.batchId || !e.batchId) &&
            e.type !== "Medicine Cost",
        )
        .reduce((a, e) => a + e.amount, 0);
      const finalPayable =
        s.totalGCPayable - medicineDeduction - feedDeduction - otherDeductions;
      return {
        farmName: farm?.name || s.farmId,
        batchNumber: s.batchNumber,
        birdsPlaced: s.birdsPlaced,
        birdsSold: s.birdsSold,
        mortalityPct: s.mortalityPct,
        finalFCR: s.finalFCR,
        gcRate: s.gcRatePerBird,
        totalGC: s.totalGCPayable,
        medicineDeduction,
        feedDeduction,
        otherDeductions,
        finalPayable,
      };
    });
  }, [settlements, farms, approvedExpenses]);

  const handleExcelExport = async () => {
    try {
      const XLSX = await import("xlsx");
      const data = reportRows.map((r) => ({
        "Farm Name": r.farmName,
        "Batch Number": r.batchNumber,
        "Birds Placed": r.birdsPlaced,
        "Birds Sold": r.birdsSold,
        "Mortality %": r.mortalityPct.toFixed(2),
        "Final FCR": r.finalFCR.toFixed(3),
        "GC Rate (₹)": r.gcRate,
        "Total GC (₹)": r.totalGC.toFixed(2),
        "Medicine Deductions (₹)": r.medicineDeduction.toFixed(2),
        "Feed Deductions (₹)": r.feedDeduction.toFixed(2),
        "Other Deductions (₹)": r.otherDeductions.toFixed(2),
        "Final Payable (₹)": r.finalPayable.toFixed(2),
      }));
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Settlement Report");
      XLSX.writeFile(wb, "farmer_settlement_report.xlsx");
      toast.success("Excel exported.");
    } catch {
      toast.error("Export failed.");
    }
  };

  const handlePDFExport = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");
      const doc = new jsPDF({ orientation: "landscape" });
      doc.text("Farmer Settlement Report", 14, 15);
      autoTable(doc, {
        startY: 22,
        head: [
          [
            "Farm",
            "Batch",
            "Placed",
            "Sold",
            "Mort%",
            "FCR",
            "GC Rate",
            "Total GC",
            "Med Ded",
            "Feed Ded",
            "Other Ded",
            "Final Pay",
          ],
        ],
        body: reportRows.map((r) => [
          r.farmName,
          r.batchNumber,
          r.birdsPlaced,
          r.birdsSold,
          r.mortalityPct.toFixed(2),
          r.finalFCR.toFixed(3),
          `₹${r.gcRate}`,
          `₹${r.totalGC.toFixed(0)}`,
          `₹${r.medicineDeduction.toFixed(0)}`,
          `₹${r.feedDeduction.toFixed(0)}`,
          `₹${r.otherDeductions.toFixed(0)}`,
          `₹${r.finalPayable.toFixed(0)}`,
        ]),
        styles: { fontSize: 8 },
      });
      doc.save("farmer_settlement_report.pdf");
      toast.success("PDF exported.");
    } catch {
      toast.error("PDF export failed.");
    }
  };

  return (
    <div data-ocid="settlement_report.page" className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText size={20} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Farmer Settlement Report</h1>
          <p className="text-sm text-muted-foreground">
            Generate and download settlement reports
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Farm
              </Label>
              <Select
                value={filterFarm}
                onValueChange={(v) => {
                  setFilterFarm(v);
                  setFilterBatch("all");
                  setGenerated(false);
                }}
              >
                <SelectTrigger data-ocid="settlement_report.farm.select">
                  <SelectValue placeholder="All Farms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Farms</SelectItem>
                  {farms.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                Batch
              </Label>
              <Select
                value={filterBatch}
                onValueChange={(v) => {
                  setFilterBatch(v);
                  setGenerated(false);
                }}
              >
                <SelectTrigger data-ocid="settlement_report.batch.select">
                  <SelectValue placeholder="All Batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {batches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.batchNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                From Date
              </Label>
              <Input
                type="date"
                data-ocid="settlement_report.from_date.input"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setGenerated(false);
                }}
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1 block">
                To Date
              </Label>
              <Input
                type="date"
                data-ocid="settlement_report.to_date.input"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setGenerated(false);
                }}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button
              data-ocid="settlement_report.generate_button"
              onClick={() => setGenerated(true)}
            >
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {generated && (
        <>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              data-ocid="settlement_report.excel_button"
              onClick={handleExcelExport}
              className="gap-2"
            >
              <Download size={16} /> Export Excel
            </Button>
            <Button
              variant="outline"
              data-ocid="settlement_report.pdf_button"
              onClick={handlePDFExport}
              className="gap-2"
            >
              <Download size={16} /> Export PDF
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {reportRows.length === 0 ? (
                <div
                  data-ocid="settlement_report.empty_state"
                  className="py-12 text-center text-muted-foreground text-sm"
                >
                  No confirmed settlements found for the selected filters.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table data-ocid="settlement_report.table">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Farm Name</TableHead>
                        <TableHead>Batch No</TableHead>
                        <TableHead>Birds Placed</TableHead>
                        <TableHead>Birds Sold</TableHead>
                        <TableHead>Mortality %</TableHead>
                        <TableHead>Final FCR</TableHead>
                        <TableHead>GC Rate (₹)</TableHead>
                        <TableHead>Total GC (₹)</TableHead>
                        <TableHead>Med Deductions</TableHead>
                        <TableHead>Feed Deductions</TableHead>
                        <TableHead>Other Deductions</TableHead>
                        <TableHead>Final Payable (₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportRows.map((r, idx) => (
                        <TableRow
                          key={`${r.batchNumber}-${idx}`}
                          data-ocid={`settlement_report.row.${idx + 1}`}
                        >
                          <TableCell>{r.farmName}</TableCell>
                          <TableCell>{r.batchNumber}</TableCell>
                          <TableCell>
                            {r.birdsPlaced.toLocaleString()}
                          </TableCell>
                          <TableCell>{r.birdsSold.toLocaleString()}</TableCell>
                          <TableCell>{r.mortalityPct.toFixed(2)}%</TableCell>
                          <TableCell>{r.finalFCR.toFixed(3)}</TableCell>
                          <TableCell>₹{r.gcRate.toFixed(2)}</TableCell>
                          <TableCell className="text-green-600 font-semibold">
                            ₹{r.totalGC.toFixed(0)}
                          </TableCell>
                          <TableCell className="text-red-600">
                            ₹{r.medicineDeduction.toFixed(0)}
                          </TableCell>
                          <TableCell className="text-red-600">
                            ₹{r.feedDeduction.toFixed(0)}
                          </TableCell>
                          <TableCell className="text-red-600">
                            ₹{r.otherDeductions.toFixed(0)}
                          </TableCell>
                          <TableCell className="font-bold">
                            ₹{r.finalPayable.toFixed(0)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
