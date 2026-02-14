/* ===========================
   daruma-ad コーポレートサイト
   JavaScript
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- スクロールアニメーション（Intersection Observer） ---
  const fadeElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // 少しずつ遅延させてフェードイン
        const delay = Array.from(entry.target.parentElement.children)
          .filter(el => el.classList.contains('fade-in'))
          .indexOf(entry.target) * 100;

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

  // ナビリンクをクリックしたらメニューを閉じる
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

      // フォーム送信のシミュレーション
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = '送信中...';
      submitBtn.disabled = true;

      // FormData を作成
      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          alert('お問い合わせありがとうございます！\n内容を確認の上、折り返しご連絡いたします。');
          contactForm.reset();
        } else {
          alert('送信に失敗しました。\nお手数ですが、メールまたはLINEでお問い合わせください。');
        }
      })
      .catch(() => {
        alert('送信に失敗しました。\nお手数ですが、メールまたはLINEでお問い合わせください。');
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
