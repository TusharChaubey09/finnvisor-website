export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { name, phone, email } = await request.json();

    if (!name || !phone || !email) {
      return new Response(JSON.stringify({ error: 'All fields are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(phone)) {
      return new Response(JSON.stringify({ error: 'Invalid phone number.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await env.DB.prepare(
      'INSERT INTO enquiries (name, phone, email) VALUES (?, ?, ?)'
    ).bind(name, phone, email).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }catch (err) {
    return new Response(JSON.stringify({ error: err.message, stack: err.stack }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }}