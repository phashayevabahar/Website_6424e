// Sebet verisini localStorage'dan alir
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let loadedProducts = [];

function saveCart() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function updateCartCount() {
  const cartCountElem = document.getElementById('cart-count');
  if (cartCountElem) {
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElem.textContent = totalQuantity;
  }
}

let cartCount = 0;
let cart = [];

function addToCart(name, price) {
    cart.push({ name, price });
    cartCount++;
    document.getElementById('cart-count').textContent = cartCount;
    localStorage.setItem('cart', JSON.stringify(cart));
}



function removeFromCart(productId) {
  cartItems = cartItems.filter(item => item.id !== productId);
  saveCart();
  updateCartCount();
  renderCartItems();
}

async function loadProducts() {
  try {
    const res = await fetch('products.json');
    const products = await res.json();
    loadedProducts = products;

    const main = document.querySelector('main');
    main.innerHTML = '';

    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('comic-card');

      card.innerHTML = `
        <img src="${product.imgSource}" alt="${product.name}" style="max-width:100%; border-radius:8px; margin-bottom:10px;" onerror="this.style.display='none'">
        <h2>${product.name}</h2>
        <p>Writer:<em> ${product.author}</em></p>
        <p>${product.description}</p>
        <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
        <button class="add-to-cart-button" data-id="${product.id}">Add to Cart</button>
      `;

      main.appendChild(card);
    });

    document.querySelectorAll('.add-to-cart-button').forEach(button => {
      button.addEventListener('click', () => {
        const id = +button.dataset.id;
        const product = loadedProducts.find(p => p.id === id);
        if (product) {
          addToCart(product);
        }
      });
    });

  } catch (err) {
    console.error('Error loading products:', err);
  }
}


function renderCartItems() {
  const cartContainer = document.getElementById('cart-items');
  if (!cartContainer) return;

  cartContainer.innerHTML = '';

  if (cartItems.length === 0) {
    cartContainer.innerHTML = '<p>Cart is empty.    <a href="index.html">Start to shopping</a></p>';
    updateCartTotal();
    return;
  }

  cartItems.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.marginBottom = '10px';
    div.style.borderBottom = '2px solid #000';
    div.style.paddingBottom = '10px';

    div.innerHTML = `
      <img src="${item.imgSource}" alt="${item.name}" style="width:120px; height:120px; object-fit: fill; border-radius:6px; margin-right:15px;">
      <div style="flex-grow:1;">
        <p style="font-weight:bold; color:#111; margin-top:0;">${item.name}</p>
        <p style="margin:5px 0 0 0; font-size:14px; color:#555;">
          <button class="decrease-qty" data-id="${item.id}" >-</button>
          <strong>${item.quantity}</strong>
          <button class="increase-qty" data-id="${item.id}" style="padding: 2px 6px; margin-left: 8px;">+</button>
           Total: $${(item.price * item.quantity).toFixed(2)}
        </p>
      </div>
      <button class="remove-item" data-id="${item.id}" ">
        Delete
      </button>
    `;

    cartContainer.appendChild(div);
  });

  // Miqdarı azaltmaq üçün
  document.querySelectorAll('.decrease-qty').forEach(button => {
    button.addEventListener('click', () => {
      const id = +button.dataset.id;
      const item = cartItems.find(i => i.id === id);
      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          // Əgər say 1-dirsə və ya '-' basılırsa, məhsulu silir
          cartItems = cartItems.filter(i => i.id !== id);
        }
        saveCart();
        updateCartCount();
        renderCartItems();
        updateCartTotal();
      }
    });
  });

  // Miqdarı artırmaq üçün
  document.querySelectorAll('.increase-qty').forEach(button => {
    button.addEventListener('click', () => {
      const id = +button.dataset.id;
      const item = cartItems.find(i => i.id === id);
      if (item) {
        item.quantity++;
        saveCart();
        updateCartCount();
        renderCartItems();
        updateCartTotal();
      }
    });
  });

  // Məhsulu tam silmək üçün
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', () => {
      const id = +button.dataset.id;
      cartItems = cartItems.filter(i => i.id !== id);
      saveCart();
      updateCartCount();
      renderCartItems();
      updateCartTotal();
    });
  });

  updateCartTotal();
}



// Səhifə yüklənəndə
window.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  loadProducts();
  renderCartItems();
});

function updateCartTotal() {
  const totalElem = document.getElementById('cart-total');
  if (!totalElem) return;

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalElem.textContent = total.toFixed(2);
}

function renderSequentialProducts(products) {
  const container = document.getElementById('products-container');
  let currentType = null;

  products.forEach(product => {
    if (product.type !== currentType) {
      currentType = product.type;

      const genreHeading = document.createElement('h2');
      genreHeading.textContent = currentType;
      genreHeading.className = 'genre-heading';
      container.appendChild(genreHeading);
    }

    const card = document.createElement('div');
    card.className = 'comic-card';
    card.innerHTML = `
      <img src="${product.imgSource}" alt="${product.name}" />
      <div class="comic-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>Author:</strong> ${product.author}</p>
        <p><strong>Price:</strong> $${product.price}</p>
        <button class="add-to-cart-button">Add to cart</button>
      </div>
    `;
    container.appendChild(card);
  });
}


// cards.js
document.addEventListener('DOMContentLoaded', function() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    let total = 0;
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p>Səbətiniz boşdur.</p>';
        return;
    }
    
    cartItems.forEach(item => {
        total += item.price;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <h3>${item.name}</h3>
            <p>Müəllif: ${item.author}</p>
            <p>Qiymət: $${item.price.toFixed(2)}</p>
            <button class="remove-item" data-id="${item.id}">Sil</button>
        `;
        
        cartItemsContainer.appendChild(itemElement);
    });
    
    cartTotalElement.textContent = total.toFixed(2);
    
    // Sil düymələrinə klik hadisəsi əlavə et
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const itemId = parseInt(this.getAttribute('data-id'));
            removeFromCart(itemId);
        });
    });
});

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload(); // Səbəti yenilə
}


function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1); // həmin məhsulu sil
        localStorage.setItem('cart', JSON.stringify(cart)); // yeni səbəti yadda saxla
        location.reload(); // səhifəni yenilə
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const checkoutButton = document.querySelector(".checkout-button");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            localStorage.removeItem("cart"); // səbəti təmizlə
            alert("Sifarişiniz uğurla təsdiqləndi!");
            window.location.href = "index.html"; // və ya sadəcə location.reload() əgər qalmaq istəyirsənsə
        });
    }
});



window.onload = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    let total = 0;

    cartItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p>${item.name} - $${item.price.toFixed(2)} 
            <button onclick="removeFromCart(${index})">❌</button></p>
        `;
        cartContainer.appendChild(div);
        total += item.price;
    });

    cartTotal.textContent = total.toFixed(2);

    // Sifarişi təsdiqlə düyməsi üçün:
    const checkoutButton = document.querySelector(".checkout-button");
    if (checkoutButton) {
        checkoutButton.addEventListener("click", () => {
            localStorage.removeItem("cart");
            alert("Sifarişiniz uğurla təsdiqləndi!");
            window.location.href = "index.html";
        });
    }
};

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        location.reload();
    }
}


