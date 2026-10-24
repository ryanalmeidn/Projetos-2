
document.addEventListener("DOMContentLoaded", function () {
    const btnTopo = document.getElementById("btnTopo");
    const menuToggle = document.querySelector(".menu-toggle");
    const menuPrincipal = document.querySelector(".menu-principal");

    if (btnTopo) {
        const atualizarBotaoTopo = function () {
            btnTopo.classList.toggle("mostrar", window.scrollY > 300);
        };

        window.addEventListener("scroll", atualizarBotaoTopo, {
            passive: true
        });

        atualizarBotaoTopo();

        btnTopo.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    if (menuToggle && menuPrincipal) {
        menuToggle.addEventListener("click", function () {
            const aberto = menuPrincipal.classList.toggle("aberto");

            menuToggle.setAttribute("aria-expanded", String(aberto));
            menuToggle.setAttribute(
                "aria-label",
                aberto ? "Fechar menu" : "Abrir menu"
            );
        });

        menuPrincipal.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                if (
                    window.innerWidth <= 768 &&
                    !link.parentElement.classList.contains("dropdown")
                ) {
                    menuPrincipal.classList.remove("aberto");
                    menuToggle.setAttribute("aria-expanded", "false");
                    menuToggle.setAttribute("aria-label", "Abrir menu");
                }
            });
        });
    }

    document.querySelectorAll(".dropdown > a").forEach(function (link) {
        link.setAttribute("aria-haspopup", "true");
        link.setAttribute("aria-expanded", "false");

        link.addEventListener("click", function (event) {
            if (window.innerWidth <= 768) {
                event.preventDefault();

                const dropdown = link.parentElement;
                const aberto = dropdown.classList.toggle("aberto");

                link.setAttribute("aria-expanded", String(aberto));
            }
        });
    });

    document.querySelectorAll("form").forEach(function (formulario) {
        formulario.querySelectorAll("input, textarea, select").forEach(function (campo) {
            campo.addEventListener("input", function () {
                if (campo.checkValidity()) {
                    campo.removeAttribute("aria-invalid");
                } else {
                    campo.setAttribute("aria-invalid", "true");
                }
            });

            campo.addEventListener("blur", function () {
                if (campo.value !== "" || campo.required) {
                    campo.setAttribute(
                        "aria-invalid",
                        String(!campo.checkValidity())
                    );
                }
            });
        });

        formulario.addEventListener("submit", function (event) {
            if (!formulario.checkValidity()) {
                event.preventDefault();

                formulario.querySelectorAll("input, textarea, select").forEach(function (campo) {
                    campo.setAttribute(
                        "aria-invalid",
                        String(!campo.checkValidity())
                    );
                });

                const primeiroInvalido = formulario.querySelector(":invalid");

                if (primeiroInvalido) {
                    primeiroInvalido.focus();
                    primeiroInvalido.reportValidity();
                }

                return;
            }

            formulario.querySelectorAll("[aria-invalid]").forEach(function (campo) {
                campo.removeAttribute("aria-invalid");
            });
        });

        formulario.addEventListener("reset", function () {
            window.setTimeout(function () {
                formulario.querySelectorAll("[aria-invalid]").forEach(function (campo) {
                    campo.removeAttribute("aria-invalid");
                });
            }, 0);
        });
    });

    window.mostrarToast = function (mensagem, tipo = "sucesso") {
        let container = document.querySelector(".toast-container");

        if (!container) {
            container = document.createElement("div");
            container.className = "toast-container";
            container.setAttribute("aria-live", "polite");
            container.setAttribute("aria-atomic", "false");
            document.body.appendChild(container);
        }

        const toast = document.createElement("div");
        const tiposPermitidos = ["sucesso", "erro", "alerta"];
        const tipoSeguro = tiposPermitidos.includes(tipo) ? tipo : "sucesso";

        toast.className = "toast toast-" + tipoSeguro;
        toast.setAttribute("role", tipoSeguro === "erro" ? "alert" : "status");
        toast.textContent = mensagem;

        container.appendChild(toast);

        window.setTimeout(function () {
            toast.remove();

            if (container.childElementCount === 0) {
                container.remove();
            }
        }, 4000);
    };

    function abrirModal(modal) {
        if (!modal) return;

        modal.classList.add("aberto");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        const controle = modal.querySelector(
            "button, a, input, select, textarea"
        );

        if (controle) {
            controle.focus();
        }
    }

    function fecharModal(modal) {
        if (!modal) return;

        modal.classList.remove("aberto");
        modal.setAttribute("aria-hidden", "true");

        if (!document.querySelector(".modal.aberto")) {
            document.body.style.overflow = "";
        }
    }

    document.querySelectorAll("[data-modal-target]").forEach(function (botao) {
        botao.addEventListener("click", function () {
            const seletor = botao.getAttribute("data-modal-target");

            if (!seletor || !seletor.startsWith("#")) return;

            abrirModal(document.querySelector(seletor));
        });
    });

    document.querySelectorAll("[data-modal-close]").forEach(function (botao) {
        botao.addEventListener("click", function () {
            fecharModal(botao.closest(".modal"));
        });
    });

    document.querySelectorAll(".modal").forEach(function (modal) {
        modal.setAttribute("aria-hidden", "true");

        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                fecharModal(modal);
            }
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            document.querySelectorAll(".modal.aberto").forEach(function (modal) {
                fecharModal(modal);
            });
        }
    });

    window.abrirModal = abrirModal;
    window.fecharModal = fecharModal;
});
