(function () {
  const i = document.createElement("link").relList;
  // ensure counts reflect current data before rendering/animating
  // (updateStatsCounts is defined below)
  typeof updateStatsCounts === 'function' && updateStatsCounts(),
    new MutationObserver((n) => {
      for (const o of n)
        if (o.type === "childList")
          for (const d of o.addedNodes)
            d.tagName === "LINK" && d.rel === "modulepreload" && r(d);
    }).observe(document, { childList: !0, subtree: !0 });
  function s(n) {
    const o = {};
    return (
      n.integrity && (o.integrity = n.integrity),
      n.referrerPolicy && (o.referrerPolicy = n.referrerPolicy),
      n.crossOrigin === "use-credentials"
        ? (o.credentials = "include")
        : n.crossOrigin === "anonymous"
          ? (o.credentials = "omit")
          : (o.credentials = "same-origin"),
      o
    );
  }
  function r(n) {
    if (n.ep) return;
    n.ep = !0;
    const o = s(n);
    fetch(n.href, o);
  }
})();
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// connect to Supabase (credentials provided by workspace/user)
const supabase = createClient(
  "https://zzrxoeolscadwvjtcxsr.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cnhvZW9sc2NhZHd2anRjeHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2MTkwMzMsImV4cCI6MjA3MjE5NTAzM30.oGgD9Pzf_y5_79CqfnlbgdQXxocXLVjLprM1PeqNp3Y"
);

lucide.createIcons();

const a = {
  searchQuery: "",
  activeFilters: [],
  sortBy: "relevance",
  viewMode: "grid",
  viewContext: "home",
  sidebarCollapsed: !1,
  isSearching: !1,
  searchResults: [],
  currentPage: 1,
  itemsPerPage: 9,
  totalResults: 0,
  searchStartTime: 0,
  videos: [],
},
  t = {
    sidebar: document.getElementById("sidebar"),
    sidebarBrand: document.getElementById("sidebar-brand"),
    sidebarToggle: document.getElementById("sidebar-toggle"),
    mobileMenuToggle: document.getElementById("mobile-menu-toggle"),
    mobileOverlay: document.getElementById("mobile-overlay"),
    mainContent: document.querySelector(".main-content"),
    searchInput: document.getElementById("search-input"),
    quickSearchInput: document.getElementById("quick-search-input"),
    searchBtn: document.getElementById("search-btn"),
    aiAssistBtn: document.getElementById("ai-assist-btn"),
    suggestionsDropdown: document.getElementById("suggestions-dropdown"),
    searchResultsDropdown: document.getElementById("search-results-dropdown"),
    searchResultsList: document.getElementById("search-results-list"),
    closeSearchResults: document.getElementById("close-search-results"),
    filterBadges: document.querySelectorAll(".filter-badge"),
    clearFiltersBtn: document.getElementById("clear-filters"),
    activeFiltersSummary: document.getElementById("active-filters-summary"),
    searchStats: document.getElementById("search-stats"),
    resultsCount: document.getElementById("results-count"),
    searchTime: document.getElementById("search-time"),
    sortSelect: document.getElementById("sort-select"),
    videosGrid: document.getElementById("videos-grid"),
    videosContainer: document.getElementById("videos-container"),
    gridViewBtn: document.getElementById("grid-view"),
    listViewBtn: document.getElementById("list-view"),
    loadMoreContainer: document.getElementById("load-more-container"),
    loadMoreBtn: document.getElementById("load-more-btn"),
    navItems: document.querySelectorAll(".nav-item[data-route]"),
    categoryItems: document.querySelectorAll(".nav-item[data-category]"),
    savedCount: document.getElementById("saved-count"),
    videoModal: document.getElementById("video-modal"),
    videoModalClose: document.getElementById("video-modal-close"),
    videoModalBackdrop: document.getElementById("video-modal-backdrop"),
    videoPlayerContainer: document.getElementById("video-player-container"),
    modalSaveBtn: document.getElementById("modal-save-btn"),
    modalShareBtn: document.getElementById("modal-share-btn"),
    uploadVideoBtn: document.getElementById("upload-video-btn"),
    toastContainer: document.getElementById("toast-container"),
    loadingScreen: document.getElementById("loading-screen"),
    // sidebar user menu button (bottom of sidebar)
    userMenu: document.querySelector('.user-menu'),
    // modal content wrapper
    videoModalContent: document.querySelector('.video-modal-content'),
  };
// Ensure toast container exists and sits above other UI (top-right)
if (!t.toastContainer) {
  const _tc = document.createElement('div');
  _tc.id = 'toast-container';
  document.body.appendChild(_tc);
  t.toastContainer = _tc;
}
if (t.toastContainer) {
  Object.assign(t.toastContainer.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: '1000',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    pointerEvents: 'none',
    alignItems: 'flex-end',
  });
}
async function N() {
  V();
  // ensure UI reflects current viewContext before rendering
  applyViewContextUI();
  // ensure stats and saved counts reflect current data
  // load videos from database then init UI
  await loadVideosFromDB();
  // ensure view buttons reflect the current viewMode (default: grid)
  if (t.gridViewBtn) t.gridViewBtn.classList.toggle('active', a.viewMode === 'grid');
  if (t.listViewBtn) t.listViewBtn.classList.toggle('active', a.viewMode === 'list');

  updateStatsCounts();
  updateSavedCount();
  g();
  q();
  de();
  setTimeout(() => {
    t.loadingScreen.style.opacity = "0";
    setTimeout(() => {
      t.loadingScreen.style.display = "none";
    }, 300);
  }, 1000);
  // Welcome toast removed per preference (toasts limited to specific events)
}

