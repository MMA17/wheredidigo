const MAP_STYLE = {
  initial: { fill: "#c8d9f2", stroke: "#ffffff", strokeWidth: 0.8 },
  hover: { fill: "#9ec0ef", fillOpacity: 1, cursor: "default" },
  selected: { fill: "#1f9d57", fillOpacity: 1 },
  selectedHover: { fill: "#1f9d57" },
};

const vietnamProvinces = [
  { code: "1",  name: "An Giang" },
  { code: "2",  name: "Bà Rịa - Vũng Tàu" },
  { code: "3",  name: "Bạc Liêu" },
  { code: "4",  name: "Bắc Kạn" },
  { code: "5",  name: "Bắc Giang" },
  { code: "6",  name: "Bắc Ninh" },
  { code: "7",  name: "Bến Tre" },
  { code: "8",  name: "Bình Dương" },
  { code: "9",  name: "Bình Định" },
  { code: "10", name: "Bình Phước" },
  { code: "11", name: "Bình Thuận" },
  { code: "12", name: "Cà Mau" },
  { code: "13", name: "Cao Bằng" },
  { code: "14", name: "Cần Thơ" },
  { code: "15", name: "Đà Nẵng" },
  { code: "16", name: "Đắk Lắk" },
  { code: "17", name: "Đắk Nông" },
  { code: "18", name: "Đồng Nai" },
  { code: "19", name: "Đồng Tháp" },
  { code: "20", name: "Điện Biên" },
  { code: "21", name: "Gia Lai" },
  { code: "22", name: "Hà Giang" },
  { code: "23", name: "Hà Nam" },
  { code: "24", name: "Hà Nội" },
  { code: "25", name: "Hà Tĩnh" },
  { code: "26", name: "Hải Dương" },
  { code: "27", name: "Hải Phòng" },
  { code: "28", name: "Hòa Bình" },
  { code: "29", name: "Hậu Giang" },
  { code: "30", name: "Hưng Yên" },
  { code: "31", name: "TP. Hồ Chí Minh" },
  { code: "32", name: "Khánh Hòa" },
  { code: "33", name: "Kiên Giang" },
  { code: "34", name: "Kon Tum" },
  { code: "35", name: "Lai Châu" },
  { code: "36", name: "Lào Cai" },
  { code: "37", name: "Lạng Sơn" },
  { code: "38", name: "Lâm Đồng" },
  { code: "39", name: "Long An" },
  { code: "40", name: "Nam Định" },
  { code: "41", name: "Nghệ An" },
  { code: "42", name: "Ninh Bình" },
  { code: "43", name: "Ninh Thuận" },
  { code: "44", name: "Phú Thọ" },
  { code: "45", name: "Phú Yên" },
  { code: "46", name: "Quảng Bình" },
  { code: "47", name: "Quảng Nam" },
  { code: "48", name: "Quảng Ngãi" },
  { code: "49", name: "Quảng Ninh" },
  { code: "50", name: "Quảng Trị" },
  { code: "51", name: "Sóc Trăng" },
  { code: "52", name: "Sơn La" },
  { code: "53", name: "Tây Ninh" },
  { code: "54", name: "Thái Bình" },
  { code: "55", name: "Thái Nguyên" },
  { code: "56", name: "Thanh Hóa" },
  { code: "57", name: "Thừa Thiên - Huế" },
  { code: "58", name: "Tiền Giang" },
  { code: "59", name: "Trà Vinh" },
  { code: "60", name: "Tuyên Quang" },
  { code: "61", name: "Vĩnh Long" },
  { code: "62", name: "Vĩnh Phúc" },
  { code: "63", name: "Yên Bái" },
];

const worldCountries = typeof WORLD_COUNTRIES !== "undefined" ? WORLD_COUNTRIES : [];

const vietnamNameByCode = new Map(vietnamProvinces.map((p) => [p.code, p.name]));
const vietnamCodeByName = new Map(vietnamProvinces.map((p) => [p.name, p.code]));
const worldNameByCode = new Map(worldCountries.map((c) => [c.code, c.name]));
const worldCodeByName = new Map(worldCountries.map((c) => [c.name, c.code]));

const state = {
  activeTab: "vietnam",
  visited: { vietnam: new Set(), world: new Set() },
  worldMap: null,
  vietnamMap: null,
};

