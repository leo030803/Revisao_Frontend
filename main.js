const API_BASE = "http://localhost:3000/products";
const PRODUCTS_ENDPOINT = `${API_BASE}/produtos`;

const form = document.querySelector("#cadastro-form");
const statusEl = document.querySelector("#form-status");
const listEl = document.querySelector("#products-list");

const setStatus = (message, isError = false) => {
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#e04848" : "#2f7a3d";
};

const formatPrice = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return "R$ --";
  return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const normalizeProduct = (formData) => ({
  nome: String(formData.get("nome") || "").trim(),
  preco: Number(formData.get("preco")),
  categoria: String(formData.get("categoria") || "").trim(),
  descricao: String(formData.get("descricao") || "").trim(),
});

const isValidProduct = (produto) =>
  Boolean(produto.nome && produto.categoria && produto.descricao) && !Number.isNaN(produto.preco);

const createProductCard = (produto) => {
  const card = document.createElement("article");
  card.className = "card product";

  const meta = document.createElement("div");
  meta.className = "meta";

  const tag = document.createElement("span");
  tag.className = "tag";
  tag.textContent = produto.categoria || "Sem categoria";

  const price = document.createElement("span");
  price.className = "price";
  price.textContent = formatPrice(produto.preco);

  meta.append(tag, price);

  const title = document.createElement("h2");
  title.textContent = produto.nome || "Produto sem nome";

  const desc = document.createElement("p");
  desc.className = "desc";
  desc.textContent = produto.descricao || "Sem descrição.";

  card.append(meta, title, desc);
  return card;
};

const renderProducts = (products) => {
  if (!listEl) return;

  if (!products.length) {
    listEl.innerHTML = "<p>Nenhum produto cadastrado.</p>";
    return;
  }

  const cards = products.map(createProductCard);
  listEl.replaceChildren(...cards);
};

const loadProducts = async () => {
  if (!listEl) return;

  listEl.innerHTML = "<p>Carregando produtos...</p>";

  try {
    const response = await fetch(PRODUCTS_ENDPOINT, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Falha na API: ${response.status}`);
    }
    const data = await response.json();
    const products = Array.isArray(data) ? data : data.produtos || [];
    renderProducts(products);
  } catch (error) {
    listEl.innerHTML = "<p>Não foi possível carregar os produtos. Verifique a API.</p>";
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const produto = normalizeProduct(formData);

  if (!isValidProduct(produto)) {
    setStatus("Preencha todos os campos corretamente.", true);
    return;
  }

  try {
    setStatus("Salvando produto...");
    const response = await fetch(PRODUCTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto),
    });

    let responseBody = null;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      responseBody = await response.json();
    } else {
      const text = await response.text();
      responseBody = text ? { message: text } : null;
    }

    if (!response.ok) {
      const message = responseBody?.message || `Falha ao salvar. Status: ${response.status}`;
      throw new Error(message);
    }

    form.reset();
    const extra = responseBody ? ` Resposta: ${JSON.stringify(responseBody)}` : "";
    setStatus(`Produto cadastrado com sucesso!${extra}`);
  } catch (error) {
    setStatus(`Não foi possível salvar o produto. ${error.message}`, true);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

loadProducts();
