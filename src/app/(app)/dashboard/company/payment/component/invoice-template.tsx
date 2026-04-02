"use client";

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitCost: number;
  tax?: number;
};

type InvoiceParty = {
  name: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  country?: string;
  zipCode?: string;
  phone?: string;
  email?: string;
};

export type InvoiceData = {
  logoUrl?: string;
  brandName?: string;
  invoiceTitle?: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate?: string;
  currency?: string;
  from: InvoiceParty;
  billTo: InvoiceParty;
  items: InvoiceItem[];
  notes?: string;
  discount?: number;
  taxRate?: number;
};

type Props = {
  data: InvoiceData;
};

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

const getPartyLines = (party: InvoiceParty) =>
  [
    party.addressLine1,
    party.addressLine2,
    party.city,
    party.country,
    party.zipCode,
  ].filter(Boolean);

export default function InvoiceTemplate({ data }: Props) {
  const currency = data.currency ?? "MUR";
  const discount = data.discount ?? 0;
  const taxRate = data.taxRate ?? 0;

  const rows = data.items.map((item) => {
    const lineSubtotal = item.quantity * item.unitCost;
    const lineTax = item.tax ?? lineSubtotal * (taxRate / 100);
    const lineTotal = lineSubtotal + lineTax;

    return {
      ...item,
      lineSubtotal,
      lineTax,
      lineTotal,
    };
  });

  const subtotal = rows.reduce((sum, item) => sum + item.lineSubtotal, 0);
  const taxTotal = rows.reduce((sum, item) => sum + item.lineTax, 0);
  const total = Math.max(subtotal + taxTotal - discount, 0);

  return (
    <div className="mx-auto w-full max-w-5xl bg-[#eef5fb] print:bg-white print:p-0">
      <div className="overflow-hidden bg-white shadow-[0_24px_80px_rgba(15,23,42,0.12)] print:rounded-none print:shadow-none">
        <div className="relative px-6 pb-8 pt-6 md:px-10 md:pb-10 md:pt-8">
          <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-bl-[140px] bg-slate-50" />
          <div className="pointer-events-none absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />

          <div className="relative z-10 flex flex-col gap-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-4">
                {data.logoUrl ? (
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <img
                      src={data.logoUrl}
                      alt={data.brandName ?? data.from.name}
                      className="h-full w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-2xl font-semibold text-sky-700">
                    {(data.brandName ?? data.from.name).slice(0, 1)}
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    {data.invoiceTitle ?? "Invoice"}
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                    {data.brandName ?? data.from.name}
                  </h1>
                </div>
              </div>

              <div className="w-full max-w-xs rounded-3xl bg-slate-50 p-5">
                <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Invoice No
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {data.invoiceNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Issue Date
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {formatDate(data.issueDate)}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Due Date
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {data.dueDate ? formatDate(data.dueDate) : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  From
                </p>
                <h2 className="mt-3 text-lg font-semibold text-slate-900">
                  {data.from.name}
                </h2>

                <div className="mt-3 space-y-1.5 text-sm leading-6 text-slate-600">
                  {getPartyLines(data.from).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  {data.from.phone ? <p>{data.from.phone}</p> : null}
                  {data.from.email ? <p>{data.from.email}</p> : null}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Bill To
                </p>
                <h2 className="mt-3 text-lg font-semibold text-slate-900">
                  {data.billTo.name}
                </h2>

                <div className="mt-3 space-y-1.5 text-sm leading-6 text-slate-600">
                  {getPartyLines(data.billTo).map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  {data.billTo.phone ? <p>{data.billTo.phone}</p> : null}
                  {data.billTo.email ? <p>{data.billTo.email}</p> : null}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Description
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Qty
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Unit Cost
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Tax
                      </th>
                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((item, index) => (
                      <tr
                        key={item.id}
                        className={index !== rows.length - 1 ? "border-b border-slate-200" : ""}
                      >
                        <td className="px-5 py-4 align-top">
                          <p className="font-medium text-slate-900">
                            {item.description}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-right text-slate-700">
                          {item.quantity}
                        </td>
                        <td className="px-5 py-4 text-right text-slate-700">
                          {formatMoney(item.unitCost, currency)}
                        </td>
                        <td className="px-5 py-4 text-right text-slate-700">
                          {formatMoney(item.lineTax, currency)}
                        </td>
                        <td className="px-5 py-4 text-right font-medium text-slate-900">
                          {formatMoney(item.lineTotal, currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[1fr_360px]">
              <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Notes
                </p>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {data.notes?.trim() || "Thank you for your business."}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-900 p-6 text-white">
                <h3 className="text-lg font-semibold">Invoice Summary</h3>

                <div className="mt-5 space-y-4 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-300">Subtotal</span>
                    <span className="font-medium">
                      {formatMoney(subtotal, currency)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-300">Tax</span>
                    <span className="font-medium">
                      {formatMoney(taxTotal, currency)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-300">Discount</span>
                    <span className="font-medium">
                      - {formatMoney(discount, currency)}
                    </span>
                  </div>

                  <div className="h-px bg-white/10" />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-base font-semibold">Total</span>
                    <span className="text-2xl font-semibold tracking-tight">
                      {formatMoney(total, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs leading-6 text-slate-400 md:flex-row md:items-center md:justify-between">
              <p>
                Please make payment by the due date. Late payments may affect access
                to services or subscriptions.
              </p>
              <p>
                {data.brandName ?? data.from.name} · {data.invoiceNumber}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}