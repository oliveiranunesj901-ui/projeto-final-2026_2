document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ANO DO RODAPÉ
    ========================= */

    const ano = document.getElementById("ano");

    if (ano) {
        ano.textContent = new Date().getFullYear();
    }


    /* =========================
       MENU MOBILE
    ========================= */

    const toggle = document.querySelector(".menu-toggle");
    const menu = document.getElementById("menu");

    if (toggle && menu) {

        toggle.addEventListener("click", () => {

            const aberto = menu.classList.toggle("open");

            toggle.setAttribute(
                "aria-expanded",
                aberto
            );

            toggle.textContent = aberto
                ? "✕"
                : "☰";

        });


        /* Fecha o menu ao clicar em um link */

        const links = menu.querySelectorAll("a");

        links.forEach(link => {

            link.addEventListener("click", () => {

                menu.classList.remove("open");

                toggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                toggle.textContent = "☰";

            });

        });

    }


    /* =========================
       FORMULÁRIO
    ========================= */

    const form = document.getElementById("contactForm");

    const feedback = document.getElementById("feedback");


    if (form && feedback) {

        form.addEventListener("submit", (event) => {

            event.preventDefault();


            const nome =
                document.getElementById("nome")
                .value
                .trim();


            const email =
                document.getElementById("email")
                .value
                .trim();


            const mensagem =
                document.getElementById("mensagem")
                .value
                .trim();


            /* Validação do e-mail */

            const emailValido =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(email);


            feedback.style.display = "block";


            /* Verifica os campos */

            if (
                !nome ||
                !emailValido ||
                !mensagem
            ) {

                feedback.classList.add("error");

                feedback.textContent =
                    "Preencha seu nome, um e-mail válido e uma mensagem.";

                return;
            }


            /* Mensagem de sucesso */

            feedback.classList.remove("error");

            feedback.textContent =
                `Obrigado, ${nome}! Sua solicitação foi registrada.`;


            /* Limpa o formulário */

            form.reset();

        });

    }

});