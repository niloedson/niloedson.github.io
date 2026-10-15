// Main client script for Nilo Edson Portfolio & Haunted Labs
document.addEventListener("DOMContentLoaded", () => {
  // Add copy button functionality to code blocks if present
  document.querySelectorAll(".code-header").forEach(header => {
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn";
    copyBtn.innerText = "Copy";
    copyBtn.style.cssText = `
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #9aa5b5;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
    `;
    
    copyBtn.addEventListener("click", () => {
      const code = header.nextElementSibling?.querySelector("pre")?.innerText;
      if (code) {
        navigator.clipboard.writeText(code).then(() => {
          copyBtn.innerText = "Copied!";
          copyBtn.style.borderColor = "#3fb950";
          copyBtn.style.color = "#3fb950";
          setTimeout(() => {
            copyBtn.innerText = "Copy";
            copyBtn.style.borderColor = "rgba(255, 255, 255, 0.15)";
            copyBtn.style.color = "#9aa5b5";
          }, 2000);
        });
      }
    });

    header.appendChild(copyBtn);
  });
});
