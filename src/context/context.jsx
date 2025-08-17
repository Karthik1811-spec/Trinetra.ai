import { createContext, useState } from "react";
import runChat from "../config/leo";

export const Context = createContext();

const ContextProvider = (props) => {
  const [prevPrompts, setPrevPrompts] = useState([]); //Save all prompt in recent tab.

  const [input, setInput] = useState(""); // To save the input data .

  const [recentPrompt, setRecentPrompt] = useState(""); // The input data field is saved in recent prompt and display in main component.

  const [showResult, setShowResult] = useState(false); // If its true hide the text in main component and show the result.

  const [loading, setLoading] = useState(false); // If its  is true it will show a loading animations.

  const [resultData, setResultData] = useState(""); // Display the data in our webpage.

  function delayPara(index, nextWord) {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  }

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true); // loading animation starts
    setShowResult(true);
    let response;
    if (prompt !== undefined) {
      response = await runChat(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await runChat(input);
    }
    let responseArray = response.split("**");
    let newArray = "";
    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newArray += responseArray[i];
      } else {
        newArray += "<b>" + responseArray[i] + "</b>";
      }
    }
    console.log(newArray);
    responseArray = newArray.split("*").join("</br>").split(" ");
    for (let i = 0; i < responseArray.length; i++) {
      const nextWord = responseArray[i];
      delayPara(i, nextWord + " ");
    }
    setLoading(false); // stops the loading animations
    setInput("");
  };

  const newChat = async () => {
    setLoading(false);
    setShowResult(false);
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
