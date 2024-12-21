const addScreenshotButton = () => {
  if (document.querySelector("#screenshot-button")) return;

  const videoPlayer = document.querySelector(".html5-video-player");
  if (!videoPlayer) return;

  const button = document.createElement("button");
  button.id = "screenshot-button";
  button.innerText = "📸 Screenshot";
  button.style.position = "absolute";
  button.style.top = "10px";
  button.style.right = "10px";
  button.style.padding = "10px";
  button.style.zIndex = 1000;
  button.style.backgroundColor = "red";
  button.style.color = "white";
  button.style.border = "none";
  button.style.cursor = "pointer";

  videoPlayer.appendChild(button);

  button.addEventListener("click", takeScreenshot);
};

const takeScreenshot = () => {
  const video = document.querySelector("video");
  if (!video) return;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL("image/png");
  saveScreenshot(imageData);
};

const saveScreenshot = (imageData) => {

  const url = window.location.href;
  const videoId = new URL(url).searchParams.get("v");
  if(videoId){
    chrome.storage.local.get([`${videoId}`], (result) => {
      const screenshots = result[videoId] || [];
      screenshots.push(imageData);
  
      chrome.storage.local.set({ [videoId]: screenshots }, () => {
        alert("Screenshot saved!");
      });
    });
  } 

};

setInterval(addScreenshotButton, 1000);
