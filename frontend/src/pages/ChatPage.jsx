import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      console.error("Failed to fetch response:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <Card key={idx} className={msg.role === "user" ? "bg-blue-50" : "bg-gray-50"}>
            <CardContent className="p-3">
              <p><strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}</p>
            </CardContent>
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="relative w-full">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something or reference your uploaded document..."
            className="pr-10"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <label className="absolute inset-y-0 right-3 flex items-center cursor-pointer">
            <Paperclip className="h-5 w-5 text-gray-400" />
            <input
              type="file"
              accept=".pdf,.docx,.csv,.xlsx"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </div>
  );
}