const refs = {
  tabButtons: [...document.querySelectorAll(".tab-btn")],
  panels: [...document.querySelectorAll(".panel")],
  placeList: document.getElementById("place-list"),
  vnTabChip: document.getElementById("vn-tab-chip"),
  worldTabChip: document.getElementById("world-tab-chip"),
  vietnamPercent: document.getElementById("vietnam-percent"),
  vietnamCount: document.getElementById("vietnam-count"),
  vietnamBar: document.getElementById("vietnam-bar"),
  worldPercent: document.getElementById("world-percent"),
  worldCount: document.getElementById("world-count"),
  worldBar: document.getElementById("world-bar"),
  vietnamDonut: document.getElementById("vietnam-donut"),
  vietnamDonutLabel: document.getElementById("vietnam-donut-label"),
  vietnamVisitedBar: document.getElementById("vietnam-visited-bar"),
  vietnamLeftBar: document.getElementById("vietnam-left-bar"),
  worldDonut: document.getElementById("world-donut"),
  worldDonutLabel: document.getElementById("world-donut-label"),
  worldVisitedBar: document.getElementById("world-visited-bar"),
  worldLeftBar: document.getElementById("world-left-bar"),
};

init();

async function init() {
  try {
    const response = await fetch("./visited.json");
    if (!response.ok) {
      throw new Error(`Failed to load visited.json (${response.status})`);
    }
    const data = await response.json();
    state.visited = {
      vietnam: new Set(normalizeVisited("vietnam", data.vietnam || [])),
      world: new Set(normalizeVisited("world", data.world || [])),
    };
  } catch (error) {
    console.error(error);
    showLoadError("Could not load visited.json. Run a local server (e.g. python3 -m http.server 8080).");
    return;
  }

  bindEvents();
  render();
}

function bindEvents() {
  refs.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      render();
    });
  });

  window.addEventListener("resize", () => {
    state.worldMap?.updateSize();
    state.vietnamMap?.updateSize();
  });
}

function render() {
  refs.tabButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === state.activeTab);
  });

  refs.panels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === state.activeTab);
  });

  renderStats();
  renderList();

  if (state.activeTab === "world") {
    ensureWorldMap();
  } else {
    ensureVietnamMap();
  }
}

function renderStats() {
  renderTabStats("vietnam", vietnamProvinces.length, refs.vietnamPercent, refs.vietnamCount, refs.vietnamBar, "provinces");
  renderTabStats("world", worldCountries.length, refs.worldPercent, refs.worldCount, refs.worldBar, "countries");
  renderGraphStats("vietnam", vietnamProvinces.length, refs.vietnamDonut, refs.vietnamDonutLabel, refs.vietnamVisitedBar, refs.vietnamLeftBar);
  renderGraphStats("world", worldCountries.length, refs.worldDonut, refs.worldDonutLabel, refs.worldVisitedBar, refs.worldLeftBar);
  syncMapHighlights();
}

function renderTabStats(tab, total, percentRef, countRef, barRef, label) {
  const visitedCount = state.visited[tab].size;
  const percent = total ? (visitedCount / total) * 100 : 0;

  percentRef.textContent = `${percent.toFixed(1)}%`;
  countRef.textContent = `${visitedCount}/${total}`;
  barRef.style.width = `${percent}%`;

  // Update tab chip
  if (tab === "vietnam" && refs.vnTabChip) refs.vnTabChip.textContent = `${visitedCount}/${total}`;
  if (tab === "world" && refs.worldTabChip) refs.worldTabChip.textContent = `${visitedCount}/${total}`;
}

function renderGraphStats(tab, total, donutRef, labelRef, visitedBarRef, leftBarRef) {
  const visitedCount = state.visited[tab].size;
  const visitedPercent = total ? (visitedCount / total) * 100 : 0;
  const leftPercent = Math.max(0, 100 - visitedPercent);

  donutRef.style.setProperty("--progress", `${visitedPercent}%`);
  labelRef.textContent = `${visitedPercent.toFixed(1)}%`;
  visitedBarRef.style.width = `${visitedPercent}%`;
  leftBarRef.style.width = `${leftPercent}%`;
}

