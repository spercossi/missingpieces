import { useState } from "react";
import ActionButtons from "./ActionButtons";
import EditableCell from "./EditableCell";
import TableHeader from "./TableHeader";
import {
  COLORI_DISPONIBILI,
  STILI_DISPONIBILI,
  TIPI_CAPO_DISPONIBILI,
} from "../../utils/constants";

const CAPI_COLUMNS = ["ID", "Marca", "Tipo", "Prezzo", "Colore", "Stile", "Azioni"];

export default function CapiTable({ capi, onModifica, onRimuovi }) {
  const [editingItem, setEditingItem] = useState(null);

  const salvaModifiche = () => {
    if (editingItem) {
      onModifica(editingItem);
      setEditingItem(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <TableHeader columns={CAPI_COLUMNS} />
        <tbody>
          {capi.map((capo) => (
            <tr key={capo.id} className="border-b">
              <td className="px-4 py-3">{capo.id}</td>
              <td className="px-4 py-3">
                <EditableCell
                  isEditing={editingItem?.id === capo.id}
                  value={editingItem?.Marca || capo.Marca || "N/A"}
                  type="text"
                  onChange={(value) =>
                    setEditingItem({
                      ...editingItem,
                      Marca: value,
                    })
                  }
                />
              </td>
              <td className="px-4 py-3">
                <EditableCell
                  isEditing={editingItem?.id === capo.id}
                  value={editingItem?.["Tipo di Capo"] || capo["Tipo di Capo"] || "N/A"}
                  type="select"
                  options={TIPI_CAPO_DISPONIBILI}
                  placeholder="Seleziona tipo"
                  onChange={(value) =>
                    setEditingItem({
                      ...editingItem,
                      "Tipo di Capo": value,
                    })
                  }
                />
              </td>
              <td className="px-4 py-3">
                <EditableCell
                  isEditing={editingItem?.id === capo.id}
                  value={editingItem?.Prezzo || capo.Prezzo || ""}
                  displayValue={capo.Prezzo ? `€${capo.Prezzo}` : "N/A"}
                  type="number"
                  step="0.01"
                  className="w-20"
                  onChange={(value) =>
                    setEditingItem({
                      ...editingItem,
                      Prezzo: parseFloat(value),
                    })
                  }
                />
              </td>
              <td className="px-4 py-3">
                <EditableCell
                  isEditing={editingItem?.id === capo.id}
                  value={editingItem?.Colore || capo.Colore || "N/A"}
                  type="select"
                  options={COLORI_DISPONIBILI}
                  placeholder="Seleziona colore"
                  onChange={(value) =>
                    setEditingItem({
                      ...editingItem,
                      Colore: value,
                    })
                  }
                />
              </td>
              <td className="px-4 py-3">
                <EditableCell
                  isEditing={editingItem?.id === capo.id}
                  value={editingItem?.Stile || capo.Stile || "N/A"}
                  type="select"
                  options={STILI_DISPONIBILI}
                  placeholder="Seleziona stile"
                  onChange={(value) =>
                    setEditingItem({
                      ...editingItem,
                      Stile: value,
                    })
                  }
                />
              </td>
              <td className="px-4 py-3">
                {editingItem?.id === capo.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={salvaModifiche}
                      className="text-green-600 hover:text-green-800"
                      aria-label="Salva modifiche"
                    >
                      Salva
                    </button>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="text-gray-600 hover:text-gray-800"
                      aria-label="Annulla modifiche"
                    >
                      Annulla
                    </button>
                  </div>
                ) : (
                  <ActionButtons
                    onEdit={() => setEditingItem(capo)}
                    onDelete={() => onRimuovi(capo.id)}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
