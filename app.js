/* ===========================
   AI忍者くん - CYBER THEME
   JavaScript（マトリックス＋グリッチ）
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- マトリックスパーティクル（Canvas） ---
  const canvas = document.getElementById('matrixCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    function drawMatrix() {
      ctx.fillStyle = 'rgba(10, 14, 26, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(0, 245, 255, 0.35)';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    setInterval(drawMatrix, 50);

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  // --- スクロールアニメーション（Intersection Observer） ---
  const fadeElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = Array.from(entry.target.parentElement.children)
          .filter(el => el.classList.contains('fade-in'))
          .indexOf(entry.target) * 120;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));

  // --- ヘッダースクロール ---
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- ハンバーガーメニュー ---
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      nav.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // --- スムーススクロール ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // --- グリッチエフェクト（セクションタイトル） ---
  const sectionTitles = document.querySelectorAll('.section-title');

  const glitchObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('glitch-active');
        setTimeout(() => {
          entry.target.classList.remove('glitch-active');
        }, 600);
        glitchObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  sectionTitles.forEach(title => glitchObserver.observe(title));

  // --- タイピングエフェクト（ヒーローバッジ） ---
  const badge = document.querySelector('.hero-badge');
  if (badge) {
    const img = badge.querySelector('.ninja-icon-img');
    const textNode = Array.from(badge.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
    const originalText = textNode ? textNode.textContent : badge.textContent;

    // テキスト部分のみをクリア
    if (textNode) {
      textNode.textContent = '';
    } else {
      badge.textContent = '';
    }

    badge.style.visibility = 'visible';
    let i = 0;

    function typeWriter() {
      if (i < originalText.length) {
        if (textNode) {
          textNode.textContent += originalText.charAt(i);
        } else {
          badge.textContent += originalText.charAt(i);
        }
        i++;
        setTimeout(typeWriter, 80);
      }
    }

    setTimeout(typeWriter, 800);
  }

  // --- お問い合わせフォーム ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert('必須項目をご入力ください。');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '>>> SENDING...';
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            alert('✅ TRANSMISSION COMPLETE\nお問い合わせありがとうございます！\n折り返しご連絡いたします。');
            contactForm.reset();
          } else {
            alert('⚠ ERROR\n送信に失敗しました。\nメールまたはLINEでお問い合わせください。');
          }
        })
        .catch(() => {
          alert('⚠ CONNECTION ERROR\n送信に失敗しました。\nメールまたはLINEでお問い合わせください。');
        })
        .finally(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
    });
  }

  // --- 年を自動更新 ---
  const yearEl = document.querySelector('.footer-bottom p');
  if (yearEl) {
    const currentYear = new Date().getFullYear();
    yearEl.innerHTML = yearEl.innerHTML.replace(/\d{4}/, currentYear);
  }
});
