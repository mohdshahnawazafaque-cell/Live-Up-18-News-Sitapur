import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Article from "./pages/Article";
import Admin from "./pages/Admin";
import Search from "./pages/Search";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="category/:id" element={<Category />} />
              <Route path="article/:id" element={<Article />} />
              <Route path="search" element={<Search />} />
              <Route path="admin" element={<Admin />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}
