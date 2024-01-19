const _apiUrl = "/api/chore";

export const getChores = () => {
  return fetch(_apiUrl).then((res) => res.json());
};

export const getChoreById = (id) => {
  return fetch(`${_apiUrl}/${id}`).then((res) => res.json());
};

export const deleteChore = (id) => {
    return fetch(`${_apiUrl}/${id}`, {
      method: "DELETE",
    });
  };

  export const addChore = (chore) => {
    return fetch(_apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chore),
    }).then((res) => res.json());
  };