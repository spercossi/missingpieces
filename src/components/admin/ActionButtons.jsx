// componente per i pulsanti azioni nelle righe della tabella
export default function ActionButtons({ 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onDelete,
  customActions = [] // array di oggetti { label, onClick, className, title }
}) {
  if (isEditing) {
    return (
      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="text-green-600 hover:text-green-800"
          aria-label="Salva modifiche"
        >
          Salva
        </button>
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800"
          aria-label="Annulla modifiche"
        >
          Annulla
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {/* azioni custom per prima */}
      {customActions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={action.className}
          title={action.title}
          aria-label={action.title || action.label}
        >
          {action.label}
        </button>
      ))}
      
      {/* azioni standard */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-800"
          aria-label="Modifica riga"
        >
          Modifica
        </button>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800"
          aria-label="Elimina riga"
        >
          Elimina
        </button>
      )}
    </div>
  );
}