// Load videos from Supabase and map to app shape
async function loadVideosFromDB() {
  try {
    const { data, error } = await supabase
      .from('EduVideoDB')
      .select('*')
      .order('upload_date', { ascending: false });
    if (error) {
      console.error('Supabase load error', error);
      c('Unable to load videos', 'error');
      return;
    }
    a.videos = (data || []).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      duration: row.duration || '0:00',
      views: row.views || 0,
      // instructor removed from DB; field removed from mapping
      category: row.category || '',
      youtubeLink: row.youtube_link || row.youtubeLink || null,
      uploadDate: row.upload_date ? new Date(row.upload_date) : new Date(),
      aiTags: row.ai_tags || row.aiTags || [],
      difficulty: row.difficulty || 'Beginner',
      rating: typeof row.rating === 'number' ? row.rating : parseFloat(row.rating) || null,
      thumbnail: row.thumbnail || row.thumbnail_url || '',
      videoUrl: row.video_url || null,
    }));
    // refresh UI
    updateStatsCounts();
    updateSavedCount();
    g();
  } catch (e) {
    console.error('loadVideosFromDB exception', e);
    c('Unable to load videos', 'error');
  }
}
function V() {
  var e, i, s, r, n, o, d, u, h, S, I, E, B, k, T, C, x, M, $, D;
  (e = t.sidebarToggle) == null || e.addEventListener("click", ae),
    (i = t.mobileMenuToggle) == null || i.addEventListener("click", ne),
    (s = t.mobileOverlay) == null || s.addEventListener("click", re),
    (r = t.searchInput) == null || r.addEventListener("input", j),
    (n = t.searchInput) == null || n.addEventListener("keydown", O),
    (o = t.searchInput) == null || o.addEventListener("focus", H),
    (d = t.searchInput) == null || d.addEventListener("blur", z),
    (u = t.quickSearchInput) == null || u.addEventListener("input", G),
    (h = t.quickSearchInput) == null ||
    h.addEventListener("keydown", (l) => {
      l.key === "Enter" &&
        ((t.searchInput.value = t.quickSearchInput.value),
          (a.searchQuery = t.quickSearchInput.value),
          p());
    }),
    (S = t.searchBtn) == null || S.addEventListener("click", p),
    (t.uploadVideoBtn) == null || t.uploadVideoBtn.addEventListener('click', createUploadModal),
    (I = t.aiAssistBtn) == null || I.addEventListener("click", oe),
    (t.sidebarBrand) == null || t.sidebarBrand.addEventListener("click", () => {
      // clicking the brand should open the sidebar on mobile or ensure it's visible on desktop
      if (window.innerWidth <= 768) {
        // open mobile sidebar
        t.sidebar.classList.add('mobile-open');
        t.mobileOverlay.classList.add('active');
        document.body.classList.add('sidebar-open');
        t.sidebar.style.transform = 'translate(0)';
      } else {
        // ensure desktop sidebar is expanded
        a.sidebarCollapsed = false;
        t.sidebar.classList.remove('collapsed');
        Q();
      }
    }),
    (E = t.closeSearchResults) == null || E.addEventListener("click", m),
    (B = t.filterBadges) == null ||
    B.forEach((l) => {
      l.addEventListener("click", () => Z(l.dataset.filter, l));
    }),
    (k = t.clearFiltersBtn) == null || k.addEventListener("click", R),
    (T = t.sortSelect) == null || T.addEventListener("change", Y),
    (C = t.gridViewBtn) == null || C.addEventListener("click", () => F("grid")),
    (x = t.listViewBtn) == null || x.addEventListener("click", () => F("list")),
    (M = t.loadMoreBtn) == null || M.addEventListener("click", _),
    ($ = t.navItems) == null ||
    $.forEach((l) => {
      l.addEventListener("click", (y) => ee(y, l));
    }),
    (D = t.categoryItems) == null ||
    D.forEach((l) => {
      l.addEventListener("click", (y) => te(y, l));
    }),
    document.querySelectorAll(".quick-action-item").forEach((l) => {
      l.addEventListener("click", () => ie(l.dataset.action));
    }),
    window.addEventListener("resize", q),
    window.addEventListener("click", ge);
}

