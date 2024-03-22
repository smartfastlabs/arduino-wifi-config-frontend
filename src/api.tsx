export async function hasConnectedToAccessPoint() {
  while (true) {
    try {
      await fetch("http://192.48.56.2/health");
      return true;
    } catch {
      return false;
    }
  }
}

export async function fetchConfig() {
  try {
    const response = await (
      await safeFetch("http://192.48.56.2/config")
    ).text();

    const result = {};
    for (let line of response.split("\n")) {
      line = line.trim();
      if (line) {
        let [key, value] = line.split(": ");
        result[key] = value;
      }
    }

    console.log(result);
    return result;
  } catch (e) {
    return Promise.reject(new Error("IN HERE"));
  }
}

export async function updateConfig(config) {
  console.log("updateConfig", config);
  const headers = {
    ssid: config.ssid,
    password: config.password,
  };
  if (config.ip) {
    headers.ip = config.ip;
  }
  return await safeFetch("http://192.48.56.2/set", {
    method: "POST",
    headers: headers,
  });
}

export async function runDevice() {
  safeFetch("http://192.48.56.2/run");
}

async function safeFetch(url, options) {
  // THERE IS SOME WEIRD CORS STUFF, RETRYING SEEMS TO SOLVE IT
  let i = 0;
  while (true) {
    try {
      return await fetch(url, options);
    } catch (e) {
      if (i++ > 2) {
        console.error("safeFetch", e);
        return Promise.reject(new Error("SOMETHING WENT WRONG"));
      }
    }
  }
}
