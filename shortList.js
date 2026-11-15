// import { getShortList } from "./api";
import { addToShortList, getCandidats } from "./mockApi.js";

const navList = document.querySelector(".nav-list");
const listItems = document.querySelectorAll(".nav-list li");
const listParent = document.querySelector(".listParent");
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

async function createCandidateTemplate(candidate) {
  return ` <div
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
