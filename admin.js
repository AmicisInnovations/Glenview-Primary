    // Replace with your Supabase credentials
    const SUPABASE_URL = "https://mzqrbmosncwhwqwiilxk.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cXJibW9zbmN3aHdxd2lpbHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNjAyMTYsImV4cCI6MjA3MDczNjIxNn0.PmGBlwbyuhe7CrjSmYh7zEbMzWfnLX_CN_-Zm5x3qPg";
    const BUCKET_NAME = "uploads";

    // Correct initialization
    const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


    const status = document.getElementById("status");
    const fileList = document.getElementById("fileList");

    // Upload handler
    document.getElementById("uploadBtn").addEventListener("click", async () => {
      const file = document.getElementById("fileInput").files[0];
      if (!file) {
        status.textContent = "Please select a file first.";
        return;
      }

      const filePath = `${Date.now()}-${file.name}`;

      let { data, error } = await client.storage
        .from(BUCKET_NAME)
        .upload(filePath, file);

      if (error) {
        console.error(error);
        status.textContent = "Upload failed: " + error.message;
      } else {
        status.textContent = "Uploaded: " + filePath;
        loadFiles(); // refresh file list
      }
    });

    // Fetch all files from bucket
    async function loadFiles() {
      fileList.innerHTML = "";

      let { data, error } = await client.storage
        .from(BUCKET_NAME)
        .list("", { limit: 100 });

      if (error) {
        console.error(error);
        fileList.innerHTML = "<li>Error loading files</li>";
        return;
      }

      for (const file of data) {
        // Get public URL
        const { data: urlData } = client.storage
          .from(BUCKET_NAME)
          .getPublicUrl(file.name);

        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = urlData.publicUrl;
        link.textContent = file.name;
        link.target = "_blank";

        li.appendChild(link);
        fileList.appendChild(li);
      }
    }

    // Load files on page load
    loadFiles();