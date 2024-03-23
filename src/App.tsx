import { Routes, Route } from "@solidjs/router";
import Connect from "./components/connect";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" component={Connect} />
    </Routes>
  );
}

export default App;
