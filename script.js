// كلمة مرور الأدمن
const adminPassword = "1234";

// قراءة المنتجات والسلة والطلبات من LocalStorage
let products = JSON.parse(localStorage.getItem("products")) || [
  { name: "منتج تجريبي", price: 20, img: "https://via.placeholder.com/200" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

const productsDiv = document.getElementById("products");
const cartItems = document.getElementById("cart-items");
const totalText = document.getElementById("total");
const cartCount = document.getElementById("cart-count");
const whatsappBtn = document.getElementById("whatsapp");
const adminProducts = document.getElementById("admin-products");

// لوحة التحكم بكلمة مرور
function promptAdmin() {
  const pass = prompt("أدخل كلمة مرور الأدمن:");
  if (pass === adminPassword) {
    document.getElementById("admin").classList.toggle("hidden");
    renderAdminProducts();
  } else {
    alert("كلمة المرور خاطئة!");
  }
}

// عرض المنتجات على الصفحة
function renderProducts() {
  productsDiv.innerHTML = "";
  products.forEach((p, index) => {
    productsDiv.innerHTML += `
      <div class="product">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>${p.price}$</p>
        <input type="number" value="1" min="1" id="qty-${index}" onchange="updateCartQty(${index})">
        <button onclick="addToCart(${index})">أضف للسلة</button>
      </div>
    `;
  });
}

// إضافة منتج جديد
function addProduct() {
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const img = document.getElementById("img").value;

  if (!name || !price || !img) { alert("عبي كل الحقول"); return; }

  products.push({ name, price, img });
  saveProducts();

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("img").value = "";
  renderAdminProducts();
}

// حذف منتج
function deleteProduct(index) {
  products.splice(index, 1);
  saveProducts();
  renderAdminProducts();
}

// تعديل منتج
function editProduct(index) {
  const newName = prompt("الاسم الجديد:", products[index].name);
  const newPrice = prompt("السعر الجديد:", products[index].price);
  const newImg = prompt("رابط الصورة الجديد:", products[index].img);
  if(newName && newPrice && newImg){
    products[index] = { name: newName, price: Number(newPrice), img: newImg };
    saveProducts();
    renderAdminProducts();
  }
}

// حفظ المنتجات في LocalStorage
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

// عرض المنتجات في لوحة التحكم
function renderAdminProducts() {
  adminProducts.innerHTML = "";
  products.forEach((p, i) => {
    adminProducts.innerHTML += `
      <li>
        ${p.name} - ${p.price}$
        <button class="edit" onclick="editProduct(${i})">تعديل</button>
        <button class="delete" onclick="deleteProduct(${i})">حذف</button>
      </li>
    `;
  });
}

// إضافة للسلة
function addToCart(index) {
  const qty = Number(document.getElementById(`qty-${index}`).value) || 1;
  const item = { ...products[index], qty };
  cart.push(item);
  saveCart();
}

// تحديث كمية منتج في السلة
function updateCartQty(index) {
  const qty = Number(document.getElementById(`qty-${index}`).value) || 1;
  cart[index].qty = qty;
  saveCart();
}

// إزالة من السلة
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

// حفظ السلة
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// عرض السلة
function renderCart() {
  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    total += item.price * (item.qty || 1);
    cartItems.innerHTML += `
      <li>
        ${item.name} - ${item.price}$ x ${item.qty || 1}
        <button onclick="removeFromCart(${i})">X</button>
      </li>
    `;
  });

  totalText.textContent = `المجموع: ${total}$`;
  cartCount.textContent = cart.length;

  const message = cart.map(p => `${p.name} - ${p.price}$ x ${p.qty || 1}`).join("%0A");
  whatsappBtn.href = `https://wa.me/000000000?text=${message}%0Aالمجموع:${total}$`;
}

// تسجيل الطلب
function saveOrder() {
  if(cart.length === 0) { alert("السلة فارغة!"); return; }
  orders.push(cart);
  localStorage.setItem("orders", JSON.stringify(orders));
  cart = [];
  saveCart();
  alert("تم تسجيل الطلب بنجاح!");
}

// تشغيل عند التحميل
renderProducts();
renderCart();
