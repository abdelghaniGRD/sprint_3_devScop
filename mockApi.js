export async function isCandidateAlreadyExist(userName) {
  let candidats = await getCandidats();
  let isExists = candidats.some((u) => u.login === userName);
  return isExists;
}

export async function getCandidats() {
  try {
    const response = await fetch(
      `https://6af5c3a4f6270fa08d6895be.mockapi.io/api/v1/candidats`
    );

    if (!response.ok) {
      throw new Error(
        `Mock API error: ${response.status} ${response.statusText}`
      );
    }
    // console.log(await response.json());
    return await response.json();
  } catch (e) {
    console.error("Failed to fetch candidate:", e.message);
    return null; // Return a fallback value so the app doesn't crash
  }
}

export async function addToShortList(candidate) {
  if (await isCandidateAlreadyExist(candidate.login)) return;
  try {
    const response = await fetch(
      `https://6af5c3a4f6270fa08d6895be.mockapi.io/api/v1/candidats`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(candidate),
      }
    );

    const rs = await response.json();
    if (!response.ok) {
      throw new Error(`Mock API error: ${rs.status} ${rs.statusText}`);
    }
    return rs.id;
  } catch (e) {
    console.error("Failed to POST candidate:", e.message);
    return null; // Return a fallback value so the app doesn't crash
  }
}
