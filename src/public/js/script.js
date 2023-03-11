const socket = io();
const cardsContainer = document.getElementById("cards");

const title = document.getElementById("title");
const description = document.getElementById("description");
const code = document.getElementById("code");
const stock = document.getElementById("stock");
const category = document.getElementById("category");
const price = document.getElementById("price");
const submit = document.getElementById("submit");

const clear = (...prods) => prods.some((prod) => !prod);

const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};

const resetForm = () => {
  title.value = ""; description.value = ""; code.value = ""; stock.value = ""; category.value = ""; price.value = ""; files.value = "";
};

const render = (data) => {
  cardsContainer.innerHTML = "";
  data.forEach((product) => {
    cardsContainer.innerHTML += `
      <div class="d-flex flex-column align-items-start justify-content-between align-text-bottom border border-bottom-0 border-end-0 border-start-0 border-secondary p-3 mb-3 bg-dark cards">
        <h5 class="text-light">${product.title}</h5>
        <p class="text-light">${product.description}</p>
        <p class="text-light">${product.price}</p>
        <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">
          Eliminar
        </button>
      </div>
    `;
  });
};

submit.addEventListener("click", (e) => {
  e.preventDefault();

  if (clear(title.value, description.value, code.value, stock.value, category.value, price.value)) {
    Swal.fire(
      'Oops..!',
      'All fields are required!',
      'error'
    );
  } else {
    const newProduct = { title: title.value, description: description.value, code: code.value, stock: stock.value, category: category.value, price: price.value };
    socket.emit("addProduct", newProduct);

    Swal.fire(
      'Great!',
      'Product added!',
      'success'
    );

    resetForm();
  }
});

socket.on("newProduct", (data) => {
  render(data);
});