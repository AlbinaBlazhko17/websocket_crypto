import { useState, useEffect } from "react";

function CryptoCurrency() {
  const [socket, setSocket] = useState(null);
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('wss://ws.blockchain.info/inv');

    ws.onopen = () => {
      console.log('Connected to WebSocket server');

      const subscribeMessage = {
        op: 'unconfirmed_sub',
      };

      ws.send(JSON.stringify(subscribeMessage));

      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleCryptoData(data);
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleCryptoData = (data) => {
    if (data.op === 'utx') {
      const { x: transaction } = data;

      const cryptoSymbol = transaction.out[0]?.addr;
      const cryptoValue = transaction.out[0]?.value;

      setCryptoData((prevData) => [
        ...prevData,
        {
          symbol: cryptoSymbol,
          value: cryptoValue,
        },
      ]);
    }
  };

  return (
    <div>
      <h1>Crypto Currency</h1>
      <ul>
        {cryptoData.map((crypto, index) => (
          <li key={index}>
            <strong>{crypto.symbol}</strong>: {crypto.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CryptoCurrency;
