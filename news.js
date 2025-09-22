    const SUPABASE_URL = "https://mzqrbmosncwhwqwiilxk.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cXJibW9zbmN3aHdxd2lpbHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNjAyMTYsImV4cCI6MjA3MDczNjIxNn0.PmGBlwbyuhe7CrjSmYh7zEbMzWfnLX_CN_-Zm5x3qPg";
    const BUCKET_NAME = "uploads";

    // Correct initialization
    const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadNewsFiles() {
  const newsletterFileList = document.getElementById("newsletter");
  newsletterFileList.innerHTML = "";

  let { data, error } = await client.storage
    .from(BUCKET_NAME)
    .list("newsletter", { limit: 100 });

  if (error) {
    console.error(error);
    newsletterFileList.innerHTML = "<li>Error loading files</li>";
    return;
  }

  for (const file of data) {
    const path = `newsletter/${file.name}`;
    const { data: urlData } = client.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);

    const li = document.createElement("li");

    // File link
    const link = document.createElement("a");
    link.href = urlData.publicUrl;
    link.textContent = file.name;
    link.target = "_blank";

    li.appendChild(link);
    newsletterFileList.appendChild(li);
  }
}

loadNewsFiles();