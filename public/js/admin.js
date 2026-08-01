let enquiries = [];
let deleteId = null;


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

                <th>Delete</th>

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

        🟡 Pending

    </option>

    <option value="Contacted"
        ${row.status==="Contacted"?"selected":""}>

        🟢 Contacted

    </option>

    <option value="Closed"
        ${row.status==="Closed"?"selected":""}>

        🔵 Closed

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

<td>

    <button
        class="deleteBtn"
        onclick="deleteEnquiry(${row.id})">

        Delete

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

       element.className = "statusSelect " + status.toLowerCase();

switch(status){

    case "Pending":

        element.options[element.selectedIndex].text = "🟡 Pending";

        break;

    case "Contacted":

        element.options[element.selectedIndex].text = "🟢 Contacted";

        break;

    case "Closed":

        element.options[element.selectedIndex].text = "🔵 Closed";

        break;

}

    }

    catch(err){

        alert("Unable to update status.");

        console.error(err);

    }

}
// ===============================
// Delete Enquiry
// ===============================

 function deleteEnquiry(id){

    deleteId=id;

    document.getElementById("deleteModal").style.display="flex";

}function closeDeleteModal(){

    document.getElementById("deleteModal").style.display="none";

    deleteId=null;

}


async function confirmDelete(){

    if(deleteId==null){

        return;

    }

    const token=sessionStorage.getItem("adminToken");

    try{

        const res=await fetch("/api/delete-enquiry",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                token,

                id:deleteId

            })

        });

        const data=await res.json();

        if(!res.ok){

            showToast(data.error,"red");

            return;

        }

        enquiries=enquiries.filter(

            e=>e.id!==deleteId

        );

        updateCards();

        renderTable(enquiries);

        closeDeleteModal();

        showToast("Enquiry deleted successfully!");

    }

    catch{

        showToast("Unable to delete enquiry.","red");

    }

}function showToast(message,color="#22C55E"){

    const toast=document.getElementById("toast");

    toast.textContent=message;

    toast.style.background=color;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

}
// ===============================
// Export CSV
// ===============================

function exportCSV(){

    if(enquiries.length===0){

        alert("No enquiries available.");

        return;

    }

    const headers=[

        "ID",

        "Name",

        "Phone",

        "Email",

        "Service",

        "Message",

        "Status",

        "Created At",

        "Updated At"

    ];

    const rows=enquiries.map(e=>[

        e.id,

        e.name,

        e.phone,

        e.email,

        e.service,

        e.message,

        e.status,

        e.created_at,

        e.updated_at

    ]);

    const csv=[headers,...rows]

        .map(row=>

            row.map(value=>

                `"${String(value ?? "").replace(/"/g,'""')}"`
            ).join(",")

        ).join("\n");

    const blob=new Blob([csv],{

        type:"text/csv;charset=utf-8;"

    });

    const url=URL.createObjectURL(blob);

    const link=document.createElement("a");

    const today=new Date().toISOString().slice(0,10);

    link.href=url;

    link.download=`Finnvisor_Enquiries_${today}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

}

// ===============================
// Logout
// ===============================

function logout(){

    sessionStorage.removeItem("adminToken");

    location.reload();

}