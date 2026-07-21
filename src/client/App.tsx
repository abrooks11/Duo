// import main components
import TopNav from './components/layout/TopNav';
// import FileUploadDropZone from './components/ui/FileUploadDropZone';
import Sidebar from './components/layout/Sidebar';
import MainContent from './components/layout/MainContent';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="h-screen flex flex-col">
        <TopNav />
        {/* <FileUploadDropZone /> */}
      <div className="flex flex-1">
        <div className="flex-none">
          <Sidebar />
        </div>
        <div className="flex flex-1 flex-col min-w-0">
          <MainContent />
        </div>
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
}

export default App;
