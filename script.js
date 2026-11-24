(function () {
  var ALLOWED_THEMES = ['maroon', 'light', 'wine', 'rose', 'blush'];

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

  function normalizeImagePath(src) {
    if (!src || typeof src !== 'string') return '';
    var trimmed = src.trim();
    if (!trimmed) return '';
    if (/^(https?:)?\/\//i.test(trimmed) || trimmed.indexOf('data:') === 0) {
      return trimmed;
    }
    return trimmed.replace(/^\/+/, '');
  }

  function fetchJson(path) {
    if (typeof window.fetch !== 'function') {
      return Promise.resolve(null);
    }
    return window.fetch(path, { cache: 'no-cache' })
      .then(function (response) {
        if (!response.ok) return null;
        return response.json();
      })
      .catch(function () {
        return null;
      });
  }

  function applyBranding(data) {
    if (!data) return;
    var logoSrc = normalizeImagePath(data.logoImage);
    if (!logoSrc) return;
    var logos = document.querySelectorAll('img[data-cms-logo]');
    logos.forEach(function (img) {
      img.setAttribute('src', logoSrc);
      if (typeof data.logoAlt === 'string') {
        img.setAttribute('alt', data.logoAlt);
      }
    });
  }

  function applyHome(data) {
    if (!data) return;

    var slideshow = document.getElementById('hero-slideshow');
    if (slideshow && Array.isArray(data.heroSlides) && data.heroSlides.length > 0) {
      var existingSlides = slideshow.querySelectorAll('.slideshow-slide');
      existingSlides.forEach(function (slide) {
        slide.remove();
      });

      data.heroSlides.forEach(function (slide, index) {
        var src = normalizeImagePath(slide && slide.image);
        if (!src) return;
        var img = document.createElement('img');
        img.setAttribute('src', src);
        img.setAttribute('alt', (slide && slide.alt) || 'FRC 9114 Rotationaries');
        img.className = index === 0
          ? 'slideshow-slide active is-blurred'
          : 'slideshow-slide';
        if (index === 0) {
          img.setAttribute('data-intro', 'true');
        }
        if (slide && slide.position) {
          img.style.objectPosition = slide.position;
        }
        slideshow.appendChild(img);
      });
    }

    var accViewport = document.querySelector('#accomplishments-carousel .accomplishments-viewport');
    if (accViewport && Array.isArray(data.accomplishments) && data.accomplishments.length > 0) {
      accViewport.innerHTML = '';

      data.accomplishments.forEach(function (item, index) {
        var theme = item && ALLOWED_THEMES.indexOf(item.theme) !== -1 ? item.theme : 'maroon';
        var article = document.createElement('article');
        article.className = 'accomplishments-slide accomplishments-slide--' + theme + (index === 0 ? ' active' : '');

        var inner = document.createElement('div');
        inner.className = 'accomplishments-slide__inner';

        var textWrap = document.createElement('div');
        textWrap.className = 'accomplishments-slide__text';

        var yearEl = document.createElement('p');
        yearEl.className = 'accomplishments-slide__year';
        yearEl.textContent = (item && item.year) || '';

        var labelEl = document.createElement('p');
        labelEl.className = 'accomplishments-slide__label';
        labelEl.textContent = (item && item.label) || '';

        textWrap.appendChild(yearEl);
        textWrap.appendChild(labelEl);

        var mediaWrap = document.createElement('div');
        mediaWrap.className = 'accomplishments-slide__media';

        var src = normalizeImagePath(item && item.image);
        if (src) {
          var img = document.createElement('img');
          img.setAttribute('src', src);
          img.setAttribute('alt', (item && item.alt) || ((item && item.year ? item.year + ' ' : '') + ((item && item.label) || '')));
          mediaWrap.appendChild(img);
        }

        inner.appendChild(textWrap);
        inner.appendChild(mediaWrap);
        article.appendChild(inner);
        accViewport.appendChild(article);
      });
    }
  }

  function applyAbout(data) {
    if (!data) return;
    var divisionImages = document.querySelectorAll('img[data-cms-about]');
    divisionImages.forEach(function (img) {
      var key = img.getAttribute('data-cms-about');
      if (!key) return;
      var src = normalizeImagePath(data[key + 'Image']);
      if (src) {
        img.setAttribute('src', src);
      }
      if (typeof data[key + 'Alt'] === 'string' && data[key + 'Alt']) {
        img.setAttribute('alt', data[key + 'Alt']);
      }
    });
  }

  function applySponsor(data) {
    if (!data) return;
    var logoImg = document.querySelector('img[data-cms-sponsor="logos"]');
    if (!logoImg) return;
    var src = normalizeImagePath(data.logosImage);
    if (src) {
      logoImg.setAttribute('src', src);
    }
    if (typeof data.logosAlt === 'string' && data.logosAlt) {
      logoImg.setAttribute('alt', data.logosAlt);
    }
  }

  function applyTeam(data) {
    if (!data) return;
    var grids = document.querySelectorAll('[data-cms-team]');
    grids.forEach(function (grid) {
      var sectionKey = grid.getAttribute('data-cms-team');
      var members = data[sectionKey];
      if (!Array.isArray(members)) return;

      grid.innerHTML = '';
      members.forEach(function (member, index) {
        if (!member || !member.name) return;

        var hasRole = Boolean(member.role && String(member.role).trim());
        var article = document.createElement('article');
        article.className = 'team-member'
          + (hasRole ? '' : ' team-member--name-only')
          + ' scroll-reveal'
          + (index % 3 !== 0 ? ' scroll-reveal--delay-1' : '');

        var photoWrap = document.createElement('div');
        photoWrap.className = 'team-member__photo';

        var src = normalizeImagePath(member.image);
        if (src) {
          var img = document.createElement('img');
          img.setAttribute('src', src);
          img.setAttribute('alt', member.name);
          if (member.photoPosition) {
            img.style.objectPosition = member.photoPosition;
          }
          var zoom = Number(member.photoZoom);
          if (zoom && zoom !== 1) {
            img.style.transform = 'scale(' + zoom + ')';
          }
          photoWrap.appendChild(img);
        } else {
          photoWrap.setAttribute('aria-hidden', 'true');
        }

        var nameEl = document.createElement('h2');
        nameEl.className = 'team-member__name';
        nameEl.textContent = member.name;

        article.appendChild(photoWrap);
        article.appendChild(nameEl);

        if (hasRole) {
          var roleEl = document.createElement('p');
          roleEl.className = 'team-member__role';
          roleEl.textContent = member.role;
          article.appendChild(roleEl);
        }

        grid.appendChild(article);
      });
    });
  }

  function loadCmsImages() {
    var tasks = [];

    if (document.querySelector('img[data-cms-logo]')) {
      tasks.push(fetchJson('data/branding.json').then(applyBranding));
    }
    if (document.getElementById('hero-slideshow') || document.getElementById('accomplishments-carousel')) {
      tasks.push(fetchJson('data/home.json').then(applyHome));
    }
    if (document.querySelector('img[data-cms-about]')) {
      tasks.push(fetchJson('data/about.json').then(applyAbout));
    }
    if (document.querySelector('img[data-cms-sponsor]')) {
      tasks.push(fetchJson('data/sponsor.json').then(applySponsor));
    }
    if (document.querySelector('[data-cms-team]')) {
      tasks.push(fetchJson('data/team.json').then(applyTeam));
    }

    return Promise.all(tasks);
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

  function initHeroSlideshow() {
    var slideshow = document.getElementById('hero-slideshow');
    if (!slideshow) return;

    var slides = slideshow.querySelectorAll('.slideshow-slide');
    var introText = document.getElementById('slideshow-intro-text');
    var line1 = document.getElementById('typed-line1');
    var line2 = document.getElementById('typed-line2');
    var cursor1 = document.getElementById('cursor-line1');
    var cursor2 = document.getElementById('cursor-line2');

    if (slides.length >= 1 && line1 && line2) {
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
        if (slides.length >= 2) {
          setTimeout(startSlideshowCycle, firstSlideDuration);
        }
      }

      typeText(line1, cursor1, 'FRC 9114', 65, function () {
        typeText(line2, cursor2, 'Rotationaries', 55, function () {
          setTimeout(revealIntro, pauseAfterTyping);
        });
      });
    }
  }

  function initScrollReveal() {
    var revealEls = document.querySelectorAll('.scroll-reveal');
    if (!revealEls.length) return;

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

  function initStaggerGroups() {
    var staggerGroups = document.querySelectorAll('[data-stagger]');
    if (!staggerGroups.length) return;

    if ('IntersectionObserver' in window) {
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
    } else {
      staggerGroups.forEach(function (group) {
        group.classList.add('is-visible');
      });
    }
  }

  function initAccomplishmentsCarousel() {
    var accomplishments = document.getElementById('accomplishments-carousel');
    if (!accomplishments) return;

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

  loadCmsImages().then(function () {
    initHeroSlideshow();
    initAccomplishmentsCarousel();
    initScrollReveal();
    initStaggerGroups();
  });
})();
