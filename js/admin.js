document.addEventListener("DOMContentLoaded", () => {
  const enviosTable = document
    .getElementById("enviosTable")
    .querySelector("tbody");
  const filterOrigen = document.getElementById("filterOrigen");
  const filterDestino = document.getElementById("filterDestino");
  const filterBtn = document.getElementById("filterBtn");
  const menuList = document.querySelector(".menu-list");
  const enviosSection = document.getElementById("enviosSection");
  const usuariosSection = document.getElementById("usuariosSection");
  const openModal = document.getElementById("openModal");
  const userModal = document.getElementById("userModal");
  const closeModal = document.querySelector(".close-modal");
  const crearUser = document.querySelector(".btn-modal-crear");
  const editModal = document.getElementById("editUserModal");
  const closeModalEdit = document.querySelector(".close-modal-edit");
  const username = document.getElementById("modalEditUsername");
  const password = document.getElementById("modalEditPassword");
  const email = document.getElementById("modalEditEmail");
  const address = document.getElementById("modalEditAddress");
  const celular = document.getElementById("modalEditCelular");
  const cedula = document.getElementById("modalEditCedula");
  let envios = [];

  userModal.style.display = "none";
  editModal.style.display = "none";

  async function cargarEnvios() {
    try {
      const response = await fetch("http://localhost:3000/shipments");
      const data = await response.json();
      if (data.status === "success") {
        envios = data.data;
        cargarTabla();
      } else {
        console.error("Error al cargar los envíos: " + data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud fetch: " + error);
    }
  }
  cargarEnvios();
  function cargarTabla() {
    enviosTable.innerHTML = "";
    envios.forEach((envio) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${envio.id}</td>
                <td>${envio.id_user}</td>
                <td>${new Date(envio.shipment_date).toLocaleDateString()}</td>
                <td>${envio.city_a}</td>
                <td>${envio.city_b}</td>
                <td>${envio.weight}</td>
                <td>${envio.broad} x ${envio.large} x ${envio.height}</td>
                <td>${envio.commercial_value}</td>
                <td><button class="btn-detalles" data-id="${
                  envio.id
                }">Detalles</button></td>
            `;
      enviosTable.appendChild(row);
    });
    document.querySelectorAll(".btn-detalles").forEach((button) => {
      button.addEventListener("click", (e) => {
        const envioId = e.target.getAttribute("data-id");
        mostrarDetalles(envioId);
      });
    });
  }
  function crearFila(envio) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${envio.id}</td>
      <td>${envio.id_user}</td>
      <td>${new Date(envio.shipment_date).toLocaleDateString()}</td>
      <td>${envio.city_a}</td>
      <td>${envio.city_b}</td>
      <td>${envio.weight}</td>
      <td>${envio.broad} x ${envio.large} x ${envio.height}</td>
      <td>${envio.commercial_value}</td>
      <td><button class="btn-detalles" data-id="${envio.id}">Detalles</button></td>
    `;
    
    row.querySelector('.btn-detalles').addEventListener('click', () => {
      mostrarDetalles(envio.id);
    });
  
    return row;
  }
  function renderizarTabla(dataToRender) {
    enviosTable.innerHTML = "";
    dataToRender.forEach(envio => {
      const row = crearFila(envio);
      enviosTable.appendChild(row);
    });
  }
  
  function menu(menuElement) {
    const allMenuElements = menuList.querySelectorAll(".menu-btn");
    allMenuElements.forEach((element) => element.classList.remove("active"));
    menuElement.classList.add("active");
    if (menuElement.getAttribute("id") == "menuEnvios") {
      enviosSection.style.display = "block";
      usuariosSection.style.display = "none";
    } else if (menuElement.getAttribute("id") == "menuUsuarios") {
      enviosSection.style.display = "none";
      usuariosSection.style.display = "block";
      cargarUsuarios();
    }
  }
  function crearUsuario() {
    const username = document.getElementById("modalUsername").value;
    const password = document.getElementById("modalPassword").value;
    const email = document.getElementById("modalEmail").value;
    const address = document.getElementById("modalAddress").value;
    const cedula = document.getElementById("modalCedula").value;
    const celular = document.getElementById("modalCelular").value;

    const newUser = {
      username: username,
      email: email,
      address: address,
      document: cedula,
      cellphone: celular,
      password: password,
    };

    fetch("http://localhost:3000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.status === "success") {
          cargarUsuarios();

          userModal.style.display = "none";

          document.getElementById("modalUsername").value = "";
          document.getElementById("modalPassword").value = "";
          document.getElementById("modalEmail").value = "";
          document.getElementById("modalAddress").value = "";
          document.getElementById("modalCedula").value = "";
          document.getElementById("modalCelular").value = "";

          console.log("Usuario agregado:", newUser);
        } else {
          console.error("Error al crear el usuario:", result.message);
        }
      })
      .catch((error) => {
        console.error("Error al crear el usuario:", error);
      });
  }
  function cargarUsuarios() {
    const tUsers = document.querySelector(".users");
    tUsers.innerHTML = "";
    fetch("http://localhost:3000/users")
      .then((response) => response.json())
      .then((data) => {
        const users = data.data || [];
        for (let i = 0; i < users.length; i++) {
          const element = users[i];
          let structure = `
            <tr>
                <td>${element.username}</td>
                <td>${element.email}</td>
                <td>${element.address}</td>
                <td>${element.document}</td>
                <td>${element.cellphone}</td>
                <td>${element.password}</td>
                <td>
                    <button class="btn-edit" data-index="${i}">Editar</button>
                    <button class="btn-delete" data-index="${i}">Eliminar</button>
                </td>
            </tr>
        `;
          tUsers.innerHTML += structure;
        }

        let deltBtn = document.querySelectorAll(".btn-delete");
        let editBtn = document.querySelectorAll(".btn-edit");

        deltBtn.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const userIndex = e.target.getAttribute("data-index");
            const userId = users[userIndex].id;
            fetch(`http://localhost:3000/users/${userId}`, {
              method: "DELETE",
            })
              .then((response) => response.json())
              .then((result) => {
                if (result.status === "success") {
                  cargarUsuarios();
                }
              });
          });
        });
        editBtn.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            editModal.style.display = "flex";
            const userIndex = e.target.getAttribute("data-index");
            const user = users[userIndex];
            username.value = user.username;
            password.value = user.password;
            email.value = user.email;
            address.value = user.address;
            celular.value = user.cellphone;
            cedula.value = user.document;

            const btnActualizar = document.querySelector(".btn-modal-editar");
            btnActualizar.addEventListener("click", (e) => {
              e.preventDefault();
              const updatedUser = {
                username: username.value,
                password: password.value,
                email: email.value,
                address: address.value,
                cellphone: celular.value,
                document: cedula.value,
              };

              fetch(`http://localhost:3000/users/${user.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
              })
                .then((response) => response.json())
                .then((result) => {
                  if (result.status === "success") {
                    editModal.style.display = "none";
                    cargarUsuarios();
                  }
                });
            });
          });
        });
      })
      .catch((error) => {
        console.error("Error al cargar los usuarios:", error);
      });
  }
  cargarTabla();
  cargarUsuarios();
  function mostrarDetalles(envioId) {
    const envio = envios.find((e) => e.id == envioId);
    if (envio) {
      const fechaEnvio = envio.shipment_date
        ? new Date(envio.shipment_date).toLocaleDateString()
        : "Fecha no disponible";
      const origen = envio.city_a || "Origen no disponible";
      const destino = envio.city_b || "Destino no disponible";
      const peso = envio.weight || "Peso no disponible";
      const dimensiones = `${envio.broad || "N/A"} x ${
        envio.large || "N/A"
      } x ${envio.height || "N/A"}`;
      const valorComercial = envio.commercial_value
        ? envio.commercial_value.toLocaleString()
        : "Valor no disponible";
      const modal = document.createElement("div");
      modal.classList.add("modal");
      modal.innerHTML = `
                <div class="modal-content">
                    <h2>Detalles del Envío</h2>
                    <p><strong>Fecha:</strong> ${fechaEnvio}</p>
                    <p><strong>Origen:</strong> ${origen}</p>
                    <p><strong>Destino:</strong> ${destino}</p>
                    <p><strong>Peso:</strong> ${peso} kg</p>
                    <p><strong>Dimensiones:</strong> ${dimensiones}</p>
                    <p><strong>Valor Comercial:</strong> $${valorComercial}</p>
                    <button id="cerrarModal">Cerrar</button>
                </div>
            `;
      document.body.appendChild(modal);
      document.getElementById("cerrarModal").addEventListener("click", () => {
        modal.remove();
      });
      modal.style.position = "fixed";
      modal.style.top = "0";
      modal.style.left = "0";
      modal.style.width = "100%";
      modal.style.height = "100%";
      modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      modal.style.display = "flex";
      modal.style.justifyContent = "center";
      modal.style.alignItems = "center";
      const modalContent = modal.querySelector(".modal-content");
      modalContent.style.backgroundColor = "#fff";
      modalContent.style.padding = "20px";
      modalContent.style.borderRadius = "8px";
      modalContent.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
      modalContent.style.textAlign = "center";
      modalContent.style.width = "90%";
      modalContent.style.maxWidth = "400px";
    } else {
      console.error("Envío no encontrado");
    }
  }
  filterBtn.addEventListener("click", () => {
    const origen = filterOrigen.value.trim().toLowerCase();
    const destino = filterDestino.value.trim().toLowerCase();
  
    const filtrados = envios.filter(envio => 
      (origen === "" || envio.city_a.toLowerCase().includes(origen)) &&
      (destino === "" || envio.city_b.toLowerCase().includes(destino))
    );
  
    renderizarTabla(filtrados);
  });
  
  menuList.addEventListener("click", (e) => {
    let menuElement = e.target;
    menu(menuElement);
  });
  openModal.addEventListener("click", () => {
    userModal.style.display = "flex";
  });
  closeModal.addEventListener("click", () => {
    userModal.style.display = "none";
  });
  closeModalEdit.addEventListener("click", () => {
    editModal.style.display = "none";
  });
  crearUser.addEventListener("click", (e) => {
    e.preventDefault();
    crearUsuario();
    cargarUsuarios();
  });
});
