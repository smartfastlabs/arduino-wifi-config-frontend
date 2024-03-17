import { Routes, Route } from "@solidjs/router";
import NewDevice from "./components/newDevice";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/a" component={NewDevice} />
    </Routes>
  );
}

export default App;
