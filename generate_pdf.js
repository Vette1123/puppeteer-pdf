const puppeteer = require('puppeteer')

async function generatePDF() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // Set the page size to A4
  await page.setViewport({ width: 595, height: 842 }) // A4 size in pixels

  // Your dynamic content
  const content = `
    <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 12px;
        margin: 0;
        padding: 20px;
      }
      .page-break {
        page-break-after: always;
      }
      h1 {
        font-size: 18px;
        margin-top: 0;
      }
      // section {
      //   background-image: url('https://i.ibb.co/wJGyPwz/Background-2.png');
      //   background-repeat: no-repeat;
      //   background-size: cover;
      //   background-position: top center;
      // }
    </style>
    <section>
      <h1>Section 1</h1>
      <p>${'Lorem ipsum '.repeat(7200)}</p>
    </section>
    <section>
      <h1>Section 2</h1>
      <p>${'Dolor sit amet '.repeat(5200)}</p>
      <ul>
        ${Array.from(
          { length: 25 },
          (_, i) => `<li>${i + 1}. Item ${i + 1}</li>`
        ).join('')}
      </ul>
    </section>
    <section>
      <h1>Section 3</h1>
      <p>${'Consectetur adipiscing '.repeat(9250)}</p>
    </section>
  `

  // Set the content
  await page.setContent(content)

  // Generate PDF
  await page.pdf({
    path: 'output.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20px',
      right: '20px',
      bottom: '20px',
      left: '20px',
    },
    displayHeaderFooter: true,
    footerTemplate: `
      <div style="font-size: 10px; text-align: right; width: 100%; padding: 10px 20px; position: relative;">
        <span style="position: absolute; bottom: -5px; right: 12px;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </span>
      </div>
    `,
  })

  await browser.close()
}

generatePDF().catch(console.error)
