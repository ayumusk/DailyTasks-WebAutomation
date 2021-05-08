const fs= require("fs");
const puppy= require("puppeteer");
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
async function fun1()
{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto("https://inshorts.com/en/read",{waitUntil:"networkidle2"});
    await page.pdf(
      {
         path: "./news.pdf", 
         format: "Letter" ,
         printBackground:true
      });
      
    await page.goto("https://www.covid19india.org/",{waitUntil:"networkidle2"});
    await page.waitForTimeout(10000);
    await page.pdf({
         
         path: "./covid.pdf", 
         format: "Letter" ,
         printBackground:true
      });

    await page.goto("https://www.covid19india.org/state/DL",{waitUntil:"networkidle2"});
    await page.waitForTimeout(10000);
    await page.pdf({

         path: "./covidDelhi.pdf", 
         format: "Letter" ,
         printBackground:true
      });
  
  
    await page.goto("https://www.google.com/search?q=covid+vaccines+near+me&oq=covid+vaccines&aqs=chrome.4.69i57j0l3j0i457j0j0i10i131i433l2j0l2.7444j0j7&sourceid=chrome&ie=UTF-8",{waitUntil:"networkidle2"});
    await page.pdf({

         path: "./Vaccine.pdf", 
         format: "Letter" ,
         printBackground:true
      });
  
      
    await browser.close();
  }
  fun1();
  
  
  
//add the meeting links here 
let id = [`meetID-1`,`meetID2`,`meetID3`];

async function main()

{ if (!fs.existsSync("screenshots"))
    {
      fs.mkdirSync("screenshots");
    }

let browser=await puppy.launch({
    headless:false,
    defaultViewport: false
   
   });

   let tabs=await browser.pages();
let tab=tabs[0];

await tab.goto("https://accounts.google.com/");

const context = browser.defaultBrowserContext();
await context.overridePermissions(
    "https://meet.google.com/", ["microphone", "camera", "notifications"]
);

await tab.waitForTimeout(5000);
await tab.goto("https://accounts.google.com/signin/v2/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&service=mail&sacu=1&rip=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin");
await tab.type("#identifierId","ABC@gmail.com");//write your email address

await tab.click(".VfPpkd-RLmnJb");
await tab.waitForTimeout(10000);
await tab.keyboard.type(`passward`, { delay: 200 }); //write the password of gmail
await tab.waitForTimeout(800);
await tab.keyboard.press('Enter');
await tab.waitForTimeout(10000);
await tab.screenshot({ path: `screenshots/gmail.jpeg` });
await tab.waitForTimeout(2500);

for(let j=0;j<3;j++)
 {  
   //1st lecture    
   if(j==0)
    {  
       await meet(id[j],tab);
    }
    //2nd lecture
    else if(j==1)
    {
        await meet(id[j],tab);
    }
    //3rd lecture
    else
    {
      await meet(id[j],tab);
    }
            
  }
await browser.close();
    
}


async function meet(meetID,tab)
{   
  await tab.waitForTimeout(2500);
  await tab.goto("https://meet.google.com/");
  await tab.waitForSelector('input[type="text"]');
  await tab.click('input[type="text"]');
  await tab.waitForTimeout(1000);
  await tab.keyboard.type(meetID, { delay: 200 }); 
  await tab.waitForTimeout(800);
  await tab.keyboard.press('Enter');
  await tab.waitForNavigation();
  
  //to turn off camera Ctrl+E
  await tab.waitForTimeout(8000);
  await tab.keyboard.down('ControlLeft');
  await tab.keyboard.press('KeyE');
  await tab.keyboard.up('ControlLeft');
  await tab.waitForTimeout(2000);
      
  
  //to turn off mic using Ctrl+D
  
  await tab.keyboard.down('ControlLeft');
  await tab.keyboard.press('KeyD');
  await tab.keyboard.up('ControlLeft');
  await tab.waitForTimeout(2000);

  // To join 
      
  let CL=await tab.$$(".NPEfkd.RveJvd");
  await CL[0].click();    
  
  //to reach at message option
  await tab.waitForTimeout(30000);
      for (let i=1; i<=2; i++) {
          await tab.keyboard.press('Tab');
          await tab.waitForTimeout(1000);
      }
  //press at message option and send a message    
  await tab.keyboard.press('Enter');
  await tab.waitForTimeout(1500);
  await tab.keyboard.type("Good morning!", { delay: 100 });
  await tab.keyboard.press('Enter');

  //for coming out of the message 
  await tab.waitForTimeout(1000);
  await tab.keyboard.press('Tab');
  await tab.keyboard.press('Enter');
  
  //wait till the meeting ends
  await tab.waitForTimeout(10000);

  //to end the call  
  for (let i=1; i<=6; i++)
   {
      await tab.keyboard.press('Tab');
      await tab.waitForTimeout(1000);
   }
     
  await tab.keyboard.press('Enter');    
}
main();