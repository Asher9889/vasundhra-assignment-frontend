import { useEffect } from "react";

import { initializeApp } from "@/bootstrap/initializeApp";

export const useBootstrap = () => {
  useEffect(() => {
    initializeApp();
  }, []);
};