// import { getShortList } from "./api";
import {
  addToShortList,
  getCandidats,
  deleteUserFromShort,
  getCandidatById,
  modifyCandidate,
} from "./mockApi.js";

// import { candidateStatus } from "./profiles-ui.js";
export const candidateStatus = Object.freeze({
  Refused: { value: "refused", label: "Refusé" },
  ToContact: { value: "toContact", label: "A contacter" },
});

const ratings = Object.freeze({
  one: { value: 1, label: "&#9733;&#9734;&#9734;&#9734;&#9734; 1 / 5" },
  two: { value: 2, label: "&#9733;&#9733;&#9734;&#9734;&#9734; 2 / 5" },
  three: { value: 3, label: "&#9733;&#9733;&#9733;&#9734;&#9734; 3 / 5" },
  four: { value: 4, label: "&#9733;&#9733;&#9733;&#9733;&#9734; 4 / 5" },
  five: { value: 5, label: "&#9733;&#9733;&#9733;&#9733;&#9733; 5 / 5" },
});
let isBussy = false;

const navList = document.querySelector(".nav-list");
const listItems = document.querySelectorAll(".nav-list li");
const listParent = document.querySelector(".listParent");
const deleteModal = document.querySelector("#deleteUserModal");
const deleteModalBtn = document.querySelector("#confirmDeleteBtn");
const body = document.querySelector("body");
const candidateModel = document.querySelector("#candidateModal");
let currentStatus = "all";

navList.addEventListener("click", async (e) => {
  const li = e.target;
  if (li.dataset.active) {
    const status = li.dataset.status;
    currentStatus = status;
    await loadList(status);
  }
});

listItems.forEach((item) => {
  item.addEventListener("click", () => {
    listItems.forEach((item) => {
      item.dataset.active = "false";
    });

    item.dataset.active = "true";
  });
});

deleteModal.addEventListener("close", async (e) => {
  console.log(e);
  if (deleteModal.returnValue === "delete") {
    try {
      const rs = await deleteUserFromShort(userDiv.dataset.id);
      if (rs.error) {
        alert(rs.message);
        return;
      }
    } finally {
      isBussy = false;
      deleteModalBtn.disabled = false;
      deleteModalBtn.textContent = originalText;
      await loadList(currentStatus);
    }
  } else if (deleteModal.returnValue === "cancel") {
    isBussy = false;
    // btn.disabled = false;
    // btn.textContent = originalText;
  }
});

listParent.addEventListener("click", async (e) => {
  const btn = e.target;
  const userDiv = btn.closest(".candidate");

  if (btn.classList.contains("Delete")) {
    //block the fetch if its already running

    if (isBussy) return;

    isBussy = true;
    btn.disabled = false;
    const originalText = btn.textContent;
    btn.textContent = "Deleting ...";
    deleteModal.returnValue;
    deleteModal.showModal();
  } else if (btn.classList.contains("modify")) {
    const id = e.target.closest(".candidate").dataset.id;
    await modify(id);
  }
});

document.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = candidateModel.dataset.id;
  const status = candidateModel.querySelector("#status").value;
  const rating = candidateModel.querySelector("#rating").value;
  const internalNote = candidateModel.querySelector("#internalNote").value;
  const saveBtn = candidateModel.querySelector(".saveBtn");
  const state = candidateModel.querySelector(".state");

  if (e.target.id === "candidateForm") {
    let candidate = {
      id: id,
      rating: rating,
      status: status,
      note: internalNote,
    };
    const prevText = saveBtn.textContent;

    saveBtn.textContent = "Enregistrer ...";
    saveBtn.setAttribute("disabled", "");
    const resp = await modifyCandidate(candidate);
    saveBtn.textContent = prevText;
    state.classList.remove("hidden");
    state.classList.add("flex");
    if (resp.data !== null) {
      state.textContent = "Candidate modifier avec succees ";
    } else {
      state.textContent = `Echec de la modofocation de candidate\nError: ${resp.error}\nMessage: ${resp.message}`;
    }
    setTimeout(() => {
      state.textContent = "";
      state.classList.remove("flex");
      state.classList.add("hidden");
      saveBtn.removeAttribute("disabled");
    }, 4000);
  }
});

async function modify(candidateId) {
  const resp = await getCandidatById(candidateId);

  if (resp.data != null) {
    const candidat = resp.data;
    candidateModel.classList.remove("hidden");
    candidateModel.classList.add("flex");

    candidateModel.dataset.id = candidateId;
    candidateModel.querySelector(".candidateName").textContent = candidat.name;
    candidateModel.querySelector("#status").value = candidat.status;
    candidateModel.querySelector("#rating").value = candidat.rating;
    candidateModel.querySelector("#internalNote").value = candidat.note;
  }
}

