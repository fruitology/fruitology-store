// Product Database
const products = {
  nakfazli: {
    id: 'nakfazli',
    name: 'Nak Fazli Mango',
    description: 'The royal mango of Bangladesh, known for its unique aroma, fiberless texture, and sweet taste. Grown in Chapai Nawabganj, this premium variety is a customer favorite.',
    longDescription: 'Nak Fazli is distinguished by its golden-yellow color, rich sweetness, and buttery texture. Perfect for desserts, smoothies, or eating fresh.',
    icon: '🥭',
    priceOptions: [
      { name: '10 Kg Pack', price: 1400, value: '10kg' },
      { name: '20 Kg Pack', price: 2500, value: '20kg' },
      { name: 'Premium Dozen', price: 650, value: 'dozen' }
    ]
  },
  langra: {
    id: 'langra',
    name: 'Langra Mango',
    description: 'Classic greenish-yellow mango with tangy sweetness. Perfect for smoothies and desserts.',
    longDescription: 'Langra mangoes are known for their unique taste and aroma. They remain green even when ripe and have a distinct sweet-tangy flavor.',
    icon: '🥭',
    priceOptions: [
      { name: '10 Kg Pack', price: 1300, value: '10kg' },
      { name: '20 Kg Pack', price: 2400, value: '20kg' },
      { name: 'Premium Dozen', price: 600, value: 'dozen' }
    ]
  },
  harivanga: {
    id: 'harivanga',
    name: 'Harivanga Mango',
    description: 'Juicy, delicious and extremely popular in Bangladesh markets. Thin skin and rich pulp.',
    longDescription: 'Harivanga mangoes have a beautiful orange color when ripe. They are fiberless, sweet, and perfect for mango lovers.',
    icon: '🥭',
    priceOptions: [
      { name: '10 Kg Pack', price: 1200, value: '10kg' },
      { name: '20 Kg Pack', price: 2200, value: '20kg' },
      { name: 'Premium Dozen', price: 580, value: 'dozen' }
    ]
  },
  amrapali: {
    id: 'amrapali',
    name: 'Amrapali Mango',
    description: 'Hybrid variety full of sweetness. Bright orange color and intense flavor.',
    longDescription: 'Amrapali is a hybrid mango variety known for its deep orange color, sweet taste, and excellent shelf life.',
    icon: '🥭',
    priceOptions: [
      { name: '10 Kg Pack', price: 1450, value: '10kg' },
      { name: '20 Kg Pack', price: 2600, value: '20kg' },
      { name: 'Premium Dozen', price: 700, value: 'dozen' }
    ]
  }
};

// Cart Management
let cart = JSON.parse(localStorage.getItem('fruitology_cart')) || [];

function saveCart() {
  localStorage.setItem('fruitology_cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountElements = document.querySelectorAll('#cartCount');
  cartCountElements.forEach(el => {
    if (el) el.textContent = count;
  });
}

function addToCart(productId, priceOption, quantity = 1) {
  const product = products[productId];
  if (!product) return;
  
  const existingItem = cart.find(item => item.productId === productId && item.priceOption.value === priceOption.value);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
     