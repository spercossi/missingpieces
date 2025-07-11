import { useEffect, useState } from "react";
import CardProdotto from '../components/CardProdotto';
import { showLoading, dismissLoading, showError } from '../utils/notifications';

export default function CatalogoCapi() {
  const [catalogo, setCatalogo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(1);
 const [perPagina, setPerPagina] = useState(12);

  useEffect(() => {
    const loadingToastId = showLoading("Caricamento catalogo capi...");
    
    fetch("http://localhost:3001/vestiti")
      .then(res => res.json())
      .then(data => {
        console.log('CatalogoCapi - dati ricevuti da API:', data);
        setCatalogo(data);
        setLoading(false);
        dismissLoading(loadingToastId);
      })
      .catch((error) => {
        console.error('CatalogoCapi - errore:', error);
        setLoading(false);
        dismissLoading(loadingToastId);
        showError("Errore nel caricamento del catalogo. Riprova più tardi.");
      });
  }, []);

    // Calcolo paginazione
  const totalePagine = Math.ceil(catalogo.length / perPagina);
  const start = (pagina - 1) * perPagina;
  const end = start + perPagina;
  const catalogoPagina = catalogo.slice(start, end);

    // Quando cambio perPagina, torno sempre alla pagina 1
  function handlePerPaginaChange(e) {
    setPerPagina(Number(e.target.value));
    setPagina(1);
  }

   return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Catalogo Capi</h1>
       {/* Picklist per scegliere quante card per pagina */}
      <div className="mb-4 flex items-center gap-2">
        <label htmlFor="perPagina" className="font-medium">Mostra:</label>
        <select
          id="perPagina"
          value={perPagina}
          onChange={handlePerPaginaChange}
          className="border rounded px-2 py-1"
        >
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={36}>36</option>
          <option value={48}>48</option>
        </select>
        <span className="ml-2">per pagina</span>
      </div>
      {loading ? (
        <div>Caricamento...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {catalogoPagina.map(capo => (
              <CardProdotto
                key={capo.id}
                prodotto={capo}
              />
            ))}
          </div>
          {/* Paginazione */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="px-4 py-2 rounded bg-[#D27D7D] hover:bg-[#A6A1B1] disabled:opacity-50, disabled:bg-[#A6A1B1]"
            >
              &larr; Indietro
            </button>
            <span>
              Pagina {pagina} di {totalePagine}
            </span>
            <button
              onClick={() => setPagina(p => Math.min(totalePagine, p + 1))}
              disabled={pagina === totalePagine}
              className="px-4 py-2 rounded bg-[#D27D7D] hover:bg-[#A6A1B1] disabled:opacity-50, disabled:bg-[#A6A1B1]"
            >
              Avanti &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  );
}