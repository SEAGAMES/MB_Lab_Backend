// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// import sarabun from '../font/thSarabun_Font'
// import timeNewRoman from '../font/timeNewRoman_Font'
// import pdfMake from 'pdfmake';

const pdfMake = require('pdfmake/build/pdfmake');
const pdfFonts = require('pdfmake/build/vfs_fonts');

// const sarabun = require('../font/thSarabun_Font')
// const timeNewRoman = require('../font/timeNewRoman_Font')

pdfMake.vfs = pdfFonts.pdfMake.vfs;

// นำ Base64-encoded Font ไปใช้
// pdfMake.vfs["Sarabun-Regular.ttf"] = sarabun.normal;
// pdfMake.vfs["times.ttf"] = timeNewRoman.normal;
// pdfMake.vfs["timesbd.ttf"] = timeNewRoman.bold;
const imgFromBase64 = require('../assets/img/logo_mu');

const certification_pdf = async (data) => {
  console.log(data)
  //console.log('x : ',pdfMake.vfs)
  const docDefinition = {
    pageSize: 'A4',
    pageOrientation: 'landscape',

    info: {
      title: 'Certificate-' + form.language,
      author: "Bam",
      subject: 'Certificate',
      keyword: 'cer'

    },

    styles: {
      mid: {
        alignment: 'center'
      },
      topic: {
        bold: true,
        fontSize: 12,

      },
      right: {
        alignment: 'right'
      },
      // icon: { font: 'Fontello' }

    },
    //watermark: { text: 'ตัวอย่าง', color: 'blue', opacity: 0.2, fontSize: 50, bold: false, italics: false },
    content: run(excel, form),

    images: {
      logo: imgFromBase64.logo_mu,
      sign: imgFromBase64.mysign,
      footer_th: imgFromBase64.myfoot_th,
      footer_eng: imgFromBase64.myfoot_eng

    },
    defaultStyle: {
      lineHeight: 1.6,
      font: form.language === 'TH' ? 'THSarabunNew' : 'TimeNewRoman',
      fontSize: form.language === 'TH' ? 14 : 18,
      alignment: 'center'
    },

  }
  pdfMake.fonts = {
    THSarabunNew: {
      normal: 'Sarabun-Regular.ttf',
      bold: 'Sarabun-Bold.ttf',
      italics: 'Sarabun-Thin.ttf',
      bolditalics: 'Sarabun-Light.ttf'

    },
    TimeNewRoman: {
      normal: 'times.ttf',
      bold: 'timesbd.ttf',
      italics: 'times.ttf',
      bolditalics: 'times.ttf'
    }
  }

  //const result = await createPDF(docDefinition);
  const result = pdfMake.createPdf(docDefinition)
  return result
}


function signOption(form) {
  let data = ''
  if (form.language === 'TH') {
    if (form.two_sign) {
      if (form.sign) {
        // console.log('TH 2Sign Sign')
        data =
        {
          columns: [
            [
              // second column consists of paragraphs
              {
                image: 'sign',
                width: 250,
                height: 80,
                absolutePosition: { x: -200, y: 410 }
              },
            ],
          ]
        }
      } else { //TH 2 ลายเซ็น ผอ. ไม่เซ็น
        // console.log('TH 2Sign NoSign')
      }
    } else { // 1 ลายเซ็น 
      if (form.sign) { // TH 1 ลายเซ็น ผอ. เซ็น
        data = [
          {
            image: 'sign',
            width: 250,
            height: 80,
            absolutePosition: { x: 70, y: 410 }
          }
        ]
        // console.log('TH 1Sign Sign')
      } else { // 1 ลายเซ็น ผอ. ไม่เซ็น
        // console.log('TH 1Sign Sign')
      }
    }
  } else { // ENG
    if (form.two_sign) {
      if (form.sign) {
        // console.log('ENG 2Sign Sign')
        data = [
          {
            image: 'sign',
            width: 250,
            height: 80,
            absolutePosition: { x: -200, y: 410 }
          },
        ]
      } else { // ENG 2 ลายเซ็น ผอ. ไม่เซ็น
        // console.log('ENG 2Sign NoSign')
        data = [
          // {
          //   text: '(............................................)',
          //   absolutePosition: { x: -205, y: 450 }
          // },
          // {
          //   text: '(............................................)',
          //   absolutePosition: { x: 335, y: 450 }
          // }
        ]
      }
    } else { // 1 ลายเซ็น 
      if (form.sign) { // ENG 1 ลายเซ็น ผอ. เซ็น
        // console.log('ENG 1Sign Sign')
        data = [
          {
            image: 'sign',
            width: 250,
            height: 80,
            absolutePosition: { x: 60, y: 415 }
          }
        ]
      } else { // ENG 1 ลายเซ็น ผอ. ไม่เซ็น
        // console.log('ENG 1Sign Sign')
        data = [
          // {
          //   text: '(............................................)',
          //   absolutePosition: { x: 70, y: 455 }
          // }
        ]
      }
    }
  }
  return data
}

