export async function initializeData() {
  fetch('../../data/data.json')
  .then(response => response.json())
  .then(data => {
    if(localStorage.length === 0) {
      const entries = Object.entries(data);
      for(const [key, value] of entries) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    }
  });
}
    
export function loadData(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

export function updateData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}