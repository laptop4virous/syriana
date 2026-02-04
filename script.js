// ===== كلمة مرور الأدمن =====
const adminPassword = "1234";

// ===== السلة =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItems = document.getElementById("cart-items");
const totalText = document.getElementById("total");
const cartCount = document.getElementById("cart-count");
const whatsappBtn = document.getElementById("whatsapp");

// لوحة التحكم
const adminProducts = document.getElementById("admin-products");

// ===== لوحة التحكم بكلمة مرور =====
function promptAdmin() {
  const pass = prompt("أدخل كلمة مرور الأدمن:");
  if (pass === adminPassword) {
    document.getElementById("admin").classList.toggle("hidden");
    renderAdminProducts();
  } else {
    alert("كلمة المرور خاطئة!");
  }
}

// ===== عرض المنتجات على الصفحة =====
function renderProductsFromFirebase() {
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "";

  db.collection("products").get().then(snapshot => {
    snapshot.forEach(doc => {
      const p = doc.data();
      productsDiv.innerHTML += `
        <div class="product">
          <img src="${p.img}">
          <h3>${p.name}</h3>
          <p>${p.price}$</p>
          <input type="number" value="1" min="1" id="qty-${doc.id}">
          <button onclick="addToCart('${doc.id}')">أضف للسلة</button>
        </div>
      `;
    });
  });
}

// ===== إضافة منتج جديد =====
function addProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const img = document.getElementById("
