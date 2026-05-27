# Employer Agent Intake Framework

This document defines the v1 framework for the TurantHire employer intake
agent. The goal is to keep intake fast for urgent frontline hiring while still
producing a structured draft that can be matched, edited, saved, and completed
later.

## Product Goal

The employer agent should not behave like a long HR form. It should behave like
a practical intake assistant that:

- asks only the minimum useful questions
- adapts depth based on role complexity
- stops when the employer says they are done
- creates a usable structured draft even when incomplete
- gives the employer an editable preview before final submission

## Design Principles

1. Minimum first
   For simple roles, collect only enough information to begin matching.
2. Role-aware depth
   Different roles need different questioning depth.
3. Critical before optional
   Ask only the highest-value missing questions first.
4. Save anytime
   The employer can stop, save, and continue later.
5. Good-enough drafts
   Partial data is still useful if the role can already be sourced.
6. No repeated questions
   Never ask for information that is already explicit or reasonably implied.
7. Conversational input, structured output
   Employer speaks naturally; agent produces a draft form.

## Intake Layers

The framework should use three layers of reasoning.

### 1. Role Complexity

This is the primary decision layer.

- `simple`: waiter, cashier, cleaner, runner, helper
- `medium`: receptionist, kitchen helper, delivery associate, front desk
- `detailed`: cook, barista, supervisor, specialty staff

### 2. Business Context

This is a modifier, not the primary engine.

Examples:

- `cafe`
- `restaurant`
- `bakery`
- `retail shop`
- `clinic`

Business context can sharpen questions later, but v1 should not depend on a
large industry taxonomy.

### 3. Conversation State

This controls whether the agent should ask, stop, save, or finalize.

- `collecting_core`
- `needs_clarification`
- `good_enough`
- `refining`
- `finalized_by_employer`
- `saved_for_later`

## Intake Modes

The agent should decide which level of completeness is currently reached.

### `minimum`

Enough to start sourcing.

Used for urgent/simple roles where a shortlist can begin with a small number of
fields.

### `matchable`

Enough to generate a reasonable shortlist.

Used for most frontline roles.

### `detailed`

Enough for deeper screening and evaluation.

Used for more specialized roles.

The agent does not need to force every conversation to reach `detailed`.

## Role Buckets and Field Priorities

This table defines the first version of role-driven intake depth.

### Simple Roles

Examples:

- waiter
- cashier
- cleaner
- runner
- support staff

Critical fields:

- `hiring_role`
- `location`
- `joining_timeline`
- `compensation`
- `shift_timing`

Helpful fields:

- `openings`
- `experience`
- `language_requirements`
- `must_have_skills`

Optional fields:

- `gender_preference`
- `education_requirement`
- `ideal_candidate_notes`

### Medium Roles

Examples:

- receptionist
- kitchen helper
- delivery associate
- front desk executive

Critical fields:

- `hiring_role`
- `location`
- `joining_timeline`
- `compensation`
- `shift_timing`
- `experience`

Helpful fields:

- `openings`
- `language_requirements`
- `must_have_skills`
- `communication_expectation`

Optional fields:

- `screening_questions`
- `education_requirement`
- `ideal_candidate_notes`

### Detailed Roles

Examples:

- cook
- barista
- shift supervisor
- specialty kitchen staff

Critical fields:

- `hiring_role`
- `role_specialization`
- `location`
- `joining_timeline`
- `compensation`
- `shift_timing`
- `experience`

Helpful fields:

- `openings`
- `must_have_skills`
- `language_requirements`
- `communication_expectation`
- `ideal_candidate_notes`

Optional fields:

- `screening_questions`
- `education_requirement`
- `disqualifiers`

## Business-Specific Guidance

V1 should support a lightweight business modifier.

Examples:

- `waiter + cafe`: ask about shift timing and customer-facing expectations
- `cashier + bakery`: ask about billing/POS familiarity if not already stated
- `cook + restaurant`: ask about cuisine, dishes, and expected experience
- `cook + cloud kitchen`: ask about volume/speed expectations if needed

This should remain additive. The agent should not open new branches unless the
information will materially improve matching quality.

## Stopping Logic

This is the most important behavior in the system.

The agent should stop asking questions when one of these conditions is met.

### Stop Condition A: Employer explicitly ends

If the employer says things like:

- done
- finish it
- that is all
- bas itna hi
- enough for now
- continue later

Then the agent should:

- stop asking questions immediately
- finalize the current draft with known information
- mark the conversation as employer-finished
- present a summary and editable preview

### Stop Condition B: Minimum useful brief is captured

If all critical fields for the relevant role bucket are known well enough to
start sourcing, the agent should avoid asking more questions by default.

Instead it should say:

