"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import React, { useRef, useState } from "react";

export default function Home() {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);
    setMessage(null);
    let data = {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      message: messageRef.current?.value,
    };

    try {
      await fetch("api/contact", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then((res) => {
        if (res.status === 200) {
          console.log("送信に成功しました");
          setMessage("送信いたしました。");
          if (nameRef.current) nameRef.current.value = "";
          if (emailRef.current) emailRef.current.value = "";
          if (messageRef.current) messageRef.current.value = "";
        } else {
          setMessage(
            "送信中にエラーが発生しました。 Status code: " + res.status
          );
        }
      });
    } catch (error: any) {
      setMessage(
        "送信中にエラーが発生しました。 Status code: " + error.message
      );
    } finally {
      setIsSending(false);
    }
  };
  return (
    <div className="container mt-5">
      <h2 className="mb-3">Next.js</h2>
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            お名前
          </label>
          <input type="text" className="form-control" required ref={nameRef} />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            メールアドレス
          </label>
          <input
            type="email"
            className="form-control"
            required
            ref={emailRef}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            メッセージ
          </label>
          <textarea
            name="message"
            className="form-control"
            required
            ref={messageRef}
          ></textarea>
        </div>
        <button disabled={isSending} type="submit" className="btn btn-primary">
          {isSending ? "送信中..." : "送信"}
        </button>
      </form>
      {message && (
        <div
          className={`${
            message.includes("successfully") ? "text-green-700" : "text-red-700"
          } text-sm font-medium mt-3`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
