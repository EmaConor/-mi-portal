// ========== CARGA AUTOMÁTICA DE COMPONENTES ==========

async function loadComponent(elementId, componentPath) {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) throw new Error(`Error cargando ${componentPath}`);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;

    // Marcar el enlace activo según la página actual
    if (elementId === "header-placeholder") {
      setTimeout(() => {
        const currentPage =
          window.location.pathname.split("/").pop() || "index.html";
        const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          if (href === currentPage) {
            link.classList.add("active");
          } else if (currentPage === "" && href === "index.html") {
            link.classList.add("active");
          }
        });
      }, 100);
    }
  } catch (error) {
    console.error("Error cargando componente:", error);
  }
}

// Cargar componentes cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Cargar header y footer
  loadComponent("header-placeholder", "components/header.html");
  loadComponent("footer-placeholder", "components/footer.html");
});
