const _apiUrl = "/api/userprofile";

export const getUserProfiles = () => {
  return fetch(_apiUrl).then((res) => res.json());
};

export const getUserProfilesWithRoles = () => {
    return fetch(_apiUrl + "/withroles").then((res) => res.json());
  };

  export const getUserProfileById = (id) => {
    return fetch(`${_apiUrl}/${id}`).then((res) => res.json());
  };