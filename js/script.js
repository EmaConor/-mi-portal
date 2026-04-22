// ========== VALIDACIÓN DEL FORMULARIO DE CONTACTO ==========
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");

  // Si no existe el formulario en esta página, salimos sin errores
  if (!form) return;

  // Elementos del formulario
  const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const mensaje = document.getElementById("mensaje");
  const interes = document.getElementById("interes");
  const terminos = document.getElementById("terminos");

  // Contador de caracteres para el mensaje
  const contadorCaracteres = document.getElementById("contadorCaracteres");

  // Función para actualizar contador de caracteres
  function actualizarContador() {
    if (mensaje && contadorCaracteres) {
      const longitud = mensaje.value.length;
      contadorCaracteres.textContent = `${longitud}/20 caracteres mínimos`;
      if (longitud >= 20) {
        contadorCaracteres.classList.add("text-success");
        contadorCaracteres.classList.remove("text-danger");
      } else {
        contadorCaracteres.classList.add("text-danger");
        contadorCaracteres.classList.remove("text-success");
      }
    }
  }

  // Validación individual de cada campo
  function validarNombre() {
    const valor = nombre.value.trim();
    const esValido = valor.length >= 3;
    if (!esValido) {
      nombre.classList.add("is-invalid");
    } else {
      nombre.classList.remove("is-invalid");
    }
    return esValido;
  }

  function validarEmail() {
    const valor = email.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const esValido = regex.test(valor);
    if (!esValido) {
      email.classList.add("is-invalid");
    } else {
      email.classList.remove("is-invalid");
    }
    return esValido;
  }

  function validarMensaje() {
    const valor = mensaje.value.trim();
    const esValido = valor.length >= 20;
    if (!esValido) {
      mensaje.classList.add("is-invalid");
    } else {
      mensaje.classList.remove("is-invalid");
    }
    actualizarContador();
    return esValido;
  }

  function validarSelect() {
    const valor = interes.value;
    const esValido = valor !== "";
    if (!esValido) {
      interes.classList.add("is-invalid");
    } else {
      interes.classList.remove("is-invalid");
    }
    return esValido;
  }

  function validarCheckbox() {
    const esValido = terminos.checked;
    if (!esValido) {
      terminos.classList.add("is-invalid");
    } else {
      terminos.classList.remove("is-invalid");
    }
    return esValido;
  }

  // Eventos en tiempo real para cada campo
  if (nombre) {
    nombre.addEventListener("input", validarNombre);
    nombre.addEventListener("blur", validarNombre);
  }

  if (email) {
    email.addEventListener("input", validarEmail);
    email.addEventListener("blur", validarEmail);
  }

  if (mensaje) {
    mensaje.addEventListener("input", validarMensaje);
    mensaje.addEventListener("blur", validarMensaje);
    mensaje.addEventListener("keyup", actualizarContador);
  }

  if (interes) {
    interes.addEventListener("change", validarSelect);
  }

  if (terminos) {
    terminos.addEventListener("change", validarCheckbox);
  }

  // Envío del formulario (sin recargar la página, sin alert())
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Validar todos los campos
    const nombreValido = validarNombre();
    const emailValido = validarEmail();
    const mensajeValido = validarMensaje();
    const selectValido = validarSelect();
    const checkboxValido = validarCheckbox();

    const formularioValido =
      nombreValido &&
      emailValido &&
      mensajeValido &&
      selectValido &&
      checkboxValido;

    const messageDiv = document.getElementById("formMessage");

    if (formularioValido) {
      // Mostrar mensaje de éxito
      messageDiv.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong>¡Mensaje enviado con éxito!</strong><br>
                    Gracias por contactarte con InnovateStart. Un asesor se comunicará contigo en las próximas 24 horas.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                </div>
            `;

      // Limpiar el formulario
      form.reset();

      // Limpiar clases de validación
      document
        .querySelectorAll(".is-invalid")
        .forEach((el) => el.classList.remove("is-invalid"));

      // Reiniciar contador
      if (contadorCaracteres) {
        contadorCaracteres.textContent = "0/20 caracteres mínimos";
      }

      // Scroll suave al mensaje
      messageDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });

      // Opcional: limpiar el mensaje después de 5 segundos
      setTimeout(() => {
        if (messageDiv.children.length > 0) {
          messageDiv.innerHTML = "";
        }
      }, 5000);
    } else {
      // Mostrar mensaje de error
      messageDiv.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>Por favor, revisa los siguientes campos:</strong><br>
                    ${!nombreValido ? "• El nombre debe tener al menos 3 caracteres.<br>" : ""}
                    ${!emailValido ? "• Ingresa un correo electrónico válido.<br>" : ""}
                    ${!mensajeValido ? "• El mensaje debe tener al menos 20 caracteres.<br>" : ""}
                    ${!selectValido ? "• Selecciona una opción de interés.<br>" : ""}
                    ${!checkboxValido ? "• Debes aceptar los términos.<br>" : ""}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
                </div>
            `;

      // Scroll al primer error
      const primerError = document.querySelector(".is-invalid");
      if (primerError) {
        primerError.scrollIntoView({ behavior: "smooth", block: "center" });
        primerError.focus();
      }
    }
  });
});

// ========== FUNCIONALIDAD ADICIONAL: Menú activo según la página ==========
document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    } else if (currentPage === "" && href === "index.html") {
      link.classList.add("active");
    }
  });
});

// ========== SMOOTH SCROLL para enlaces internos ==========
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// ========== Mostrar año actual en el footer automáticamente ==========
document.addEventListener("DOMContentLoaded", function () {
  const yearSpan = document.querySelector(".footer-year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// ========== Tooltips de Bootstrap (opcional) ==========
const tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]'),
);
tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});
