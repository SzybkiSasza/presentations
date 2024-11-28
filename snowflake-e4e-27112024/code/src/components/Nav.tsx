import { Link } from "react-router-dom";

import "./Nav.css";

export const Nav = () => (
  <div className="Nav">
    <Link to="/">Parse search params</Link>
    <Link to="/updating">Updating search params</Link>
    <Link to="/simple-serialization">Put simple stuff in the box</Link>
    <Link to="/boxing">Put in the box!</Link>
    <Link to="/unboxing">Unbox!</Link>
    <Link to="/box-playground">Box Playground</Link>
  </div>
);
