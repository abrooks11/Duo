// import main components
import TopNav from './components/layout/TopNav';
import FileUploadDropZone from './components/ui/FileUploadDropZone';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="app-wrapper">
      <div className="top-wrapper">
        <TopNav />
        <FileUploadDropZone />
      </div>
      <div className="main-container">
        <div className="main-left-container">
          <Sidebar />
        </div>
        <div className="main-right-container">
          <MainContent />
        </div>
      </div>
      <div className="main-footer-container">
        <Footer />
      </div>
    </div>
  );
}

export default App;
