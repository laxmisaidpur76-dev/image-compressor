const slider = document.getElementById("slider");
const val = document.getElementById("val");

const fileInput = document.getElementById("fileInput");
const previewImage = document.getElementById("previewImage");
const fileName = document.getElementById("fileName");

slider.oninput = () => val.innerText = slider.value;

// 👇 FILE PREVIEW LOGIC
fileInput.addEventListener("change", function () {
  const file = this.files[0];

  if (!file) return;

  fileName.innerText = "File: " + file.name + " (" + (file.size/1024).toFixed(2) + " KB)";

  if (file.type.startsWith("image")) {
    const reader = new FileReader();

    reader.onload = function (e) {
      previewImage.src = e.target.result;
      previewImage.style.display = "block";
    };

    reader.readAsDataURL(file);
  } else {
    previewImage.style.display = "none";
  }
});

// MAIN FUNCTION
function processFile() {
  const file = fileInput.files[0];
  const typeSelect = document.getElementById("fileType").value;

  if (!file) {
    alert("File select करो");
    return;
  }

  let type = typeSelect;

  if (type === "auto") {
    if (file.type.includes("image")) type = "image";
    else if (file.type.includes("pdf")) type = "pdf";
    else if (file.type.includes("video")) type = "video";
    else if (file.name.endsWith(".zip")) type = "zip";
  }

  if (type === "image") compressImage(file);
  else if (type === "pdf") compressPDF(file);
  else if (type === "video") compressVideo(file);
  else if (type === "zip") compressZIP(file);
}

// IMAGE COMPRESS
function compressImage(file) {
  const img = new Image();
  const reader = new FileReader();

  reader.onload = e => img.src = e.target.result;

  img.onload = () => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const quality = slider.value / 100;

    canvas.toBlob(blob => {
      download(blob, "compressed.jpg");
    }, "image/jpeg", quality);
  };

  reader.readAsDataURL(file);
}

// PDF
async function compressPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });

  download(new Blob([pdfBytes], { type: "application/pdf" }), "compressed.pdf");
}

// VIDEO
function compressVideo(file) {
  alert("MP4 compression heavy है, अभी direct download होगा");
  download(file, "video.mp4");
}

// ZIP
function compressZIP(file) {
  alert("ZIP already compressed होता है");
  download(file, "file.zip");
}

// DOWNLOAD
function download(blob, name) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  link.click();
}