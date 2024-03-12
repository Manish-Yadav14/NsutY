const btn = document.getElementById("btn")

btn?.addEventListener("click", async ()=>{
    console.log("hi");
    try {
        const response = await axios.get("http://localhost:5000/attendance")
        console.log(response);
    } catch (error) {
        console.log(error);
    }
})