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
  const resourcesFileList = document.getElementById("filelist");
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

// Load both on page load
loadGalleryFiles();
loadResourceFiles();

