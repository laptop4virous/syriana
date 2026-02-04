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
  const img = document.getElementById("img").value;

  if (!name || !price || !img) { alert("عبي كل الحقول"); return; }

  db.collection("products").add({ name, price: Number(price), img })
    .then(() => {
      document.getElementById("name").value = "";
      document.getElementById("price").value = "";
      document.getElementById("img").value = "";
      renderAdminProducts();
      renderProductsFromFirebase();
    });
}

// ===== عرض المنتجات في لوحة التحكم =====
function renderAdminProducts() {
  adminProducts.innerHTML = "";
  db.collection("products").get().then(snapshot => {
    snapshot.forEach(doc => {
      const p = doc.data();
      adminProducts.innerHTML += `
        <li>
          ${p.name} - ${p.price}$
          <button class="edit" onclick="editProduct('${doc.id}')">تعديل</button>
          <button class="delete" onclick="deleteProduct('${doc.id}')">حذف</button>
        </li>
      `;
    });
  });
}

// ===== حذف منتج =====
function deleteProduct(docId) {
  db.collection("products").doc(docId).delete()
    .then(() => {
      renderAdminProducts();
      renderProductsFromFirebase();
    });
}

// ===== تعديل منتج =====
function editProduct(docId) {
  const docRef = db.collection("products").doc(docId);
  docRef.get().then(doc => {
    if(doc.exists){
      const p = doc.data();
      const newName = prompt("الاسم الجديد:", p.name);
      const newPrice = prompt("السعر الجديد:", p.price);
      const newImg = prompt("رابط الصورة الجديد:", p.img);

      if(newName && newPrice && newImg){
        docRef.update({ name: newName, price: Number(newPrice), img: newImg })
          .then(() => {
            renderAdminProducts();
            renderProductsFromFirebase();
          });
      }
    }
  });
}

// ===== السلة =====
function addToCart(docId) {
  const qty = Number(document.getElementById(`qty-${docId}`).value) || 1;

  db.collection("products").doc(docId).get().then(doc => {
    if(doc.exists){
      const item = { ...doc.data(), qty };
      cart.push(item);
      saveCart();
    }
  });
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

// ===== تسجيل الطلب =====
function saveOrder() {
  if(cart.length === 0){ alert("السلة فارغة!"); return; }
  cart = [];
  saveCart();
  alert("تم تسجيل الطلب بنجاح!");
}

// ===== تشغيل عند التحميل =====
renderProductsFromFirebase();
renderCart();
