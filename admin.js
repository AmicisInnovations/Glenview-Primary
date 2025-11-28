// Replace with your Supabase credentials
    const SUPABASE_URL = "https://mzqrbmosncwhwqwiilxk.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cXJibW9zbmN3aHdxd2lpbHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNjAyMTYsImV4cCI6MjA3MDczNjIxNn0.PmGBlwbyuhe7CrjSmYh7zEbMzWfnLX_CN_-Zm5x3qPg";
    const BUCKET_NAME = "uploads";
// Add the Supabase Auth Client dependency if it's not already included in your HTML
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// --- START OF ADDED AUTH CHECK ---
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
/**
 * Checks the current Supabase session.
 * If no session is found, redirects to login.html.
 */
async function checkUserSession() {
    // client is already defined below as: const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const { data: { session }, error } = await client.auth.getSession();

    if (error) {
        console.error("Supabase session error:", error);
        // Treat error as not logged in for safety
        window.location.href = 'login.html'; 
        return;
    }

    if (!session) {
        // User is NOT logged in. Redirect them.
        console.log("No active session found. Redirecting to login.");
        window.location.href = 'login.html'; 
        // Important: Stop further execution of the script
        return; 
    }
    
    // User is logged in. Log the user ID and continue script execution.
    console.log("User is logged in:", session.user.id);
}

// Immediately call the check function. 
// Note: The rest of the script is only guaranteed to run if the redirect doesn't happen.
checkUserSession();

// --- END OF ADDED AUTH CHECK ---


// Correct initialization
// This initialization must occur before checkUserSession() runs,
// or checkUserSession() must be called after this initialization.
// Since you provided this code structure, we assume 'supabase' is globally available,
// or we ensure the check is called after this.


const status = document.getElementById("status");
const fileList = document.getElementById("fileList");

// Upload handler
// Upload to Gallery
document.getElementById("uploadBtn-Gallery").addEventListener("click", async () => {
    const file = document.getElementById("fileInput").files[0];
    if (!file) {
        status.textContent = "Please select a file first.";
        return;
    }

    const filePath = `gallery/${Date.now()}-${file.name}`;
    let { data, error } = await client.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

    if (error) {
        console.error(error);
        status.textContent = "Upload failed: " + error.message;
    } else {
        status.textContent = "Uploaded: " + filePath;
        loadGalleryFiles();
    }
});

// Upload to Resources
document.getElementById("uploadBtn-Resources").addEventListener("click", async () => {
    const folder = document.getElementById("resources").value;
    const file = document.getElementById("fileInput-Resources").files[0];
    if (!file) {
        status.textContent = "Please select a file first.";
        return;
    }

    const filePath = `${folder}/${Date.now()}-${file.name}`;
    let { data, error } = await client.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

    if (error) {
        console.error(error);
        status.textContent = "Upload failed: " + error.message;
    } else {
        status.textContent = "Uploaded to resources: " + filePath;
        loadResourceFiles();
    }
});

// Load Gallery Files
async function loadGalleryFiles() {
    const galleryFileList = document.getElementById("fileListGal");
    galleryFileList.innerHTML = "";

    let { data, error } = await client.storage
        .from(BUCKET_NAME)
        .list("gallery", { limit: 100 });

    if (error) {
        console.error(error);
        galleryFileList.innerHTML = "<li>Error loading files</li>";
        return;
    }

    for (const file of data) {
        const path = `gallery/${file.name}`;
        const { data: urlData } = client.storage
            .from(BUCKET_NAME)
            .getPublicUrl(path);

        const li = document.createElement("li");

        // File link
        const link = document.createElement("a");
        link.href = urlData.publicUrl;
        link.textContent = file.name;
        link.target = "_blank";

        // Delete button
        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.classList.add("deleteBtn");
        delBtn.addEventListener("click", () => deleteFile(path, loadGalleryFiles));

        li.appendChild(link);
        li.appendChild(delBtn);
        galleryFileList.appendChild(li);
    }
}

