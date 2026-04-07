"use client";

import { useEffect, useState } from "react";
import { DataEntryWorkspace } from "@/components/Dashboard/client-records/data-entry-workspace";
import {
  getCompanyFormulas,
  getCompanyRecordDraft,
} from "@/services/coach-schema.services";
import { Member } from "@/types/member";

export default function DataEntryPage(props: Member) {
  const [draft, setDraft] = useState<any>(null);
  const [formulas, setFormulas] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [draftRes, formulasRes] = await Promise.all([
          getCompanyRecordDraft(),
          getCompanyFormulas(),
        ]);

        setDraft(draftRes);
        setFormulas(formulasRes);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div>
      <DataEntryWorkspace client={props} draft={draft} formulas={formulas} />
    </div>
  );
}