// Create a friendly popup upload modal
function createUploadModal() {
  // avoid multiple modals
  if (document.getElementById('uploadModal')) return;
  const modal = document.createElement('div');
  modal.id = 'uploadModal';
  modal.className = 'upload-modal';
  modal.innerHTML = `
    <div class="upload-modal-backdrop"></div>
    <div class="upload-modal-content">
      <button class="upload-modal-close" aria-label="Close">✕</button>
      <h2>Upload Video</h2>
      <form id="uploadForm" class="upload-form" autocomplete="off" autocorrect="off" spellcheck="false">
        <div class="row"><input id="u_title" placeholder="Title" required></div>
        <div class="row"><textarea id="u_description" placeholder="Description" style="resize: none"></textarea></div>
        <div class="row inline">
          <input id="u_duration" placeholder="Duration (e.g. 1:25:40)" autocomplete="off">
          <input id="u_views" type="number" placeholder="Views" autocomplete="off">
        </div>
        <div class="row inline">
          <input id="u_category" placeholder="Category" autocomplete="off">
          <input id="u_rating" type="number" step="0.1" placeholder="Rating" autocomplete="off">
        </div>
        <div class="row inline">
          <input id="u_youtube" placeholder="YouTube Link" autocomplete="off">
          <input id="u_date" type="date" autocomplete="off">
        </div>
        <div class="row inline">
          <input id="u_tags" placeholder="AI Tags (comma separated)" autocomplete="off">
          <select id="u_difficulty"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
        </div>
  <div class="row inline">
  <input id="u_thumbnail" placeholder="Thumbnail URL" autocomplete="off">
  <input id="u_password" type="password" placeholder="Password" autocomplete="new-password">
  </div>
        <div class="row actions">
          <button type="button" id="u_cancel" class="btn btn-outline">Cancel</button>
          <button type="submit" class="btn btn-primary">Save</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  // set default date to today in YYYY-MM-DD so uploads use current date by default
  try {
    const dateInput = modal.querySelector('#u_date');
    if (dateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
  } catch (err) {
    console.error('Failed to set default date on upload modal', err);
  }
  const close = () => modal.remove();
  modal.querySelector('.upload-modal-backdrop').addEventListener('click', close);
  modal.querySelector('.upload-modal-close').addEventListener('click', close);
  modal.querySelector('#u_cancel').addEventListener('click', close);

  modal.querySelector('#uploadForm').addEventListener('submit', async (ev) => {
    ev.preventDefault();
    // check developer password (not stored)
    const pass = modal.querySelector('#u_password').value || '';
    if (pass !== 'bD32CCc3') {
      // wrong password: notify and abort
      c('Are you Developer', 'error');
      return;
    }
    const video = {
      title: modal.querySelector('#u_title').value,
      description: modal.querySelector('#u_description').value,
      duration: modal.querySelector('#u_duration').value,
      views: parseInt(modal.querySelector('#u_views').value) || 0,
      category: modal.querySelector('#u_category').value,
      youtube_link: modal.querySelector('#u_youtube').value,
      upload_date: modal.querySelector('#u_date').value || new Date().toISOString(),
      ai_tags: (modal.querySelector('#u_tags').value || '').split(',').map(s => s.trim()).filter(Boolean),
      difficulty: modal.querySelector('#u_difficulty').value,
      rating: parseFloat(modal.querySelector('#u_rating').value) || null,
      thumbnail: modal.querySelector('#u_thumbnail').value,
    };
    // simple validation
    if (!video.title) return c('Please enter a title', 'error');
    try {
      const { error } = await supabase.from('EduVideoDB').insert([video]);
      if (error) {
        console.error('upload error', error);
        c('Upload failed', 'error');
      } else {
        c('Video uploaded', 'success');
        close();
        await loadVideosFromDB();
      }
    } catch (e) {
      console.error(e);
      c('Upload failed', 'error');
    }
  });
}
function j(e) {
  (a.searchQuery = e.target.value),
    a.searchQuery.length > 2 ? ue(U, 300)() : (m(), g());
}
function O(e) {
  e.key === "Enter"
    ? p()
    : e.key === "Escape" &&
    (m(), t.suggestionsDropdown.classList.add("hidden"));
}
function H() {
  a.searchQuery.length > 2 &&
    t.searchResultsDropdown.classList.remove("hidden");
}
function z(e) {
  setTimeout(() => {
    t.searchResultsDropdown.contains(e.relatedTarget) || m();
  }, 200);
}
function G(e) {
  const i = e.target.value;
  if (i.length > 2) {
    const s = b(i).slice(0, 3);
    showQuickSearchResults(s);
  }
}
function U() {
  a.searchStartTime = performance.now();
  const e = b(a.searchQuery);
  (a.searchResults = e), J(e.slice(0, 5)), L(e.length);
}
function p() {
  (a.searchStartTime = performance.now()), (a.currentPage = 1);
  const e = b(a.searchQuery);
  (a.searchResults = e),
    (a.totalResults = e.length),
    m(),
    g(),
    L(e.length),
    // show search found toast only when there is a query and results
    a.searchQuery && e.length > 0 && c(`Found ${e.length} videos`, "info");
}
function b(e) {
  // Build base list: if query provided, filter by query terms; otherwise start with full list
  const base = e && e.trim()
    ? (function () {
      const i = e
        .toLowerCase()
        .split(" ")
        .filter((s) => s.length > 0);
      return a.videos.filter((s) => {
        const r = [
          s.title,
          s.description,
          s.category,
          ...(s.aiTags || []),
          s.difficulty,
        ]
          .join(" ")
          .toLowerCase();
        return i.every((n) => r.includes(n));
      });
    })()
    : a.videos.slice();

  // Apply active filters on top of base list (works when search is empty)
  if (!a.activeFilters || a.activeFilters.length === 0) return base;
  return base.filter((s) =>
    a.activeFilters.some((r) => {
      return (
        (s.category && s.category.toLowerCase().includes(r.toLowerCase())) ||
        (s.aiTags && s.aiTags.some((n) => n.toLowerCase().includes(r.toLowerCase())))
      );
    })
  );
}

// Toggle visibility of primary page sections depending on viewContext
function applyViewContextUI() {
  const hero = document.querySelector('.hero-section');
  const stats = document.querySelector('.stats-grid');
  const featured = document.querySelector('.featured-section');
  const quick = document.querySelector('.quick-actions');
  const search = document.querySelector('.search-section');
  if (a.viewContext === 'home') {
    if (hero) hero.style.display = '';
    if (stats) stats.style.display = '';
    if (featured) featured.style.display = '';
    if (quick) quick.style.display = '';
    if (search) search.style.display = '';
  } else if (a.viewContext === 'videos') {
    if (hero) hero.style.display = 'none';
    if (stats) stats.style.display = 'none';
    // show featured/videos grid when viewing videos
    if (featured) featured.style.display = '';
    if (quick) quick.style.display = 'none';
    if (search) search.style.display = '';
  } else if (a.viewContext === 'saved') {
    if (hero) hero.style.display = 'none';
    if (stats) stats.style.display = 'none';
    // show featured/videos grid for saved view as well
    if (featured) featured.style.display = '';
    if (quick) quick.style.display = 'none';
    if (search) search.style.display = 'none';
  }
}
function J(e) {
  (t.searchResultsList.innerHTML = ""),
    e.length === 0
      ? (t.searchResultsList.innerHTML = `
      <div class="no-search-results">
        <i data-lucide="search-x"></i>
        <span>No results found</span>
      </div>
    `)
      : e.forEach((i) => {
        const s = W(i);
        t.searchResultsList.appendChild(s);
      }),
    t.searchResultsDropdown.classList.remove("hidden"),
    lucide.createIcons();
}
function W(e) {
  const i = document.createElement("div");
  return (
    (i.className = "search-result-item"),
    (i.innerHTML = `
    <div class="search-result-thumbnail">
      <img src="${e.thumbnail}" alt="${e.title}" loading="lazy">
      <div class="search-result-duration">${e.duration}</div>
    </div>
    <div class="search-result-content">
      <h4 class="search-result-title">${A(e.title, a.searchQuery)}</h4>
      <p class="search-result-description">${A(
      e.description.substring(0, 100) + "...",
      a.searchQuery
    )}</p>
      <div class="search-result-meta">
        <span class="search-result-views">${f(e.views)} views</span>
      </div>
    </div>
  `),
    i.addEventListener("click", () => {
      // Opening video - no toast per preference; keep dropdown closed
      m();
    }),
    i
  );
}
function A(e, i) {
  if (!i.trim()) return e;
  const s = i
    .toLowerCase()
    .split(" ")
    .filter((n) => n.length > 0);
  let r = e;
  return (
    s.forEach((n) => {
      const o = new RegExp(`(${n})`, "gi");
      r = r.replace(o, "<mark>$1</mark>");
    }),
    r
  );
}
function m() {
  t.searchResultsDropdown.classList.add("hidden");
}
function g() {
  const e = performance.now();
  let i = a.searchQuery ? a.searchResults : a.videos;
  i = X(i, a.sortBy);
  const r = (a.currentPage - 1) * a.itemsPerPage + a.itemsPerPage,
    n = i.slice(0, r);
  if (
    ((t.videosGrid.innerHTML = ""),
      (t.videosContainer.className = `videos-container ${a.viewMode}-view`),
      i.length === 0)
  ) {
    le();
    return;
  }
  if (
    (n.forEach((o, d) => {
      const u = K(o, d);
      t.videosGrid.appendChild(u);
    }),
      r < i.length
        ? t.loadMoreContainer.classList.remove("hidden")
        : t.loadMoreContainer.classList.add("hidden"),
      a.searchQuery)
  ) {
    const o = Math.round(performance.now() - e);
    L(i.length, o);
  } else t.searchStats.classList.add("hidden");
  lucide.createIcons();
}
function K(e, i) {
  const s = document.createElement("div");
  (s.className = `video-card animate-fade-in ${a.viewMode}-card`),
    (s.style.animationDelay = `${i * 0.1}s`);
  const r =
    { Beginner: "success", Intermediate: "warning", Advanced: "destructive" }[
    e.difficulty
    ] || "muted";
  s.innerHTML = `
    <div class="video-thumbnail">
      <img src="${e.thumbnail}" alt="${e.title}" loading="lazy">
      <div class="video-duration">${e.duration}</div>
      <div class="video-overlay">
        <button class="play-btn">
          <i data-lucide="play"></i>
        </button>
      </div>
    </div>
    <div class="video-content">
      <div class="video-header">
        <h3 class="video-title">${e.title}</h3>
        <div class="video-rating">
          <i data-lucide="star"></i>
          <span>${e.rating}</span>
        </div>
      </div>
      <p class="video-description">${e.description}</p>
      <div class="video-meta">
        <div class="video-views">
          <i data-lucide="eye"></i>
          <span>${f(e.views)} views</span>
        </div>
      </div>
      <div class="video-footer">
        <div class="video-tags">
          <span class="video-category">${e.category}</span>
          <span class="video-difficulty ${r}">${e.difficulty}</span>
          ${e.aiTags.map((u) => `<span class="video-tag">${u}</span>`).join("")}
        </div>
        <div class="video-actions">
          <button class="video-action-btn" title="Save">
            <i data-lucide="bookmark"></i>
          </button>
          <button class="video-action-btn" title="Share">
            <i data-lucide="share-2"></i>
          </button>
          <button class="video-action-btn" title="More">
            <i data-lucide="more-horizontal"></i>
          </button>
        </div>
      </div>
    </div>
  `;
  const n = s.querySelector(".play-btn"),
    o = s.querySelector('.video-action-btn[title="Save"]'),
    d = s.querySelector('.video-action-btn[title="Share"]');
  // reflect initial saved state
  if (o) o.classList.toggle("active", isSaved(e.id));
  return (
    n.addEventListener("click", (u) => {
      u.stopPropagation();
      // Open playable modal if youtube link or video file present
      openVideoModal(e);
    }),
    o.addEventListener("click", (u) => {
      u.stopPropagation();
      toggleSave(e.id);
      o.classList.toggle("active", isSaved(e.id));
    }),
    d.addEventListener("click", (u) => {
      u.stopPropagation();
      const url = e.youtubeLink || e.videoUrl || window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        c("Link copied to clipboard!", "success");
      });
    }),
    s.addEventListener("click", () => {
      // Open YouTube if user clicks any other place on the card
      const url = e.youtubeLink || e.videoUrl;
      if (url) {
        window.open(url, "_blank");
        return;
      }
      // No toast for opening external link
    }),
    s
  );
}

// update numeric stats (Total Videos etc) to reflect real data
function updateStatsCounts() {
  try {
    // Map specific stat cards by title to desired values
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card) => {
      const titleEl = card.querySelector('.stat-title');
      const valueEl = card.querySelector('.stat-value');
      if (!titleEl || !valueEl) return;
      const title = titleEl.textContent.trim().toLowerCase();
      if (title.includes('total videos')) {
        valueEl.dataset.count = String(a.videos.length);
        valueEl.textContent = f(a.videos.length);
      } else if (title.includes('active students')) {
        // static override as requested
        valueEl.dataset.count = String(1428);
        valueEl.textContent = '1,428';
      } else if (title.includes('ai insights')) {
        valueEl.dataset.count = String(273);
        valueEl.textContent = '273';
      }
    });

    // Update the My Videos nav badge to reflect total videos count
    const myNavBadge = document.querySelector('.nav-item[data-route="my-videos"] .nav-badge');
    if (myNavBadge) myNavBadge.textContent = String(a.videos.length);
  } catch (e) {
    console.error('updateStatsCounts error', e);
  }
}

// Persist saved videos in localStorage
function getSaved() {
  try {
    const raw = localStorage.getItem("eduvideo_saved");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveList(list) {
  localStorage.setItem("eduvideo_saved", JSON.stringify(list));
}

function isSaved(id) {
  return getSaved().some((v) => v.id === id);
}

function toggleSave(id) {
  const saved = getSaved();
  const exists = saved.find((v) => v.id === id);
  if (exists) {
    const updated = saved.filter((v) => v.id !== id);
    saveList(updated);
    // show remove saved toast
    c("Removed from saved", "info");
  } else {
    const video = a.videos.find((v) => v.id === id);
    if (video) {
      saved.push({ id: video.id, title: video.title, thumbnail: video.thumbnail, youtubeLink: video.youtubeLink || null });
      saveList(saved);
      // show saved toast
      c("Video saved!", "success");
    }
  }
  updateSavedCount();
}

function updateSavedCount() {
  const count = getSaved().length;
  if (t.savedCount) t.savedCount.textContent = count;
}

function renderSavedSection() {
  // when user navigates to 'saved' route, show saved videos in videos grid
  a.viewContext = 'saved';
  applyViewContextUI();
  const saved = getSaved();
  // show a nicer header in the featured area for saved content
  if (saved.length === 0) {
    t.videosGrid.innerHTML = `<div class="no-results"><h3>No saved videos</h3><p>You haven't saved any videos yet.</p></div>`;
    return;
  }
  t.videosGrid.innerHTML = "";
  saved.forEach((sv, idx) => {
    const v = a.videos.find((x) => x.id === sv.id);
    if (v) {
      const node = K(v, idx);
      t.videosGrid.appendChild(node);
    }
  });
  updateSavedCount();
  lucide.createIcons();
}

