let enquiries = [];


// ===============================
// Login + Load Data
// ===============================

async function loadEnquiries() {

    const token = document.getElementById("tokenInput").value.trim();
    const loginError = document.getElementById("loginError");

    loginError.textContent = "";

    try {

        const res = await fetch(`/api/admin?token=${encodeURIComponent(token)}`);

        const data = await res.json();

        if (!res.ok) {

            loginError.textContent = data.error || "Login Failed";
            return;

        }

        enquiries = data;
        sessionStorage.setItem("adminToken", token);

        document.getElementById("loginPage").style.display = "none";

        document.getElementById("dashboard").style.display = "block";

        updateCards();

        renderTable(enquiries);

    }

    catch (err) {

        loginError.textContent = "Network Error";

        console.error(err);

    }

}



// ===============================
// Dashboard Cards
// ===============================

function updateCards() {

    document.getElementById("totalCount").textContent = enquiries.length;

    const today = new Date().toISOString().slice(0, 10);

    const todayCount = enquiries.filter(e =>
        e.created_at.startsWith(today)
    ).length;

    document.getElementById("todayCount").textContent = todayCount;

}



// ===============================
// Render Table
// ===============================

function renderTable(data) {

    let html = `

    <table>

        <thead>

            <tr>

                <th>Name</th>

                <th>Service</th>

                <th>Status</th>

                <th>Date</th>

                <th>View</th>

            </tr>

        </thead>

        <tbody>

    `;

    data.forEach((row, index) => {

        html += `

        <tr>

            <td>${row.name}</td>

            <td>${row.service}</td>

           <td>

<select
class="statusSelect ${row.status.toLowerCase()}"
onchange="updateStatus(${row.id}, this.value, this)">

    <option value="Pending"
        ${row.status==="Pending"?"selected":""}>

        Pending

    </option>

    <option value="Contacted"
        ${row.status==="Contacted"?"selected":""}>

        Contacted

    </option>

    <option value="Closed"
        ${row.status==="Closed"?"selected":""}>

        Closed

    </option>

</select>

</td>

            <td>${row.created_at}</td>

            <td>

                <button
                    class="viewBtn"
                    onclick="viewEnquiry(${index})">

                    View

                </button>

            </td>

        </tr>

        `;

    });

    html += `

        </tbody>

    </table>

    `;

    document.getElementById("tableContainer").innerHTML = html;

}



// ===============================
// Search
// ===============================

document.addEventListener("DOMContentLoaded", () => {

    const search = document.getElementById("searchInput");

    if (search) {

        search.addEventListener("input", () => {

            const value = search.value.toLowerCase();

            const filtered = enquiries.filter(row =>

                row.name.toLowerCase().includes(value) ||

                row.phone.toLowerCase().includes(value) ||

                row.email.toLowerCase().includes(value) ||

                row.service.toLowerCase().includes(value) ||

                row.status.toLowerCase().includes(value)

            );

            renderTable(filtered);

        });

    }

});



// ===============================
// View Customer Details
// ===============================

function viewEnquiry(index) {

    const e = enquiries[index];

    document.getElementById("modalName").textContent = e.name;

    document.getElementById("modalPhone").textContent = e.phone;

    document.getElementById("modalEmail").textContent = e.email;

    document.getElementById("modalService").textContent = e.service;

    document.getElementById("modalMessage").textContent = e.message;

    document.getElementById("modalStatus").textContent = e.status;

    document.getElementById("modalCreated").textContent = e.created_at;

    document.getElementById("modalUpdated").textContent = e.updated_at;

    document.getElementById("viewModal").style.display = "flex";

}



// ===============================
// Close Modal
// ===============================

function closeModal() {

    document.getElementById("viewModal").style.display = "none";

}
async function updateStatus(id,status,element){

    try{

        const token = sessionStorage.getItem("adminToken");

        const res=await fetch("/api/update-status",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                token,
                id,
                status

            })

        });

        const data=await res.json();

        if(!res.ok){

            alert(data.error);

            return;

        }

        element.className="statusSelect "+status.toLowerCase();

    }

    catch(err){

        alert("Unable to update status.");

        console.error(err);

    }

}



// ===============================
// Logout
// ===============================

function logout(){

    sessionStorage.removeItem("adminToken");

    location.reload();

}