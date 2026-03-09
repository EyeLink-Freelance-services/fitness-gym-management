"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import MemberActions from "../components/ui";
import MeasurementsTab from "./measurements-tab";
import MembershipPlansSelector from "../../membership-plans/components/membership-plan-selector";
import { MembershipPlanTab } from "./membership-plan-tab";

type MemberTab = "measurments" | "progress" | "membership" | "medical";

export interface MemberTabsProps {
  member: any; // replace with your member type
}

export default function MemberTabs({ member }: MemberTabsProps) {
  const [activeTab, setActiveTab] = useState<MemberTab>("measurments");

  const tabs = [
    { key: "measurments" as MemberTab, label: "Measurments" },
    { key: "progress" as MemberTab, label: "Progress" },
    { key: "membership" as MemberTab, label: "Membership" },
    { key: "medical" as MemberTab, label: "Medical" },
  ];

  return (
    <div className="space-y-6">
			<div className="flex flex-wrap justify-between md:justify-center gap-10 w-full">
				<div className="flex-1">
					{/* Tabs */}
					<Tabs<MemberTab> value={activeTab} onChange={setActiveTab} tabs={tabs} />
					{/* Tab content */}
					<div className="mt-4">
						{activeTab === "measurments" && (
							<MeasurementsTab />
						)}
						{activeTab === "progress" && <div>Progress content here</div>}
						{activeTab === "membership" && 
							<MembershipPlanTab member={member} />
						}
						{activeTab === "medical" && <div>Medical content here</div>}
					</div>
				</div>
				<div className="max-xl:flex-1 xl:sticky xl:top-35 h-fit">
					{/* Showcase Section */}
					<ShowcaseSection title="Personal Information" className="!p-7">
						<div className="mb-6">
							<div>
								<h1 className="text-2xl font-semibold">
									{member.first_name} {member.last_name}
								</h1>
								<p className="text-sm text-gray-500">
									Member code: {member.member_code}
								</p>
							</div>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
							<div>
								<p className="text-gray-500">Status</p>
								<p className="font-medium capitalize">{member.status}</p>
							</div>
							<div>
								<p className="text-gray-500">Email</p>
								<p className="font-medium">{member.email ?? "-"}</p>
							</div>
							<div>
								<p className="text-gray-500">Phone</p>
								<p className="font-medium">{member.phone ?? "-"}</p>
							</div>
							<div>
								<p className="text-gray-500">Joined</p>
								<p className="font-medium">
									{new Date(member.created_at).toLocaleDateString()}
								</p>
							</div>
						</div>

						<div className="border-t my-6"></div>

						<div>
							<h2 className="text-sm font-semibold mb-3 text-gray-600">
								Member Actions
							</h2>
							<MemberActions id={member.id} member={member} />
						</div>
					</ShowcaseSection>
				</div>
			</div>
    </div>
  );
}