function run(excel, form) {
  let s = []
  let valueX = 0
  let valueMargin = 15

  if (form.pj_code.length === 7) {
    valueX = 613
  }
  else if (form.pj_code.length === 8) {
    valueX = 608
  }
  else if (form.pj_code.length === 9) {
    valueX = 603
  }
  else if (form.pj_code.length === 10) {
    valueX = 599
  }
  else if (form.pj_code.length === 11) {
    valueX = 596
  }
  else if (form.pj_code.length === 12) {
    valueX = 590
  }

  signOption(form)
  excel.forEach((e, index) => {
    // console.log(form.pj_code)
    s.push(
      (form.language === "TH") ? {
        image: 'logo',
        width: 80
      } : {
        image: 'logo',
        width: 80,
        absolutePosition: { x: 50, y: 30 }
      },

      {
        text: 'CERTIFICATION NUMBER  ' + form.currentYear + '-' + form.pj_code + '-' + String(index + 1).padStart(4, '0'),
        fontSize: 9,
        font: 'THSarabunNew',
        absolutePosition: { x: valueX, y: 40 }
      },

      { qr: form.pj_code + String(index + 1).padStart(4, '0'), fit: '60', absolutePosition: { x: 753, y: 60 } },

      (form.language === "Eng") ? { text: 'Institute of  Molecular Biosciences', color: '#1565C0', fontSize: 24, absolutePosition: { x: 50, y: 120 } } : {},
      (form.language === "Eng") ? { text: 'Mahidol University ', color: '#1565C0', fontSize: 24, absolutePosition: { x: 50, y: 150 } } : {},

      (form.language === "TH") ? { text: 'เกียรติบัตรนี้ให้ไว้เพื่อแสดงว่า', margin: [0, 15, 0, 0], fontSize: 18 } : { text: 'This is to certify that', absolutePosition: { x: 50, y: 180 + valueMargin } },

      (form.language === "Eng") ? {
        text: e.prefix + ' ' + e.name, color: '#0D47A1', fontSize: 34, absolutePosition: { x: 50, y: 215 + valueMargin },  bold: true,
      } : {
        text: e.prefix + ' ' + e.name, color: '#0D47A1', fontSize: 28
      },

      (form.language === "TH" && form.pj_code.substring(0, 3) === 'PAR') ? {
        text: 'เข้าอบรมเชิงปฏิบัติการเรื่อง '
      } : (form.language === "TH" && form.pj_code.substring(0, 4) === 'ASST') ? { text: 'เป็นผู้ช่วยวิทยากรในการอบรมเชิงปฏิบัติการเรื่อง' } : {},

      (form.language === "Eng" && form.pj_code.substring(0, 3) === 'PAR') ? { text: 'participated in the practical training entitled', absolutePosition: { x: 50, y: 265 + valueMargin } } : (form.language === "Eng" && form.pj_code.substring(0, 4) === 'ASST') ? { text: 'is an assistant on practical training entitled', absolutePosition: { x: 50, y: 265 + valueMargin } } : {},

      (form.language === "Eng") ? {
        text: 'Student Science Training Program' + ' ' + form.currentYear, color: '#1565C0', fontSize: 28, absolutePosition: { x: 50, y: 300 + valueMargin }, bold: true,
      } : {},


      (form.language === "TH") ? { text: "“" + form.pj_name + "”", color: '#1565C0', fontSize: 24 } : {},
      { text: form.date },

      (form.language === "TH") ? {
        text: form.date_desc
      } : { text: form.date_desc, absolutePosition: { x: 50, y: 350 + valueMargin } },

      (form.language === "TH") ? {
        text: 'ณ สถาบันชีววิทยาศาสตร์โมเลกุล มหาวิทยาลัยมหิดล', margin: [0,10,0,0]
      } : {},

      signOption(form),

      (form.two_sign) ? {
        columns: [
          [
            (form.language === "TH") ? {
              text: 'ศาสตราจารย์ ดร. นายแพทย์นรัตถพล เจริญพันธุ์',
              fontSize: 11,
              bolditalics: true,
              absolutePosition: { x: -220, y: 495 }
            } : {
              text: 'Professor Narattaphol Charoenphandhu, M.D., Ph.D.',
              fontSize: 13,
              bolditalics: true,
              absolutePosition: { x: -220, y: 495 }
            },
            (form.language === "TH") ? {
              text: 'ผู้อำนวยการสถาบันชีววิทยาศาสตร์โมเลกุล', fontSize: 11, bolditalics: true,
              absolutePosition: { x: -220, y: 520 }
            } : {
              text: 'Director', fontSize: 13, bolditalics: true,
              absolutePosition: { x: -220, y: 520 }
            }
          ],
          [
            {
              text: `${form.add_name}`,
              fontSize: 11,
              bolditalics: true,
              absolutePosition: { x: 330, y: 495 }
            },
            {
              text: `${form.add_position}`, fontSize: 11, bolditalics: true,
              absolutePosition: { x: 335, y: 520 }
            },
          ]
        ]
      } : {
        columns: [
          [
            (form.language === 'TH') ? {
              text: 'ศาสตราจารย์ ดร. นายแพทย์นรัตถพล เจริญพันธุ์',
              fontSize: 11,
              bolditalics: true,
              absolutePosition: { x: 45, y: 495 }
            } : {
              text: 'Professor Narattaphol Charoenphandhu, M.D., Ph.D.',
              fontSize: 13,
              bolditalics: true,
              absolutePosition: { x: 45, y: 495 }
            },
            (form.language === 'TH') ? {
              text: 'ผู้อำนวยการสถาบันชีววิทยาศาสตร์โมเลกุล', fontSize: 11, bolditalics: true,
              absolutePosition: { x: 50, y: 520 }
            } : {
              text: 'Director', fontSize: 13, bolditalics: true,
              absolutePosition: { x: 50, y: 520 }
            }
          ],
        ]
      },
      {
        image: (form.language === 'TH') ? 'footer_th' : 'footer_eng',
        width: 842,
        height: 50,
        absolutePosition: { x: 40, y: 550 }, pageBreak: 'after'
      },

    )
  })
  return s
}


// export default {
//   certification_pdf
// };
module.exports = certification_pdf;


