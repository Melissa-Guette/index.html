document.addEventListener("DOMContentLoaded", () => {
  console.log('DOM Content Loaded - slider.js');
  // Slider logic
  let currentIndex = 0;
  const images = document.querySelectorAll('.slider-image');
  const totalImages = images.length;
  console.log('Images found:', images.length);

  function showImage(index) {
    images.forEach((img, i) => {
      img.classList.toggle('active', i === index);
    });
  }

  function nextImage() {
    const oldIndex = currentIndex; // Store old index for logging
    currentIndex = (currentIndex + 1) % totalImages;
    console.log('Next Image - Old index:', oldIndex, 'New index:', currentIndex);
    showImage(currentIndex);
  }

  console.log('Initial currentIndex:', currentIndex);
  showImage(currentIndex); // Show the first image initially
  setInterval(nextImage, 3000); // Change image every 3 seconds

  // Cart logic (already present and working)
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  const verCarritoBtn = document.getElementById("verCarritoBtn");
  const carritoModal = document.getElementById("carritoModal");
  const cerrarBtn = document.querySelector(".cerrar");
  const listaCarrito = document.getElementById("listaCarrito");
  const totalCarrito = document.getElementById("totalCarrito");
  const metodoPagoSelect = document.getElementById("metodoPago");

  actualizarCarrito();

  verCarritoBtn.onclick = () => {
    actualizarCarrito();
    carritoModal.style.display = "block";
  };

  cerrarBtn.onclick = () => {
    carritoModal.style.display = "none";
  };

  window.onclick = (event) => {
    if (event.target === carritoModal) {
      carritoModal.style.display = "none";
    }
  };

  function agregarAlCarrito(nombre, precio, imagenSrc) {
    const existingItem = carrito.find(item => item.nombre === nombre);

    if (existingItem) {
      existingItem.cantidad = (existingItem.cantidad || 1) + 1;
    } else {
      carrito.push({ nombre, precio, imagenSrc, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
    console.log(`${nombre} added to cart.`);
    actualizarCarrito();
  }

  function actualizarCarrito() {
    listaCarrito.innerHTML = "";
    let total = 0;
    carrito.forEach((item, index) => {
      const li = document.createElement("li");
      li.classList.add("carrito-item");

      const itemDetails = document.createElement("div");
      itemDetails.style.display = "flex";
      itemDetails.style.alignItems = "center";
      itemDetails.style.flexGrow = "1";

      const img = document.createElement("img");
      img.src = item.imagenSrc;
      img.alt = item.nombre;
      img.style.width = "50px";
      img.style.height = "50px";
      img.style.marginRight = "15px";
      img.style.objectFit = "cover";
      img.style.borderRadius = "5px";

      const namePriceSpan = document.createElement("span");
      namePriceSpan.style.flexGrow = "1";
      namePriceSpan.textContent = `${item.nombre} - $${item.precio}`;

      itemDetails.appendChild(img);
      itemDetails.appendChild(namePriceSpan);

      const quantityControls = document.createElement("div");
      quantityControls.classList.add("quantity-controls");

      const decreaseBtn = document.createElement("button");
      decreaseBtn.textContent = "-";
      decreaseBtn.classList.add("quantity-btn");
      decreaseBtn.classList.add("decrease");
      decreaseBtn.onclick = () => disminuirCantidad(item.nombre);

      const quantitySpan = document.createElement("span");
      quantitySpan.textContent = item.cantidad || 1;
      quantitySpan.classList.add("quantity-display");

      const increaseBtn = document.createElement("button");
      increaseBtn.textContent = "+";
      increaseBtn.classList.add("quantity-btn");
      increaseBtn.classList.add("increase");
      increaseBtn.onclick = () => aumentarCantidad(item.nombre);

      quantityControls.appendChild(decreaseBtn);
      quantityControls.appendChild(quantitySpan);
      quantityControls.appendChild(increaseBtn);

      li.appendChild(itemDetails);
      li.appendChild(quantityControls);

      listaCarrito.appendChild(li);

      total += parseFloat(item.precio) * (item.cantidad || 1);
    });
    totalCarrito.textContent = total.toFixed(2);
  }

  function aumentarCantidad(nombre) {
    const item = carrito.find(item => item.nombre === nombre);
    if (item) {
      item.cantidad = (item.cantidad || 1) + 1;
      localStorage.setItem('carrito', JSON.stringify(carrito));
      actualizarCarrito();
    }
  }

  function disminuirCantidad(nombre) {
    const itemIndex = carrito.findIndex(item => item.nombre === nombre);
    if (itemIndex > -1) {
      const item = carrito[itemIndex];
      if ((item.cantidad || 1) > 1) {
        item.cantidad -= 1;
      } else {
        carrito.splice(itemIndex, 1);
      }
      localStorage.setItem('carrito', JSON.stringify(carrito));
      actualizarCarrito();
    }
  }

  window.agregarAlCarrito = agregarAlCarrito;

  window.finalizarCompra = function finalizarCompra() {
    if (carrito.length === 0) {
      alert("No hay productos en el carrito.");
      return;
    }

    if (!metodoPagoSelect || metodoPagoSelect.value === "") {
      alert("Por favor, seleccione un método de pago.");
      return;
    }

    const metodo = metodoPagoSelect.value;
    alert(`Compra finalizada. Método de pago: ${metodo}`);

    carrito.length = 0;
    localStorage.setItem('carrito', JSON.stringify(carrito));

    actualizarCarrito();
    carritoModal.style.display = "none";
  };
});