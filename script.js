let total = 0;
const cart = document.getElementById("cart");
const totalText = document.getElementById("total");

function addToCart(name, price) {
  const li = document.createElement("li");
  li.textContent = `${name} - ${price}$`;
  cart.appendChild(li);

  total += price;
  totalText.textContent = `المجموع: ${total}$`;
}
