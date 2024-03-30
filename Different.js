import express, { response } from 'express'
// import Tesseract from 'tesseract.js';
import prompt from "prompt"
import puppeteer from 'puppeteer'
import cors from 'cors'
import fs from 'fs'
import tesseract from 'node-tesseract-ocr'
import { log } from 'console'

let browser;
let page;
let link;
let frame;
let f;
let finaldata;
let texting;
let OK=false;
let finale;
let OTPvalue;
const config = {
  lang: "eng", // default
  oem: 3,
  psm: 12,
  tessedit_char_whitelist: '0123456789',
}

const app = express()
app.use(cors());
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(express.static('./public'))
const port = process.env.PORT || 5000;

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  const delay = (time) => {
    return new Promise(res => {
      setTimeout(res,time)
    })
  }
  const getImageData = () => {
    return new Promise((resolve, reject) => {
        // Read the image file into a buffer
        fs.readFile('./imgtes.jpg', (err, data) => { // Update path accordingly
            if (err) {
                console.log(err);
                reject(err);
            } else {
                // Convert buffer data to base64 string
                const base64Image = Buffer.from(data).toString('base64');
                OK=true;
                delay(1500);
                resolve(base64Image);
            }
        });
    });
}
function waitForCondition() {
  return new Promise((resolve) => {
    const intervalId = setInterval(() => {
      // Check the condition
      if (OK === true) {
        clearInterval(intervalId); // Stop the interval
        resolve("Condition is met!"); // Resolve the promise
      }
    }, 30); // Check every 30ms
  });
}

async function getAttendance(){
    try {
        let num= randomNumber(10,100)
        browser=await puppeteer.launch({
        headless:true,
        slowMo:num
         });
    } catch (error) {
        console.log(error)
    }
}


// app.get('/mlFunction',(req,res)=>{
  //   async function mlFunc() {
    //     try {
//       // const img = "https://www.imsnsit.org/imsnsit/images/captcha/captcha_1711166381.jpg"
//       const text = await tesseract.recognize('imgtes.jpg',config)
//       console.log("Result:", text)
//     } catch (error) {
  //       console.log(error.message)
//     }
//   }
  
//   mlFunc()
// })
app.get('/getcaptcha',(req,res)=>{
    async function getCaptcha(){
    page = await browser.newPage();
    // await page.goto('https://www.google.com',{waitUntil:'networkidle0'});
    await page.goto('https://www.imsnsit.org',{waitUntil:'networkidle0'});
    await page.goto('https://www.imsnsit.org/imsnsit/student.htm',{waitUntil:'networkidle0'});
    f = await page.$("frame[name='banner']")
    frame =  await f.contentFrame();
    link=await frame.$eval('#captchaimg', el => el.src);
    console.log(link);
    const page2=await browser.newPage()
    const viewSource=await page2.goto(link);
    fs.writeFile("./imgtes.jpg",await viewSource.buffer(),function(err){
        if (err){
          return console.log(err)
        }
      })
    fs.readFile('./imgtes.jpg', (err, data) => { 
        if (err) {
            console.log(err);
            reject(err);
        } else {
            const base64Image = Buffer.from(data).toString('base64');
            res.send(base64Image)
        }
    })
    await frame.$eval('#uid', el => el.value = '2022UIT3055');
    await frame.$eval('#pwd', el => el.value = '9650818207');
    await page.bringToFront();
    return ;
    }
    const callfunc=getCaptcha();

    //wrchb~0
})

app.post('/sendcaptcha',(req,res)=>{
  
  async function g(){
    const {otp}=await req.body
    console.log(otp);
    OTPvalue=otp;
    
    await frame.type("#cap",OTPvalue);
    await delay(500);
    await frame.click('#login')
    await delay(500)
    f = await page.$("frame[name='banner']")
    frame =  await f.contentFrame();
    // await frame.click('xpath=/html/body/table/tbody/tr[1]/td/table/tbody/tr[2]/td[1]/table/tbody/tr/td[5]/a')
    await frame.click('body > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(2) > td:nth-child(1) > table > tbody > tr > td:nth-child(5) > a')
    // await page.mouse.click(250,107)
     await delay(500)
     await page.mouse.click(17,327)
    //  await page.screenshot({path:'./image2.jpg'})
     await delay(500)//
     await page.mouse.click(64,350)
     await delay(500)
    console.log("POINT 2")
    // await page.screenshot({path:'./image3.jpg'})
    const f2 = await page.$("frame[name='data']")
    const frame2 = await f2.contentFrame();
    await delay(500)
    //
    await frame2.select('#year','2023-24')
    await frame2.select('#sem','4')
    await delay(500)
    await page.mouse.click(675,153)
    // await frame2.click('xpath=//*[@id="rep"]/table/tbody/tr/td/input[3]')
    await delay(500)

    const thTexts = await frame2.evaluate(() => {
      const thElements = document.querySelectorAll('div#myreport table.plum_fieldbig tr.plum_head th');
      return Array.from(thElements, th => th.textContent);
    });
    const attendanceArray = thTexts;
    // console.log(attendanceArray)
    // await browser.close()
    OK=true;
    console.log("hey");
    console.log(attendanceArray);
    return attendanceArray;
     
    
  }
  finale=g();  
  res.send("Received data");
  
})
app.get('/attendance',(req,res)=>{
  waitForCondition().then((result)=>{
    console.log(result);
    console.log("Getting");
    const dataprocessed=finale;
    const data = dataprocessed.then((response)=>{
    res.json({data:response});
    console.log({data:response})
  });
  })
  
  
})
getAttendance()

  const start= async()=>{
    app.listen(port,()=>{
        console.log(`Server is listening on port ${port}`)
    })
}
start()