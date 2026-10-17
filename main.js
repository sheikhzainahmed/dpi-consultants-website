/**
 * DPI Consultants | Premium Student Division
 * Main Interactive Controller (Navigation, Scroll Effects, Consultation Booking)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Scroll Effect
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 24) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Navigation Menu Toggle
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Consultation Page Role Tabs & URL Query Pre-Selection
  const roleTabs = document.querySelectorAll('.role-tab');
  const roleInput = document.getElementById('applicantRole');
  if (roleTabs.length && roleInput) {
    roleTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        roleTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        roleInput.value = tab.dataset.role || 'Student';
      });
    });
  }

  // Pre-select topic checkboxes based on ?topic= query param
  const urlParams = new URLSearchParams(window.location.search);
  const topicParam = urlParams.get('topic');
  if (topicParam) {
    const topicMap = {
      admissions: 'Global University Admissions',
      scholarships: 'Scholarships & Financial Aid',
      profile: 'Profile & Portfolio Building',
    };
    const targetValue = topicMap[topicParam];
    if (targetValue) {
      const checkbox = document.querySelector(`input[name="focusArea"][value="${targetValue}"]`);
      if (checkbox) {
        checkbox.checked = true;
      }
    }
  }

  // 4. Interactive Consultation Form Submission
  const consultationForm = document.getElementById('consultationForm');
  const successPanel = document.getElementById('formSuccessPanel');
  const summaryBox = document.getElementById('consultationSummaryText');
  const whatsappBtn = document.getElementById('sendWhatsappBtn');
  const copyBriefBtn = document.getElementById('copyBriefBtn');
  const resetFormBtn = document.getElementById('resetConsultationBtn');

  if (consultationForm && successPanel) {
    let generatedBrief = '';

    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(consultationForm);
      const role = formData.get('applicantRole') || 'Student';
      const fullName = formData.get('fullName') || '';
      const email = formData.get('email') || '';
      const phone = formData.get('phone') || '';
      const city = formData.get('city') || '';
      const qualification = formData.get('qualification') || '';
      const intendedSubject = formData.get('intendedSubject') || '';
      const intakeYear = formData.get('intakeYear') || '';
      const goals = formData.get('goals') || '';

      const destinations = formData.getAll('destination');
      const focusAreas = formData.getAll('focusArea');

      const destText = destinations.length ? destinations.join(', ') : 'Open to Exploring (US / UK)';
      const focusText = focusAreas.length ? focusAreas.join(', ') : 'Comprehensive Admissions & Strategy';

      generatedBrief = [
        `DPI CONSULTANTS: CONSULTATION REQUEST`,
        `----------------------------------------`,
        `Role: ${role}`,
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Phone / WhatsApp: ${phone}`,
        `City: ${city || 'Pakistan'}`,
        `Current Background: ${qualification}`,
        `Preferred Destination(s): ${destText}`,
        `Intended Subject / Field: ${intendedSubject || 'To be discussed'}`,
        `Target Intake: ${intakeYear || 'Upcoming Cycle'}`,
        `Focus Areas: ${focusText}`,
        goals ? `Ambitions & Notes: ${goals}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      if (summaryBox) {
        summaryBox.innerHTML = `
          <div style="display:grid; gap:0.45rem;">
            <div><strong>Applicant (${role}):</strong> ${escapeHtml(fullName)} (${escapeHtml(city || 'Pakistan')})</div>
            <div><strong>Academic Stage:</strong> ${escapeHtml(qualification)}</div>
            <div><strong>Preferred Destinations:</strong> ${escapeHtml(destText)}</div>
            <div><strong>Intended Subject:</strong> ${escapeHtml(intendedSubject || 'To be discussed')} (${escapeHtml(intakeYear)})</div>
            <div><strong>Priority Areas:</strong> ${escapeHtml(focusText)}</div>
          </div>
        `;
      }

      if (whatsappBtn) {
        const waText = encodeURIComponent(
          `Hello DPI Consultants (Premium Student Division),\n\nI would like to book a personalised consultation.\n\n` +
            `*Name:* ${fullName} (${role})\n` +
            `*Current Qualification:* ${qualification}\n` +
            `*Preferred Destinations:* ${destText}\n` +
            `*Intended Subject:* ${intendedSubject || 'Undecided'}\n` +
            `*Focus Areas:* ${focusText}\n` +
            (goals ? `*Notes:* ${goals}\n` : '')
        );
        whatsappBtn.href = `https://wa.me/?text=${waText}`;
      }

      consultationForm.style.display = 'none';
      successPanel.classList.add('visible');
    });

    if (copyBriefBtn) {
      copyBriefBtn.addEventListener('click', () => {
        if (!generatedBrief) return;
        navigator.clipboard.writeText(generatedBrief).then(() => {
          const originalText = copyBriefBtn.textContent;
          copyBriefBtn.textContent = '✓ Consultation Brief Copied';
          setTimeout(() => {
            copyBriefBtn.textContent = originalText;
          }, 2500);
        });
      });
    }

    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        consultationForm.reset();
        successPanel.classList.remove('visible');
        consultationForm.style.display = 'block';
      });
    }
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
