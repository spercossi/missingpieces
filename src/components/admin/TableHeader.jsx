// componente per le intestazioni delle tabelle admin
export default function TableHeader({ columns }) {
  return (
    <thead className="bg-gray-50">
      <tr>
        {columns.map((column, index) => (
          <th key={index} className="px-4 py-3 text-left">
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}
