body {
  margin: 0;
  font-family: Tahoma;
  background: #f2f2f2;
  direction: rtl;
}

header {
  background: #111;
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#cart-count {
  background: red;
  padding: 5px 10px;
  border-radius: 50%;
}

main {
  display: flex;
  gap: 20px;
  padding: 20px;
}

.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px,1fr));
  gap: 20px;
  flex: 3;
}

.product {
  background: white;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
}

.product img {
  width: 100%;
  border-radius: 10px;
}

.product button {
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  background: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}

.cart {
  flex: 1;
  background: white;
  padding: 15px;
  border-radius: 10px;
}

.cart li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.cart button {
  background: red;
  color: white;
  border: none;
  cursor: pointer;
}

#whatsapp {
  display: block;
  margin-top: 15px;
  background: #25D366;
  color: white;
  text-align: center;
  padding: 10px;
  text-decoration: none;
}
