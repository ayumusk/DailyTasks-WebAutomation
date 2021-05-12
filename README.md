# Daily Tasks Web Automation

## Overview ##
I made this project to automate my daily tasks which includes things like checking emails whether there is any new and important email waiting for the response in inbox or the daily news. Looking at the current scenerio we are more concerned about the situation of corona outbreak and news related to covid.

So, I automated my daily tasks with the help of web automation tool called ```puppeteer```. 

## Features

This project performs following tasks:
##
```
✅Generates a pdf of daily news
✅Generates a pdf of current corona scenerio in India
✅Generates a pdf of current corona scenerio in Delhi( your location )
✅Generates a pdf of vaccine related information
✅Login to gmail and takes a screenshot of inbox
✅Goes to google meet and write meet ID
✅Turns off mic and camera
✅Asks to join
✅Sends a message in ChatBox 
✅After lecture time in ends the call and joins next meeting (or lecture)
✅Once all lectures are over Browser will get closed
```
## Installation
You need a working installation of node and the npm package manager. In your terminal, install dependencies with ```npm install```.
( Use this command to install all the modules used in this project automatically without installing them individually )

```bash
npm install 
```

## Usage
It contains two functions <br></br>
1. First function uses headless browser( Puppeteer uses headless chrome, Headless Chrome is a way to run the Chrome Browser without actually running Chrome.) 
2. Second function uses browser that is visible to us (```headless : false``` => means browser ```visible``` to us, ```headless : true``` => means browser is ```not visible``` to us)
<br></br>

<b>Lets look at the code one by one</b>

```javascript
const fs= require("fs");
const puppy= require("puppeteer");
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
```
We need to require the dependencies that we are going to use in our project.

1. [puppeteer](https://www.npmjs.com/package/puppeteer)
2. [puppeteer-extra](https://www.npmjs.com/package/puppeteer-extra)
3. [puppeteer-extra-plugin-stealth](https://github.com/berstend/puppeteer-extra/tree/0049d6010311505f27e7f3be804bb198e2c09aa2/packages/puppeteer-extra-plugin-stealth)

✅ ```puppeeteer-extra``` with stealth passes all public bot tests.<br></br>
There are 3 async functions, lets talk about the first function named as fun1( this function is responsible for scrapping the data and generating pdf )
```javascript
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
  
```

This function contains 4 parts ( data changes every day as per the changes made in that respective urls )
1. Goes to url to generate pdf of daily news.
2. Goes to url to generate pdf of current corona cases in India.
3. Goes to url to generate pdf of current corona cases in your state.
4. Goes to url to generate pdf of vaccination details.

```await puppeteer.launch()```  Launches a ```headless : true``` browser<br><br>
 
   

After completing the task, browser will get closed. In the last line we have invoked this function.
<br></br>
Now, lets talk about the next function named as main. This function contains the code of our automation for gmail and google meet.

```javascript
let id = [`meetID-1`,`meetID2`,`meetID3`];
```
This array stores the meeting IDs, I took this IDs as an example and we can add the IDs where we want to go .

```javascript
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
 
 
```
This function calls another async function named as meet which takes two arguments (meeting ID and tab)
<br></br>
So, here comes our next and last function.

```javascript
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

```
In the last line we will invoke our main() function


```javascript
main();
```