- it has enough to prepare the draft
- the employer can save now
- the employer can continue later
- the employer can answer one or two more questions to improve matching

### Stop Condition C: Employer appears busy or gives short answers

If the employer is clearly in a hurry, the agent should prefer short
continuation paths over deeper intake.

### Stop Condition D: Follow-up value is low

If remaining questions are optional and unlikely to materially improve first
shortlisting, do not ask them unless the employer chooses to continue.

## Question Planning Rules

The agent should ask at most two focused questions per turn.

When choosing the next question:

1. determine the role bucket
2. extract already known fields
3. identify missing critical fields
4. ask the single highest-value missing question, or combine two related ones
5. avoid overlapping questions

Examples:

- Good: "What area is the job in, and when do you need the person to join?"
- Bad: "Tell me about location, salary, shifts, skills, experience, and
  language requirements."

## Employer Experience Rules

The flow should feel easier than hiring through WhatsApp or phone.

The employer should usually be able to:

1. send one natural message
2. answer two or three follow-up questions
3. review a short draft
4. save, edit, or submit

If the product requires too much effort for small roles, employers will not use
it.

## Editable Draft Form

After the conversation, the employer should see an editable structured draft.

The draft should support:

- edit any field manually
- save for later
- continue chat from the same draft
- finalize with partial information

### V1 Draft Sections

#### Core Role Info

- role title
- openings
- location
- shift timing
- joining timeline
- compensation

#### Matching Details

- experience
- must-have skills
- language requirements
- communication expectation

#### Optional Notes

- education requirement
- screening questions
- disqualifiers
- ideal candidate notes

## Suggested State Model

Instead of only `ready_to_review`, the framework should evolve toward richer
states.

### Suggested conversation status

- `captured_minimum`
- `needs_followup`
- `ready_for_matching`
- `ready_for_review`
- `finalized_by_employer`
- `saved_for_later`

### Suggested response actions

- `ask_next_question`
- `offer_save_now`
- `offer_continue_later`
- `show_editable_preview`
- `finalize_partial_draft`

## Mapping to Current API

The current API already returns:

- `assistant_message`
- `structured_requirement`
- `missing_fields`
- `ready_to_review`

This can remain valid in v1.

The current `structured_requirement` schema should be treated as the editable
form backing object. Some fields are broad for simple roles, but the agent can
leave non-essential fields blank.

## Suggested Near-Term API Extension

When the backend is ready, extend the agent response with the following fields:

- `conversation_status`
- `intake_mode`
- `role_bucket`
- `next_action`
- `can_finalize_now`
- `employer_finished`

Example response shape:

```json
{
  "assistant_message": "I have enough to prepare the draft. If you want, we can save this now or you can answer one more question about shift timing.",
  "structured_requirement": {
    "hiring_role": "Waiter",
    "location": "Bandra West",
    "joining_timeline": "Needs today",
    "compensation": "18000 to 22000",
    "experience": "",
    "must_have_skills": "",
    "ideal_candidate_notes": ""
  },
  "missing_fields": ["shift_timing"],
  "ready_to_review": false,
  "conversation_status": "captured_minimum",
  "intake_mode": "minimum",
  "role_bucket": "simple",
  "next_action": "offer_save_now",
  "can_finalize_now": true,
  "employer_finished": false
}
```

## Prompt Requirements

The prompt should enforce these behaviors.

It should tell the model to:

- classify the role into a role bucket
- ask only for missing critical fields
- ask at most two focused questions
- stop when the employer says they are done
- produce a partial draft even when incomplete
- prefer a concise summary once minimum useful information is captured
- avoid requesting advanced details for simple roles

It should not tell the model to always collect every field in the schema.

## V1 Implementation Order

1. Refine the prompt and response contract
2. Add stop detection for employer-finished messages
3. Add role bucket inference in the agent service
4. Add critical/helpful field matrices in code
5. Add conversation status and next action in the response
6. Render editable preview from `structured_requirement`
7. Support save-and-continue-later flows

## Initial Role Set

Keep the first role taxonomy small and practical.

Suggested starting roles:

- waiter
- cashier
- cleaner
- kitchen helper
- receptionist
- cook
- barista
- delivery associate

Everything else can map to the nearest bucket until role coverage expands.

## Non-Goals for V1

- exhaustive role taxonomy across all industries
- deep industry-specific logic for every business type
- forcing every employer to complete a full review-ready brief
- long-form form filling before a draft is created

## Success Criteria

The framework is working if:

- simple roles can usually be captured in one message plus two follow-ups
- employers can stop anytime without losing progress
- the agent does not bombard employers with low-value questions
- the resulting draft is usable for matching even when partial
- the final preview form gives enough trust and control to edit before submit
