const mp = new MercadoPago("APP_USR-dd0a41f9-bade-4719-afc7-9c50c13ddccd", {
  locale: "es-AR",
});

document.getElementById("checkout-btn").addEventListener("click", async () => {
  try {
    const port = 5001;
    const url = "https://c38a42628de3.ngrok-free.app";

    const orderData = {
      title: document.getElementById("name").innerText,
      quantity: document.getElementById("quantity").value,
      unit_price: document.getElementById("unit_price").innerText,
    };
    //console.log("orderdata"+JSON.stringify(orderData))
    console.log(`url :${url}`);
    console.log(`${url}/create_preference`);

    const response = await fetch(`${url}/create_preference`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    window.location.href = data.init_point;
  } catch (error) {
    alert("hubo un problema al enviar los datos");
    console.log(error);
  }
});
