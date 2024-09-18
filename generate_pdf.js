const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");

async function generatePDF() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the page size to A4
  await page.setViewport({ width: 595, height: 1403 }); // A4 size in pixels

  // Read the HTML template
  const htmlTemplate = await fs.readFile(
    path.join(__dirname, "template.html"),
    "utf-8"
  );

  // Read the CSS file
  const cssContent = await fs.readFile(
    path.join(__dirname, "styles.css"),
    "utf-8"
  );

  // Inject the CSS into the HTML template
  const content = htmlTemplate.replace(
    "</head>",
    `<style>${cssContent}</style></head>`
  );

  // Add background style to every page
  // const backgroundStyle = `
  //   @page {
  //     background-image: url('https://i.ibb.co/wJGyPwz/Background-2.png');
  //     background-size: cover;
  //     background-repeat: no-repeat;
  //     background-position: center;
  //   }
  // `;

  // Set the content
  await page.setContent(content);

  // Add the background style
  // await page.evaluate((style) => {
  //   const styleElement = document.createElement("style");
  //   styleElement.textContent = style;
  //   document.head.appendChild(styleElement);
  // }, backgroundStyle);

  // Generate PDF
  await page.pdf({
    path: "output.pdf",
    format: "A4",
    printBackground: true,
    displayHeaderFooter: true,
    footerTemplate: `
      <div style="font-size: 10px; text-align: left; width: 100%; padding: 10px 20px; position: relative; direction: rtl;">
        <span style="position: absolute; bottom: -5px; left: 12px;">
          الصفحة <span class="pageNumber"></span> من <span class="totalPages"></span>
        </span>
      </div>
    `,
    landscape: false, // Explicitly set to false for portrait
  });

  await browser.close();
}

generatePDF().catch(console.error);
