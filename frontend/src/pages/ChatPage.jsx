import { useState, useEffect, useRef } from "react";
import { Paperclip } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() && !file) return;

    const formData = new FormData();
    formData.append("message", input);
    if (file) formData.append("file", file);

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setFile(null);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, there was an error." },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full items-center bg-gray-100">
      <div className="flex-1 w-full max-w-2xl px-2 py-6 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-2`}
          >
            <div
              className={`rounded-lg px-4 py-2 shadow-sm max-w-xs ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-900 border"
              }`}
            >
              <span className="font-semibold">{msg.role === "user" ? "You" : "Bot"}:</span>{" "}
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="w-full max-w-2xl px-2 pb-6">
        <form
          className="flex gap-2 items-center bg-white rounded-xl shadow px-4 py-2"
          onSubmit={e => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask something or reference your uploaded document..."
            className="flex-1 px-3 py-2 rounded-lg border outline-none"
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
          />
          <label className="cursor-pointer flex items-center">
            <Paperclip className="h-5 w-5 text-gray-400" />
            <input
              type="file"
              accept=".pdf,.docx,.csv,.xlsx"
              onChange={e => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-semibold"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
