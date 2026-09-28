// ============================================================
// EDITE OS PREÇOS E NOMES AQUI.
// Você pode mudar os valores sem mexer no HTML.
// ============================================================

const categories = [
  {
    id: "motor",
    title: "MECÂNICA",
    subtitle: "REVISÕES E PERFORMANCE",
    color: "cyan",
    items: [
      ["motor", "REVISÃO DO MOTOR", 150000, "⚙"],
      ["freio", "SISTEMA DE FREIO", 150000, "◉"],
      ["susp", "SUSPENSÃO", 150000, "✥"],
      ["turbo", "MELHORIA DO TURBO", 150000, "➜"],
      ["blind", "BLINDAGEM", 150000, "♢"]
    ],
    packages: [
      ["pack1", "PACOTE MECÂNICA COMPLETO", 500000],
      ["pack2", "PACOTE COMPLETO + BLINDAGEM", 600000]
    ]
  },
  {
    id: "reparo",
    title: "REPARO",
    subtitle: "MANUTENÇÕES E REPAROS",
    color: "orange",
    items: [
      ["interno", "INTERNO", 30000, "▣"],
      ["externo", "EXTERNO", 50000, "⌁"],
      ["kit3", "KIT REPARO (3 USOS)", 50000, "▣"],
      ["parceria", "KIT REPARO — COM PARCERIA", 30000, "◇"],
      ["semparceria", "KIT REPARO — SEM PARCERIA", 50000, "⊗"],
      ["pneu", "PNEU", 5000, "○"],
      ["pneuparceria", "PNEU — COM PARCERIA", 2500, "◇"]
    ]
  },
  {
    id: "custom",
    title: "CUSTOMIZAÇÃO",
    subtitle: "E APARÊNCIA",
    color: "pink",
    items: [
      ["pintura", "PINTURA", 25000, "✎"],
      ["placa", "COR PRA PLACA", 25000, "✿"],
      ["secundaria", "COR SECUNDÁRIA", 25000, "✿"],
      ["perolado", "PEROLADO", 25000, "✦"],
      ["vidro", "VIDRO", 25000, "□"],
      ["buzina", "BUZINA", 25000, "◖"],
      ["capo", "CAPÔ", 25000, "⌁"],
      ["grade", "GRADE", 25000, "▦"],
      ["xenon", "XENON", 50000, "♧"],
      ["neon", "NEON (SOB O CARRO)", 150000, "ϟ"]
    ],
    common: true
  },
  {
    id: "extras",
    title: "EXTRAS",
    subtitle: "OUTRAS MODIFICAÇÕES",
    color: "green",
    items: [
      ["turbo2", "MELHORIA DE TURBO", 400000, "≋"],
      ["blind2", "BLINDAGEM", 25000, "♢"],
      ["pintura2", "PINTURA", 25000, "✎"],
      ["cor", "COR", 25000, "◉"],
      ["interior", "INTERIOR", 25000, "▣"],
      ["som", "SOM", 25000, "◖"],
      ["luzes", "LUZES", 25000, "♧"],
      ["performance", "PERFORMANCE", 25000, "ϟ"]
    ],
    packages: [
      ["heli", "PACOTE COMPLETO HELI", 800000]
    ],
    common: true
  }
];

const PREMIUM = 600000;
const state = { selected: new Map(), premium: false };

const money = value => {
  const k = value / 1000;
  return `R$ ${Number.isInteger(k) ? k.toLocaleString("pt-BR") : k.toLocaleString("pt-BR",{maximumFractionDigits:1})}K`;
};

