let products = JSON.parse(localStorage.getItem("products")) || [
  { id: 1, name: "منتج تجريبي", price: 20, img: "https://via.placeholder.com/200" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productsDiv = document.getElementById("products");
const cartItems = document.getElementById("cart-items");
const totalText = document.getElementById("total");
const whatsappBtn = document.getElementById("whatsapp");

function toggleAdmin() {
  document.getElementById("admin").classList.toggle("hidden");
}

function renderProducts() {
  productsDiv.innerHTML = "";
  products.forEach((p, index) => {
    productsDiv.innerHTML += `
      <div class="product">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>${p.price}$</p>
        <button onclick="addToCart(${index})">أضف للسلة</button>
        <button onclick="deleteProduct(${index})" style="background:red">حذف</button>
      </div>
    `;
  });
}

function addProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const img = document.getElementById("img").value;

  if (!name || !price || !img) {
    alert("عبي كل الحقول");
    return;
  }

  products.push({ name, price, img });
  saveProducts();

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("img").value = "";
}

function deleteProduct(index) {
  products.splice(index, 1);
  saveProducts();
}

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

function addToCart(index) {
  cart.push(products[index]);
  saveCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    total += Number(item.price);
    cartItems.innerHTML += `
      <li>
        ${item.name}
        <button onclick="removeFromCart(${i})">X</button>
      </li>
    `;
  });

  totalText.textContent = `المجموع: ${total}$`;
  const message = cart.map(p => `${p.name} - ${p.price}$`).join("%0A");
  whatsappBtn.href = `https://wa.me/000000000?text=${message}%0Aالمجموع:${total}$`;
}

renderProducts();
renderCart();
