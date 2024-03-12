const btn = document.getElementById("btn")

btn?.addEventListener("click", async ()=>{
    console.log("hi");
    try {
        await fetch("http://localhost:5000/attendance").then(response=>response.json()).then(data=>console.log(data));
        // const data = await response.json();
        // console.log(data);
    } catch (error) {
        console.log(error);
    }
})