import { MembershipPlanRow } from "@/lib/validation/schemas/membership-plan";
import Link from "next/link";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-MU", {
    style: "currency",
    currency: "MUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function getDurationLabel(plan: MembershipPlanRow) {
  if (plan.is_monthly) {
    const months = plan.duration_days / 30;
    if (months === 1) return "1 month";
    if (Number.isInteger(months)) return `${months} months`;
  }

  if (plan.duration_days === 1) return "1 day";
  return `${plan.duration_days} days`;
}

interface MembershipPlanProps {
  plan: MembershipPlanRow; // replace with your member type
}

export default function MembershipPlanView({plan}: MembershipPlanProps) {
	if (!plan) {
		return <div className="p-4 text-sm text-gray-600">Membership plan not found.</div>;
	}

	return (
		<div className="mx-auto w-full max-w-4xl p-4">
			<div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
				<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
					<div>
						<div className="flex items-center gap-2">
							<h1 className="text-2xl font-semibold text-gray-900">{plan.name}</h1>
							<span
								className={[
									"inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
									plan.is_active
										? "bg-green-100 text-green-700"
										: "bg-gray-100 text-gray-600",
								].join(" ")}
							>
								{plan.is_active ? "Active" : "Inactive"}
							</span>
						</div>

						<p className="mt-2 text-sm text-gray-500">
							View the configured pricing, duration, and details for this membership plan.
						</p>
					</div>

					<Link
						href={`/membership-plans/${plan.id}/edit`}
						className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-black/90"
					>
						Edit Plan
					</Link>
				</div>

				<div className="mt-6 grid gap-4 md:grid-cols-2">
					<div className="rounded-2xl border border-gray-200 p-4">
						<p className="text-sm text-gray-500">Price</p>
						<p className="mt-1 text-lg font-semibold text-gray-900">
							{formatCurrency(plan.price)}
						</p>
					</div>

					<div className="rounded-2xl border border-gray-200 p-4">
						<p className="text-sm text-gray-500">Entry Fee</p>
						<p className="mt-1 text-lg font-semibold text-gray-900">
							{formatCurrency(plan.entree_fee)}
						</p>
					</div>

					<div className="rounded-2xl border border-gray-200 p-4">
						<p className="text-sm text-gray-500">Billing Type</p>
						<p className="mt-1 text-lg font-semibold text-gray-900">
							{plan.is_monthly ? "Monthly" : "Custom"}
						</p>
					</div>

					<div className="rounded-2xl border border-gray-200 p-4">
						<p className="text-sm text-gray-500">Duration</p>
						<p className="mt-1 text-lg font-semibold text-gray-900">
							{getDurationLabel(plan)}
						</p>
					</div>
				</div>

				<div className="mt-4 rounded-2xl border border-gray-200 p-4">
					<p className="text-sm text-gray-500">Description</p>
					<p className="mt-2 text-sm text-gray-800">{plan.description || "-"}</p>
				</div>

				<div className="mt-4 grid gap-4 md:grid-cols-2">
					<div className="rounded-2xl border border-gray-200 p-4">
						<p className="text-sm text-gray-500">Created At</p>
						<p className="mt-1 text-sm font-medium text-gray-900">
							{new Date(plan.created_at).toLocaleString()}
						</p>
					</div>

					<div className="rounded-2xl border border-gray-200 p-4">
						<p className="text-sm text-gray-500">Updated At</p>
						<p className="mt-1 text-sm font-medium text-gray-900">
							{new Date(plan.updated_at).toLocaleString()}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}