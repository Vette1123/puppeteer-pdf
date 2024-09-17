const puppeteer = require('puppeteer')

async function generatePDF() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Set the page size to A4
  await page.setViewport({ width: 595, height: 842 }) // A4 size in pixels

  // Your dynamic content
  const content = `
    <style>
      @page {
        margin: 0;
        padding: 0;
      }
      body {
        font-family: Arial, sans-serif;
        font-size: 12px;
        margin: 0;
        padding: 0;
      }
      .page {
        width: 100%;
        height: 100vh;
        page-break-after: always;
        position: relative;
        background-image: url('https://i.ibb.co/wJGyPwz/Background-2.png');
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }
      .content {
        position: absolute;
        top: 20px;
        left: 20px;
        right: 20px;
        bottom: 20px;
        overflow: hidden;
      }
      h1 {
        font-size: 18px;
        margin-top: 0;
      }
    </style>
    <div class="page">
      <div class="content">
        <h1>Section 1</h1>
        <p>${'Lorem ipsum '.repeat(1200)}</p>
      </div>
    </div>
    <div class="page">
      <div class="content">
        <h1>Section 2</h1>
        <p>${'Dolor sit amet '.repeat(1200)}</p>
        <ul>
          ${Array.from({ length: 25 }, (_, i) => `<li>${i + 1}. Item ${i + 1}</li>`).join('')}
        </ul>
      </div>
    </div>
    <div class="page">
      <div class="content">
        <h1>Section 3</h1>
        <p>${'Consectetur adipiscing '.repeat(1250)}</p>
      </div>
    </div>
  `

  // Set the content
  await page.setContent(content)

  // Generate PDF
  await page.pdf({
    path: 'output.pdf',
    format: 'A4',
    printBackground: true,
    outline:true,
    margin: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
    },
    displayHeaderFooter: true,
    footerTemplate: `
      <div style="font-size: 10px; text-align: right; width: 100%; padding: 10px 20px; position: relative;">
        <span style="position: absolute; bottom: -15px; right: 15px;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </span>
      </div>
    `,
  })

  await browser.close()
}

generatePDF().catch(console.error)
