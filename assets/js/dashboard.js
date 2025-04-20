document.addEventListener("DOMContentLoaded", function () {
    updateUserType();
});

function updateUserType() {
    const userEmail = sessionStorage.getItem("userEmail");
    const userTypeElement = document.getElementById("user-type");

    if (userTypeElement) {
        userTypeElement.textContent = (userEmail === "invitado@upaep.edu.mx") ? "Invitado" : "Administrativo";
    }
}

function loadPeriodos() {
    const selectPeriodo = document.getElementById("periodo");
    if (!selectPeriodo) return;

    selectPeriodo.innerHTML = ""; // Limpia opciones anteriores
    const defaultOption = document.createElement("option");
    defaultOption.textContent = "Seleccione opción";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectPeriodo.appendChild(defaultOption);

    fetch("../backend/api/getPeriodos.php")
        .then(response => response.json())
        .then(periodos => {
            periodos.forEach(periodo => {
                const option = document.createElement("option");
                option.value = periodo;
                option.textContent = periodo;
                selectPeriodo.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar periodos:", error));
}

function loadProgramas() {
    const selectPrograma = document.getElementById("programa");
    if (!selectPrograma) return;

    selectPrograma.innerHTML = ""; // Limpia opciones anteriores
    const defaultOption = document.createElement("option");
    defaultOption.textContent = "Seleccione opción";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectPrograma.appendChild(defaultOption);

    fetch("../backend/api/getProgramas.php")
        .then(response => response.json())
        .then(programas => {
            programas.forEach(programa => {
                const option = document.createElement("option");
                option.value = programa;
                option.textContent = programa;
                selectPrograma.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar programas:", error));
}