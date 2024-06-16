import TextEditor from "./TextEditor";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from "./components/HomePage";
import Error from "./components/Error";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/document/:id/" element={
          <>
            <TextEditor />
          </>
        } />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
