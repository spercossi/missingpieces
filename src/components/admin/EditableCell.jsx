// componente per celle editabili nelle tabelle
export default function EditableCell({ 
  isEditing, 
  value, 
  displayValue,
  type = "text", 
  options = [], 
  onChange,
  className = "",
  placeholder = ""
}) {
  if (!isEditing) {
    return <span>{displayValue || value || "N/A"}</span>;
  }

  // campo di testo
  if (type === "text") {
    return (
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`border rounded px-2 py-1 w-full ${className}`}
        placeholder={placeholder}
      />
    );
  }

  // campo numerico
  if (type === "number") {
    return (
      <input
        type="number"
        step="0.01"
        value={value || ""}
        onChange={(e) => onChange(parseFloat(e.target.value) || "")}
        className={`border rounded px-2 py-1 w-20 ${className}`}
      />
    );
  }

  // select con opzioni
  if (type === "select") {
    return (
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`border rounded px-2 py-1 w-full ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  return <span>{value || "N/A"}</span>;
}