// function returnModifyModalTemplate(candidate) {
// return `<div
//     id="candidateModal"
//     class="fixed inset-0 z-50 flex items-center justify-center bg-[#06080f]/80 p-4 backdrop-blur-sm"
//   >
//     <!-- Modal Card -->
//     <div
//       role="dialog"
//       aria-labelledby="modalTitle"
//       aria-modal="true"
//       class="w-full max-w-[560px] rounded-[20px] border border-[#222638] bg-[#131622] p-8 shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
//     >
//       <!-- Header -->
//       <div class="mb-7 flex items-start justify-between gap-4">
//         <div>
//           <p
//             class="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#63d2d6]"
//           >
//             MISE À JOUR DU PROFIL
//           </p>
//           <h2
//             id="modalTitle"
//             class="text-[21px] font-bold leading-snug text-white"
//           >
//             Modifier le candidat
//             <span class="mx-1 text-[#5c637a]">&bull;</span>
//             <span class="text-[#d95eb8]">${candidate.name}</span>
//           </h2>
//         </div>

//         <button
//           type="button"
//           aria-label="Fermer"
//           onclick="document.getElementById('candidateModal').classList.add('hidden')"
//           class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#2a3046] bg-[#1d2132] text-[#a0a8c0] transition hover:bg-[#282e44] hover:text-white"
//         >
//           <svg
//             class="h-3.5 w-3.5"
//             viewBox="0 0 14 14"
//             fill="none"
//             stroke="currentColor"
//             stroke-width="2"
//             stroke-linecap="round"
//           >
//             <path d="M1 1L13 13M13 1L1 13" />
//           </svg>
//         </button>
//       </div>

//       <!-- Form -->
//       <form id="candidateForm" class="space-y-5">
//         <!-- Statut de recrutement -->
//         <div>
//           <label
//             for="status"
//             class="mb-2 block text-[13px] font-semibold text-[#a4adc4]"
//           >
//             Statut de recrutement
//           </label>
//           <div class="relative">
//             <select
//               id="status"
//               class="w-full cursor-pointer appearance-none rounded-xl border border-[#2b3248] bg-[#1b2030] px-4 py-3.5 pr-10 text-sm text-[#e6eaf5] outline-none transition focus:border-[#5bc2e7] focus:ring-2 focus:ring-[#5bc2e7]/20"
//             > ${Object.values(candidateStatus).map((key) => {
//               return `<option value=${key.value} ${
//                 candidate.status === key.value ? "selected" : ""
//               } >${key.label}</option>`;
//             })}

//             </select>
//             <svg
//               class="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-[#7c859e]"
//               viewBox="0 0 12 12"
//               fill="none"
//               stroke="currentColor"
//               stroke-width="1.8"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//             >
//               <path d="M2.5 4.5L6 8L9.5 4.5" />
//             </svg>
//           </div>
//         </div>

//         <!-- Note -->
//         <div>
//           <label
//             for="rating"
//             class="mb-2 block text-[13px] font-semibold text-[#a4adc4]"
//           >
//             Note
//           </label>
//           <div class="relative">
//             <select
//               id="rating"
//               class="w-full cursor-pointer appearance-none rounded-xl border border-[#2b3248] bg-[#1b2030] px-4 py-3.5 pr-10 text-sm text-[#e6eaf5] outline-none transition focus:border-[#5bc2e7] focus:ring-2 focus:ring-[#5bc2e7]/20"
//             >
//             ${Object.values(ratings).map((key) => {
//               return `<option value=${key.value} ${
//                 candidate.rating === key.value ? "selected" : ""
//               } >${key.label}</option>`;
//             })}

//             </select>
//             <svg
//               class="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-[#7c859e]"
//               viewBox="0 0 12 12"
//               fill="none"
//               stroke="currentColor"
//               stroke-width="1.8"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//             >
//               <path d="M2.5 4.5L6 8L9.5 4.5" />
//             </svg>
//           </div>
//         </div>

//         <!-- Note interne -->
//         <div>
//           <label
//             for="internalNote"
//             class="mb-2 block text-[13px] font-semibold text-[#a4adc4]"
//           >
//             Note interne
//           </label>
//           <textarea
//             id="internalNote"
//             rows="4"
//             placeholder="Ajouter une note interne..."
//             class="min-h-[125px] w-full resize-y rounded-xl border border-[#2b3248] bg-[#1b2030] px-4 py-3.5 text-sm leading-relaxed text-[#e6eaf5] outline-none transition focus:border-[#5bc2e7] focus:ring-2 focus:ring-[#5bc2e7]/20"
//           >${candidate.note}</textarea
//           >
//         </div>

