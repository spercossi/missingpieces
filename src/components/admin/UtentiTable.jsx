import ActionButtons from "./ActionButtons";
import TableHeader from "./TableHeader";

const UTENTI_COLUMNS = ["ID", "Username", "Nome", "Cognome", "Ruolo", "Azioni"];

export default function UtentiTable({ utenti, onResetPassword, onElimina }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <TableHeader columns={UTENTI_COLUMNS} />
        <tbody>
          {utenti.map((utente) => (
            <tr key={utente.id} className="border-b">
              <td className="px-4 py-3">{utente.id}</td>
              <td className="px-4 py-3">{utente.username || "N/A"}</td>
              <td className="px-4 py-3">{utente.nome || "N/A"}</td>
              <td className="px-4 py-3">{utente.cognome || "N/A"}</td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    utente.role === "admin"
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {utente.role || "user"}
                </span>
              </td>
              <td className="px-4 py-3">
                <ActionButtons
                  customActions={[
                    {
                      label: "Reset",
                      onClick: () => onResetPassword(utente),
                      className: "text-orange-600 hover:text-orange-800",
                      title: "Reset password a 123456"
                    }
                  ]}
                  onDelete={() => onElimina(utente.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
