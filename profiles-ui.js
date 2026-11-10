import {
  getProfile,
  getUserSubscriptions,
  getRepos,
  getFollowers,
  getFollowing,
} from "./api.js";
const urlParams = new URLSearchParams(window.location.search);

const prevInput = urlParams.get("query");

if (prevInput) {
  document.querySelector(".search").value = prevInput;
}

const searchBtn = document.querySelector(".searchBtn");
const mainContent = document.querySelector(".mainContent");
const search = document.querySelector(".search");
const profileParent = document.querySelector(".profileParent");

searchBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  await displayResults();
});

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
            <div>${followers.length !== 0 ? followers : "0"}</div>
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
        <button
          class="viewOriginalProfile block ml-auto mr-auto ml-auto mr-auto bg-fuchsia-500 p-[10px] rounded-[10px] w-full font-medium text-xl mt-[20px]"
        >
          voir le profil original
        </button>`;
}

async function displayResults() {
  const profile = await getProfile(search.value);

  const htmlString = await createProfileTemplate(profile);

  const template = document.createElement("template");

  template.innerHTML = htmlString.trim();

  profileParent.innerHTML = "";

  profileParent.append(template.content);
}
