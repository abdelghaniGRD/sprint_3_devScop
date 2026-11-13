import {
  getProfile,
  getUserSubscriptions,
  getRepos,
  getFollowers,
  getFollowing,
  getRepoLunguages,
} from "./api.js";

import { addToShortList } from "./mockApi.js";

export const candidateStatus = Object.freeze({
  Refused: { value: "refused", label: "Refusé" },
  ToContact: { value: "toContact", label: "A contacter" },
});

const urlParams = new URLSearchParams(window.location.search);

const prevInput = urlParams.get("query");

if (prevInput) {
  document.querySelector(".search").value = prevInput;
}

const searchBtn = document.querySelector(".searchBtn");
const mainContent = document.querySelector(".mainContent");
const search = document.querySelector(".search");
const profileParent = document.querySelector(".profileParent");
const aside = document.querySelector(".profileParent");

let profile;

aside.addEventListener("click", async (e) => {
  if (e.target.matches(".addToShortList")) {
    await addCandidateToShortList();
  }
});

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await displayResults();
});

async function addCandidateToShortList() {
  let candidate = {
    login: profile.login,
    name: profile.name ? profile.name : "N/A",
    avatar_url: profile.avatar_url,
    html_url: profile.html_url,
    language: profile.language ? profile.language : "N/A",
    rating: profile.rating ? profile.rating : 0,
    status: candidateStatus.ToContact.value,
    note: profile.bio ? profile.bio : "N/A",
    createdAt: new Date().toISOString(),
  };

  await addToShortList(candidate);
}

async function createProfileTemplate(profile) {
  const repos = await getRepos(profile.login);

  const followers = await getFollowers(profile.login);
  const following = await getFollowing(profile.login);

  return ` <div class="profilePicture overflow-hidden rounded-[50%]">
          <img src=${profile.avatar_url}/>
    </div>
        <p class="name font-medium text-2xl">${profile.login}</p>
        <p class="userName text-sky-500 font-medium text-xl mt-[5px] uppercase">
          @${profile.login}
        </p>
        <div class="post text-gray-400 mt-[20px]">
          "full stack web developer"
        </div>
        <div class="address bg-slate-700 p-[10px] rounded-[10px] mt-[10px]">
          <p class="text-gray-300 font-medium">📍 marrakech morocco</p>
          <p class="text-gray-300 font-medium">📅 member depuis janvier 2021</p>
        </div>

        <div class="gitInfo flex mt-[20px] gap-[5px] justify-between">
          <div class="reposetories p-[10px] bg-slate-700 rounded-[10px]">
            <div class="reposNumber">${
              repos === null ? "0" : repos.length
            }</div>
            <div class="text-sm">DEPOTS</div>
          </div>
          <div class="followers p-[10px] bg-slate-700 rounded-[10px]">
            <div>${followers.length !== 0 ? followers.length : "0"}</div>
            <div class="text-sm">ABONNES</div>
          </div>
          <div class="following p-[10px] bg-slate-700 rounded-[10px]">
            <div>${following.length === 0 ? "0" : following.length}</div>
            <div class="text-sm">ABONNMENTS</div>
          </div>
        </div>
        <button
          class="addToShortList block ml-auto mr-auto bg-cyan-300 p-[10px] rounded-[10px] w-full font-medium text-xl mt-[20px]"
        >
          Ajouter a la shortlist
        </button>
        <a href=${profile.html_url}
          class="viewOriginalProfile block ml-auto mr-auto ml-auto mr-auto bg-fuchsia-500 p-[10px] rounded-[10px] w-full font-medium text-xl mt-[20px]"
        >
          voir le profil original
        </a>`;
}

async function createRepoTemplate(repo) {
  let lunguages = await getRepoLunguages(search.value, repo.name);

  return `
    <div class="repo w-[49%] bg-slate-900 p-[20px] rounded-[10px] h-[300px]">
            <div
              class="repoName font-medium text-xl before:content-[''] before:inline-block before:bg-cyan-200 before:w-[10px] before:h-[10px] before:rounded-[10px]"
            >
              ${repo.name}
            </div>
            <div class="description text-gray-300 mt-[10px]">
              ${repo.description === null ? "aucun" : repo.description}
            </div>
            <div
              class="language font-medium text-gray-400 before:content-[''] before:inline-block before:bg-white before:w-[10px] before:h-[10px] before:rounded-[10px] mt-[10px]"
            >
            
              ${
                Object.keys(lunguages)
                  .map((key) => {
                    return `<span>${key}</span>`;
                  })
                  .join(" | ") || "no languange found"
              }
            </div>
            <div class="lastModified text-gray-500 mt-[10px]">
              Mis a jour il y a ${Math.floor(
                (Date.now() - new Date(repo.updated_at)) / 86400000
              )} jours
            </div>
          </div>
  `;
}

async function returnUserNotFound() {
  return `<main class="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-slate-800/80 bg-[#0d111a]/90 px-6 py-16 text-center shadow-xl">
      
      <!-- Glowing Red Exclamation Circle -->
      <div class="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-rose-500/40 bg-rose-500/10 text-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.25)]">
        <span class="text-lg font-semibold">!</span>
      </div>

      <!-- Error Message -->
      <p class="max-w-sm text-sm font-semibold leading-relaxed text-slate-100">
        Aucun développeur trouvé. Vérifiez le nom d'utilisateur et réessayez.
      </p>

    </main>`;
}

async function displayResults() {
  profile = await getProfile(search.value);
  if (!profile) {
    const htmlString = await returnUserNotFound(profile);

    const template = document.createElement("template");

    template.innerHTML = htmlString.trim();

    profileParent.innerHTML = "";

    profileParent.append(template.content);
    // mainContent.classList.add("hidden");
    return;
  }

  const htmlString = await createProfileTemplate(profile);

  const template = document.createElement("template");

  template.innerHTML = htmlString.trim();

  profileParent.innerHTML = "";

  profileParent.append(template.content);
  // mainContent.classList.remove("hidden");
  // mainContent.classList.add("block");

  await displayRepos();
}

async function displayRepos() {
  let reposList = document.querySelector(".reposList");

  reposList.innerHTML = "";

  const repos = await getRepos(search.value);

  if (repos.length === 0) return;

  repos.forEach(async (repo) => {
    const htmlString = await createRepoTemplate(repo);

    const template = document.createElement("template");

    template.innerHTML = htmlString.trim();

    reposList.append(template.content);
  });
}
