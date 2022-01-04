const blobDownloader = (blob: Blob, filename: string, type: string) => {
  const url = window.URL.createObjectURL(new Blob([blob], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename); //or any other extension
  document.body.appendChild(link);
  link.click();
};

export default blobDownloader;
