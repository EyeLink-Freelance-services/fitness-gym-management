"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";

type Measurement = {
  id: number;
  recorded_by: string;
  recorded_at: string;
  weight: number;
  body_fat: number;
  notes?: string;
  created_at: string;
};

interface MeasurementsTabProps {
  initialData?: Measurement[];
}

export default function MeasurementsTab({ initialData = [] }: MeasurementsTabProps) {
  const [measurements, setMeasurements] = useState<Measurement[]>(initialData);

  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<Measurement>>({});

  const startEdit = (row: Measurement, editLabel?: string) => {
    editLabel && setIsEdit(true);
    setEditRowId(row.id);
    setFormData(row);
  };

  const saveEdit = () => {
    if (editRowId === null) return;
    setMeasurements((prev) =>
      prev.map((m) => (m.id === editRowId ? { ...m, ...formData } as Measurement : m))
    );
    setEditRowId(null);
    setFormData({});
  };

  const cancelEdit = () => {
    if (!editRowId) return;

    if (!isEdit)
      setMeasurements((prev) =>
        prev.filter((m) => m.id !== editRowId) // remove the editing row entirely
      );

    setEditRowId(null);
    setFormData({});
    setIsEdit(false);
  };

  const addMeasurement = () => {
    const newRecord: Measurement = {
      id: Date.now(),
      recorded_by: "You",
      recorded_at: new Date().toISOString(),
      weight: 0,
      body_fat: 0,
      notes: "",
      created_at: new Date().toISOString(),
    };
    setMeasurements([newRecord, ...measurements]);
    startEdit(newRecord);
  };

  // Helper for weight comparison
  const previousWeight = (index: number) =>
    index < measurements.length - 1 ? measurements[index + 1].weight : null;

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <button
          onClick={addMeasurement}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Measurement
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {measurements.length === 0 && (
          <div className="col-span-full text-center py-6 text-gray-500">
            No measurements recorded yet.
          </div>
        )}

        {measurements.map((m, idx) => {
          const prevWeight = previousWeight(idx);
          const weightChangeClass =
            prevWeight !== null && m.weight > prevWeight
              ? "text-green-600 font-semibold"
              : prevWeight !== null && m.weight < prevWeight
              ? "text-red-600 font-semibold"
              : "text-gray-800 font-medium";

          return (
            <div
              key={m.id}
              className={`border rounded-lg shadow hover:shadow-lg transition 
                bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900
                ${editRowId === m.id ? "p-6" : "p-4"}  // larger padding only for edit
              `}
            >
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Recorded By:</span>{" "}
                  
                    {m.recorded_by}
                
                </div>

                <div>
                  <span className="font-semibold">Recorded At:</span>{" "}
                  
                    {new Date(m.recorded_at).toLocaleString()}
                </div>

                <div>
                  <span className="font-semibold">Weight (kg):</span>{" "}
                  
                    <span className={weightChangeClass}>{m.weight}</span>
                  
                </div>

                <div>
                  <span className="font-semibold">Body Fat (%):</span>{" "}
                  
                    <span
                      className={
                        m.body_fat > 30 ? "text-red-600 font-semibold" : "text-gray-800"
                      }
                    >
                      {m.body_fat}
                    </span>
                  
                </div>

                <div>
                  <span className="font-semibold">Notes:</span>{" "}
                  
                    {m.notes}
                  
                </div>

                <div>
                  <span className="font-semibold">Created At:</span>{" "}
                  {new Date(m.created_at).toLocaleString()}
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => startEdit(m, 'edit')}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* Modal for editing */}
      <Modal open={editRowId !== null} title="Edit Measurement" onClose={cancelEdit}>
        {editRowId !== null && (
          <div className="space-y-4">
            <div>
              <label className="font-semibold block">Recorded By</label>
              <input
                type="text"
                value={formData.recorded_by || ""}
                onChange={(e) => setFormData({ ...formData, recorded_by: e.target.value })}
                className="w-full border px-2 py-1 rounded focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="font-semibold block">Recorded At</label>
              <input
                type="datetime-local"
                value={
                  formData.recorded_at
                    ? new Date(formData.recorded_at).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) => setFormData({ ...formData, recorded_at: e.target.value })}
                className="w-full border px-2 py-1 rounded focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="font-semibold block">Weight (kg)</label>
              <input
                type="number"
                value={formData.weight || 0}
                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
                className="w-full border px-2 py-1 rounded focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="font-semibold block">Body Fat (%)</label>
              <input
                type="number"
                value={formData.body_fat || 0}
                onChange={(e) => setFormData({ ...formData, body_fat: parseFloat(e.target.value) })}
                className="w-full border px-2 py-1 rounded focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="font-semibold block">Notes</label>
              <input
                type="text"
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border px-2 py-1 rounded focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}