// Dados de filmes embutidos (cópia estável do JSON original, com fallback de imagem)
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

function setup() {
  noCanvas();
  addLightningEffect();
  populateYearDropdown(filmesData);
  renderFilms(filmesData);

  select("#yearSelect").changed(() => {
    const selected = select("#yearSelect").value();
    const filtered = selected === "all" ? filmesData : filmesData.filter(f => f.Year === selected);
    renderFilms(filtered);
  });
}

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
    
    // Se não houver poster, usa placeholder com o título do filme
    if (!posterUrl) {
      posterUrl = `https://via.placeholder.com/220x320/1a1025/ecd8b4?text=${encodeURIComponent(film.Title.substring(0, 20))}`;
    }
    
    img.attribute("src", posterUrl);
    img.attribute("alt", film.Title);
    
    // Fallback universal: se a imagem falhar, mostra um placeholder escuro com o título
    img.elt.onerror = () => {
      img.attribute("src", `https://via.placeholder.com/220x320/0a0510/d4af37?text=${encodeURIComponent(film.Title.substring(0, 18))}`);
      img.addClass("error");
      img.elt.onerror = null; // evita loop
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

    info.parent(card);
    card.parent(grid);
  });
}

// Efeito de relâmpago (igual ao anterior)
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