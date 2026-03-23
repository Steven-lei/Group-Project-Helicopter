import { useState } from "react";
import "./App.css";
import { useQueryDishes } from "./hooks/useQueryDishes";
import Dish from "./components/Dish";
import { Group } from "./components/Group";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Member } from "./components/Member";

function App() {
  const { data: dishes } = useQueryDishes();
  return (
    <>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Group />} />
          <Route path="member/:id" element={<Member></Member>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
