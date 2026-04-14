/* =============================================
   PATAS & AMOR — PETSHOP
   JavaScript Principal
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // 1. LOADER
  // ========================================
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1000);
  });
  document.body.style.overflow = 'hidden';


  // ========================================
  // 2. NAVBAR — scroll + mobile toggle
  // ========================================
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');
  const allLinks   = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
    toggleBackTop();
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  allLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id], header[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        allLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(sec => observer.observe(sec));


  // ========================================
  // 3. COUNTER ANIMATION (hero stats)
  // ========================================
  const counters = document.querySelectorAll('.stat-number');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => countObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = Math.floor(current).toLocaleString('pt-BR');
    }, 16);
  }


  // ========================================
  // 4. AOS — Animate On Scroll
  // ========================================
  const aosElements = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('aos-visible');
        }, i * 80);
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  aosElements.forEach(el => aosObserver.observe(el));


  // ========================================
  // 5. PRODUCT FILTER
  // ========================================
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      productCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
        if (match) {
          card.style.animation = 'fadeInUp 0.5s ease both';
        }
      });
    });
  });


  // ========================================
  // 6. CART SYSTEM
  // ========================================
  let cart = [];

  const cartBtn      = document.getElementById('cartBtn');
  const cartSidebar  = document.getElementById('cartSidebar');
  const cartOverlay  = document.getElementById('cartOverlay');
  const closeCart    = document.getElementById('closeCart');
  const cartItemsEl  = document.getElementById('cartItems');
  const cartCountEl  = document.getElementById('cartCount');
  const cartTotalEl  = document.getElementById('cartTotal');
  const cartFooter   = document.getElementById('cartFooter');
  const addCartBtns  = document.querySelectorAll('.add-cart');

  function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeCartFn() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartBtn.addEventListener('click', openCart);
  closeCart.addEventListener('click', closeCartFn);
  cartOverlay.addEventListener('click', closeCartFn);

  addCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const name  = btn.dataset.name;
      const price = parseFloat(btn.dataset.price);
      addToCart(name, price);
      animateCartBtn();
      showToast(`"${name}" adicionado! 🐾`);
    });
  });

  function addToCart(name, price) {
    const existing = cart.find(i => i.name === name);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    renderCart();
  }

  function removeFromCart(name) {
    cart = cart.filter(i => i.name !== name);
    renderCart();
  }

  function renderCart() {
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const count = cart.reduce((sum, i) => sum + i.qty, 0);

    cartCountEl.textContent = count;
    cartCountEl.style.transform = 'scale(1.4)';
    setTimeout(() => cartCountEl.style.transform = '', 300);

    if (cart.length === 0) {
      cartItemsEl.innerHTML = `
        <div class="cart-empty">
          <span>🐾</span>
          <p>Seu carrinho está vazio</p>
        </div>`;
      cartFooter.style.display = 'none';
    } else {
      cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-info">
            <h5>${item.name} ${item.qty > 1 ? `x${item.qty}` : ''}</h5>
            <span>R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</span>
          </div>
          <button class="cart-item-remove" onclick="removeCartItem('${item.name}')">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      `).join('');
      cartFooter.style.display = 'block';
      cartTotalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }
  }

  // Expose to global for inline onclick
  window.removeCartItem = removeFromCart;

  function animateCartBtn() {
    cartBtn.style.transform = 'scale(1.2) rotate(-10deg)';
    cartBtn.style.background = 'rgba(232,162,74,0.3)';
    setTimeout(() => {
      cartBtn.style.transform = '';
      cartBtn.style.background = '';
    }, 400);
  }


  // ========================================
  // 7. TOAST NOTIFICATIONS
  // ========================================
  function showToast(msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = msg;
    toast.style.cssText = `
      position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%) translateY(20px);
      background: var(--brown-dark, #3B2314); color: #fff;
      padding: 12px 24px; border-radius: 100px;
      font-size: 0.9rem; font-weight: 500;
      box-shadow: 0 8px 28px rgba(0,0,0,0.2);
      z-index: 999; opacity: 0;
      transition: all 0.4s ease;
      white-space: nowrap;
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }


  // ========================================
  // 8. TESTIMONIALS SLIDER
  // ========================================
  const track   = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testimonialDots');
  const cards   = track.querySelectorAll('.testimonial-card');
  let currentSlide = 0;
  let autoPlay;
  
  const getVisible = () => window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;

  function buildDots() {
    dotsContainer.innerHTML = '';
    const visible = getVisible();
    const total   = Math.ceil(cards.length / visible);
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goToSlide(index) {
    const visible = getVisible();
    const total   = Math.ceil(cards.length / visible);
    currentSlide  = (index + total) % total;

    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${currentSlide * visible * cardWidth}px)`;

    dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function nextSlide() {
    const visible = getVisible();
    goToSlide(currentSlide + 1);
    if ((currentSlide + 1) * visible >= cards.length) currentSlide = -1;
  }

  function startAuto() {
    clearInterval(autoPlay);
    autoPlay = setInterval(nextSlide, 4500);
  }

  buildDots();
  startAuto();

  track.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.addEventListener('mouseleave', startAuto);

  // Touch/swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    }
  });

  window.addEventListener('resize', () => {
    buildDots();
    goToSlide(0);
  });


  // ========================================
  // 9. CONTACT FORM
  // ========================================
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    setTimeout(() => {
      formSuccess.classList.add('show');
      contactForm.reset();
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
      btn.disabled = false;
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1800);
  });


  // ========================================
  // 10. BACK TO TOP
  // ========================================
  const backTop = document.getElementById('backTop');

  function toggleBackTop() {
    backTop.classList.toggle('show', window.scrollY > 400);
  }

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  // ========================================
  // 11. SMOOTH HOVER on service icons
  // ========================================
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.service-icon');
      icon.style.transform = 'scale(1.15) rotate(-5deg)';
      icon.style.transition = 'transform 0.3s ease';
    });
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.service-icon');
      icon.style.transform = '';
    });
  });


  // ========================================
  // 12. PARALLAX HEADER SHAPES
  // ========================================
  const shapes = document.querySelectorAll('.shape');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (shapes[0]) shapes[0].style.transform = `translateY(${y * 0.15}px)`;
    if (shapes[1]) shapes[1].style.transform = `translateY(${y * 0.08}px)`;
  }, { passive: true });


  // ========================================
  // 13. NEWSLETTER
  // ========================================
  const newsletterBtn = document.querySelector('.newsletter-form button');
  const newsletterInput = document.querySelector('.newsletter-form input');

  if (newsletterBtn) {
    newsletterBtn.addEventListener('click', () => {
      const val = newsletterInput.value.trim();
      if (!val || !val.includes('@')) {
        newsletterInput.style.borderColor = '#E8A24A';
        newsletterInput.placeholder = 'E-mail inválido!';
        setTimeout(() => {
          newsletterInput.style.borderColor = '';
          newsletterInput.placeholder = 'Seu e-mail';
        }, 2000);
        return;
      }
      showToast('✅ Inscrito com sucesso!');
      newsletterInput.value = '';
    });
  }

  console.log('🐾 Patas & Amor — PetShop carregado com amor!');
});