// Load Resource Files
async function loadResourceFiles() {
    const resourcesFileList = document.getElementById("fileList");
    resourcesFileList.innerHTML = "";

    const folders = ["newsletter", "exam-timetable", "what-to-learn", "stationery-list"];

    for (const folder of folders) {
        let { data, error } = await client.storage
            .from(BUCKET_NAME)
            .list(folder, { limit: 100 });

        if (error) {
            console.error(error);
            resourcesFileList.innerHTML += `<li>Error loading ${folder}</li>`;
            continue;
        }

        if (data.length > 0) {
            const folderLi = document.createElement("li");
            folderLi.textContent = folder + ":";

            const subList = document.createElement("ul");

            for (const file of data) {
                const path = `${folder}/${file.name}`;
                const { data: urlData } = client.storage
                    .from(BUCKET_NAME)
                    .getPublicUrl(path);

                const li = document.createElement("li");

                // File link
                const link = document.createElement("a");
                link.href = urlData.publicUrl;
                link.textContent = file.name;
                link.target = "_blank";

                // Delete button
                const delBtn = document.createElement("button");
                delBtn.textContent = "Delete";
                delBtn.classList.add("deleteBtn");
                delBtn.addEventListener("click", () => deleteFile(path, loadResourceFiles));

                li.appendChild(link);
                li.appendChild(delBtn);
                subList.appendChild(li);
                subList.classList.add("subList");
            }

            folderLi.appendChild(subList);
            resourcesFileList.appendChild(folderLi);
        }
    }
}

async function deleteFile(path, refreshFn) {
    if (!confirm(`Are you sure you want to delete ${path}?`)) return;

    const { data, error } = await client.storage
        .from(BUCKET_NAME)
        .remove([path]);

    if (error) {
        console.error("Delete failed:", error);
        alert("Failed to delete file: " + error.message);
    } else {
        alert("Deleted: " + path);
        refreshFn(); // reload list
    }
}


// Grab modal elements
const createEventBtn = document.getElementById("create-event");
const modal = document.querySelector(".modal-event");
const closeBtn = modal.querySelector(".close-btn");

// Open modal on button click
createEventBtn.addEventListener("click", () => {
    modal.showModal(); // <dialog> method to open modal
});

// Close modal on X button click
closeBtn.addEventListener("click", () => {
    modal.close();
});

// Optional: close modal when clicking outside modal content
modal.addEventListener("click", (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
    );
    if (!isInDialog) modal.close();
});

// Handle CREATE EVENT button inside modal
const eventSubmitBtn = document.getElementById('event-btn');

// Handle form submission
eventSubmitBtn.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default button behavior

    // Collect data from inputs
    const event_name = document.getElementById('eventName').value;
    const description = document.getElementById('desc').value;
    const date = document.getElementById('eventDate').value;
    const startTime = document.getElementById('start').value;
    const endTime = document.getElementById('end').value; // optional if you want
    const costInput = document.getElementById('price').value;
    const cost = parseInt(costInput, 10) || 0;
    const status = 'pending'; // default status

    // Insert into Supabase
    const { error, data } = await client
        .from('events')
        .insert([
            {
                description,
                date,
                time: startTime,
                cost,
                status,
                event_name
            }
        ]);

    if (error) {
        console.error("Error adding event:", error.message, error);
        alert("Failed to add event: " + error.message);
    } else {
        console.log('Event added successfully:', data);
        alert('Event created successfully!');
        modal.close();

        // Optionally clear form
        document.getElementById('eventName').value = '';
        document.getElementById('desc').value = '';
        document.getElementById('eventDate').value = '';
        document.getElementById('start').value = '';
        document.getElementById('end').value = '';
        document.getElementById('price').value = '';
        fetchEvents(); // Refresh event list
    }
});

// --- 2️⃣ Fetch event details ---
async function fetchEvents() {
    const { data, error } = await client
        .from('events') // replace with your table name
        .select('event_name, cost, date, time, description');

    if (error) {
        console.error("Error fetching events:", error);
        document.getElementById("event-container").textContent = "Error loading events.";
        return;
    }

    // --- 3️⃣ Display the events ---
    if (data.length === 0) {
        document.getElementById("event-container").textContent = "No events found.";
        return;
    }

    let html = `
<table style="
    width: 95%;
    border-collapse: collapse;
    margin-left: 1rem;
    margin-right: 1rem;
    font-size: 1rem;
    background-color: #fff;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    border-radius: 8px;
    overflow: hidden;
">
`;

    html += "<thead><tr><th>Event</th><th>Description</th><th>Date</th><th>Time</th><th>Cost</th></tr></thead>";

    data.forEach(event => {
        html += `
          <tr>
            <td>${event.event_name}</td>
            <td>${event.description || '-'}</td>
            <td>${event.date || '-'}</td>
            <td>${event.time || '-'}</td>
            <td>${event.cost || '-'}</td>
          </tr>
        `;
    });

    html += "</table>";
    document.getElementById("event-container").innerHTML = html;

}

// Load both on page load and fetch events
window.addEventListener("DOMContentLoaded", () => {
    // The checkUserSession() runs immediately upon script parsing.
    // If we've reached here, the user is likely authenticated.
    loadGalleryFiles();
    loadResourceFiles();
    fetchEvents();
});