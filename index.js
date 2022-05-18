// Referencias
const $selectCripto = document.getElementById("selectCripto");
const $precio = document.getElementById("precio");
const $botonCotizar = document.getElementById("botonCotizar");
const $cancelar = document.getElementById("cancelar");
const $mensajeCotizar = document.getElementById("mensajeCotizar");
let precio;

class Cripto {
  constructor(nombre, habilitada, codigo) {
    this.nombre = nombre;
    this.habilitada = habilitada;
    this.codigo = codigo;
  }
}

const obtenerMonedas = () => {
  for (i = 0; i < criptos.length; i++) {
    const option = document.createElement("option");
    option.classList.add("option");
    // Desestructuración de objeto
    const { nombre, codigo, habilitada } = criptos[i];

    option.text = nombre;
    option.value = codigo;

    habilitada && $selectCripto.appendChild(option);
  }
};

const obtenerPrecio = () => {
  $precio.textContent = "Cargando...";
  $selectCripto.disabled = true;

  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${$selectCripto.value}&tsyms=ARS`
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      precio = data.ARS.toFixed(2) || "Precio desconocido";
      $precio.textContent = `${numeral(precio).format("0,00.00")} ARS`;
    })
    .finally(() => {
      $selectCripto.disabled = false;
    });
};

const cotizar = () => {
  const $cantidad = document.getElementById("cantidad").value;

  let mensajeMonto;

  if ($cantidad > 0) {
    const monto = precio * $cantidad;
    mensajeMonto = swal(
      `El precio de compra de ${$cantidad} ${selectCripto.value} es ${numeral(
        monto
      ).format("0,0.00")} ARS`,
      "",
      "success"
    );
  } else {
    swal(
      "No se pudo calcular. Por favor reintente ingresando un valor numérico mayor a cero.",
      "",
      "error"
    );
  }
};

let criptos;
const monedasHabilitadas = ["Bitcoin", "Ethereum", "Tether", "Binance Coin"];

const localCriptos = JSON.parse(localStorage.getItem("criptos"));

if (localCriptos) {
  criptos = localCriptos.map((cripto) => ({
    // Operador spread
    ...cripto,
    habilitada: monedasHabilitadas.includes(cripto.nombre),
  }));
} else {
  //declaro el array e incorporo los objetos.
  criptos = [];

  const bitcoin = new Cripto(
    "Bitcoin",
    monedasHabilitadas.includes("Bitcoin"),
    "BTC"
  );

  const ethereum = new Cripto(
    "Ethereum",
    monedasHabilitadas.includes("Ethereum"),
    "ETH"
  );

  const tether = new Cripto(
    "Tether",
    monedasHabilitadas.includes("Tether"),
    "USDT"
  );

  const binanceCoin = new Cripto(
    "Binance Coin",
    monedasHabilitadas.includes("Binance Coin"),
    "BNB"
  );

  const fakeCoin = new Cripto(
    "FakeCoin",
    monedasHabilitadas.includes("FakeCoin"),
    "FKC"
  );

  criptos.push(bitcoin);
  criptos.push(ethereum);
  criptos.push(tether);
  criptos.push(binanceCoin);
  criptos.push(fakeCoin);
}

localStorage.setItem("criptos", JSON.stringify(criptos));

obtenerMonedas();
obtenerPrecio();

// Eventos
$selectCripto.addEventListener("change", obtenerPrecio);
$botonCotizar.addEventListener("click", cotizar);
