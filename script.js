(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.contains('is-open');
      nav.classList.toggle('is-open', !isOpen);
      toggle.setAttribute('aria-expanded', !isOpen);
      toggle.textContent = isOpen ? 'Menu' : 'Close';
    });
  }

  function typeText(element, cursor, text, speed, onComplete) {
    var index = 0;
    element.textContent = '';
    if (cursor) {
      cursor.textContent = '|';
      cursor.classList.remove('is-done');
    }

    function step() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index += 1;
        setTimeout(step, speed);
      } else {
        if (cursor) cursor.classList.add('is-done');
        if (onComplete) onComplete();
      }
    }

    step();
  }

  var slideshow = document.getElementById('hero-slideshow');
  if (slideshow) {
    var slides = slideshow.querySelectorAll('.slideshow-slide');
    var introText = document.getElementById('slideshow-intro-text');
    var line1 = document.getElementById('typed-line1');
    var line2 = document.getElementById('typed-line2');
    var cursor1 = document.getElementById('cursor-line1');
    var cursor2 = document.getElementById('cursor-line2');

    if (slides.length >= 2 && line1 && line2) {
      var current = 0;
      var slideInterval = 3000;
      var firstSlideDuration = 1500;
      var pauseAfterTyping = 700;

      function advanceSlide() {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.remove('is-blurred');
        slides[current].classList.add('active');
      }

      function startSlideshowCycle() {
        advanceSlide();
        setInterval(advanceSlide, slideInterval);
      }

      function revealIntro() {
        if (introText) {
          introText.classList.add('is-hidden');
          introText.setAttribute('aria-hidden', 'true');
        }
        slides[0].classList.remove('is-blurred');
        setTimeout(startSlideshowCycle, firstSlideDuration);
      }

      typeText(line1, cursor1, 'FRC 9114', 65, function () {
        typeText(line2, cursor2, 'Rotationaries', 55, function () {
          setTimeout(revealIntro, pauseAfterTyping);
        });
      });
    }
  }

  var revealEls = document.querySelectorAll('.scroll-reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px'
      });

      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add('is-visible');
      });
    }
  }

  var staggerGroups = document.querySelectorAll('[data-stagger]');
  if (staggerGroups.length && 'IntersectionObserver' in window) {
    var staggerObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var group = entry.target;
        var items = group.querySelectorAll('[data-stagger-item]');
        group.classList.add('is-visible');

        items.forEach(function (item, index) {
          item.style.transitionDelay = (index * 0.12) + 's';
        });

        staggerObserver.unobserve(group);
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -6% 0px'
    });

    staggerGroups.forEach(function (group) {
      staggerObserver.observe(group);
    });
  } else if (staggerGroups.length) {
    staggerGroups.forEach(function (group) {
      group.classList.add('is-visible');
    });
  }

  var accomplishments = document.getElementById('accomplishments-carousel');
  if (accomplishments) {
    var accSlides = accomplishments.querySelectorAll('.accomplishments-slide');
    var prevBtn = accomplishments.querySelector('.accomplishments-nav--prev');
    var nextBtn = accomplishments.querySelector('.accomplishments-nav--next');
    var accCurrent = 0;
    var accInterval = 3000;
    var accTimer = null;

    function showAccSlide(index) {
      accSlides[accCurrent].classList.remove('active');
      accCurrent = (index + accSlides.length) % accSlides.length;
      accSlides[accCurrent].classList.add('active');
    }

    function nextAcc() {
      showAccSlide(accCurrent + 1);
    }

    function prevAcc() {
      showAccSlide(accCurrent - 1);
    }

    function resetAccTimer() {
      if (accTimer) clearInterval(accTimer);
      accTimer = setInterval(nextAcc, accInterval);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevAcc();
        resetAccTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextAcc();
        resetAccTimer();
      });
    }

    if (accSlides.length > 1) {
      resetAccTimer();
    }
  }
})();
