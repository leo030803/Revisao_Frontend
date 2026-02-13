const API_BASE = "http://localhost:3000/products";

const listEl = document.querySelector("#products-list");

const formatPrice = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return "R$ --";
  return number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

const renderProducts = (products) => {
  if (!listEl) return;
  if (!products.length) {
    listEl.innerHTML = "<p>Nenhum produto cadastrado.</p>";
    return;
  }

  listEl.innerHTML = products
    .map(
      (produto) => `
        <article class="card product">
          <div class="meta">
            <span class="tag">${produto.categoria || "Sem categoria"}</span>
            <span class="price">${formatPrice(produto.preco)}</span>
          </div>
          <h2>${produto.nome || "Produto sem nome"}</h2>
          <p class="desc">${produto.descricao || "Sem descrição."}</p>
        </article>
      `
    )
    .join("");
};

const loadProducts = async () => {
  if (!listEl) return;

  try {
    const response = await fetch(`${API_BASE}/produtos`);
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

loadProducts();
