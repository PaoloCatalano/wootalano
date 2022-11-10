import React from "react";

export default function Test() {
  // const fetchData-From-Server-Prova = async () => {
  // const [serverData, setServerData] = React.useState("");
  //   try {
  //     const res = await fetch("/api/v1");
  //     const { msg } = await res.json();
  //     setServerData(msg);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // React.useEffect(() => {
  //   fetchData-From-Server-Prova();
  // }, []);
  // };
  const [color, setColor] = React.useState("red");
  const handleClick = () => {
    if (color === "red") {
      setColor("yellow");
    }
    if (color === "yellow") {
      setColor("red");
    }
  };

  React.useEffect(() => {
    if (color === "red") {
      setTimeout(() => {
        setColor("yellow");
      }, 3000);
    }
  }, [color]);

  return (
    <div
      className="test"
      style={{ "--variable-in-js": color }}
      onClick={handleClick}
    >
      Vari test!!!
    </div>
  );
}
