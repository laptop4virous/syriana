import { db } from './index.html';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const adminPassword = "1234";

const productsCol = collection(db, "products");

const productsDiv = document.getElementById("products");
const cartItems = document.getElementById("cart-items");
const totalText = document.getElementById("total");
const cartCount = document.getElementById("cart-count");
const whatsappBtn = document.getElementById("whatsapp");
const adminProducts = document.getElementById("admin-products");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function promptAdmin() {
  const pass = prompt("أدخل كلمة مرور الأدمن:");
  if (pass === adminPassword) {
    document.getElementById("admin").classList.toggle("hidden");
    renderAdminProducts();
  } else {
    alert("كلمة المرور خاطئة!");
  }
}

// جلب المنتجات وعرضها مباشرة عند التغيير
onSnapshot(productsCol, (snapshot) => {
  const products = [];
  snapshot.forEach(docSnap => {
    products.push({ id: docSnap.id, ...docSnap.data() });
  });
  renderProducts(products);
  renderAdminProducts(products);
});

// عرض المنتجات
function renderProducts(products) {
  productsDiv.innerHTML = "";
  products.forEach((p) => {
    productsDiv.innerHTML += `
      <div class="product">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>${p.price}$</p>
        <input type="number" value="1" min="1" id="qty-${p.id}" onchange="updateCartQty('${p.id}')">
        <button onclick="addToCart('${p.id}', '${p.name}', ${p.price}, '${p.img}')">أضف للسلة</button>
      </div>
    `;
  });
}

// لوحة التحكم
function renderAdminProducts() {
  getDocs(productsCol).then(snapshot => {
    const products = [];
    snapshot.forEach(docSnap => products.push({ id: docSnap.id, ...docSnap.data() }));
    adminProducts.innerHTML = "";
    products.forEach((p) => {
      adminProducts.innerHTML += `
        <li>
          ${p.name} - ${p.price}$
          <button class="edit" onclick="editProduct('${p.id}', '${p.name}', ${p.price}, '${p.img}')">تعديل</button>
          <button class="delete" onclick="deleteProduct('${p.id}')">حذف</button>
        </li>
      `;
    });
  });
}

// إضافة منتج جديد
window.addProduct = async function() {
  const name = document.getElementById("name").value;
  const price = Number(document.getElementById("price").value);
  const img = document.getElementById("img").value;

  if (!name || !price || !img) { alert("عبي كل الحقول"); return; }

  await addDoc(productsCol, { name, price, img });

  document.getElementById("name").value = "";
  document.getElementById("price").value = "";
  document.getElementById("img").value = "";
};

// تعديل منتج
window.editProduct = async function(id, oldName, oldPrice, oldImg) {
  const newName = prompt("الاسم الجديد:", oldName);
  const newPrice = prompt("السعر الجديد:", oldPrice);
  const newImg = prompt("رابط الصورة الجديد:", oldImg);
  if (newName && newPrice && newImg) {
    const productDoc = doc(db, "products", id);
    await updateDoc(productDoc, { name: newName, price: Number(newPrice), img: newImg });
  }
};

// حذف منتج
window.deleteProduct = async function(id) {
  const productDoc = doc(db, "products", id);
  await deleteDoc(productDoc);
};

// إضافة للسلة
window.addToCart = function(id, name, price, img) {
  const qty = Number(document.getElementById(`qty-${id}`).value) || 1;
  const item = { id, name, price, img, qty };
  cart.push(item);
  saveCart();
};

// تحديث كمية المنتج في السلة
window.updateCartQty = function(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty = Number(document.getElementById(`qty-${id}`).value);
  saveCart();
};

// إزالة من السلة
window.removeFromCart = function(index) {
  cart.splice(index, 1);
  saveCart();
};

// حفظ وعرض السلة
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
