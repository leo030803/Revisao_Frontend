const API_BASE = "http://localhost:3000/cadastro";

const form = document.querySelector("#cadastro-form");
const statusEl = document.querySelector("#form-status");

const setStatus = (message, isError = false) => {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#e04848" : "#2f7a3d";
};

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    nome: String(formData.get("nome") || "").trim(),
    preco: Number(formData.get("preco")),
    categoria: String(formData.get("categoria") || "").trim(),
    descricao: String(formData.get("descricao") || "").trim(),
  };

  if (!produto.nome || !produto.categoria || !produto.descricao || Number.isNaN(produto.preco)) {
    setStatus("Preencha todos os campos corretamente.", true);
    return;
  }

  try {
    setStatus("Salvando produto...");
    const response = await fetch(`${API_BASE}/produtos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto),
    });

    if (!response.ok) {
      throw new Error(`Falha ao salvar. Status: ${response.status}`);
    }

    form.reset();
    setStatus("Produto cadastrado com sucesso!");
  } catch (error) {
    setStatus("Não foi possível salvar o produto. Verifique a API.", true);
  }
});
