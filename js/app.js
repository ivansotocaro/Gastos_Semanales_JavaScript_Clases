const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

window.addEventListener("load", function () {
  preguntarPresupuesto();
  formulario.addEventListener("submit", agregarGasto);
});

// Clases
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos.push(gasto);
    this.calcularRestante();
  }

  calcularRestante() {
    let gastado = this.gastos.reduce(
      (total, gasto) => total + gasto.cantidad,
      0
    );
    this.restante = this.presupuesto - gastado;
    if (this.restante > 0) {
      formulario.querySelector('button[type="submit"]').disabled = false;
    }
  }

  eliminarGastos(id) {
    const data = this.gastos.filter((gasto) => gasto.id !== id);
    this.gastos = [...data];
    this.calcularRestante();
  }
}

class UI {
  insertarPresupuesto({ presupuesto, restante }) {
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {
    // Crear div
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert");

    if (tipo == "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    // Agregar mensaje
    divMensaje.textContent = mensaje;
    // Insertar en el html
    document.querySelector(".primario").insertBefore(divMensaje, formulario);
    // Eliminar mensaje
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  listarGastos({ gastos }) {
    this.limpiarHTML();

    gastos.forEach((gasto) => {
      // Crear Li
      const li = document.createElement("li");

      // Agregar al HTML del gasto
      li.className =
        "list-group-item d-flex justify-content-between align-items-center mb-2";

      li.dataset.id = gasto.id;

      li.innerHTML = `${gasto.nombre} <span class='badge badge-primary badge-pill'>$${gasto.cantidad} </span>`;
      // Botton para borrar gasto
      const btnBorrar = document.createElement("button");
      btnBorrar.classList.add("btn", "btn-danger", "borrar-gasto");
      btnBorrar.textContent = "Borrar";
      btnBorrar.onclick = () => {
        eliminarGastos(gasto.id);
      };
      li.appendChild(btnBorrar);
      // Agregarlo al HTMl
      gastoListado.appendChild(li);
    });
  }

  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actualizarRestante({ restante }) {
    document.querySelector("#restante").textContent = restante;
  }

  comprobarPresupuesto({ presupuesto, restante }) {
    const restanteDiv = document.querySelector(".restante");

    // Comprobar el 25%
    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");
    } else if (presupuesto / 2 > restante) {
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }

    if (restante <= 0) {
      ui.imprimirAlerta("El presupuesto se ha agotado", "error");
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}

// Instanciar
const ui = new UI();
let presupuesto;

// Function
function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("¿Cúal es tu presupuesto? ");

  if (
    presupuestoUsuario == "" ||
    presupuestoUsuario == null ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario == 0
  ) {
    location.reload();
  } else {
    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
  }
}

// Agregar gastos
function agregarGasto(e) {
  e.preventDefault();

  // Leer datos
  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);
  // Validar campos
  if (nombre == "" || cantidad == "") {
    ui.imprimirAlerta("Ambos campos son obligatorios", "error");
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta("Cantidad no valida", "error");
  } else if (nombre <= 0 || nombre >= 0) {
    ui.imprimirAlerta("El nombre del gatos no es valido", "error");
    console.log(nombre);
  } else {
    const gasto = { nombre, cantidad, id: Date.now() };
    // Agregar un nuevo gastos
    presupuesto.nuevoGasto(gasto);

    // Mostrar mensaje en pantalla
    ui.imprimirAlerta("Gasto agregado correctamente");

    // Reiniciar formulario
    formulario.reset();

    // Listar gastos
    ui.listarGastos(presupuesto);

    // Actualiar restante
    ui.actualizarRestante(presupuesto);

    //
    ui.comprobarPresupuesto(presupuesto);
  }
}

function eliminarGastos(id) {
  presupuesto.eliminarGastos(id);
  ui.listarGastos(presupuesto);
  ui.actualizarRestante(presupuesto);
  ui.comprobarPresupuesto(presupuesto);
}
