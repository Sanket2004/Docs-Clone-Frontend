import TextEditor from "./TextEditor";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrintButton from "./Print";
import HomePage from "./components/HomePage";
import Error from "./components/Error";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/documents/:id/:title" element={
          <>
            <TextEditor />
            <PrintButton />
          </>
        } />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
