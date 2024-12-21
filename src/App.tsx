import { jsPDF } from 'jspdf';
import './App.css'
import { useState } from 'react';

function App() {

  const [title, setTitle] = useState("");

  const generatePDF = () => {

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const activeTab = tabs[0];
          const url = activeTab.url;
          if(url){
            const id = new URL(url).searchParams.get('v');
            if(id){

              chrome.storage.local.get([`${id}`], async (result) => {
                const screenshots = result[id] || [];
                if (screenshots.length === 0) {
                  alert("No screenshots saved!");
                  return;
                }
              
                const pdf = new jsPDF();
                pdf.deletePage(1);
                for (let i = 0; i < screenshots.length; i++) {
                  const image = screenshots[i];

                  const img = new Image();
                  img.src = image;

                  img.onload = function() {

                    const imgWidth = img.width * 0.264583;
                    const imgHeight = img.height * 0.264583;
                    pdf.addPage([imgHeight, imgWidth],"landscape");
                    pdf.addImage(img, "PNG", 0, 0, imgWidth, imgHeight);
                    
                    if (i === screenshots.length - 1) {
                      pdf.save(`${title}.pdf`);
                    }
                  };
                }
                chrome.storage.local.remove([`${id}`])
              });

            }
          }
          
        } else {
          console.error("No active tab found!");
        }
      });
  }

  return (
    <div>
      <h3>YouTube Video PDF Generator</h3>
      <input type="text" value={title} onChange={ (e) => setTitle(e.target.value) } required/>
      <button id="generate-pdf" onClick={generatePDF}>Generate PDF</button>
    </div>
  )
}

export default App
