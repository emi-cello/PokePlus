function toggleMenu() {
  const menu = document.getElementById("menu");
  const btn = document.getElementById("nav-menu");
  
  menu.classList.toggle("active");
}

async function loadNews() {
    const container = document.getElementById("news-container");

    try {
        const response = await fetch("./news.json");

        if (!response.ok) {
            throw new Error("Could not find news.json");
        }

        const news = await response.json();

        container.innerHTML = "";

        news.forEach(article => {
            container.innerHTML += `
                <div class="news-card">

                    <img
                        src="${article.image}"
                        alt="${article.title}"
                        class="news-image"
                    >

                    <div class="news-content">

                        <div class="news-category ${article.category.toLowerCase()}">
                            ${article.category}
                        </div>

                        <h3>${article.title}</h3>

                        <p>${article.date}</p>

                        <a href="${article.url}">
                            Read More →
                        </a>

                    </div>

                </div>
            `;
        });

    } catch(error) {
        console.error(error);

        container.innerHTML = `
            <p>Failed to load news.</p>
        `;
    }
}

document.addEventListener("DOMContentLoaded", loadNews);