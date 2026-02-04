// كلمة مرور الأدمن
const adminPassword = "1234";

const cartItems = document.getElementById("cart-items");
const totalText = document.getElementById("total");
const cartCount = document.getElementById("cart-count");
const whatsappBtn = document.getElementById("whatsapp");
const productsDiv = document.getElementById("products");
const adminProducts = document.getElementById("admin-products");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKHxD3W3Ei0-vEPFAyq6tpWt1xobV0Lg4",
  authDomain: "syriana-83fc8.firebaseapp.com",
  projectId: "syriana-83fc8",
  storageBucket: "syriana-83fc8.firebasestorage.app",
  messagingSenderId: "424965345616",
  appId: "1:424965345616:web:01a1d4f69602901c35dc55"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// لوحة التحكم بكلمة مرور
function promptAdmin() {
  const pass = prompt("أدخل كلمة مرور الأدمن:");
  if (pass === adminPassword) {
    document.getElementById("admin").classList.toggle("hidden");
  } else {
    alert("كلمة المرور خاطئة!");
  }
}

// Listener للمنتجات بشكل حي
db.collection("products").onSnapshot((snapshot) => {
  renderProducts(snapshot);
  renderAdminProducts(snapshot);
});

// عرض المنتجات
function renderProducts(snapshot) {
  productsDiv.innerHTML = "";
  snapshot.forEach((doc) => {
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
}

// عرض المنتجات في لوحة التحكم
function renderAdminProducts(snapshot) {
  adminProducts.innerHTML = "";
  snapshot.forEach((doc) => {
    const p = doc.data();
    adminProducts.innerHTML += `
      <li>
        ${p.name} - ${p.price}$
        <button class="edit" onclick="editProduct('${doc.id}')">تعديل</button>
        <button class="delete" onclick="deleteProduct('${doc.id}')">حذف</button>
      </li>
    `;
  });
}

// إضافة منتج جديد
function addProduct() {
  const name = document.getElementById("name").value;
  const price = Number(document.getElementById("price").value);
  const img = document.getElementById("img").value;

  if (!name || !price || !img) { alert("عبي كل الحقول"); return; }

  db.collection("products").add({ name, price, img })
    .then(() => {
      document.getElementById("name").value = "";
      document.getElementById("price").value = "";
      document.getElementById("img").value = "";
    });
}

// تعديل منتج
function editProduct(id) {
  const docRef = db.collection("products").doc(id);
  docRef.get().then(doc => {
    if (!doc.exists) return;
    const newName = prompt("الاسم الجديد:", doc.data().name);
    const newPrice = prompt("السعر الجديد:", doc.data().price);
    const newImg = prompt("رابط الصورة الجديد:", doc.data().img);
    if(newName && newPrice && newImg){
      docRef.update({ name: newName, price: Number(newPrice), img: newImg });
    }
  });
}

// حذف منتج
function deleteProduct(id) {
  db.collection("products").doc(id).delete();
}

// إضافة للسلة
function addToCart(id) {
  const qty = Number(document.getElementById(`qty-${id}`).value) || 1;
  db.collection("products").doc(id).get().then(doc => {
    const item = { ...doc.data(), qty };
    cart.push(item);
    saveCart();
  });
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

// تشغيل عند التحميل
renderCart();
