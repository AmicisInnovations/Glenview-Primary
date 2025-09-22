    // Replace with your Supabase credentials
    const SUPABASE_URL = "https://mzqrbmosncwhwqwiilxk.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cXJibW9zbmN3aHdxd2lpbHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNjAyMTYsImV4cCI6MjA3MDczNjIxNn0.PmGBlwbyuhe7CrjSmYh7zEbMzWfnLX_CN_-Zm5x3qPg";
    const BUCKET_NAME = "uploads";

    // Correct initialization
    const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


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
    const { data: urlData } = client.storage
      .from(BUCKET_NAME)
      .getPublicUrl(`gallery/${file.name}`);

    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = urlData.publicUrl;
    link.textContent = file.name;
    link.target = "_blank";

    li.appendChild(link);
    galleryFileList.appendChild(li);
  }
}

// Load Resource Files
async function loadResourceFiles() {
  const resourcesFileList = document.getElementById("fileList");
  resourcesFileList.innerHTML = "";

  // list top-level resource folders
  const folders = ["newsletter", "exam-timetable", "what-to-learn", "stationary-list"];

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
        const { data: urlData } = client.storage
          .from(BUCKET_NAME)
          .getPublicUrl(`${folder}/${file.name}`);

        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = urlData.publicUrl;
        link.textContent = file.name;
        link.target = "_blank";

        li.appendChild(link);
        subList.appendChild(li);
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

async function loadResourceFiles() {
  const resourcesFileList = document.getElementById("fileList");
  resourcesFileList.innerHTML = "";

  const folders = ["newsletter", "exam-timetable", "what-to-learn", "stationary-list"];

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
      }

      folderLi.appendChild(subList);
      resourcesFileList.appendChild(folderLi);
    }
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
document.getElementById("event-btn").addEventListener("click", () => {
  const name = document.getElementById("eventName").value;
  const desc = document.getElementById("desc").value;
  const date = document.getElementById("eventDate").value;
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;
  const price = document.getElementById("price").value;

  // TODO: validate fields and save event to database

  console.log({ name, desc, date, start, end, price });
  modal.close(); // close after submission
});


// Load both on page load
loadGalleryFiles();
loadResourceFiles();

