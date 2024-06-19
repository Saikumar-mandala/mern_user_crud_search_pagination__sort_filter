import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/Headers";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Edit from "./pages/Edit";
import Profile from "./pages/Profile";
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/edit/:id' element={<Edit />} />
        <Route path='/userprofile/:id' element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