function renderList() {
  const tab = state.activeTab;
  const visitedCodes = state.visited[tab];
  const allPlaces = tab === "world"
    ? worldCountries.map((c) => ({ code: c.code, name: c.name }))
    : vietnamProvinces.map((p) => ({ code: p.code, name: p.name }));

  allPlaces.sort((a, b) => a.name.localeCompare(b.name));

  refs.placeList.innerHTML = "";

  const frag = document.createDocumentFragment();
  allPlaces.forEach(({ code, name }) => {
    const li = document.createElement("li");
    const isVisited = visitedCodes.has(code);
    li.className = `place-item ${isVisited ? "visited" : "not-visited"}`;
    li.textContent = name;
    frag.appendChild(li);
  });
  refs.placeList.appendChild(frag);
}

function createMapOptions(selector, mapName, selected) {
  return {
    selector,
    map: mapName,
    zoomButtons: true,
    zoomOnScroll: true,
    regionsSelectable: false,
    selectedRegions: [...selected],
    regionStyle: MAP_STYLE,
    onRegionTooltipShow(_event, tooltip, code) {
      const name = getRegionLabel(mapName, code);
      const tab = mapName === "world" ? "world" : "vietnam";
      const status = state.visited[tab].has(code) ? "Visited" : "Not visited";
      tooltip.text(`${name} — ${status}`);
    },
  };
}

function ensureWorldMap() {
  const mapEl = document.getElementById("world-map");
  const errorEl = document.getElementById("world-map-error");
  if (!mapEl || !window.jsVectorMap) {
    errorEl?.classList.remove("hidden");
    return;
  }
  errorEl?.classList.add("hidden");

  if (state.worldMap) {
    requestAnimationFrame(() => {
      state.worldMap.updateSize();
      syncMapHighlights();
    });
    return;
  }

  requestAnimationFrame(() => {
    state.worldMap = new window.jsVectorMap(
      createMapOptions("#world-map", "world", state.visited.world),
    );
    syncMapHighlights();
  });
}

function ensureVietnamMap() {
  const mapEl = document.getElementById("vietnam-map");
  const errorEl = document.getElementById("vietnam-map-error");
  if (!mapEl || !window.jsVectorMap) {
    errorEl?.classList.remove("hidden");
    return;
  }
  errorEl?.classList.add("hidden");

  if (state.vietnamMap) {
    requestAnimationFrame(() => {
      state.vietnamMap.updateSize();
      syncMapHighlights();
    });
    return;
  }

  requestAnimationFrame(() => {
    state.vietnamMap = new window.jsVectorMap(
      createMapOptions("#vietnam-map", "vietnam", state.visited.vietnam),
    );
    syncMapHighlights();
  });
}

function syncMapHighlights() {
  if (state.worldMap?.setSelectedRegions) {
    state.worldMap.setSelectedRegions([...state.visited.world]);
  }
  if (state.vietnamMap?.setSelectedRegions) {
    state.vietnamMap.setSelectedRegions([...state.visited.vietnam]);
  }
}

function getRegionLabel(tab, code) {
  if (tab === "world") {
    return worldNameByCode.get(code) || code;
  }
  return vietnamNameByCode.get(code) || code;
}

function normalizeVisited(tab, items) {
  const normalized = [];
  items.forEach((item) => {
    // New object format: { place, visited } or { code, place, visited }
    if (typeof item === "object" && item !== null) {
      if (!item.visited) return;
      if (tab === "world") {
        const code = item.code || worldCodeByName.get(item.place);
        if (code) normalized.push(code);
      } else {
        const code = vietnamCodeByName.get(item.place);
        if (code) normalized.push(code);
      }
      return;
    }
    // Legacy string format
    if (typeof item !== "string") return;
    if (tab === "world") {
      if (worldNameByCode.has(item)) { normalized.push(item); return; }
      const byName = worldCodeByName.get(item);
      if (byName) normalized.push(byName);
      return;
    }
    if (vietnamNameByCode.has(item)) { normalized.push(item); return; }
    const byName = vietnamCodeByName.get(item);
    if (byName) normalized.push(byName);
  });
  return normalized;
}

function showLoadError(message) {
  const hero = document.querySelector(".hero");
  if (!hero) {
    return;
  }
  const error = document.createElement("p");
  error.className = "map-error";
  error.textContent = message;
  hero.appendChild(error);
}
