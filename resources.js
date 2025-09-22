    const SUPABASE_URL = "https://mzqrbmosncwhwqwiilxk.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cXJibW9zbmN3aHdxd2lpbHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNjAyMTYsImV4cCI6MjA3MDczNjIxNn0.PmGBlwbyuhe7CrjSmYh7zEbMzWfnLX_CN_-Zm5x3qPg";
    const BUCKET_NAME = "uploads";

    // Correct initialization
    const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function loadExamFiles() {
  const examFileList = document.getElementById("exam-timetable");
  examFileList.innerHTML = "";

  let { data, error } = await client.storage
    .from(BUCKET_NAME)
    .list("exam-timetable", { limit: 100 });

  if (error) {
    console.error(error);
    examFileList.innerHTML = "<li>Error loading files</li>";
    return;
  }

  for (const file of data) {
    const path = `exam-timetable/${file.name}`;
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
    examFileList.appendChild(li);
  }
}

async function loadWhatToLearn() {
  const whattolearnFileList = document.getElementById("what-to-learn");
  whattolearnFileList.innerHTML = "";

  let { data, error } = await client.storage
    .from(BUCKET_NAME)
    .list("what-to-learn", { limit: 100 });

  if (error) {
    console.error(error);
    whattolearnFileList.innerHTML = "<li>Error loading files</li>";
    return;
  }

  for (const file of data) {
    const path = `what-to-learn/${file.name}`;
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
    whattolearnFileList.appendChild(li);
  }
}

async function loadStationeryFiles() {
  const stationeryFileList = document.getElementById("stationery-list");
  stationeryFileList.innerHTML = "";

  let { data, error } = await client.storage
    .from(BUCKET_NAME)
    .list("stationery-list", { limit: 100 });

  if (error) {
    console.error(error);
    stationeryFileList.innerHTML = "<li>Error loading files</li>";
    return;
  }

  for (const file of data) {
    const path = `stationery-list/${file.name}`;
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
    stationeryFileList.appendChild(li);
  }
}

loadStationeryFiles();
loadWhatToLearn();
loadExamFiles();

