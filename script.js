document.addEventListener('DOMContentLoaded', () => {
    const cardGrid = document.getElementById('cardGrid');
    const newCardBtn = document.getElementById('newCardBtn');
    const cardModal = document.getElementById('cardModal');
    const closeModal = document.querySelector('.close');
    const cardForm = document.getElementById('cardForm');
    const categoryFilter = document.getElementById('categoryFilter');
    const uploadFileBtn = document.getElementById('uploadFileBtn');
    const fileInput = document.getElementById('fileInput');
    const attachmentSelect = document.getElementById('attachment');
    const attachmentFile = document.getElementById('attachmentFile');

    let cards = JSON.parse(localStorage.getItem('cards')) || [];

    const saveCards = () => {
        localStorage.setItem('cards', JSON.stringify(cards));
    };

    const renderCards = (filter = 'all') => {
        cardGrid.innerHTML = '';
        cards.forEach((card, index) => {
            if (filter === 'all' || card.category === filter) {
                const cardElement = document.createElement('div');
                cardElement.classList.add('card', card.category);
                cardElement.innerHTML = `
                    <h3>${card.title}</h3>
                    <p>${card.description}</p>
                    ${card.attachment ? `<a href="${card.attachment}" target="_blank">Csatolmány megtekintése</a>` : ''}
                `;
                cardGrid.appendChild(cardElement);
            }
        });
    };

    newCardBtn.addEventListener('click', () => {
        cardModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        cardModal.style.display = 'none';
        cardForm.reset();
        attachmentFile.style.display = 'none';
    });

    attachmentSelect.addEventListener('change', () => {
        attachmentFile.style.display = attachmentSelect.value !== 'none' ? 'block' : 'none';
        attachmentFile.accept = attachmentSelect.value === 'photo' ? 'image/*' : 'application/pdf';
    });

    cardForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const category = document.getElementById('category').value;
        const attachmentType = attachmentSelect.value;

        let attachment = null;
        if (attachmentType !== 'none' && attachmentFile.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                attachment = event.target.result;
                cards.push({ title, description, category, attachment });
                saveCards();
                renderCards(categoryFilter.value);
                cardModal.style.display = 'none';
                cardForm.reset();
                attachmentFile.style.display = 'none';
            };
            reader.readAsDataURL(attachmentFile.files[0]);
        } else {
            cards.push({ title, description, category, attachment });
            saveCards();
            renderCards(categoryFilter.value);
            cardModal.style.display = 'none';
            cardForm.reset();
        }
    });

    categoryFilter.addEventListener('change', (e) => {
        renderCards(e.target.value);
    });

    uploadFileBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const fileData = event.target.result;
                cards.forEach(card => {
                    if (!card.attachment) card.attachment = fileData;
                });
                saveCards();
                renderCards(categoryFilter.value);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    renderCards();
});

// Service Worker regisztráció
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker regisztrálva:', reg))
        .catch(err => console.error('Service Worker regisztráció hiba:', err));
}
