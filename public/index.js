const btn = document.getElementById("btn")
let dataArray;
btn?.addEventListener("click", async ()=>{
    console.log("hi");
    try {
        const linkresponse = await axios.get("http://localhost:5000/getcaptcha")
        const jsonString =JSON.stringify(linkresponse)
        const jsonData = JSON.parse(jsonString);
        link = jsonData.data.data;
        console.log(link);
        document.getElementById('imgtagz').src=link;
    } catch (error) {
        console.log(error);
    }
})
let otp;
async function handleInputChange(){
        otp=document.getElementById("OTPINPUT").value;
}
const btn2 = document.getElementById("btn2");
btn2?.addEventListener("click",async ()=>{
    console.log("hello");
    try {
        console.log(otp);
        await axios.post('http://localhost:5000/sendcaptcha',{otp}).then(response=>{
            console.log('OTP sent');
        }).catch(error=>{
            console.log('Error sending OTP');
        })
        const response=await axios.get('http://localhost:5000/attendance')
        const jsonString =JSON.stringify(response)
        const jsonData = JSON.parse(jsonString);
        const dataArray = jsonData.data.data;
        console.log(dataArray);
        document.getElementById('Yoga').innerHTML=dataArray[0]
        document.getElementById('ADC').innerHTML=dataArray[1]
        document.getElementById('OS').innerHTML=dataArray[2]
        document.getElementById('DAA').innerHTML=dataArray[3]
        document.getElementById('SE').innerHTML=dataArray[4]
        document.getElementById('CN').innerHTML=dataArray[5]
        
    } catch (error) {
        console.log(error);
    }
})

