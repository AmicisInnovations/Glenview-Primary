async function loadStaff() {
  try {
    const response = await fetch('staff.json');
    const staffData = await response.json();

    const container = document.getElementById('staff-container');
    container.innerHTML = '';

    staffData.forEach(member => {
      const card = document.createElement('div');
      card.classList.add('staff-card');

      card.innerHTML = `
        <img src="${member.photo}" alt="${member.name}">
        <h3>${member.name}</h3>
        <p>${member.position}</p>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading staff data:', error);
  }
}

loadStaff();