// Video modal helpers
let currentModalVideoId = null;
function openVideoModal(video) {
  currentModalVideoId = video.id;
  if (!t.videoModal || !t.videoPlayerContainer) return;
  // lock background scroll
  document.body.style.overflow = 'hidden';

  // build header and player area
  t.videoPlayerContainer.innerHTML = "";
  // inject header
  const header = document.createElement('div');
  header.className = 'modal-video-header';
  header.innerHTML = `<div class="modal-title"><h3>${video.title}</h3></div>`;
  t.videoPlayerContainer.appendChild(header);
  const playerWrap = document.createElement('div');
  playerWrap.className = 'modal-video-player';
  t.videoPlayerContainer.appendChild(playerWrap);
  // If youtube link present, embed iframe
  if (video.youtubeLink && video.youtubeLink.includes("youtube.com")) {
    const url = new URL(video.youtubeLink);
    const vid = url.searchParams.get("v") || video.youtubeLink.split("/").pop();
    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${vid}?autoplay=1`;
    iframe.width = "100%";
    iframe.height = "480";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    playerWrap.appendChild(iframe);
  } else if (video.videoUrl) {
    const vid = document.createElement("video");
    vid.src = video.videoUrl;
    vid.controls = true;
    vid.autoplay = true;
    vid.style.width = "100%";
    playerWrap.appendChild(vid);
  } else {
    playerWrap.textContent = "Video cannot be played.";
  }
  // Update modal save button state
  if (t.modalSaveBtn) t.modalSaveBtn.classList.toggle("active", isSaved(video.id));
  // action row (YouTube link / watch externally)
  const actions = document.createElement('div');
  actions.className = 'modal-video-actions';
  if (video.youtubeLink) {
    const ytBtn = document.createElement('a');
    ytBtn.href = video.youtubeLink;
    ytBtn.target = '_blank';
    ytBtn.rel = 'noopener';
    ytBtn.className = 'btn btn-outline';
    ytBtn.textContent = 'Watch on YouTube';
    actions.appendChild(ytBtn);
  }
  // append actions after player
  t.videoPlayerContainer.appendChild(actions);

  // display modal and trap focus
  t.videoModal.classList.remove("hidden");
  trapFocusInModal(t.videoModal);
  lucide.createIcons();
}

function closeVideoModal() {
  if (!t.videoModal) return;
  t.videoModal.classList.add("hidden");
  if (t.videoPlayerContainer) t.videoPlayerContainer.innerHTML = "";
  // restore body scroll
  document.body.style.overflow = '';
  releaseFocusTrap();
  currentModalVideoId = null;
}

// Wire modal buttons
if (t.videoModalClose) t.videoModalClose.addEventListener("click", closeVideoModal);
if (t.videoModalBackdrop) t.videoModalBackdrop.addEventListener("click", closeVideoModal);
if (t.modalShareBtn) t.modalShareBtn.addEventListener("click", () => {
  if (!currentModalVideoId) return;
  const video = a.videos.find((v) => v.id === currentModalVideoId);
  if (!video) return;
  const url = video.youtubeLink || video.videoUrl || window.location.href;
  navigator.clipboard.writeText(url).then(() => c("Link copied to clipboard!", "success"));
});
if (t.modalSaveBtn) t.modalSaveBtn.addEventListener("click", () => {
  if (!currentModalVideoId) return;
  toggleSave(currentModalVideoId);
  if (t.modalSaveBtn) t.modalSaveBtn.classList.toggle("active", isSaved(currentModalVideoId));
});

// Focus trap utilities for modal
let _previouslyFocused = null;
function trapFocusInModal(modal) {
  _previouslyFocused = document.activeElement;
  const focusable = modal.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  function keyHandler(e) {
    if (e.key === 'Escape') {
      closeVideoModal();
      return;
    }
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }
  modal.__keyHandler = keyHandler;
  document.addEventListener('keydown', keyHandler);
  // focus first
  first && first.focus();
}
function releaseFocusTrap() {
  if (_previouslyFocused) _previouslyFocused.focus();
  document.removeEventListener('keydown', (e) => { });
}

// Hide user menu three-dots when sidebar collapsed (improve UX)
function updateUserMenuVisibility() {
  if (!t.userMenu) return;
  if (a.sidebarCollapsed) {
    t.userMenu.style.display = 'none';
  } else {
    t.userMenu.style.display = '';
  }
}
// call when sidebar toggled
const originalAe = ae;
ae = function () {
  originalAe();
  updateUserMenuVisibility();
};

// Ensure saved count is initialized
updateSavedCount();
function X(e, i) {
  const s = [...e];
  switch (i) {
    case "newest":
      return s.sort((r, n) => n.uploadDate - r.uploadDate);
    case "oldest":
      return s.sort((r, n) => r.uploadDate - n.uploadDate);
    case "most-viewed":
      return s.sort((r, n) => n.views - r.views);
    case "duration-short":
      return s.sort((r, n) => v(r.duration) - v(n.duration));
    case "duration-long":
      return s.sort((r, n) => v(n.duration) - v(r.duration));
    case "alphabetical":
      return s.sort((r, n) => r.title.localeCompare(n.title));
    case "relevance":
    default:
      return s;
  }
}
function v(e) {
  const i = e.split(":").map(Number);
  return i.length === 3 ? i[0] * 3600 + i[1] * 60 + i[2] : i[0] * 60 + i[1];
}
function Y(e) {
  a.sortBy = e.target.value;
  g();
  // Sorting toast suppressed
}
function Z(e, i) {
  // normalize filter token to lower-case for reliable matching
  const token = String(e).toLowerCase();
  const s = a.activeFilters.map(f => f.toLowerCase()).indexOf(token);
  if (s === -1) {
    a.activeFilters.push(e);
    i.classList.add("active");
  } else {
    // remove by index of original array
    const origIndex = a.activeFilters.findIndex(f => f.toLowerCase() === token);
    if (origIndex > -1) a.activeFilters.splice(origIndex, 1);
    i.classList.remove("active");
  }
  w();
  g();
  // Filter change toast suppressed
}
function R() {
  a.activeFilters = [];
  t.filterBadges.forEach((e) => e.classList.remove("active"));
  w();
  g();
  // Clear filters toast suppressed
}
function w() {
  a.activeFilters.length > 0
    ? (t.clearFiltersBtn.classList.remove("hidden"),
      t.activeFiltersSummary.classList.remove("hidden"),
      (t.activeFiltersSummary.textContent = `Filtering by: ${a.activeFilters.join(
        ", "
      )}`))
    : (t.clearFiltersBtn.classList.add("hidden"),
      t.activeFiltersSummary.classList.add("hidden"));
}
function F(e) {
  a.viewMode = e;
  t.gridViewBtn.classList.toggle("active", e === "grid");
  t.listViewBtn.classList.toggle("active", e === "list");
  g();
  // View switch toast suppressed
}
function _() {
  a.currentPage++;
  g();
}
function ee(e, i) {
  e.preventDefault();
  const s = i.dataset.route;
  t.navItems.forEach((r) => r.classList.remove("active"));
  i.classList.add("active");
  // set viewContext
  if (s === 'my-videos') a.viewContext = 'videos';
  else if (s === 'saved') a.viewContext = 'saved';
  else a.viewContext = 'home';
  applyViewContextUI();
  se(s);
}
function te(e, i) {
  e.preventDefault();
  const s = i.dataset.category;
  R();
  a.activeFilters = [s];
  a.viewContext = 'videos';
  const r = document.querySelector(`[data-filter="${s}"]`);
  r && r.classList.add("active");
  w();
  // activate My Videos nav item
  t.navItems.forEach((n) => n.classList.remove('active'));
  const myNav = Array.from(t.navItems).find((n) => n.dataset.route === 'my-videos');
  if (myNav) myNav.classList.add('active');
  applyViewContextUI();
  g();
}
function se(e) {
  switch (e) {
    case "search":
      t.searchInput.focus();
      break;
    case "my-videos":
      applyViewContextUI();
      g();
      break;
    case "saved":
      a.viewContext = 'saved';
      applyViewContextUI();
      renderSavedSection();
      break;
    case "trending":
      (a.sortBy = "most-viewed"), (t.sortSelect.value = "most-viewed"), g();
      break;
  }
}
function ie(e) {
  switch (e) {
    case "start-learning":
      // quick action toast suppressed
      break;
    case "ai-recommendations":
      // keep AI suggestions toast when generated successfully (handled in oe())
      break;
    case "upload-content":
      // suppressed
      break;
    case "analytics":
      // suppressed
      break;
  }
}
function ae() {
  (a.sidebarCollapsed = !a.sidebarCollapsed),
    t.sidebar.classList.toggle("collapsed", a.sidebarCollapsed),
    Q();
}
function ne() {
  // Toggle mobile sidebar
  t.sidebar.classList.toggle("mobile-open");
  t.mobileOverlay.classList.toggle("active");
  document.body.classList.toggle("sidebar-open");

  // Ensure the sidebar is visible when opened
  if (t.sidebar.classList.contains("mobile-open")) {
    t.sidebar.style.transform = "translate(0)";
  } else {
    t.sidebar.style.transform = "translate(-100%)";
  }
}
function re() {
  t.sidebar.classList.remove("mobile-open");
  t.mobileOverlay.classList.remove("active");
  document.body.classList.remove("sidebar-open");
  // Reset transform when closing
  t.sidebar.style.transform = "translate(-100%)";
}
function Q() {
  window.innerWidth > 768
    ? (t.mainContent.style.marginLeft = a.sidebarCollapsed ? "80px" : "280px")
    : (t.mainContent.style.marginLeft = "0");
}
async function oe() {
  // If searchQuery is empty, try quick search input or provide generic suggestions
  if (!a.searchQuery.trim()) {
    const quick = (t.quickSearchInput && t.quickSearchInput.value) ? t.quickSearchInput.value.trim() : "";
    if (quick) {
      a.searchQuery = quick;
      t.searchInput.value = quick;
    } else {
      // fallback generic topics so AI Assist still returns suggestions
      a.searchQuery = "learning";
      // don't overwrite the visible input if user left it blank intentionally
    }
  }
  try {
    (a.isSearching = !0), P();
    const e = [
      `${a.searchQuery} for beginners`,
      `Advanced ${a.searchQuery} techniques`,
      `${a.searchQuery} best practices`,
      `${a.searchQuery} real-world applications`,
    ];
    await new Promise((i) => setTimeout(i, 1500)),
      ce(e),
      t.suggestionsDropdown.classList.remove("hidden"),
      c("AI suggestions generated!", "success");
  } catch (e) {
    console.error("AI search failed:", e),
      c("AI search temporarily unavailable", "error"),
      p();
  } finally {
    (a.isSearching = !1), P();
  }
}
function ce(e) {
  const i = document.querySelector(".suggestions-list");
  (i.innerHTML = ""),
    e.forEach((s) => {
      const r = document.createElement("button");
      (r.className = "suggestion-item"),
        (r.textContent = s),
        r.addEventListener("click", () => {
          (t.searchInput.value = s),
            (a.searchQuery = s),
            t.suggestionsDropdown.classList.add("hidden"),
            p();
        }),
        i.appendChild(r);
    });
}
function P() {
  a.isSearching
    ? ((t.searchBtn.innerHTML =
      '<i data-lucide="loader-2" class="animate-spin"></i>'),
      (t.aiAssistBtn.innerHTML =
        '<i data-lucide="sparkles"></i> AI Thinking...'),
      (t.aiAssistBtn.disabled = !0))
    : ((t.searchBtn.innerHTML = '<i data-lucide="search"></i>'),
      (t.aiAssistBtn.innerHTML = '<i data-lucide="sparkles"></i> AI Assist'),
      (t.aiAssistBtn.disabled = !1)),
    lucide.createIcons();
}
function L(e, i = 0) {
  (t.resultsCount.textContent = `${e} result${e !== 1 ? "s" : ""}`),
    i > 0 && (t.searchTime.textContent = `in ${i}ms`),
    t.searchStats.classList.remove("hidden");
}
function le() {
  (t.videosGrid.innerHTML = `
    <div class="no-results">
      <div class="no-results-icon">
        <i data-lucide="search-x"></i>
      </div>
      <h3>No videos found</h3>
      <p>Try adjusting your search terms or filters</p>
      <div class="no-results-actions">
        <button class="btn btn-secondary" onclick="clearAllFilters()">
          <i data-lucide="refresh-cw"></i>
          Clear Filters
        </button>
        <button class="btn btn-outline" onclick="elements.searchInput.value = ''; appState.searchQuery = ''; renderVideos();">
          <i data-lucide="x"></i>
          Clear Search
        </button>
      </div>
    </div>
  `),
    t.loadMoreContainer.classList.add("hidden"),
    lucide.createIcons();
}
function c(e, i = "info") {
  const s = document.createElement("div");
  s.className = `toast toast-${i}`;
  const r =
    {
      success: "check-circle",
      error: "x-circle",
      warning: "alert-triangle",
      info: "info",
    }[i] || "info";
  (s.innerHTML = `
    <div class="toast-content">
      <i data-lucide="${r}"></i>
      <span>${e}</span>
    </div>
    <button class="toast-close">
      <i data-lucide="x"></i>
    </button>
  `),
    // make individual toast clickable while container ignores pointer events
    Object.assign(s.style, {
      pointerEvents: 'auto',
      zIndex: '1001',
      boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
    }),
    t.toastContainer.appendChild(s),
    lucide.createIcons(),
    setTimeout(() => {
      s.classList.add("removing"),
        setTimeout(() => {
          s.parentNode && s.parentNode.removeChild(s);
        }, 300);
    }, 3e3),
    s.querySelector(".toast-close").addEventListener("click", () => {
      s.classList.add("removing"),
        setTimeout(() => {
          s.parentNode && s.parentNode.removeChild(s);
        }, 300);
    });
}
function de() {
  document.querySelectorAll("[data-count]").forEach((i) => {
    const s = parseInt(i.dataset.count),
      n = s / (2e3 / 16);
    let o = 0;
    const d = setInterval(() => {
      (o += n),
        o >= s
          ? ((i.textContent = f(s)), clearInterval(d))
          : (i.textContent = f(Math.floor(o)));
    }, 16);
  });
}
function f(e) {
  return e >= 1e6
    ? (e / 1e6).toFixed(1) + "M"
    : e >= 1e3
      ? (e / 1e3).toFixed(1) + "K"
      : e.toString();
}
function ue(e, i) {
  let s;
  return function (...n) {
    const o = () => {
      clearTimeout(s), e(...n);
    };
    clearTimeout(s), (s = setTimeout(o, i));
  };
}
function ge(e) {
  !t.searchInput.contains(e.target) &&
    !t.searchResultsDropdown.contains(e.target) &&
    m(),
    !t.searchInput.contains(e.target) &&
    !t.suggestionsDropdown.contains(e.target) &&
    t.suggestionsDropdown.classList.add("hidden");
}
function q() {
  if (window.innerWidth <= 768) {
    t.sidebar.classList.add("mobile");
    t.mainContent.style.marginLeft = "0";
    // Ensure mobile menu toggle is visible and functional
    if (t.mobileMenuToggle) {
      t.mobileMenuToggle.style.display = "block";
    }
  } else {
    t.sidebar.classList.remove("mobile", "mobile-open");
    t.mobileOverlay.classList.remove("active");
    document.body.classList.remove("sidebar-open");
    // Hide mobile menu toggle on desktop
    if (t.mobileMenuToggle) {
      t.mobileMenuToggle.style.display = "none";
    }
    Q();
  }
}
function renderVideos() {
  // Re-render videos with current state
  g();
}

function showQuickSearchResults(results) {
  // This function shows quick search results in the top bar
  // For now, we'll just log the results to avoid errors
  console.log('Quick search results:', results);
}

function clearAllFilters() {
  // Clear all active filters
  a.activeFilters = [];
  a.sortBy = "relevance";

  // Clear filter badges
  if (t.filterBadges) {
    t.filterBadges.forEach(badge => {
      badge.classList.remove("active");
    });
  }

  // Reset sort select
  if (t.sortSelect) {
    t.sortSelect.value = "relevance";
  }

  // Hide clear button
  if (t.clearFiltersBtn) {
    t.clearFiltersBtn.classList.add("hidden");
  }

  // Re-render videos
  g();

  // Show success message
  c("All filters cleared", "success");
}

N();
