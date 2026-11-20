import { getCache, setCache } from "./cach.js";

export async function getProfile(userName) {
  let profile = getCache("profile-" + userName);
  if (profile) {
    console.log("fetched from cach");
    return profile;
  } else {
    try {
      const response = await fetch(`https://api.github.com/users/${userName}`);

      if (!response.ok) {
        throw new Error(
          `GitHub API error: ${response.status} ${response.statusText}`
        );
      }
      console.log("fetched from api");
      const data = await response.json();
      setCache("profile-" + userName, data);
      return data;
    } catch (e) {
      console.error("Failed to fetch profile:", e.message);
      return null; // Return a fallback value so the app doesn't crash
    }
  }
}

export async function getUserSubscriptions(userName) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${userName}/subscriptions`
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (e) {
    console.error("Failed to fetch profile:", e.message);
    return null; // Return a fallback value so the app doesn't crash
  }
}

export async function getRepos(userName, repoName, language) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${userName}/repos`
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    let repos = await response.json();

    const rs = repos.filter((repo) => {
      const matchesName = repo.name
        .toLowerCase()
        .includes(repoName.toLowerCase());
      const matchesLanguage = language === "all" || repo.language === language;

      return matchesName && matchesLanguage;
    });

    console.log(rs);

    return rs;
  } catch (e) {
    console.error("Failed to fetch profile:", e.message);
    return null; // Return a fallback value so the app doesn't crash
  }
}

export async function getFollowers(userName) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${userName}/followers`
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (e) {
    console.error("Failed to fetch profile:", e.message);
    return null; // Return a fallback value so the app doesn't crash
  }
}

export async function getFollowing(userName) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${userName}/following`
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (e) {
    console.error("Failed to fetch profile:", e.message);
    return null; // Return a fallback value so the app doesn't crash
  }
}

export async function getRepoLunguages(userName, repo) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${userName}/${repo}/languages`
    );

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (e) {
    console.error("Failed to fetch profile:", e.message);
    return null; // Return a fallback value so the app doesn't crash
  }
}
