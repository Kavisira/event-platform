import { useState } from "react";

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "mobile", label: "Mobile Number" },
  { value: "date", label: "Date" },
  { value: "dropdown", label: "Dropdown" },
];

export default function FieldBuilder({ fields, setFields }) {
  // ➕ Add new field
  const addField = () => {
    setFields([
      ...fields,
      {
        id: `field_${Date.now()}`,
        label: "",
        type: "text",
        required: false,
        isPrimary: false,
        options: [],
      },
    ]);
  };

  // ✏️ Update field (with single-primary enforcement)
  const updateField = (index, key, value) => {
    const updated = [...fields];

    // Only ONE primary field allowed
    if (key === "isPrimary" && value === true) {
      updated.forEach((f, i) => {
        if (i !== index) f.isPrimary = false;
      });
    }

    updated[index][key] = value;
    setFields(updated);
  };

  // ❌ Remove field
  const removeField = (index) => {
    const updated = [...fields];
    updated.splice(index, 1);
    setFields(updated);
  };

  // ➕ Add dropdown option
  const addOption = (index) => {
    const updated = [...fields];
    updated[index].options.push("");
    setFields(updated);
  };

  // ✏️ Update dropdown option
  const updateOption = (fieldIndex, optionIndex, value) => {
    const updated = [...fields];
    updated[fieldIndex].options[optionIndex] = value;
    setFields(updated);
  };

  // ❌ Remove dropdown option
  const removeOption = (fieldIndex, optionIndex) => {
    const updated = [...fields];
    updated[fieldIndex].options.splice(optionIndex, 1);
    setFields(updated);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-800">
          Form Fields
        </h2>
        <button
          onClick={addField}
          className="text-sm bg-indigo-600 hover:bg-indigo-700 transition text-white px-4 py-1.5 rounded-lg"
        >
          + Add Field
        </button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-6">
          No fields added yet
        </p>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="border rounded-xl p-4 bg-gray-50 mb-4 transition hover:shadow-sm"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs text-gray-500">
              Field {index + 1}
              {field.isPrimary && (
                <span className="ml-2 text-green-600 font-medium">
                  Primary
                </span>
              )}
            </p>
            <button
              onClick={() => removeField(index)}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>

          {/* Label */}
          <input
            type="text"
            placeholder="Field label (ex: Mobile Number)"
            value={field.label}
            onChange={(e) =>
              updateField(index, "label", e.target.value)
            }
            className="w-full mb-3 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          {/* Type + Required + Primary */}
          <div className="flex flex-wrap gap-3 mb-3">
            <select
              value={field.type}
              onChange={(e) =>
                updateField(index, "type", e.target.value)
              }
              className="border rounded-lg px-3 py-2"
            >
              {FIELD_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={field.required}
                onChange={(e) =>
                  updateField(index, "required", e.target.checked)
                }
              />
              Required
            </label>

            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={field.isPrimary}
                onChange={(e) =>
                  updateField(index, "isPrimary", e.target.checked)
                }
              />
              Primary
            </label>
          </div>

          {/* Dropdown Options */}
          {field.type === "dropdown" && (
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-2">
                Dropdown Options
              </p>

              {field.options.map((opt, optIndex) => (
                <div
                  key={optIndex}
                  className="flex items-center gap-2 mb-2"
                >
                  <input
                    type="text"
                    value={opt}
                    placeholder={`Option ${optIndex + 1}`}
                    onChange={(e) =>
                      updateOption(
                        index,
                        optIndex,
                        e.target.value
                      )
                    }
                    className="flex-1 border rounded-lg px-3 py-2"
                  />
                  <button
                    onClick={() =>
                      removeOption(index, optIndex)
                    }
                    className="text-xs text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                onClick={() => addOption(index)}
                className="text-xs text-indigo-600 hover:underline"
              >
                + Add option
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
