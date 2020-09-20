var novoCart = JSON.parse(localStorage.getItem("cart"));

function mostrarCarrinho() {
  var novaCart = "";
  novoCart.map((cart) => {
    let price = cart.price.toLocaleString("pt-BR");
    novaCart += `
        <div class="carrinhoProduto">
            <img src=${cart.image} alt=${cart.title}>               
            <div class="produtoPrecoName">
                <h2>${cart.title}</h2>
                <p>R$ ${price}</p>
            </div>
            <div class="buttonNumber">
                <button onclick="carrinhoMenos(${cart.id})" class="buttonA">-</button><input typy="number" class="inputClass" min=1 value=${cart.quantity}><button onclick="carrinhoMais(${cart.id})" class="buttonB">+</button> 
            </div>                
            <button onclick="DeleteCarrinho(${cart.id})">Remover do carrinho</button>
        </div>                   
         `;
  });
  let carrinho = document.querySelector(".carrinho");
  carrinho.innerHTML = novaCart;

  let subTotal = 0;
  novoCart.forEach((element) => {
    subTotal += element.price;
  });

  document.querySelector(
    ".valorTotal"
  ).innerHTML = `<h3>Valor total da comprar: R$ ${subTotal.toLocaleString(
    "pt-BR"
  )}</h3>`;
  if (novoCart.length <= 0) {
    document.querySelector(".notCarrinho").innerHTML =
      "<h2>Não há produto no carrinho</h2>";
  }
}

mostrarCarrinho();
function DeleteCarrinho(id) {
  localStorage.removeItem("cart");
  for (var i = novoCart.length - 1; i >= 0; i--) {
    if (novoCart[i].id === id) {
      novoCart.splice(i, 1);
    }
  }
  localStorage.setItem("cart", JSON.stringify(novoCart));

  mostrarCarrinho();
}

function carrinhoMenos(ID) {
  var currentCarts = JSON.parse(localStorage.getItem("cart"));

  var currentPreco = 0;
  currentCarts.forEach((element) => {
    if (element.id === ID) {
      currentPreco = element.price;
    }
  });
  novoCart.forEach((element) => {
    if (element.id === ID) {
      if (element.quantity > 1) {
        element.quantity = element.quantity - 1;
        element.price -= currentPreco;
      }
    }
  });
  mostrarCarrinho();
}
function carrinhoMais(ID) {
  var currentCarts = JSON.parse(localStorage.getItem("cart"));

  var currentPreco = 0;
  currentCarts.forEach((element) => {
    if (element.id === ID) {
      currentPreco = element.price;
    }
  });

  novoCart.forEach((element) => {
    if (element.id === ID) {
      element.quantity = element.quantity + 1;
      if (element.quantity > 1) {
        element.price = element.price + currentPreco;
      }
    }
  });

  mostrarCarrinho();
}
