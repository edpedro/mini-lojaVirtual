function showPageLoading(bool) {
  if (bool) {
    document.getElementById("showLoad").style.display = "block";
  } else {
    document.getElementById("loader").style.display = "none";
  }
}

function getList() {
  showPageLoading(true);
  fetch("https://fakestoreapi.com/products")
    .then((res) => res.json())
    .then((product) => {
      //Incrementar a quantidade no array para cada item
      const result = product.map((value) => {
        const ajust = Object.assign({}, value);
        ajust.quantity = 1;
        return ajust;
      });

      state(result);
      carts.push(result);
      showPageLoading(false);
    });
}
getList();

var carts = [];
var localData = localStorage.getItem("cart");
var novoCarrnho = localData ? JSON.parse(localData) : [];

function lista(products, pageQuery, resultPagination) {
  var novaProduto = "";
  products.map((product) => {
    //Ajustar tamanho da title
    let novoTitle = product.title;
    if (novoTitle.length > 60) {
      novoTitle = novoTitle.substring(0, 60) + "...";
    }
    var price = product.price.toLocaleString("pt-BR");
    novaProduto += ` 
        <div class="product">                       
        <img src=${product.image} alt=${product.title}> 
        <div>    
            <hr>            
                <i class="material-icons" onclick="carrinho(${product.id})">
                shopping_cart
                </i>        
            </hr>
        </div>               
            <div class="textPrice">            
                <h4>R$ ${price}</h4>
                
                ${
                  price > 50
                    ? `<p>12x R$ ${parseFloat(product.price / 12)
                        .toLocaleString("pt-BR")
                        .toFixed(2)}</p>`
                    : `<p>4x R$ ${parseFloat(product.price / 4).toFixed(2)}</p>`
                }
                          
            </div>                    
            <div class="textTitle"><h3>${novoTitle}</h3></div>      
                  
        </div>
`;
  });

  if (parseInt(pageQuery) > resultPagination.pages) {
    document.querySelector(".nenhumItem").innerHTML =
      "<p>Nenhum item encontrado</p>";
  } else {
    let product = document.querySelector(".store");
    product.innerHTML = novaProduto;
  }
  {
    /* <button onclick="carrinho(${produto.id}, ${produto.price})">Adicionar ao carrinho</button> */
  }
}

function carrinho(id) {
  //Verificar ser tem na listar
  var carr = carts[0].filter((produto) => {
    return produto.id === id;
  });
  if (novoCarrnho.length <= 0) {
    novoCarrnho.push(carr[0]);
  } else {
    for (const iterator of novoCarrnho) {
      if (iterator.id !== id) {
        novoCarrnho.push(carr[0]);
      }
    }
  }

  //Adicionar no localStorage
  adicionarLocalStorage();
  //Encrementar no carrinho
  mostrarValorCarrinho();
}

function adicionarLocalStorage() {
  localStorage.removeItem("cart");

  const removerIdDuplicado = [
    ...new Map(novoCarrnho.map((item) => [item.id, item])).values(),
  ];

  localStorage.setItem("cart", JSON.stringify(removerIdDuplicado));
}

function mostrarValorCarrinho() {
  const removerIdDuplicado = [
    ...new Map(novoCarrnho.map((item) => [item.id, item])).values(),
  ];

  if (removerIdDuplicado.length <= 0) {
    document.getElementById("valorCarrinho").innerHTML = "";
  } else {
    document.getElementById(
      "valorCarrinho"
    ).innerHTML = `<span>${removerIdDuplicado.length}</span>`;
  }
}

mostrarValorCarrinho();

function state(array) {
  const pageQuery = getUrlVars()["pagina"];
  const page = parseInt(pageQuery) || 1;
  const limit = 4;
  const offset = (page - 1) * limit;
  const total = array.length;
  const items = array.slice(offset, offset + limit);
  const resultPagination = pagination(page, total, limit);

  numbersList(resultPagination, page);
  lista(items, pageQuery, resultPagination);
}

function numbersList(resultPagination, page) {
  var paginationItem = "";
  for (let i = 0; i < resultPagination.pages; i++) {
    const paginationAtivo = i + 1;
    const ativo = page === paginationAtivo ? "ativo" : "";

    paginationItem += `<a class="pagination_item ${ativo}" href="index.html?pagina=${paginationAtivo}">${paginationAtivo}</a>`;
  }
  document.getElementById("pagination").innerHTML = paginationItem;
}

function pagination(page, total, limit) {
  const pageSize = Math.ceil(total / limit);

  const statePagination = {
    page: page,
    total: total,
    limit: limit,
    pages: pageSize,
  };

  if (page > 1) {
    const prev = page - 1;
    statePagination.previous = prev;
  }

  const remaining = total - page * limit;

  if (remaining > 0) {
    statePagination.next = page + 1;
  }

  return statePagination;
}
//Pegar valor da URL
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
   function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}
