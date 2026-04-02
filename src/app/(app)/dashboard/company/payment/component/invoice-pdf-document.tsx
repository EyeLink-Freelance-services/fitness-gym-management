"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { InvoiceData } from "./invoice-template";

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 11,
    color: "#0f172a",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
  },
  label: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 10,
    color: "#64748b",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  card: {
    border: "1 solid #e2e8f0",
    borderRadius: 12,
    padding: 14,
  },
  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  col: {
    flex: 1,
  },
  table: {
    border: "1 solid #e2e8f0",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderTop: "1 solid #e2e8f0",
  },
  desc: {
    flex: 3,
  },
  qty: {
    flex: 1,
    textAlign: "right",
  },
  price: {
    flex: 1.5,
    textAlign: "right",
  },
  total: {
    flex: 1.5,
    textAlign: "right",
  },
  summaryWrap: {
    flexDirection: "row",
    gap: 12,
  },
  notes: {
    flex: 1.6,
    border: "1 solid #e2e8f0",
    borderRadius: 12,
    padding: 14,
  },
  summary: {
    flex: 1,
    backgroundColor: "#0f172a",
    color: "#ffffff",
    borderRadius: 12,
    padding: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});

const formatMoney = (value: number, currency = "MUR") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export function InvoicePdfDocument({ data }: { data: InvoiceData }) {
  const currency = data.currency ?? "MUR";
  const discount = data.discount ?? 0;
  const taxRate = data.taxRate ?? 0;

  const rows = data.items.map((item) => {
    const subtotal = item.quantity * item.unitCost;
    const tax = item.tax ?? subtotal * (taxRate / 100);
    const total = subtotal + tax;

    return { ...item, subtotal, tax, total };
  });

  const subtotal = rows.reduce((sum, item) => sum + item.subtotal, 0);
  const taxTotal = rows.reduce((sum, item) => sum + item.tax, 0);
  const grandTotal = Math.max(subtotal + taxTotal - discount, 0);

  return (
    <Document title={data.invoiceNumber}>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.label}>{data.invoiceTitle ?? "Invoice"}</Text>
            <Text style={styles.title}>{data.brandName ?? data.from.name}</Text>
          </View>

          <View style={styles.card}>
            <Text>Invoice No: {data.invoiceNumber}</Text>
            <Text>Issue Date: {formatDate(data.issueDate)}</Text>
            <Text>Due Date: {data.dueDate ? formatDate(data.dueDate) : "—"}</Text>
          </View>
        </View>

        <View style={styles.grid}>
          <View style={[styles.col, styles.card]}>
            <Text style={styles.sectionTitle}>From</Text>
            <Text>{data.from.name}</Text>
            {data.from.addressLine1 ? <Text>{data.from.addressLine1}</Text> : null}
            {data.from.addressLine2 ? <Text>{data.from.addressLine2}</Text> : null}
            {data.from.city ? <Text>{data.from.city}</Text> : null}
            {data.from.country ? <Text>{data.from.country}</Text> : null}
            {data.from.email ? <Text>{data.from.email}</Text> : null}
          </View>

          <View style={[styles.col, styles.card]}>
            <Text style={styles.sectionTitle}>Bill To</Text>
            <Text>{data.billTo.name}</Text>
            {data.billTo.addressLine1 ? <Text>{data.billTo.addressLine1}</Text> : null}
            {data.billTo.addressLine2 ? <Text>{data.billTo.addressLine2}</Text> : null}
            {data.billTo.city ? <Text>{data.billTo.city}</Text> : null}
            {data.billTo.country ? <Text>{data.billTo.country}</Text> : null}
            {data.billTo.email ? <Text>{data.billTo.email}</Text> : null}
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.desc}>Description</Text>
            <Text style={styles.qty}>Qty</Text>
            <Text style={styles.price}>Unit Cost</Text>
            <Text style={styles.total}>Amount</Text>
          </View>

          {rows.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.qty}>{item.quantity}</Text>
              <Text style={styles.price}>{formatMoney(item.unitCost, currency)}</Text>
              <Text style={styles.total}>{formatMoney(item.total, currency)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryWrap}>
          <View style={styles.notes}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text>{data.notes?.trim() || "Thank you for your business."}</Text>
          </View>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text>Subtotal</Text>
              <Text>{formatMoney(subtotal, currency)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Tax</Text>
              <Text>{formatMoney(taxTotal, currency)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Discount</Text>
              <Text>- {formatMoney(discount, currency)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Total</Text>
              <Text>{formatMoney(grandTotal, currency)}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}