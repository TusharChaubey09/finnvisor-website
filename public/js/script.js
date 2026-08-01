// ===============================
// Mobile Navigation
// ===============================

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {

    hamburger.addEventListener("click", () => {

        navLinks.classList.toggle("active");

    });

    document.querySelectorAll("#navLinks a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");

        });

    });

    document.addEventListener("click", (e) => {

        if (
            !hamburger.contains(e.target) &&
            !navLinks.contains(e.target)
        ) {

            navLinks.classList.remove("active");

        }

    });

}


// ===============================
// Enquiry Form
// ===============================

const enquiryForm = document.getElementById("enquiryForm");

if (enquiryForm) {

    enquiryForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const name = document.getElementById("name").value.trim();

        const phone = document.getElementById("phone").value.trim();

        const email = document.getElementById("email").value.trim();

        const service = document.getElementById("service").value;

        const message = document.getElementById("message").value.trim();

        const msgEl = document.getElementById("formMessage");

        const submitBtn = e.target.querySelector("button");

        submitBtn.disabled = true;

        submitBtn.textContent = "Submitting...";

        try {

            const res = await fetch("/api/enquiry", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    name,
                    phone,
                    email,
                    service,
                    message

                })

            });

            const data = await res.json();

            if (res.ok) {

                msgEl.style.color = "#22C55E";

                msgEl.textContent = "Thank you! We will contact you shortly.";

                e.target.reset();

            }
            else {

                msgEl.style.color = "#EF4444";

                msgEl.textContent = data.error || "Something went wrong.";

            }

        }
        catch {

            msgEl.style.color = "#EF4444";

            msgEl.textContent = "Network Error.";

        }

        submitBtn.disabled = false;

        submitBtn.textContent = "Schedule Free Consultation";

    });

}


// ===============================
// Call Popup
// ===============================

function openCallPopup() {

    document.getElementById("callPopup").classList.add("active");

}

function closeCallPopup() {

    document.getElementById("callPopup").classList.remove("active");

}