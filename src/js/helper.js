import { TIMEOUT_SEC } from "./config.js";
import "regenerator-runtime/runtime.js";

export const timeout = function (s) {
  return new Promise((_, rej) =>
    setTimeout(function () {
      rej(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000)
  );
};

export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    let data = await res.json();
    if (!res.ok) throw new Error(`${data.message} - ${res.status}`);
    return data;
  } catch (err) {
    // console.error(err.message);
    throw err;
  }
};
