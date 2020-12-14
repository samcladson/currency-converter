import React, { useState } from "react";
import axios from "axios";
import curSym from "currency-symbol-map";
import { Select, Card, Button, Input, Alert, message } from "antd";
const { Option } = Select;

const currencyType = [
  "SELECT",
  "AUD",
  "BGN",
  "BRL",
  "CAD",
  "CHF",
  "CNY",
  "CZK",
  "DKK",
  "EUR",
  "GBP",
  "HKD",
  "HRK",
  "HUF",
  "IDR",
  "ILS",
  "INR",
  "ISK",
  "JPY",
  "KRW",
  "MXN",
  "MYR",
  "NOK",
  "NZD",
  "PHP",
  "PLN",
  "RON",
  "RUB",
  "SEK",
  "SGD",
  "THB",
  "TRY",
  "USD",
  "ZAR",
];

const CurrencyConverter = () => {
  const [currencyData, setCurrencyData] = useState({
    inputValue: "",
    inputCurrencyType: "",
    outputValue: "",
    outputCurrencyType: "",
  });
  const [conversion, setConversion] = useState();
  const [error, setError] = useState(false);

  const handleError = () => {
    if (
      currencyData.inputValue !== "" &&
      currencyData.inputCurrencyType !== "" &&
      currencyData.inputCurrencyType !== "SELECT" &&
      currencyData.outputCurrencyType !== "" &&
      currencyData.outputCurrencyType !== "SELECT"
    ) {
      setError(false);
      axios
        .get(
          `https://api.frankfurter.app/latest?amount=${currencyData.inputValue}&from=${currencyData.inputCurrencyType}&to=${currencyData.outputCurrencyType}`
        )
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            setConversion(res.data);
          }
        })
        .catch((err) => {
          message.error("Canot convert same currency");
        });
    } else {
      setError(true);
    }
  };

  return (
    <div className="wrapper">
      <h1 style={{ marginTop: "25px", fontWeight: 800, color: "Grey" }}>
        Currency Converter
      </h1>
      <p>This tool is built for converting currency of your choice</p>
      {error ? (
        <Alert
          style={{ margin: "20px" }}
          type="error"
          showIcon={true}
          message="Missing values"
        />
      ) : null}

      <div className="container">
        <div className="input-card">
          <Card
            hoverable
            style={{ width: "auto", margin: "10px" }}
            title="Input Amount"
          >
            <Input
              onChange={(e) =>
                setCurrencyData((prestate) => {
                  return {
                    ...prestate,
                    inputValue: e.target.value,
                  };
                })
              }
              size="large"
              placeholder="Enter ammount"
              prefix={
                currencyData.inputCurrencyType
                  ? curSym(currencyData.inputCurrencyType)
                  : null
              }
            />

            <Select
              defaultValue={currencyType[0]}
              style={{
                width: "100%",
                marginTop: "10px",
              }}
              onChange={(value) =>
                setCurrencyData((prestate) => {
                  return {
                    ...prestate,
                    inputCurrencyType: value,
                  };
                })
              }
            >
              {currencyType.map((cur, i) => {
                return (
                  <Option key={i} value={cur}>
                    {cur}
                  </Option>
                );
              })}
            </Select>
          </Card>
        </div>
        <Button onClick={handleError} type="primary" size="large">
          Convert
        </Button>
        <div className="output-card">
          <Card
            hoverable
            style={{ width: "auto", margin: "10px" }}
            title="Output Amount"
          >
            <Input
              size="large"
              placeholder="Output value"
              prefix={
                currencyData.outputCurrencyType
                  ? curSym(currencyData.outputCurrencyType)
                  : null
              }
              value={
                conversion
                  ? conversion.rates[currencyData.outputCurrencyType]
                  : 0
              }
            />
            <Select
              defaultValue={currencyType[0]}
              style={{ width: "100%", marginTop: "10px" }}
              onChange={(value) => {
                setCurrencyData((prestate) => {
                  return {
                    ...prestate,
                    outputCurrencyType: value,
                  };
                });
              }}
            >
              {currencyType.map((cur, i) => {
                return (
                  <Option key={i} value={cur}>
                    {cur}
                  </Option>
                );
              })}
            </Select>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
