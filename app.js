const TAG_W = 526;
const TAG_H = 325;

const FONT_FAMILIES = [
  "Arial",
  "Helvetica",
  "Times New Roman",
  "Georgia",
  "Courier New",
  "Verdana",
  "Tahoma",
  "Trebuchet MS",
];

let lines = [
  { id: "institution", text: "KENYA SCHOOL OF GOVERNMENT", size: 22, top: 132, left: 284, weight: 700, color: "#A2A825", bg: false, letterSpacing: 1.5, fontFamily: "Arial" },
  { id: "name", text: "ROY MBECHE", size: 30, top: 183, left: 257, weight: 800, color: "#000000", bg: false, letterSpacing: 0.5, fontFamily: "Times New Roman" },
  { id: "role", text: "ATTACHEE", size: 24, top: 226, left: 260, weight: 700, color: "#000000", bg: false, letterSpacing: 0.5, fontFamily: "Times New Roman" },
  { id: "department", text: "ICT", size: 25, top: 269, left: 258, weight: 700, color: "#000000", bg: false, letterSpacing: 0.5, fontFamily: "Times New Roman" },
];
let selectedId = lines[0].id;
let dragId = null;

const $ = (id) => document.getElementById(id);
const tagEl = $("tag");

function getSelected() { return lines.find(l => l.id === selectedId); }

function renderLinesList() {
  const list = $("linesList");
  list.innerHTML = "";
  lines.forEach(l => {
    const div = document.createElement("div");
    div.className = "line-item" + (l.id === selectedId ? " selected" : "");
    const btn = document.createElement("button");
    btn.className = "line-text";
    btn.textContent = l.text || "(empty)";
    btn.onclick = () => { selectedId = l.id; renderAll(); };
    const rm = document.createElement("button");
    rm.textContent = "✕";
    rm.onclick = (e) => {
      e.stopPropagation();
      lines = lines.filter(x => x.id !== l.id);
      if (selectedId === l.id && lines.length) selectedId = lines[0].id;
      renderAll();
    };
    div.appendChild(btn);
    div.appendChild(rm);
    list.appendChild(div);
  });
}

function renderTag() {
  tagEl.innerHTML = "";
  lines.forEach(l => {
    const el = document.createElement("div");
    el.className = "tag-line" + (l.id === selectedId ? " selected" : "");
    el.textContent = l.text;
    el.style.top = l.top + "px";
    el.style.left = l.left + "px";
    el.style.fontSize = l.size + "px";
    el.style.fontWeight = l.weight;
    el.style.color = l.color;
    el.style.letterSpacing = l.letterSpacing + "px";
    el.style.fontFamily = l.fontFamily || "Arial";
    el.style.backgroundColor = l.bg ? "rgba(255,255,255,0.92)" : "transparent";
    el.addEventListener("mousedown", (e) => {
      e.preventDefault();
      selectedId = l.id;
      dragId = l.id;
      renderAll();
    });
    tagEl.appendChild(el);
  });
}

function populateFontSelect() {
  const sel = $("txtFont");
  sel.innerHTML = "";
  FONT_FAMILIES.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f; opt.textContent = f;
    sel.appendChild(opt);
  });
}

function renderControls() {
  const s = getSelected();
  if (!s) return;
  $("txtText").value = s.text;
  $("txtFont").value = s.fontFamily || "Arial";
  $("txtSize").value = s.size; $("valSize").textContent = s.size + "px";
  $("txtWeight").value = s.weight; $("valWeight").textContent = s.weight;
  $("txtLS").value = s.letterSpacing; $("valLS").textContent = s.letterSpacing + "px";
  $("txtTop").value = Math.round(s.top); $("valTop").textContent = Math.round(s.top) + "px";
  $("txtLeft").value = Math.round(s.left); $("valLeft").textContent = Math.round(s.left) + "px";
  $("txtBg").checked = s.bg;
  $("txtColor").value = s.color;
}

function renderAll() { renderLinesList(); renderTag(); renderControls(); }

function update(patch) {
  const s = getSelected();
  Object.assign(s, patch);
  renderAll();
}

// Controls
$("txtText").addEventListener("input", (e) => update({ text: e.target.value }));
$("txtFont").addEventListener("change", (e) => update({ fontFamily: e.target.value }));
$("txtSize").addEventListener("input", (e) => update({ size: +e.target.value }));
$("txtWeight").addEventListener("input", (e) => update({ weight: +e.target.value }));
$("txtLS").addEventListener("input", (e) => update({ letterSpacing: +e.target.value }));
$("txtTop").addEventListener("input", (e) => update({ top: +e.target.value }));
$("txtLeft").addEventListener("input", (e) => update({ left: +e.target.value }));
$("txtBg").addEventListener("change", (e) => update({ bg: e.target.checked }));
$("txtColor").addEventListener("input", (e) => update({ color: e.target.value }));

$("addLine").addEventListener("click", () => {
  const id = "line-" + Date.now();
  lines.push({ id, text: "NEW TEXT", size: 16, top: 240, left: 263, weight: 700, color: "#000000", bg: false, letterSpacing: 0, fontFamily: "Arial" });
  selectedId = id;
  renderAll();
});

$("printBtn").addEventListener("click", () => window.print());

// Dragging
tagEl.addEventListener("mousemove", (e) => {
  if (!dragId) return;
  const rect = tagEl.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * TAG_W;
  const y = ((e.clientY - rect.top) / rect.height) * TAG_H;
  const l = lines.find(x => x.id === dragId);
  l.left = Math.max(0, Math.min(TAG_W, x));
  l.top = Math.max(0, Math.min(TAG_H, y));
  renderTag();
  renderControls();
});
document.addEventListener("mouseup", () => { dragId = null; });

populateFontSelect();
renderAll();
