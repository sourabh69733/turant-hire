import { useEffect, useRef, useState } from "react";

export function EmployerRequirementAgent({
  actionLabel = "Send",
  heading = "Describe the role in your own words",
  messages,
  missingFields,
  onSendMessage,
  placeholder = "Example: I need 3 waiters for our Bandra cafe, evening shift, immediate joining, salary around 18k.",
  subheading = "I will turn your conversation into a structured hiring brief for matching.",
  readyToReview,
  isLoading,
  statusCollectingLabel = "Collecting details",
  statusReadyLabel = "Brief ready",
  tip = "Tip: include role, openings, location, salary, shifts, and urgency.",
}) {
  const [input, setInput] = useState("");
  const threadRef = useRef(null);

  useEffect(() => {
    if (!threadRef.current) {
      return;
    }

    threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [isLoading, messages]);

  async function handleSubmit(event) {
    event.preventDefault();
    const nextValue = input.trim();
    if (!nextValue || isLoading) {
      return;
    }

    setInput("");
    await onSendMessage(nextValue);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <section className="employer-agent-card">
      <div className="employer-agent-head">
        <div>
          <div className="employer-agent-kicker">Employer Agent</div>
          <h3>{heading}</h3>
          <p>{subheading}</p>
        </div>
        <div className={`employer-agent-status ${readyToReview ? "ready" : ""}`}>
          {readyToReview ? statusReadyLabel : statusCollectingLabel}
        </div>
      </div>

      {missingFields.length ? (
        <div className="employer-agent-missing">
          {missingFields.map((field) => (
            <span className="employer-agent-chip" key={field}>
              {field.replaceAll("_", " ")}
            </span>
          ))}
        </div>
      ) : null}

      <div className="employer-agent-thread" ref={threadRef}>
        {messages.map((message, index) => (
          <div className={`employer-agent-bubble ${message.role}`} key={`${message.role}-${index}`}>
            <span>{message.content}</span>
          </div>
        ))}
        {isLoading ? <div className="employer-agent-bubble assistant loading">Thinking through your requirement...</div> : null}
      </div>

      <form className="employer-agent-form" onSubmit={handleSubmit}>
        <textarea
          className="employer-agent-input"
          onKeyDown={handleKeyDown}
          onChange={(event) => setInput(event.target.value)}
          placeholder={placeholder}
          rows="3"
          value={input}
        />
        <div className="employer-agent-actions">
          <span>{tip}</span>
          <button className="employer-primary-action" disabled={isLoading || !input.trim()} type="submit">
            {isLoading ? "Sending..." : actionLabel}
          </button>
        </div>
      </form>
    </section>
  );
}
