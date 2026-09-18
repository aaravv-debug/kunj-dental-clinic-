// Kunj Multispeciality Dental Care - Interactive Functionality

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-active');
      const isExpanded = navLinks.classList.contains('mobile-active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
      menuToggle.innerHTML = isExpanded 
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isActive = item.classList.contains('active');

      // Close all items
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      // If wasn't active, open it
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 3. Treatment Filter Tabs (on treatments.html)
  const filterButtons = document.querySelectorAll('.filter-btn');
  const treatmentCards = document.querySelectorAll('.detail-treatment-card');

  if (filterButtons.length > 0 && treatmentCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        treatmentCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.4s ease forwards';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Modal Handler
  const modal = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.open-booking-modal');
  const closeModalBtn = document.getElementById('closeModal');

  const openModal = (prefillService = '') => {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (prefillService) {
      const serviceSelect = modal.querySelector('select[name="service"]');
      if (serviceSelect) {
        serviceSelect.value = prefillService;
      }
    }
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      openModal(service);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // 5. Booking Form Submission (Homepage Hero form, Treatments page form, or Modal form)
  const bookingForms = document.querySelectorAll('.appointment-form');

  bookingForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="patient_name"]')?.value || 'Guest';
      const phone = form.querySelector('[name="phone"]')?.value || '';
      const service = form.querySelector('[name="service"]')?.value || 'Consultation';
      const date = form.querySelector('[name="date"]')?.value || 'Earliest available';
      const time = form.querySelector('[name="time"]')?.value || 'Morning slot';

      // Create WhatsApp message
      const text = encodeURIComponent(
        `Hello Dr. Chirag Patel (Kunj Multispeciality Dental Care),\n\nI would like to book a dental appointment:\n- Patient Name: ${name}\n- Phone: ${phone}\n- Treatment Needed: ${service}\n- Preferred Date: ${date}\n- Preferred Time: ${time}\n\nPlease confirm my appointment slot. Thank you!`
      );

      // WhatsApp direct link for Dr. Chirag Patel (Kunj Multispeciality Dental Care)
      const whatsappUrl = `https://wa.me/919825032937?text=${text}`;

      // Show confirmation dialog / redirect
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>Opening WhatsApp...</span>`;
      submitBtn.disabled = true;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // If modal was open, show thank you state
        if (modal && modal.classList.contains('active')) {
          const modalBody = modal.querySelector('.modal-body');
          if (modalBody) {
            modalBody.innerHTML = `
              <div class="success-card">
                <div class="success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3 style="font-family: var(--font-heading); font-size: 1.4rem; color: var(--primary-900); margin-bottom: 8px;">Appointment Request Sent!</h3>
                <p style="color: var(--neutral-600); font-size: 0.95rem; margin-bottom: 24px;">Dr. Chirag Patel's team will verify and confirm your slot on WhatsApp shortly.</p>
                <button class="btn btn-primary" onclick="location.reload()">Done</button>
              </div>
            `;
          }
        } else {
          alert(`Thank you, ${name}! Your appointment request for ${service} on ${date} has been sent directly to Kunj Multispeciality Dental Care on WhatsApp.`);
        }
      }, 700);
    });
  });
});