//         <!-- Footer Buttons -->
//         <div class="flex items-center justify-end gap-3 pt-2">
//           <button
//             type="button"
//             onclick="document.getElementById('candidateModal').classList.add('hidden')"
//             class="rounded-xl border border-[#2c334a] bg-[#1d2132] px-5 py-3 text-sm font-semibold text-[#c5cde0] transition hover:bg-[#252b40] hover:text-white active:scale-[0.98]"
//           >
//             Annuler
//           </button>

//           <button
//             type="submit"
//             class="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#56cbe8] via-[#9b8df2] to-[#e15bb8] px-5 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(225,91,184,0.28)] transition hover:opacity-90 active:scale-[0.98]"
//           >
//             <svg
//               class="h-4 w-4"
//               viewBox="0 0 16 16"
//               fill="none"
//               stroke="currentColor"
//               stroke-width="2.2"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//             >
//               <path d="M3 8.5L6.5 12L13 4.5" />
//             </svg>
//             Enregistrer
//           </button>
//         </div>
//       </form>
//     </div>
//   </div>`;
// }

async function deleteUserModal(userId) {
  return `
    <dialog id="deleteUserModal" style="border: none; border-radius: 8px; padding: 24px; max-width: 400px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-family: sans-serif;">
      <h3 style="margin-top: 0; color: #111;">Delete User</h3>
      <p style="color: #555; line-height: 1.5;">
        Are you sure you want to delete that user</strong>? This action cannot be undone.
      </p>
      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;">
        <button id="cancelDeleteBtn" type="button" style="padding: 8px 16px; border: 1px solid #ccc; background: #fff; border-radius: 4px; cursor: pointer;">
          Cancel
        </button>
        <button id="confirmDeleteBtn" type="button" data-user-id="${userId}" style="padding: 8px 16px; border: none; background: #dc2626; color: #fff; border-radius: 4px; cursor: pointer;">
          Delete
        </button>
      </div>
    </dialog>
  `;
}

async function createCandidateTemplate(candidate) {
  return `<div data-id=${candidate.id} 
          class="candidate flex justify-between items-center bg-slate-800 p-[10px] rounded-[10px] "
        >
          <div class="info flex items-center gap-[20px]">
            <div class="img w-[50px] h-[50px] rounded-[50%] overflow-hidden">
              <img
                src=${candidate.avatar_url}
              />
            </div>
            <div>
              <div class="font-medium text-2xl">${candidate.name}</div>
              <div class="flex gap-[10px]">
                <div class="text-slate-400 mt-[5px] uppercase">
                  @${candidate.name}
                </div>
                <div
                  class="pt-[5px] pb-[5px] pl-[9px] pr-[9px] bg-cyan-500 rounded-[10px] border-cyan-400 border-[1px] w-fit"
                >
                  ${candidate.language}
                </div>
              </div>
              <div class="text-lime-600 font-medium">${candidate.note}</div>
              <div class="text-gray-500 font-medium">Ajoute le ${candidate.createdAt}</div>
            </div>
          </div>
          <div class="actions flex gap-[20px] items-center">
            <div class="stars"></div>
            <div
              class="status text-red-400 p-[7px] border-red-500 border-[1px] rounded-[10px] bg-slate-800"
            >
              refusé
            </div>
            <div
              class="modify text-blue-400 p-[10px] border-blue-500 border-[1px] rounded-[10px] bg-slate-800"
            >
              Modifier
            </div>
            <div
              class="Delete text-red-400 p-[10px] border-red-500 border-[1px] rounded-[10px] bg-slate-800"
            >
              Supprimer
            </div>
          </div>
        </div>`;
}

async function returnError(error, message) {
  return `<main class="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-[#0d111a]/90 px-6 py-16 text-center shadow-xl">
      
      <!-- Glowing Red Exclamation Circle -->
      <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.25)]">
        <span class="text-lg font-semibold">!</span>
      </div>

      <!-- Error Message -->
      <p class="max-w-sm text-sm font-semibold leading-relaxed text-slate-100">
        ${message}
      </p>

    </main>`;
}

async function loadList(status) {
  listParent.innerHTML = "";

  const candidats = await getCandidats(status);

  if (candidats.data === null) {
    const htmlString = await returnError(candidats.error, candidats.message);

    const template = document.createElement("template");

    template.innerHTML = htmlString.trim();

    listParent.append(template.content);

    return;
  }

  if (candidats.data.length === 0) return;

  candidats.data.forEach(async (c) => {
    const htmlString = await createCandidateTemplate(c);

    const template = document.createElement("template");

    template.innerHTML = htmlString.trim();

    listParent.append(template.content);
  });
}

await loadList(currentStatus);
