import api from "../utils/axios";
export async function getCreateUser(phone) {
  const res = await api.post("/users/create-get-user", {
    phone,
  });

  return res.data || null;
}

export async function requestPurchase(phone) {
  const res = await api.post("/requests", {
    phone,
  });

  return res.data;
}

export async function redeem(userId) {
  const res = await api.post(`/users/${userId}/redeem`);

  return res.data;
}