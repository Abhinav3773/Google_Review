/**
 * Piyush Cloth Collection - Feedback Web Application Logic
 * Single Unified Glass Card Architecture with Horizontal Review Slider
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- State Management ---
  let selectedRating = 0;
  let selectedComment = "";

  // --- DOM Elements ---
  const starsWrapperEl = document.getElementById('stars-wrapper');
  const ratingBadgeEl = document.getElementById('rating-badge');
  const stepTwoContainer = document.getElementById('step-two-container');
  const stepMessageEl = document.getElementById('step-message');
  const chipsSliderTrack = document.getElementById('chips-slider-track');
  const sliderDotsContainer = document.getElementById('slider-dots');
  const sliderPrevBtn = document.getElementById('slider-prev');
  const sliderNextBtn = document.getElementById('slider-next');
  const customTextarea = document.getElementById('custom-textarea');
  const actionBtn = document.getElementById('action-btn');
  const actionBtnText = document.getElementById('action-btn-text');
  const actionBtnIcon = document.getElementById('action-btn-icon');
  const mainCard = document.querySelector('.single-feedback-card');
  const successScreen = document.getElementById('success-screen');
  const toastNotification = document.getElementById('toast-notification');
  const toastMessage = document.getElementById('toast-message');
  const resetBtn = document.getElementById('reset-btn');

  const sliderWrapper = document.querySelector('.chips-slider-wrapper');

  // --- Star Labels & Mood Badges ---
  const STAR_DESCRIPTIONS = {
    1: { label: "Needs Improvement — Tell Us More", class: "star-1", emoji: "🙏" },
    2: { label: "Fair — We Can Do Better", class: "star-2", emoji: "🙁" },
    3: { label: "Good — Decent Experience", class: "star-3", emoji: "👍" },
    4: { label: "Very Good — Loved the Collection!", class: "star-4", emoji: "🌟" },
    5: { label: "Excellent — Best Shopping Experience!", class: "star-5", emoji: "✨" }
  };

  // --- Initialize Stars ---
  const starButtons = Array.from(document.querySelectorAll('.star-btn'));

  starButtons.forEach((btn) => {
    const starVal = parseInt(btn.getAttribute('data-star'), 10);

    btn.addEventListener('click', () => {
      setRating(starVal);
    });

    btn.addEventListener('mouseenter', () => {
      highlightStarsUpTo(starVal, true);
    });
  });

  starsWrapperEl.addEventListener('mouseleave', () => {
    highlightStarsUpTo(selectedRating, false);
  });

  // --- Rating Selection Handler ---
  function setRating(rating) {
    selectedRating = rating;

    const targetStar = starButtons[rating - 1];
    if (targetStar) {
      targetStar.classList.remove('pulse');
      void targetStar.offsetWidth;
      targetStar.classList.add('pulse');
    }

    highlightStarsUpTo(rating, false);

    const info = STAR_DESCRIPTIONS[rating];
    if (info) {
      ratingBadgeEl.textContent = `${info.emoji} ${info.label}`;
      ratingBadgeEl.className = `rating-badge visible ${info.class}`;
    }

    renderStepTwo(rating);

    const threshold = typeof GOOGLE_REVIEW_THRESHOLD !== 'undefined' ? GOOGLE_REVIEW_THRESHOLD : 4;
    if (rating >= threshold) {
      triggerConfetti();
    }
  }

  function highlightStarsUpTo(count, isHover) {
    starButtons.forEach((btn, idx) => {
      const starVal = idx + 1;
      if (isHover) {
        if (starVal <= count) btn.classList.add('hover-active');
        else btn.classList.remove('hover-active');
      } else {
        btn.classList.remove('hover-active');
        if (starVal <= count) btn.classList.add('active');
        else btn.classList.remove('active');
      }
    });
  }

  // --- Step 2 Renderer ---
  function renderStepTwo(rating) {
    stepTwoContainer.classList.add('active');

    const threshold = typeof GOOGLE_REVIEW_THRESHOLD !== 'undefined' ? GOOGLE_REVIEW_THRESHOLD : 4;

    // if (rating >= threshold) {
    //   // stepMessageEl.textContent = "SELECT A QUICK FEEDBACK:";
    // } else if (rating === 3) {
    //   stepMessageEl.textContent = "Thank you for your feedback! Please let us know how we can make your next visit even better:";
    // } else {
    //   stepMessageEl.textContent = "We're sorry your experience wasn't perfect. Please tell us how we can improve:";
    // }

    const suggestions = (typeof SUGGESTED_COMMENTS !== 'undefined' && SUGGESTED_COMMENTS[rating]) ? SUGGESTED_COMMENTS[rating] : [];
    chipsSliderTrack.innerHTML = '';
    sliderDotsContainer.innerHTML = '';
    selectedComment = '';
    customTextarea.value = '';

    suggestions.forEach((commentText, index) => {
      const slide = document.createElement('div');
      slide.className = `chip-slide ${index === 0 ? 'selected' : ''}`;
      slide.setAttribute('data-index', index);
      slide.innerHTML = `
        <div class="slide-content">"${commentText}"</div>
        <div class="slide-footer">
          <span class="slide-star-badge">★ ${rating} Stars</span>
          <span class="slide-select-btn">${index === 0 ? 'Selected ✓' : 'Select'}</span>
        </div>
      `;

      if (index === 0) {
        selectedComment = commentText;
        customTextarea.value = commentText;
      }

      slide.addEventListener('click', () => {
        selectSlide(index, commentText);
      });

      chipsSliderTrack.appendChild(slide);

      const dot = document.createElement('div');
      dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        scrollToSlide(index);
        selectSlide(index, commentText);
      });
      sliderDotsContainer.appendChild(dot);
    });

    if (sliderWrapper) sliderWrapper.scrollLeft = 0;

    customTextarea.oninput = () => {
      selectedComment = customTextarea.value;
      document.querySelectorAll('.chip-slide').forEach(s => {
        const text = s.querySelector('.slide-content').textContent.replace(/"/g, '');
        if (text === customTextarea.value) {
          s.classList.add('selected');
          s.querySelector('.slide-select-btn').textContent = 'Selected ✓';
        } else {
          s.classList.remove('selected');
          s.querySelector('.slide-select-btn').textContent = 'Select';
        }
      });
    };

    if (rating >= threshold) {
      actionBtn.className = 'btn-primary btn-gold';
      actionBtnText.textContent = 'Publish Review To Google Business';
      actionBtnIcon.innerHTML = `
        <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.5 8.9 5 12 5z"/>
        <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
        <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-2.9c-.3-.7-.4-1.5-.4-2.3z"/>
        <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.5-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"/>
      `;
    } else {
      actionBtn.className = 'btn-primary btn-submit';
      actionBtnText.textContent = 'Submit Feedback';
      actionBtnIcon.innerHTML = `
        <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
      `;
    }

    setTimeout(() => {
      stepTwoContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 120);
  }

  // --- Slide Selection Controls ---
  function selectSlide(index, commentText) {
    const slides = document.querySelectorAll('.chip-slide');
    const dots = document.querySelectorAll('.slider-dot');

    slides.forEach((slide, idx) => {
      if (idx === index) {
        slide.classList.add('selected');
        slide.querySelector('.slide-select-btn').textContent = 'Selected ✓';
      } else {
        slide.classList.remove('selected');
        slide.querySelector('.slide-select-btn').textContent = 'Select';
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === index) dot.classList.add('active');
      else dot.classList.remove('active');
    });

    selectedComment = commentText;
    customTextarea.value = commentText;
  }

  function scrollToSlide(index) {
    const slides = document.querySelectorAll('.chip-slide');
    if (slides[index] && sliderWrapper) {
      const slideLeft = slides[index].offsetLeft - 10;
      sliderWrapper.scrollTo({ left: slideLeft, behavior: 'smooth' });
    }
  }

  if (sliderPrevBtn) {
    sliderPrevBtn.addEventListener('click', () => {
      if (sliderWrapper) sliderWrapper.scrollBy({ left: -260, behavior: 'smooth' });
    });
  }

  if (sliderNextBtn) {
    sliderNextBtn.addEventListener('click', () => {
      if (sliderWrapper) sliderWrapper.scrollBy({ left: 260, behavior: 'smooth' });
    });
  }

  if (sliderWrapper) {
    sliderWrapper.addEventListener('scroll', () => {
      const slides = document.querySelectorAll('.chip-slide');
      const dots = document.querySelectorAll('.slider-dot');
      if (!slides.length) return;

      const scrollPos = sliderWrapper.scrollLeft;
      slides.forEach((slide, idx) => {
        if (Math.abs(slide.offsetLeft - 10 - scrollPos) < 130) {
          dots.forEach((d, i) => {
            if (i === idx) d.classList.add('active');
            else d.classList.remove('active');
          });
        }
      });
    });
  }

  // --- Smart Google Review URL Resolver ---
  function getGoogleReviewUrl() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
    if (isMobile && typeof GOOGLE_REVIEW_MOBILE_URL !== 'undefined' && GOOGLE_REVIEW_MOBILE_URL) {
      return GOOGLE_REVIEW_MOBILE_URL;
    }
    if (!isMobile && typeof GOOGLE_REVIEW_DESKTOP_URL !== 'undefined' && GOOGLE_REVIEW_DESKTOP_URL) {
      return GOOGLE_REVIEW_DESKTOP_URL;
    }
    return (typeof GOOGLE_REVIEW_URL !== 'undefined' && GOOGLE_REVIEW_URL)
      ? GOOGLE_REVIEW_URL
      : "https://search.google.com/local/writereview?placeid=ChIJ3zoA0iBGDTkRw4rfeKkNgPs";
  }

  // --- Action Button Click Handler ---
  actionBtn.addEventListener('click', async () => {
    if (!selectedRating) return;

    const textToSubmit = customTextarea.value.trim() || selectedComment.trim();
    const threshold = typeof GOOGLE_REVIEW_THRESHOLD !== 'undefined' ? GOOGLE_REVIEW_THRESHOLD : 4;

    if (selectedRating >= threshold) {
      if (textToSubmit) {
        await copyToClipboard(textToSubmit);
        showToast("Review copied! Opening Google Reviews...");
      } else {
        showToast("Opening Google Reviews...");
      }

      setTimeout(() => {
        const redirectUrl = getGoogleReviewUrl();
        window.location.href = redirectUrl;
      }, 1200);

    } else {
      showSuccessScreen();
    }
  });

  // --- Clipboard Copy Helper ---
  async function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn("Clipboard API error", err);
      }
    }
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }

  // --- Success View ---
  function showSuccessScreen() {
    // Hide rating, banner, and step two sections inside single card
    const heroHeader = document.querySelector('.hero-brand-header');
    const heroBanner = document.querySelector('.hero-banner-container');
    const ratingSection = document.querySelector('.rating-section');
    if (heroHeader) heroHeader.style.display = 'none';
    if (heroBanner) heroBanner.style.display = 'none';
    if (ratingSection) ratingSection.style.display = 'none';
    stepTwoContainer.classList.remove('active');
    successScreen.classList.add('active');
  }

  // --- Reset Flow ---
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      selectedRating = 0;
      selectedComment = '';
      customTextarea.value = '';
      ratingBadgeEl.className = 'rating-badge';
      ratingBadgeEl.textContent = '';
      highlightStarsUpTo(0, false);

      const heroHeader = document.querySelector('.hero-brand-header');
      const heroBanner = document.querySelector('.hero-banner-container');
      const ratingSection = document.querySelector('.rating-section');
      if (heroHeader) heroHeader.style.display = 'block';
      if (heroBanner) heroBanner.style.display = 'block';
      if (ratingSection) ratingSection.style.display = 'flex';

      stepTwoContainer.classList.remove('active');
      successScreen.classList.remove('active');
    });
  }

  // --- Toast Notification Helper ---
  function showToast(msg) {
    toastMessage.textContent = msg;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3000);
  }

  // --- Confetti Particle Engine ---
  function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#fef08a', '#eab308', '#ca8a04', '#10b981', '#6366f1', '#ffffff'];

    for (let i = 0; i < 55; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2 - 40,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.75) * 18,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        opacity: 1
      });
    }

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;

      particles.forEach(p => {
        if (p.opacity > 0) {
          alive++;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.38;
          p.opacity -= 0.016;
          p.rotation += p.rotSpeed;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });

      if (alive > 0) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    render();
  }
});
