window.onload = function () {
  const modal = document.getElementById("productModal");
  const btn = document.getElementById("newProduct");
  const span = document.getElementsByClassName("close")[0];
  const form = document.getElementById("productForm");
  const productList = document.getElementById("productList");
  const search = document.getElementById("search");

  if (localStorage.getItem("products") === null) {
    localStorage.setItem("products", JSON.stringify([]));
  } else {
    const products = JSON.parse(localStorage.getItem("products"));
    products.forEach(product => {
      addProductToDOM(product);
    });
  }

 

  span.onclick = function () {
    modal.style.display = "none";
  }

  btn.onclick = function () {
    modal.style.display = "block";
  }
  
  window.onclick = function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  }

  form.onsubmit = function (event) {
    event.preventDefault();
    const product = {
      img: document.getElementById('img').value,
      title: document.getElementById('title').value,
      price: document.getElementById('price').value,
      number: document.getElementById('number').value
    }
    addProductToDOM(product);
    addProductToLocalStorage(product);
    modal.style.display = "none";
    form.reset();
  }

  productList.addEventListener('click', function (event) {
    if (event.target.classList.contains('delete')) {
      const productElement = event.target.parentElement.parentElement;
      const title = productElement.querySelector('.title').textContent;
      removeProductFromDOM(productElement);
      removeProductFromLocalStorage(title);
    }
    if (event.target.classList.contains('edit')) {
      const productElement = event.target.parentElement.parentElement;
      const title = productElement.querySelector('.title').textContent;
      const price = productElement.querySelector('.price').textContent;
      const number = productElement.querySelector('.number').textContent;
      editProduct(productElement, title, price, number);
    }
  });

  function addProductToDOM(product) {
    const productEl = document.createElement('div');
    productEl.classList.add('product');
    productEl.innerHTML = `
            <img src="${product.img}" alt="${product.title}" width="100" height="100">
            <div class="details">
              <h2 class="title">${product.title}</h2>
            <p class="price">${product.price}</p>
            <p class="number">${product.number}</p>
            <button class="edit">Düzenle</button>
            <button class="delete">Sil</button>
            </div>
        `;
    productList.appendChild(productEl);
  }

  function addProductToLocalStorage(product) {
    let products = JSON.parse(localStorage.getItem("products"));
    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));
  }

  function removeProductFromDOM(productElement) {
    productList.removeChild(productElement);
  }

  function removeProductFromLocalStorage(title) {
    let products = JSON.parse(localStorage.getItem("products"));
    products = products.filter(product => product.title !== title);
    localStorage.setItem("products", JSON.stringify(products));
  }

  function editProduct(productElement, title, price, number) {
    const newTitle = prompt("Yeni başlık:", title);
    const newPrice = prompt("Yeni fiyat:", price);
    const newNumber = prompt("Yeni numara:", number);
    if (newTitle && newPrice && newNumber) {
      productElement.querySelector('.title').textContent = newTitle;
      productElement.querySelector('.price').textContent = newPrice;
      productElement.querySelector('.number').textContent = newNumber;
      updateProductInLocalStorage(title, newTitle, newPrice, newNumber);
    }
  }

  function updateProductInLocalStorage(oldTitle, newTitle, price, number) {
    let products = JSON.parse(localStorage.getItem("products"));
    const index = products.findIndex(product => product.title === oldTitle);
    if (index !== -1) {
      products[index].title = newTitle;
      products[index].price = price;
      products[index].number = number;
      localStorage.setItem("products", JSON.stringify(products));
    }
  }

  search.onkeyup = function (event) {
    const value = event.target.value;
    const products = JSON.parse(localStorage.getItem("products"));
    const filteredProducts = products.filter(product => product.title.toLowerCase().includes(value.toLowerCase()));
    productList.innerHTML = '';
    filteredProducts.forEach(product => {
      addProductToDOM(product);
    });
  }
}
