export async function getProfile(userName) {
  try {
    const response = await fetch(`https://api.github.com/users/${userName}`);

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

export async function getRepos(userName) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${userName}/repos`
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

// export async function getShortList() {
//   try {
//     const response = await fetch(
//       `https://api.github.com/repos/${userName}/${repo}/languages`,
//       {
//         headers: {
//           authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (!response.ok) {
//       throw new Error(
//         `GitHub API error: ${response.status} ${response.statusText}`
//       );
//     }

//     return await response.json();
//   } catch (e) {
//     console.error("Failed to fetch profile:", e.message);
//     return null; // Return a fallback value so the app doesn't crash
//   }
// }
