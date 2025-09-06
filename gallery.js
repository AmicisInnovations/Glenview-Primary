    const SUPABASE_URL = "https://mzqrbmosncwhwqwiilxk.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cXJibW9zbmN3aHdxd2lpbHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNjAyMTYsImV4cCI6MjA3MDczNjIxNn0.PmGBlwbyuhe7CrjSmYh7zEbMzWfnLX_CN_-Zm5x3qPg";
    const BUCKET_NAME = "uploads";

    const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    const gallery = document.getElementById("gallery");

    async function loadImages() {
      gallery.innerHTML = "";

      let { data, error } = await client.storage
        .from(BUCKET_NAME)
        .list("", { limit: 100 });

      if (error) {
        console.error(error);
        gallery.innerHTML = "<p>Error loading images</p>";
        return;
      }

      for (const file of data) {
        const { data: urlData } = client.storage
          .from(BUCKET_NAME)
          .getPublicUrl(file.name);

        if (/\.(jpg|jpeg|png|gif|webp)$/i.test(file.name)) {
          const img = document.createElement("img");
          img.src = urlData.publicUrl;
          img.alt = file.name;
          gallery.appendChild(img);
        }
      }
    }

    // Load images on page load
    loadImages();