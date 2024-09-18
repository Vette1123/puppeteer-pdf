const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");

async function generatePDF() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the page size to A4
  await page.setViewport({ width: 595, height: 842 }); // A4 size in pixels

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

  // Fetch the image and convert it to base64
  const imageResponse = await fetch(
    "https://i.ibb.co/wJGyPwz/Background-2.png"
  );
  const imageBuffer = await imageResponse.arrayBuffer();
  const base64Image = Buffer.from(imageBuffer).toString("base64");

  // Create background style with base64 image
  const backgroundStyle = `
    @page {
      size: A4;
      margin: 0;
    }
    html, body {
      width: 210mm;
      height: 297mm;
      margin: 0;
      padding: 0;
    }
    .page-background {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url(data:image/png;base64,${base64Image});
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
      z-index: -1;
    }
    .page-content {
      position: relative;
      z-index: 1;
    }
  `;

  // Modify the HTML structure to include background and content divs
  const modifiedHtmlTemplate = htmlTemplate
    .replace(
      "<body>",
      `<body><div class="page-background"></div><div class="page-content">`
    )
    .replace("</body>", `</div></body>`);

  // Inject the CSS and background style into the HTML template
  const content = modifiedHtmlTemplate.replace(
    "</head>",
    `<style>${cssContent}${backgroundStyle}</style></head>`
  );

  // Set the content
  await page.setContent(content);

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
    margin: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
    },
  });

  await browser.close();
}

generatePDF().catch(console.error);
