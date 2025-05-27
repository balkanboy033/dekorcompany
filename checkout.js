
const fontAwesome = document.createElement('link');
fontAwesome.rel = 'stylesheet';
fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
document.head.appendChild(fontAwesome);


document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let checkoutItems = document.getElementById("checkout-items");

    if (!checkoutItems) {
        console.error("Element #checkout-items ne postoji!");
        return;
    }

    
    if (cart.length === 0) {
        checkoutItems.innerHTML = "<p>Vaša korpa je prazna.</p>";
        return;
    }

    cart.forEach(item => {
        let itemDiv = document.createElement("div");
        itemDiv.classList.add("checkout-item");
        itemDiv.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}">
            <span>${item.name} (x${item.quantity}) - ${item.price * item.quantity} RSD</span>
        `;
        checkoutItems.appendChild(itemDiv);
    });

    function calculateTotal() {
        let total = 0;
        cart.forEach(item => {
            let itemPrice = parseFloat(item.price);
            if (!isNaN(itemPrice)) {
                total += itemPrice * item.quantity;
            } else {
                console.error("Greška: Cena proizvoda nije broj", item);
            }
        });
        return total;
    }

    let total = calculateTotal();
    let discount = 0;
    let paymentAmount = total - discount;

    let purchaseAmountElem = document.getElementById("purchase-amount");
    let paymentAmountElem = document.getElementById("payment-amount");
    let discountAmountElem = document.getElementById("discount-amount");

    if (purchaseAmountElem) purchaseAmountElem.textContent = `${total} RSD`;
    if (paymentAmountElem) paymentAmountElem.textContent = `${paymentAmount} RSD`;
    if (discountAmountElem) discountAmountElem.textContent = `${discount} RSD`;

    let checkoutForm = document.getElementById("checkout-form");

    if (!checkoutForm) {
        console.error("Element #checkout-form ne postoji!");
        return;
    }

    checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault();
        console.log("Pokušaj slanja narudžbine...");

        let name = document.getElementById("name").value.trim();
        let address = document.getElementById("address").value.trim();
        let city = document.getElementById("city").value.trim();
        let postalCode = document.getElementById("postal-code").value.trim();
        let phone = document.getElementById("phone").value.trim();
        let email = document.getElementById("email").value.trim();

        if (!name || !address || !city || !postalCode || !phone || !email || cart.length === 0) {
            alert("Sva polja su obavezna!");
            return;
        }

        let orderData = {
            name,
            address,
            city,
            postalCode,
            phone,
            email,
            cart,
            total,
            discount,
            paymentAmount
        };

        console.log("Podaci za slanje:", orderData);

        fetch("https://dekorcompany.rs/shop/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        })
        .then(response => {
            console.log("Odgovor servera:", response);
            return response.json();
        })
        .then(data => {
            console.log("Podaci sa servera:", data);



            
const orderId = 'DEK-' + Math.floor(10000 + Math.random() * 90000);
document.getElementById('generated-order-id').textContent = orderId;


const productsContainer = document.getElementById('confirmation-products');
productsContainer.innerHTML = '';

cart.forEach(item => {
    const productElement = document.createElement('div');
    productElement.className = 'product-item';
    productElement.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}">
        <div class="product-info">
            <div class="product-name">${item.name}</div>
            <div class="product-quantity-price">
                ${item.quantity} × ${item.price} RSD = ${item.quantity * item.price} RSD
            </div>
        </div>
    `;
    productsContainer.appendChild(productElement);
});


const modal = document.getElementById('order-confirmation');
modal.style.display = 'flex';
setTimeout(() => {
    modal.classList.add('active');
}, 10);


document.getElementById('continue-shopping').addEventListener('click', function() {
    localStorage.removeItem('cart');
    window.location.href = 'home.html';
});
        })
        .catch(error => {
            console.error("Greška pri slanju narudžbine:", error);
            alert("Došlo je do greške pri slanju narudžbine.");
        });
    });
});
