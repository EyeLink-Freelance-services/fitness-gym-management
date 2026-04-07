"use client"

import { Tabs } from "@/components/ui/tabs";
import { useState } from "react";
import PersonalInfo from "../[id]/personal-info/page";
import { Member } from "@/types/member";
import DataEntryPage from "../[id]/data-entry/page";
import ProgressPage from "../[id]/progress/page";

type ClientTab = "personalInformation" | "dataEntry" | "progress" | "contract" | "medical";

export interface ClientTabsProps {
	client: Member;
}

export default function ClientTabs({ client }: ClientTabsProps) {
	const [activeTab, setActiveTab] = useState<ClientTab>("personalInformation");

	const tabs = [
		{ key: "personalInformation" as ClientTab, label: "Personal Information" },
		{ key: "dataEntry" as ClientTab, label: "Data Entry" },
		{ key: "progress" as ClientTab, label: "Progress" },
		{ key: "contract" as ClientTab, label: "Contract" },
		{ key: "medical" as ClientTab, label: "Medical Notes" },
	];

	return (
		<div className="w-full lg:pr-5">
			<div className="flex flex-wrap justify-between md:justify-center gap-10 w-full">
				<div className="flex-1">
					{/* Tabs */}
					<Tabs<ClientTab> value={activeTab} onChange={setActiveTab} tabs={tabs} />
					{/* Tab content */}
					<div className="mt-4">
						{activeTab === "personalInformation" && (
							<PersonalInfo {...client} />
						)}
						{activeTab === "progress" && <ProgressPage {...client} />}
						{activeTab === "dataEntry" && 
							<DataEntryPage {...client} />
						}
						{activeTab === "medical" && <div>Medical content here</div>}
					</div>
				</div>
			</div>
		</div>
	);
}