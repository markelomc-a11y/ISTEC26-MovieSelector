// ==================== DADOS ORIGINAIS DOS FILMES ====================
const filmesData = [
  { "Title": "The Godfather", "Year": "1972", "Runtime": "175 min", "Genre": "Crime, Drama", "imdbRating": "9.2", "Poster": "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { "Title": "The Dark Knight", "Year": "2008", "Runtime": "152 min", "Genre": "Action, Crime, Drama", "imdbRating": "9.0", "Poster": "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg" },
  { "Title": "Pulp Fiction", "Year": "1994", "Runtime": "154 min", "Genre": "Crime, Drama", "imdbRating": "8.9", "Poster": "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { "Title": "The Lord of the Rings: The Return of the King", "Year": "2003", "Runtime": "201 min", "Genre": "Adventure, Drama, Fantasy", "imdbRating": "9.0", "Poster": "https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { "Title": "Forrest Gump", "Year": "1994", "Runtime": "142 min", "Genre": "Drama, Romance", "imdbRating": "8.8", "Poster": "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg" },
  { "Title": "Inception", "Year": "2010", "Runtime": "148 min", "Genre": "Action, Adventure, Sci-Fi", "imdbRating": "8.8", "Poster": "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg" },
  { "Title": "Fight Club", "Year": "1999", "Runtime": "139 min", "Genre": "Drama", "imdbRating": "8.8", "Poster": "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { "Title": "The Matrix", "Year": "1999", "Runtime": "136 min", "Genre": "Action, Sci-Fi", "imdbRating": "8.7", "Poster": "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg" },
  { "Title": "Goodfellas", "Year": "1990", "Runtime": "146 min", "Genre": "Biography, Crime, Drama", "imdbRating": "8.7", "Poster": "https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg" },
  { "Title": "Se7en", "Year": "1995", "Runtime": "127 min", "Genre": "Crime, Drama, Mystery", "imdbRating": "8.6", "Poster": "https://m.media-amazon.com/images/M/MV5BOTUwODM5MTctZjczMi00OTk4LTg3NWUtNmVhMTAzNTNjYjcyXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg" }
];

// ==================== VARIÁVEIS DO DASHBOARD ====================
let dashboardCanvas;
let currentImage;        // p5.Image carregada do poster
let originalPixels;      // cópia original dos pixels
let brightnessSlider, contrastSlider, glitchSlider;
let isProcessing = false;

// ==================== CONFIGURAÇÃO PRINCIPAL ====================
function setup() {
  noCanvas();  // sem canvas automático
  
  // --- Funcionalidades originais ---
  addLightningEffect();
  populateYearDropdown(filmesData);
  renderFilms(filmesData);   // esta função agora adiciona botões "Editar"
  
  select("#yearSelect").changed(() => {
    const selected = select("#yearSelect").value();
    const filtered = selected === "all" ? filmesData : filmesData.filter(f => f.Year === selected);
    renderFilms(filtered);
  });
  
  // --- Configuração do Dashboard de Edição ---
  setupEditionDashboard();
}

function setupEditionDashboard() {
  const container = select("#canvas-container");
  dashboardCanvas = createCanvas(420, 420);
  dashboardCanvas.parent(container);
  dashboardCanvas.style('display', 'block');
  dashboardCanvas.style('margin', '0 auto');
  
  // Fundo vazio
  background(10, 5, 15);
  fill("#d9c8b2");
  textAlign(CENTER, CENTER);
  textSize(16);
  text("🔮 Clique em 'EDITAR POSTER'", width/2, height/2);
  textSize(12);
  text("em qualquer filme abaixo", width/2, height/2 + 25);
  
  // Criar sliders
  const panel = select("#filter-panel");
  panel.html("");
  
  const brightDiv = createDiv().class("filter-control");
  brightDiv.parent(panel);
  createSpan("💀 Brilho").parent(brightDiv);
  brightnessSlider = createSlider(-100, 100, 0);
  brightnessSlider.parent(brightDiv);
  brightnessSlider.input(() => applyAllFilters());
  
  const contrastDiv = createDiv().class("filter-control");
  contrastDiv.parent(panel);
  createSpan("⚡ Contraste").parent(contrastDiv);
  contrastSlider = createSlider(0.5, 3.0, 1.0, 0.01);
  contrastSlider.parent(contrastDiv);
  contrastSlider.input(() => applyAllFilters());
  
  const glitchDiv = createDiv().class("filter-control");
  glitchDiv.parent(panel);
  createSpan("🌀 Glitch").parent(glitchDiv);
  glitchSlider = createSlider(0, 1, 0, 0.01);
  glitchSlider.parent(glitchDiv);
  glitchSlider.input(() => applyAllFilters());
  
  // Botão Reset
  const resetBtn = createButton("🔁 RESTAURAR ORIGINAL");
  resetBtn.class("filter-control");
  resetBtn.style("background", "#2a102a");
  resetBtn.style("border", "1px solid #8b0000");
  resetBtn.style("color", "#ecd8b4");
  resetBtn.style("cursor", "pointer");
  resetBtn.parent(panel);
  resetBtn.mousePressed(() => {
    if (originalPixels) restoreOriginalPixels();
  });
  
  // Botão Salvar
  const saveBtn = select("#saveImageBtn");
  saveBtn.mousePressed(() => {
    if (!currentImage) {
      alert("Nenhuma imagem carregada. Selecione um poster primeiro.");
      return;
    }
    saveCanvas(dashboardCanvas, "poster_maldito", "png");
  });
}

// ==================== CARREGAR POSTER DO FILME ====================
function loadFilmPoster(film) {
  let posterUrl = film.Poster && film.Poster !== "N/A" ? film.Poster : null;
  if (!posterUrl) {
    posterUrl = `https://via.placeholder.com/400x400/1a1025/ecd8b4?text=${encodeURIComponent(film.Title.substring(0, 15))}`;
  }
  
  // Mostra loading
  background(10, 5, 15);
  fill("#d9c8b2");
  textSize(14);
  text("Carregando tormento...", width/2, height/2);
  
  loadImage(posterUrl, img => {
    currentImage = img;
    image(currentImage, 0, 0, width, height);
    loadPixels();
    originalPixels = new Uint8ClampedArray(pixels);
    // Reset sliders
    brightnessSlider.value(0);
    contrastSlider.value(1.0);
    glitchSlider.value(0);
    applyAllFilters();
  }, err => {
    console.error("Erro ao carregar poster:", err);
    background(10, 5, 15);
    fill("#b00030");
    text("❌ Falha ao carregar imagem", width/2, height/2);
  });
}

// ==================== FILTROS E PÓS-PROCESSAMENTO ====================
function applyAllFilters() {
  if (!originalPixels || !currentImage) return;
  if (isProcessing) return;
  isProcessing = true;
  
  restoreOriginalPixels();
  
  let brightVal = brightnessSlider.value();
  let contrastVal = contrastSlider.value();
  let glitchVal = glitchSlider.value();
  
  loadPixels();
  for (let i = 0; i < pixels.length; i += 4) {
    let r = pixels[i];
    let g = pixels[i+1];
    let b = pixels[i+2];
    
    r = (r - 128) * contrastVal + 128;
    g = (g - 128) * contrastVal + 128;
    b = (b - 128) * contrastVal + 128;
    
    r += brightVal;
    g += brightVal;
    b += brightVal;
    
    pixels[i] = constrain(r, 0, 255);
    pixels[i+1] = constrain(g, 0, 255);
    pixels[i+2] = constrain(b, 0, 255);
  }
  updatePixels();
  
  if (glitchVal > 0.05) {
    applyGlitchEffect(glitchVal);
  }
  
  isProcessing = false;
}

function restoreOriginalPixels() {
  if (!originalPixels) return;
  loadPixels();
  for (let i = 0; i < originalPixels.length; i++) {
    pixels[i] = originalPixels[i];
  }
  updatePixels();
}

function applyGlitchEffect(intensity) {
  loadPixels();
  let steps = floor(intensity * 25);
  for (let n = 0; n < steps; n++) {
    let y = floor(random(height));
    let blockH = floor(random(4, 25));
    let shiftX = floor(random(-35, 35));
    for (let row = 0; row < blockH && y+row < height; row++) {
      let startIdx = (y + row) * width * 4;
      let tempRow = new Uint8ClampedArray(width * 4);
      for (let x = 0; x < width; x++) {
        let srcIdx = startIdx + x * 4;
        let destX = (x + shiftX) % width;
        if (destX < 0) destX += width;
        let destIdx = startIdx + destX * 4;
        tempRow[destIdx] = pixels[srcIdx];
        tempRow[destIdx+1] = pixels[srcIdx+1];
        tempRow[destIdx+2] = pixels[srcIdx+2];
        tempRow[destIdx+3] = pixels[srcIdx+3];
      }
      for (let x = 0; x < width; x++) {
        let idx = startIdx + x * 4;
        pixels[idx] = tempRow[idx];
        pixels[idx+1] = tempRow[idx+1];
        pixels[idx+2] = tempRow[idx+2];
      }
    }
  }
  updatePixels();
}

// ==================== INTERAÇÃO DO MOUSE (DISTORÇÃO) ====================
function mouseDragged() {
  if (!currentImage || isProcessing) return;
  // Verifica se o mouse está dentro do canvas
  const canvasRect = dashboardCanvas.elt.getBoundingClientRect();
  const mouseCanvasX = mouseX - canvasRect.left;
  const mouseCanvasY = mouseY - canvasRect.top;
  if (mouseCanvasX < 0 || mouseCanvasX > width || mouseCanvasY < 0 || mouseCanvasY > height) return;
  
  // Efeito de distorção local
  let dx = mouseX - pmouseX;
  let dy = mouseY - pmouseY;
  let strength = min(25, abs(dx) + abs(dy));
  if (strength < 2) return;
  
  loadPixels();
  let radius = 45;
  let centerX = constrain(mouseCanvasX, 0, width-1);
  let centerY = constrain(mouseCanvasY, 0, height-1);
  
  for (let y = max(0, centerY - radius); y < min(height, centerY + radius); y++) {
    for (let x = max(0, centerX - radius); x < min(width, centerX + radius); x++) {
      let distToCenter = dist(x, y, centerX, centerY);
      if (distToCenter < radius) {
        let force = (1 - distToCenter/radius) * strength * 0.6;
        let offsetX = floor(dx * force);
        let offsetY = floor(dy * force);
        let srcX = constrain(x + offsetX, 0, width-1);
        let srcY = constrain(y + offsetY, 0, height-1);
        let targetIdx = (y * width + x) * 4;
        let sourceIdx = (srcY * width + srcX) * 4;
        if (sourceIdx >= 0 && sourceIdx < pixels.length) {
          pixels[targetIdx] = pixels[sourceIdx];
          pixels[targetIdx+1] = pixels[sourceIdx+1];
          pixels[targetIdx+2] = pixels[sourceIdx+2];
        }
      }
    }
  }
  updatePixels();
}

// ==================== FUNÇÕES ORIGINAIS DOS FILMES (com botão Editar) ====================
function populateYearDropdown(films) {
  const years = [...new Set(films.map(f => f.Year))].sort();
  const sel = select("#yearSelect");
  years.forEach(y => {
    const opt = createElement("option", y);
    opt.attribute("value", y);
    opt.parent(sel);
  });
}

function renderFilms(films) {
  const grid = select("#film-grid");
  grid.html("");
  if (films.length === 0) {
    const msg = createElement("p", "Nenhum filme amaldiçoado encontrado para este ano...");
    msg.class("no-results");
    msg.parent(grid);
    return;
  }
  films.forEach(film => {
    const card = createElement("div");
    card.class("film-card");
    
    const img = createElement("img");
    let posterUrl = film.Poster && film.Poster !== "N/A" ? film.Poster : null;
    if (!posterUrl) {
      posterUrl = `https://via.placeholder.com/220x320/1a1025/ecd8b4?text=${encodeURIComponent(film.Title.substring(0, 20))}`;
    }
    img.attribute("src", posterUrl);
    img.attribute("alt", film.Title);
    img.elt.onerror = () => {
      img.attribute("src", `https://via.placeholder.com/220x320/0a0510/d4af37?text=${encodeURIComponent(film.Title.substring(0, 18))}`);
      img.addClass("error");
      img.elt.onerror = null;
    };
    img.parent(card);
    
    const info = createElement("div");
    info.class("film-info");
    createElement("h3", film.Title).parent(info);
    createElement("p", `📅 ${film.Year} · ${film.Runtime || "?? min"}`).parent(info);
    createElement("p", `🎬 ${film.Genre || "Gênero desconhecido"}`).parent(info);
    const rating = createElement("p", `⭐ ${film.imdbRating || "?"} / 10`);
    rating.class("rating");
    rating.parent(info);
    
    // Botão Editar
    const editBtn = createElement("button", "✂️ EDITAR POSTER ✂️");
    editBtn.class("edit-btn");
    editBtn.mousePressed(() => loadFilmPoster(film));
    editBtn.parent(info);
    
    info.parent(card);
    card.parent(grid);
  });
}

function addLightningEffect() {
  const overlay = createDiv();
  overlay.class("lightning-overlay");
  overlay.parent(document.body);
  function lightningFlash() {
    overlay.style("opacity", random(0.7, 1.0));
    setTimeout(() => overlay.style("opacity", 0), 80);
    if (random(1) < 0.35) {
      setTimeout(() => {
        overlay.style("opacity", random(0.3, 0.6));
        setTimeout(() => overlay.style("opacity", 0), 50);
      }, 120);
    }
    const cards = selectAll(".film-card");
    cards.forEach(card => {
      card.style("transform", "translateX(2px)");
      setTimeout(() => card.style("transform", ""), 100);
    });
  }
  setInterval(() => {
    if (random(1) < 0.65) lightningFlash();
  }, random(4000, 12000));
  setTimeout(lightningFlash, 600);
}