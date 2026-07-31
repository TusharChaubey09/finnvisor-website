document.getElementById('enquiryForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const msgEl = document.getElementById('formMessage');
  const submitBtn = e.target.querySelector('button');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  try {
    const res = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email })
    });

    const data = await res.json();

    if (res.ok) {
      msgEl.style.color = '#4ade80';
      msgEl.textContent = "Thank you! We've received your enquiry and will contact you shortly.";
      e.target.reset();
    } else {
      msgEl.style.color = '#f87171';
      msgEl.textContent = data.error || 'Something went wrong. Please try again.';
    }
  } catch (err) {
    msgEl.style.color = '#f87171';
    msgEl.textContent = 'Network error. Please try again.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Enquiry';
  }
});