function render() {
  const root = document.querySelector("#categories");
  root.innerHTML = categories.map(cat => `
    <article class="card ${cat.color}">
      <div class="card-title">
        <h2>${cat.title}</h2>
        <p>${cat.subtitle}</p>
      </div>

      ${cat.items.map(item => itemHTML(cat, item)).join("")}

      ${cat.packages ? `
        <div class="section-label">« PACOTES ${cat.id === "extras" ? "EXTRAS" : ""} »</div>
        ${cat.packages.map(p => `
          <div class="item">
            <div class="icon">${cat.id === "extras" ? "✦" : "♙"}</div>
            <div class="name">${p[1]}</div>
            <div class="price">${money(p[2])}</div>
            <button class="check" data-id="${p[0]}" data-price="${p[2]}" aria-label="Selecionar ${p[1]}"></button>
          </div>
        `).join("")}
      ` : ""}

      ${cat.common ? `
        <div class="section-label">« ITENS COMUNS EXTRAS »</div>
        <div class="item">
          <div class="icon">+</div>
          <div>
            <div class="name">ITEM COMUM</div>
            <div style="font-size:9px;color:#6f7b90">R$ 25K CADA</div>
          </div>
          <div class="counter" style="grid-column:3 / 5;color:inherit">
            <button data-common="-">−</button>
            <div class="qty" id="common-${cat.id}">0</div>
            <button data-common="+">+</button>
          </div>
        </div>
      ` : ""}
    </article>
  `).join("");

  document.querySelector("#premiumPrice").textContent = money(PREMIUM);
  bind();
  update();
}

function itemHTML(cat, item) {
  return `
    <div class="item">
      <div class="icon">${item[3]}</div>
      <div class="name">${item[1]}</div>
      <div class="price">${money(item[2])}</div>
      <button class="check" data-id="${item[0]}" data-price="${item[2]}" aria-label="Selecionar ${item[1]}"></button>
    </div>
  `;
}

function bind() {
  document.querySelectorAll(".check:not(.premium-check)").forEach(btn => {
    btn.addEventListener("click", () => toggle(btn.dataset.id, Number(btn.dataset.price), btn));
  });

  document.querySelector(".premium-check").addEventListener("click", e => {
    state.premium = !state.premium;
    e.currentTarget.classList.toggle("selected", state.premium);
    update();
  });

  document.querySelectorAll("[data-common]").forEach(btn => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      const id = "common-" + card.querySelector(".card-title h2").textContent.toLowerCase();
      const current = state.selected.get(id)?.qty || 0;
      const next = btn.dataset.common === "+" ? current + 1 : Math.max(0, current - 1);
      if (next === 0) state.selected.delete(id);
      else state.selected.set(id, { price: 25000, qty: next, name: "ITEM COMUM" });
      card.querySelector(".qty").textContent = next;
      update();
    });
  });
}

function toggle(id, price, btn) {
  if (state.selected.has(id)) state.selected.delete(id);
  else state.selected.set(id, { price, qty: 1, name: btn.closest(".item").querySelector(".name").textContent });
  btn.classList.toggle("selected", state.selected.has(id));
  update();
}

function update() {
  let total = state.premium ? PREMIUM : 0;
  let count = state.premium ? 1 : 0;

  state.selected.forEach(v => {
    total += v.price * v.qty;
    count += v.qty;
  });

  document.querySelector("#total").textContent = money(total);
  document.querySelector("#selectedCount").textContent = count;
}

document.querySelector("#clearBtn").addEventListener("click", () => {
  state.selected.clear();
  state.premium = false;
  render();
  toast("Seleção limpa.");
});

document.querySelector("#summaryBtn").addEventListener("click", () => {
  const lines = [];
  if (state.premium) lines.push(`• Pacote Completo Premium — ${money(PREMIUM)}`);
  state.selected.forEach(v => {
    lines.push(`• ${v.name}${v.qty > 1 ? ` x${v.qty}` : ""} — ${money(v.price * v.qty)}`);
  });

  toast(lines.length ? lines.join(" | ") : "Nenhum item selecionado.");
});

function toast(message) {
  const el = document.querySelector("#toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.__toast);
  window.__toast = setTimeout(() => el.classList.remove("show"), 3200);
}

render();
