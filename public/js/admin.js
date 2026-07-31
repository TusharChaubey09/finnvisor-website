async function loadEnquiries() {
  const token = document.getElementById('tokenInput').value.trim();
  const resultEl = document.getElementById('result');
  resultEl.innerHTML = 'Loading...';

  try {
    const res = await fetch(`/api/admin?token=${encodeURIComponent(token)}`);
    const data = await res.json();

    if (!res.ok) {
      resultEl.innerHTML = `<p style="color:red;">${data.error}</p>`;
      return;
    }

    if (data.length === 0) {
      resultEl.innerHTML = '<p>No enquiries yet.</p>';
      return;
    }

    let html = '<table><tr><th>Name</th><th>Phone</th><th>Email</th><th>Date</th></tr>';
    data.forEach(row => {
      html += `<tr><td>${row.name}</td><td>${row.phone}</td><td>${row.email}</td><td>${row.created_at}</td></tr>`;
    });
    html += '</table>';
    resultEl.innerHTML = html;
  } catch (e) {
    resultEl.innerHTML = '<p style="color:red;">Network error.</p>';
  }
}