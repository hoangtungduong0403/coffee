import { useState } from "react";
import * as userService from "../services/user.service";

let globalState = {
  phone: "",
  user: { purchases: 0, points: 0 },
};

let listeners = [];

export function useUser() {
  const [, setRender] = useState({});

  const notify = () => {
    listeners.forEach((l) => l({}));
  };

  if (!listeners.includes(setRender)) {
    listeners.push(setRender);
  }

  const setPhone = (phone) => {
    globalState.phone = phone;
    localStorage.setItem("phone", phone);
    notify();
  };

  const loadUser = async () => {
    const data = await userService.getCreateUser(globalState.phone);
    globalState.user = data;
    notify();
  };

  const requestPurchase = async () => {
    await userService.requestPurchase(globalState.user.phone);
  };

  const redeem = async () => {
    await userService.redeem(globalState.user.id);
    globalState.user.points = 0;
    notify();
  };

  return {
    phone: globalState.phone,
    user: globalState.user,
    setPhone,
    loadUser,
    requestPurchase,
    redeem,
  };
}