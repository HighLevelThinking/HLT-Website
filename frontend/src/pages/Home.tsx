import Header from "../Header";
import Footer from "../Footer";

function App() {
  return (
    <>
      <Header />

      <div id={"top-title"}>
        <h1>HLT</h1>
      </div>

      <div id={"desc"}>
        <div className="hlm">
          <h1>HLM:</h1>
          <body>  
            <p>
              HLM is out making branch Higher Level Making where you can order cutom made products or products we make and design here. We use DTG Printes, LASERS, 3D Printers, Water Jet Cutters, Plasma Cutters, CNCs, and Sublimation Printers. Anything you need to be made can be made here.
            </p>
          </body>
        </div>
        
        <div className="hls">
          <h1>HLS:</h1>
          <body>
            <p>
              HLS is our software branch where software for out made products and other coding orientsed things are made, like this website. We use a plethera of different programing langauges and can make almost anything you want.
            </p>
          </body>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default App;
