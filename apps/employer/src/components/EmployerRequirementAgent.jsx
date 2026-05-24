import { useState } from "react";

export function EmployerRequirementAgent({
  messages,
  missingFields,
  onSendMessage,
  readyToReview,
  isLoading,
}) {
  const [input, setInput] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const nextValue = input.trim();
    if (!nextValue || isLoading) {
      return;
    }

    setInput("");
    await onSendMessage(nextValue);
  }

  return (
    <section className="employer-agent-card">
      <div className="employer-agent-head">
        <div>
          <div className="employer-agent-kicker">Employer Agent</div>
          <h3>Describe the role in your own words</h3>
          <p>I will turn your conversation into a structured hiring brief for matching.</p>
        </div>
        <div className={`employer-agent-status ${readyToReview ? "ready" : ""}`}>
          {readyToReview ? "Brief ready" : "Collecting details"}
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

      <div className="employer-agent-thread">
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
          onChange={(event) => setInput(event.target.value)}
          placeholder="Example: I need 3 waiters for our Bandra cafe, evening shift, immediate joining, salary around 18k."
          rows="3"
          value={input}
        />
        <div className="employer-agent-actions">
          <span>Tip: include role, openings, location, salary, shifts, and urgency.</span>
          <button className="employer-primary-action" disabled={isLoading || !input.trim()} type="submit">
            {isLoading ? "Sending..." : "Send to Agent"}
          </button>
        </div>
      </form>
    </section>
  );
}
