/* =========================================================
   PROFESSIONAL HAIR SALON - KATY
   script.js
   Handles: mobile navigation, scroll-reveal animations,
   the gallery lightbox, and the booking form's mailto flow.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* =======================================================
     CONFIG — the two values a shop owner is most likely to
     need to change later live here at the top of the file.
     ======================================================= */

  // The booking form builds a mailto: link with this address.
  // Replace "YOUR_EMAIL_HERE" with the shop's real inbox before
  // taking live bookings — until then, the form will warn
  // whoever submits it instead of silently failing.
  const BUSINESS_EMAIL = "YOUR_EMAIL_HERE";

  // The "View Google Reviews" button uses this URL. Swap it out
  // any time the shop's Google Maps listing link changes.
  const GOOGLE_REVIEWS_URL =
    "https://www.google.com/maps/place/Professional+Hair+Salon+-+Katy/@29.7569839,-95.7553508,17z/data=!4m8!3m7!1s0x864127cee7dad945:0xadf25db508c28f8e!8m2!3d29.7569839!4d-95.7527759!9m1!1b1!16s%2Fg%2F11f75v2cg8?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D";

  const reviewsLink = document.getElementById("google-reviews-link");
  if (reviewsLink) reviewsLink.href = GOOGLE_REVIEWS_URL;


  /* =======================================================
     MOBILE NAVIGATION
     ======================================================= */
  const navToggle = document.getElementById("nav-toggle");
  const mainNav = document.getElementById("main-nav");

  function closeNav() {
    mainNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  function toggleNav() {
    const isOpen = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", toggleNav);

    // Close the mobile menu whenever a nav link is used.
    mainNav.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }


  /* =======================================================
     SMOOTH SCROLL (fallback for browsers ignoring the CSS
     scroll-behavior property, and used for any in-page link)
     ======================================================= */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });


  /* =======================================================
     SCROLL REVEAL
     Every element with the "reveal" class fades/slides in the
     first time it enters the viewport.
     ======================================================= */
  const revealTargets = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // No IntersectionObserver support — just show everything.
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }


  /* =======================================================
     GALLERY + LIGHTBOX
     ======================================================= */
  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-ydd_DCROCTA?q=80&w=900&auto=format&fit=crop",
      alt: "Barber giving a client a fresh fade haircut",
      caption: "A fresh fade in progress",
      tall: true
    },
    {
      src: "https://images.unsplash.com/photo-P0llk_dL7DE?q=80&w=900&auto=format&fit=crop",
      alt: "Close-up of a straight razor used for a clean hairline",
      caption: "Straight-razor line work",
      tall: false
    },
    {
      src: "https://images.unsplash.com/photo-dU6eE_j2My8?q=80&w=900&auto=format&fit=crop",
      alt: "Modern black and silver barber chair",
      caption: "One of our barber chairs",
      tall: false
    },
    {
      src: "https://images.unsplash.com/photo-I2qtMgu8IJA?q=80&w=900&auto=format&fit=crop",
      alt: "Barber trimming a client's beard",
      caption: "Beard trim in the chair",
      tall: true
    },
    {
      src: "https://images.unsplash.com/photo-586N6c3vNS0?q=80&w=900&auto=format&fit=crop",
      alt: "Close-up of barber shears on a table",
      caption: "Tools of the trade",
      tall: false
    },
    {
      src: "https://images.unsplash.com/photo-0iW0NSHjiiw?q=80&w=900&auto=format&fit=crop",
      alt: "Barber giving a young child a haircut",
      caption: "Kids haircuts, done patiently",
      tall: false
    },
    {
      src: "https://images.unsplash.com/photo-BBGyxhtPpC0?q=80&w=900&auto=format&fit=crop",
      alt: "Barbershop interior with a chair facing a mirror",
      caption: "Inside the shop",
      tall: true
    },
    {
      src: "https://images.unsplash.com/photo-PDDvMlScofU?q=80&w=900&auto=format&fit=crop",
      alt: "Barber finishing a haircut with steam towel service",
      caption: "The finishing touch",
      tall: false
    }
  ];

  const galleryGrid = document.getElementById("gallery-grid");
  let currentImageIndex = 0;

  // Build the gallery grid from the data above.
  galleryImages.forEach(function (image, index) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "gallery-item" + (image.tall ? " span-2" : "");
    item.setAttribute("data-index", String(index));
    item.setAttribute("aria-label", "View larger image: " + image.caption);

    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "lazy";

    const caption = document.createElement("span");
    caption.className = "gallery-caption";
    caption.textContent = image.caption;

    item.appendChild(img);
    item.appendChild(caption);
    item.addEventListener("click", function () { openLightbox(index); });

    galleryGrid.appendChild(item);
  });

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const lightboxClose = document.getElementById("lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");

  function renderLightboxImage() {
    const image = galleryImages[currentImageIndex];
    lightboxImg.src = image.src.replace("w=900", "w=1600");
    lightboxImg.alt = image.alt;
    lightboxCounter.textContent = (currentImageIndex + 1) + " / " + galleryImages.length;
  }

  function openLightbox(index) {
    currentImageIndex = index;
    renderLightboxImage();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    renderLightboxImage();
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    renderLightboxImage();
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", showPrevImage);
  lightboxNext.addEventListener("click", showNextImage);

  // Clicking the dark backdrop (but not the image itself) closes the lightbox.
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard support: Escape closes, arrow keys browse.
  document.addEventListener("keydown", function (e) {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showPrevImage();
    if (e.key === "ArrowRight") showNextImage();
  });


  /* =======================================================
     BOOKING FORM — validates required fields, then opens the
     visitor's email client with a pre-filled message.
     ======================================================= */
  const bookingForm = document.getElementById("booking-form");
  const formError = document.getElementById("form-error");

  if (bookingForm) {
    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      formError.hidden = true;

      // If the shop owner hasn't configured a real address yet,
      // stop here and say so clearly instead of sending a broken mailto link.
      if (BUSINESS_EMAIL === "YOUR_EMAIL_HERE") {
        formError.textContent =
          "Booking is almost ready: the shop's email address still needs to be added in script.js (look for BUSINESS_EMAIL near the top of the file) before requests can be sent.";
        formError.hidden = false;
        return;
      }

      const fullName = bookingForm.fullName.value.trim();
      const phone = bookingForm.phone.value.trim();
      const email = bookingForm.email.value.trim();
      const date = bookingForm.date.value;
      const time = bookingForm.time.value;
      const service = bookingForm.service.value;
      const notes = bookingForm.notes.value.trim();

      // Required-field validation.
      if (!fullName || !phone || !email || !date || !time || !service) {
        formError.textContent = "Please fill in your name, phone, email, preferred date, preferred time and service before booking.";
        formError.hidden = false;
        return;
      }

      const subject = "New Appointment Request - " + fullName;

      const bodyLines = [
        "New Appointment Request",
        "",
        "Name: " + fullName,
        "Phone: " + phone,
        "Email: " + email,
        "Preferred Date: " + date,
        "Preferred Time: " + time,
        "Service: " + service,
        "",
        "Additional Notes:",
        notes || "(none)"
      ];
      const body = bodyLines.join("\n");

      const mailtoLink =
        "mailto:" + encodeURIComponent(BUSINESS_EMAIL) +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailtoLink;
    });
  }

});
