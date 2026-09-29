const modalAbout = document.getElementById("myModal");
const modalEmail = document.getElementById("emailModal");
const card = document.querySelector(".card");

const btnAbout = document.getElementById("openModalBtn");
const btnEmail = document.getElementById("emailBtn");

const closeAbout = document.querySelector(".close-button");
const closeEmail = document.querySelector(".close-email-button");

const openModal = (targetModal) => {
    targetModal.classList.add("active");
    card.classList.add("hidden");
};

const closeModal = () => {
    modalAbout.classList.remove("active");
    modalEmail.classList.remove("active");
    card.classList.remove("hidden");
};

btnAbout.addEventListener('click', () => openModal(modalAbout));

btnEmail.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(modalEmail);
});

[closeAbout, closeEmail].forEach(btn => {
    btn.addEventListener('click', closeModal);
});

window.addEventListener('click', (e) => {
    if (e.target === modalAbout || e.target === modalEmail) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeModal();
});