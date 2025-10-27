// Replace with your Supabase credentials
    const SUPABASE_URL = "https://mzqrbmosncwhwqwiilxk.supabase.co";
    const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16cXJibW9zbmN3aHdxd2lpbHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNjAyMTYsImV4cCI6MjA3MDczNjIxNn0.PmGBlwbyuhe7CrjSmYh7zEbMzWfnLX_CN_-Zm5x3qPg";
    const BUCKET_NAME = "uploads";

    // Correct initialization
    const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
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
  <div style="
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    width: 95%;
    margin: 1rem auto;
  ">
`;

data.forEach(event => {
  html += `
    <div style="
      background-color: #fff;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      border-radius: 12px;
      padding: 1rem 1.2rem;
      font-size: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    "
    onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 6px 14px rgba(0,0,0,0.1)';"
    onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 10px rgba(0,0,0,0.05)';"
    >
      <h3 style="margin: 0 0 0.5rem 0; color: #2b2b2b;">${event.event_name}</h3>
      <p style="margin: 0.2rem 0; color: #555;"><strong>Description:</strong> ${event.description || '-'}</p>
      <p style="margin: 0.2rem 0; color: #555;"><strong>Date:</strong> ${event.date || '-'}</p>
      <p style="margin: 0.2rem 0; color: #555;"><strong>Time:</strong> ${event.time || '-'}</p>
      <p style="margin: 0.2rem 0; color: #555;"><strong>Cost:</strong> ${event.cost || '-'}</p>
    </div>
  `;
});

html += `</div>`;
document.getElementById("event-container").innerHTML = html;


    }

window.addEventListener("DOMContentLoaded", () => {
  fetchEvents();
});
