import { useEffect, useState } from "react";

export function useLocalStorage(key, initialData) {
  const [localData, setLocalData] = useState(initialData);
  //use effect jab chalta hai jab pura component re rander ho jata hai
  useEffect(() => {
    const existingData = JSON.parse(localStorage.getItem(key));
    if (existingData) {
      setLocalData(existingData);
    } else {
      localStorage.setItem(key, JSON.stringify(initialData));
    }
  }, []);

  function updateLocalStorage(newData) {
    if (typeof newData === "function") {
      localStorage.setItem(key, JSON.stringify(newData(localData)));
    } else {
      localStorage.setItem(key, JSON.stringify(newData));
    }
    // console.log(newData);
    setLocalData(newData);
  }
  return [localData, updateLocalStorage];
}
