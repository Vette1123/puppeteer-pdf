const puppeteer = require('puppeteer')

const styles = `<style>
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
      body {
        font-family: 'Cairo', Arial, sans-serif;
        font-size: 12px;
        margin: 0;
        padding: 0;
        direction: rtl;
        text-align: right;
      }
      .page-break {
        page-break-after: always;
      }
      .page_content_wrapper {
        position: relative;
        height: 1403px;
      }
      .page_content_wrapper_inner_pages {
        background: url(https://i.ibb.co/wJGyPwz/Background-2.png);
        background-size: cover;
        height: 1200px;
        position: relative;
      }
      .page_content_wrapper_inner_pages__content {
        position: relative;
        z-index: 2;
        padding: 3rem;
      }
      .page_content_wrapper_inner_pages::after {
        position: absolute;
        content: "";
        background-color: white;
        width: 96%;
        height: 96%;
        z-index: 1;
        top: 2%;
        bottom: 2%;
        right: 2%;
        left: 2%;
        border-radius: 10px;
      }
      .inner_pages_header__logo img {
        margin-right: auto;
      }
      img {
        display: block;
        max-width: 100%;
        height: auto;
      }
      .inner_pages_title p {
        color: #308A69;
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 2rem;
      }
      .process_flow_tarmeez {
        background-image: url(https://i.ibb.co/vDg3qfH/financing-steps.png);
        background-repeat: no-repeat;
        background-size: contain;
        height: 400px;
        background-position: center;
        margin-bottom: 2.5rem;
      }
      .inner_pages_title p {
        color: #308A69;
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 2rem;
      }
      .terms p {
        font-weight: bold;
        color: #308A69;
        margin-bottom: 2.5rem;
      }
      .terms_table {
        table-layout: fixed;
        border-collapse: separate;
        border-spacing: 0 10px;
      }
      .terms_table tr {
        height: 60px;
        font-size: 18px;
      }
      .bold {
        font-weight: bold;
      }
      .terms_table tr td {
        width: 80%;
        background-color: #fbfbfb;
        padding: 0.5rem;
      }
      .terms_table tr td:first-child {
        width: 20%;
        color: #54C272;
        background-color: transparent;
      }
      .bold {
        font-weight: bold;
      }
    </style>
    `;

async function generatePDF() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the page size to A4
  await page.setViewport({ width: 595, height: 1403 }); // A4 size in pixels

  // Your dynamic content
  const content = `
  ${styles}
    <div class="page_content_wrapper">
            <div class="page_content_wrapper_inner_pages">
                <div class="page_content_wrapper_inner_pages__content">
                    <div class="inner_pages_header">
                        <div class="inner_pages_header__logo">
                            <img src="https://i.ibb.co/3YZWZr5/colorful-logo.png" alt="colorful-logo" width="200px" border="0">
                        </div>
                    </div>
                    <div class="inner_pages_title">
                        <p>مراحل التمويل
                        </p>
                    </div>
                    <div class="process_flow_tarmeez">
                    </div>
                    <div class="terms">
                        <div class="inner_pages_title">
                            <p class="title">التعريفات</p>
                        </div>
                        <table class="terms_table">
                            <tbody><tr>
                                <td><span class="bold">البرنامج</span></td>
                                <td>
                                    <span class="bold">يحتوي البرنامج على سلسلة من الإصدارات، </span>وهو يعبر عن <span class="bold"> سقف التمويل للشركة</span> على سبيل المثال برنامج بقيمة 15 مليون
                                    مقسمة على 3 اصدارات بقيمة 5 مليون للإصدار الواحد.
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="bold">
                                        هامش الربح
                                    </span>
                                    <br>للإصدارات
                                </td>
                                <td>
                                    <span class="bold">المبلغ الإضافي</span> الذي <span class="bold">يضاف إلى سعر
                                        التمويل الأساسي</span> وهو يُعتبر جزء من تكلفة الاقتراض التي تتحملها الشركة
                                    طالبة التمويل.
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <span class="bold">هامش المرابحة</span>
                                    <br>اليومي
                                </td>
                                <td>
                                    <span class="bold">المبلغ الإضافي</span> الذي <span class="bold">يضاف إلى سعر
                                        التمويل الأساسي بشكل يومي.</span> وهو يُعتبر جزء من تكلفة الاقتراض التي تتحملها
                                    الشركة طالبة التمويل
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
  `;

  // Add background style to every page
  await page.addStyleTag({
    content: `
      @page {
        background-image: url('https://i.ibb.co/wJGyPwz/Background-2.png');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
      }
    `,
  });
  // Set the content
  await page.setContent(content);

  // Wait for the font and images to load
  // await page.evaluate(() =>
  //   Promise.all([
  //     document.fonts.ready,
  //     Promise.all(
  //       Array.from(document.images).map((img) => {
  //         if (img.complete) return Promise.resolve();
  //         return new Promise((resolve, reject) => {
  //           img.onload = resolve;
  //           img.onerror = reject;
  //         });
  //       })
  //     ),
  //   ])
  // );

  // await page.screenshot({ path: "./Background-2.png" });
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

generatePDF().catch(console.error)
