Swal.fire("Bienvenido a la inscripción de pacientes!");

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formulario");
  const tablaPacientes = document.getElementById("tablaPacientes");
  let filtroEdad = null;
  let pacientes = [];

  const pacientesGuardados = localStorage.getItem("pacientes");
  if (pacientesGuardados) {
    pacientes = JSON.parse(pacientesGuardados);
    pacientes.forEach(function (paciente) {
      agregarPacienteATabla(paciente);
    });
  }

  formulario.addEventListener("submit", function (event) {
    event.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const edad = document.getElementById("edad").value;

    if (nombre && apellido && edad) {
      const paciente = {
        nombre: nombre,
        apellido: apellido,
        edad: edad,
      };

      pacientes.push(paciente);
      agregarPacienteATabla(paciente);

      localStorage.setItem("pacientes", JSON.stringify(pacientes));

      document.getElementById("nombre").value = "";
      document.getElementById("apellido").value = "";
      document.getElementById("edad").value = "";

      setTimeout(function () {
        limpiarFormularioYDatos();
      }, 5 * 60 * 1000);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "¡El paciente ha sido registrado exitosamente!",
        showConfirmButton: false,
        timer: 1500,
      });

      enviarDatosAlServidor(paciente);
    } else {
      alert("Por favor, completa todos los campos del formulario.");
    }
  });

  function enviarDatosAlServidor(paciente) {
    const url = "https://jsonplaceholder.typicode.com/posts";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paciente),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Datos enviados exitosamente:", data);
      })
      .catch(error => {
        console.error("Error al enviar los datos:", error);
      });
  }

  function agregarPacienteATabla(paciente) {
    const fila = tablaPacientes.insertRow();
    const celdaNombre = fila.insertCell(0);
    const celdaApellido = fila.insertCell(1);
    const celdaEdad = fila.insertCell(2);

    celdaNombre.textContent = paciente.nombre;
    celdaApellido.textContent = paciente.apellido;
    celdaEdad.textContent = paciente.edad;
  }

  function actualizarTabla() {
    limpiarTabla();
    pacientes.forEach(function (paciente) {
      if (filtroEdad === null || paciente.edad == filtroEdad) {
        agregarPacienteATabla(paciente);
      }
    });
  }

  function limpiarTabla() {
    while (tablaPacientes.rows.length > 1) {
      tablaPacientes.deleteRow(1);
    }
  }

  document.getElementById("btnFiltrar").addEventListener("click", function () {
    filtroEdad = parseInt(document.getElementById("filtroEdad").value);
    actualizarTabla();
  });

  document.getElementById("btnResetFiltro").addEventListener("click", function () {
    filtroEdad = null;
    actualizarTabla();
    document.getElementById("filtroEdad").value = "";
  });

  document.getElementById("btnLimpiarFormulario").addEventListener("click", function () {
    limpiarFormularioYDatos();
  });

  function limpiarFormularioYDatos() {
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("edad").value = "";

    localStorage.removeItem("pacientes");

    limpiarTabla();
  }
});
