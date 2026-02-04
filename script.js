const adminPassword = "1234";
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const cartItems = document.getElementById("cart-items");
const totalText = document.getElementById("total");
const cartCount = document.getElementById("cart-count");
const whatsappBtn = document.getElementById("whatsapp");
const adminProducts = document.getElementById("admin-products");

// --- لوحة التحكم ---
function promptAdmin(){
  const pass = prompt("كلمة مرور الأدمن:");
  if(pass===adminPassword){
    document.getElementById("admin").classList.toggle("hidden");
    renderAdminProducts();
  } else { alert("كلمة المرور خاطئة!"); }
}

// --- عرض المنتجات على الصفحة ---
function renderProducts(){
  const productsDiv = document.getElementById("products");
  productsDiv.innerHTML = "";
  db.collection("products").get().then(snapshot=>{
    snapshot.forEach(doc=>{
      const p = doc.data();
      productsDiv.innerHTML += `
      <div class="product">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>${p.price}$</p>
        <input type="number" value="1" min="1" id="qty-${doc.id}">
        <button onclick="addToCart('${doc.id}')">أضف للسلة</button>
      </div>`;
    });
  });
}

// --- لوحة التحكم ---
function renderAdminProducts(){
  adminProducts.innerHTML = "";
  db.collection("products").get().then(snapshot=>{
    snapshot.forEach(doc=>{
      const p = doc.data();
      adminProducts.innerHTML += `
      <li>
        ${p.name} - ${p.price}$
        <button class="edit" onclick="editProduct('${doc.id}')">تعديل</button>
        <button class="delete" onclick="deleteProduct('${doc.id}')">حذف</button>
      </li>`;
    });
  });
}

function addProduct(){
  const name = document.getElementById("name").value;
  const price = Number(document.getElementById("price").value);
  const img = document.getElementById("img").value;
  if(!name || !price || !img){ alert("عبي كل الحقول"); return; }
  db.collection("products").add({name, price, img})
    .then(()=> { document.getElementById("name").value=""; document.getElementById("price").value=""; document.getElementById("img").value=""; renderProducts(); renderAdminProducts(); });
}

function deleteProduct(id){
  db.collection("products").doc(id).delete().then(()=>{ renderProducts(); renderAdminProducts(); });
}

function editProduct(id){
  const docRef = db.collection("products").doc(id);
  docRef.get().then(doc=>{
    if(doc.exists){
      const p = doc.data();
      const name = prompt("الاسم الجديد:", p.name);
      const price = prompt("السعر الجديد:", p.price);
      const img = prompt("رابط الصورة الجديد:", p.img);
      if(name && price && img){
        docRef.update({name, price:Number(price), img}).then(()=>{ renderProducts(); renderAdminProducts(); });
      }
    }
  });
}

// --- السلة ---
function addToCart(id){
  const qty = Number(document.getElementById(`qty-${id}`).value)||1;
  db.collection("products").doc(id).get().then(doc=>{
    if(doc.exists){
      const item = {...doc.data(), qty};
      cart.push(item); saveCart();
    }
  });
}

function removeFromCart(i){ cart.splice(i,1); saveCart(); }
function saveCart(){ localStorage.setItem("cart",JSON.stringify(cart)); renderCart(); }
function renderCart(){
  cartItems.innerHTML=""; let total=0;
  cart.forEach((item,i)=>{
    total+=item.price*(item.qty||1);
    cartItems.innerHTML+=`<li>${item.name} - ${item.price}$ x ${item.qty||1} <button onclick="removeFromCart(${i})">X</button></li>`;
  });
  totalText.textContent=`المجموع: ${total}$`;
  cartCount.textContent=cart.length;
  const msg = cart.map(p=>`${p.name} - ${p.price}$ x ${p.qty||1}`).join("%0A");
  whatsappBtn.href=`https://wa.me/000000000?text=${msg}%0Aالمجموع:${total}$`;
}

// --- تشغيل عند التحميل ---
renderProducts(); renderCart();
