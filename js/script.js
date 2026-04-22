// ========== ROUTER ==========

const routes = {
  "/": "pages/home.html",
  "/informacion": "pages/informacion.html",
  "/galeria": "pages/galeria.html",
  "/tabla": "pages/tabla.html",
  "/contacto": "pages/contacto.html",
};

// Obtener la ruta actual desde el hash de la URL
function getCurrentRoute() {
  const hash = window.location.hash;
  // Si no hay hash o es "#/", devolver "/"
  if (!hash || hash === "#/" || hash === "#") {
    return "/";
  }
  // Quitar el "#" del inicio
  return hash.substring(1);
}

// Actualizar el hash sin causar recarga
function setHash(route) {
  window.location.hash = route;
}

// Función para cargar el contenido de la página actual
async function loadContent(route) {
  const contentDiv = document.getElementById("app-content");
  if (!contentDiv) return;

  // Mostrar loading
  contentDiv.innerHTML = `
        <div class="container text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3">Cargando contenido...</p>
        </div>
    `;

  try {
    const pagePath = routes[route] || routes["/"];
    const response = await fetch(pagePath);

    if (!response.ok)
      throw new Error(`Error cargando ${pagePath}: ${response.status}`);

    const html = await response.text();
    contentDiv.innerHTML = html;

    // Actualizar el título de la página según la ruta
    updatePageTitle(route);

    // Marcar el enlace activo en la navegación
    setActiveNavLink(route);

    // Ejecutar scripts específicos de la página cargada
    executePageScripts(route);

    // Scroll al inicio
    window.scrollTo(0, 0);
  } catch (error) {
    console.error("Error:", error);
    contentDiv.innerHTML = `
            <div class="container text-center py-5">
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    Error al cargar el contenido: ${error.message}<br>
                    Verifica que los archivos en la carpeta "pages/" existan.
                </div>
            </div>
        `;
  }
}

// Actualizar el título de la página
function updatePageTitle(route) {
  const titles = {
    "/": "InnovateStart | Inicio - Portal de Emprendimiento",
    "/informacion": "InnovateStart | Información - Metodologías",
    "/galeria": "InnovateStart | Galería - Eventos y talleres",
    "/tabla": "InnovateStart | Planes y precios",
    "/contacto": "InnovateStart | Contacto",
  };
  document.title = titles[route] || "InnovateStart";
}

// Marcar el enlace activo en el menú
function setActiveNavLink(route) {
  const navLinks = document.querySelectorAll(
    ".navbar-nav .nav-link, footer a[data-route]",
  );
  navLinks.forEach((link) => {
    const linkRoute = link.getAttribute("data-route");
    if (linkRoute === route) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Ejecutar scripts específicos después de cargar la página
function executePageScripts(route) {
  // Si es la página de contacto, inicializar la validación del formulario
  if (route === "/contacto") {
    setTimeout(() => {
      if (typeof initContactForm === "function") {
        initContactForm();
      }
    }, 100);
  }
}

// Manejar la navegación (solo cambia el hash)
function navigateTo(route) {
  if (route !== getCurrentRoute()) {
    setHash(route);
  }
}

// Escuchar cambios en el hash (cuando cambia la URL)
function handleHashChange() {
  const route = getCurrentRoute();
  loadContent(route);
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Escuchar cambios en el hash
  window.addEventListener("hashchange", handleHashChange);

  // Cargar la ruta inicial (la que está en el hash o "/" por defecto)
  const initialRoute = getCurrentRoute();
  loadContent(initialRoute);

  // Delegación de eventos para clics en enlaces con data-route
  document.body.addEventListener("click", (e) => {
    const link = e.target.closest("[data-route]");
    if (link) {
      e.preventDefault();
      const route = link.getAttribute("data-route");
      navigateTo(route);
    }
  });
});



// ========== VALIDACIÓN DEL FORMULARIO DE CONTACTO ==========
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const mensaje = document.getElementById("mensaje");
  const interes = document.getElementById("interes");
  const terminos = document.getElementById("terminos");
  const contador = document.getElementById("contadorCaracteres");

  function actualizarContador() {
    if (mensaje && contador) {
      const len = mensaje.value.length;
      contador.textContent = `${len}/20 caracteres mínimos`;
      contador.classList.toggle("text-success", len >= 20);
      contador.classList.toggle("text-danger", len < 20);
    }
  }

  function validarNombre() {
    const valido = nombre.value.trim().length >= 3;
    nombre.classList.toggle("is-invalid", !valido);
    return valido;
  }

  function validarEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valido = regex.test(email.value.trim());
    email.classList.toggle("is-invalid", !valido);
    return valido;
  }

  function validarMensaje() {
    const valido = mensaje.value.trim().length >= 20;
    mensaje.classList.toggle("is-invalid", !valido);
    actualizarContador();
    return valido;
  }

  function validarSelect() {
    const valido = interes.value !== "";
    interes.classList.toggle("is-invalid", !valido);
    return valido;
  }

  function validarCheckbox() {
    const valido = terminos.checked;
    terminos.classList.toggle("is-invalid", !valido);
    return valido;
  }

  // Eventos en tiempo real
  nombre?.addEventListener("input", validarNombre);
  email?.addEventListener("input", validarEmail);
  mensaje?.addEventListener("input", validarMensaje);
  interes?.addEventListener("change", validarSelect);
  terminos?.addEventListener("change", validarCheckbox);

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const valido =
      validarNombre() &
      validarEmail() &
      validarMensaje() &
      validarSelect() &
      validarCheckbox();
    const msgDiv = document.getElementById("formMessage");

    if (valido) {
      msgDiv.innerHTML =
        '<div class="alert alert-success">✅ Mensaje enviado con éxito. Un asesor te contactará pronto.</div>';
      form.reset();
      document
        .querySelectorAll(".is-invalid")
        .forEach((el) => el.classList.remove("is-invalid"));
      if (contador) contador.textContent = "0/20 caracteres mínimos";
    } else {
      msgDiv.innerHTML =
        '<div class="alert alert-danger">❌ Revisa los campos en rojo.</div>';
    }
  });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initContactForm);
} else {
  initContactForm();
}
