import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import "./App.css";

import { Nav } from "./components/Nav";
import { SearchParams } from "./components/phases/1_SearchParams";
import { Updating } from "./components/phases/2_Updating";
import { Deserializer } from "./components/phases/3_Deserializer";
import { Boxing } from "./components/phases/4_Boxing";
import { Unboxing } from "./components/phases/5_Unboxing";
import { BoxPlayground } from "./components/phases/6_BoxPlayground";

export const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="App_container">
          <Nav />
          <Routes>
            <Route path="/" element={<SearchParams />} />
            <Route path="/updating" element={<Updating />} />
            <Route path="/simple-serialization" element={<Deserializer />} />
            <Route path="/boxing" element={<Boxing />} />
            <Route path="/unboxing" element={<Unboxing />} />
            <Route path="/box-playground" element={<BoxPlayground />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};
