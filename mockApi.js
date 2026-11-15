export async function isCandidateAlreadyExist(userName) {
  let candidats = await getCandidats();
  if (candidats.data !== null) {
    let isExists = candidats.data.some((u) => u.login === userName);
    return isExists;
  }
}

export async function getCandidats(status) {
  try {
    //i left it here were i need to pass the status as param to the url
    const response = await fetch(
      `https://6af5c3a4f6270fa08d6895be.mockapi.io/api/v1/candidats?status=${
        status === "all" ? "" : status
      }`
    );

    if (!response.ok) {
      if (response.status === 404) {
        return {
          data: null,
          error: "not found error",
          message: "cadidate not found ",
        };
      }

      return {
        data: null,
        error: "http error",
        message: `mock api error ${response.status} ${response.statusText}`,
      };
    }
    const data = await response.json();
    return { data: data, error: null };
  } catch (e) {
    if (e instanceof TypeError) {
      return {
        data: null,
        error: "network error",
        message: "no internet connection",
      };
    }
    return {
      data: null,
      error: e.name || "unkonwn",
      message: e.message,
    };
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
