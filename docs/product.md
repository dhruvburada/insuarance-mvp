# Insurance Agent Platform — Product Requirements Document

---

## Overview

A web-based MVP platform enabling insurance agents to:

* Onboard clients
* Match clients to applicable insurance policies
* Generate personalized insurance documents
* Share documents via WhatsApp
* Collect payments

---

## Goals

* **Fast MVP delivery:** Target 1–2 days
* **Scalable foundation:** Support Phase 1, Phase 2, and Phase 3 development
* **Agent-first workflow:** No customer-facing portal in the MVP

---

## Users

| Role                | Description                                                     |
| ------------------- | --------------------------------------------------------------- |
| **Insurance Agent** | Signs up, manages client profiles, and sells insurance policies |

---

## Tech Stack

| Layer           | Tool                                                    |
| --------------- | ------------------------------------------------------- |
| Frontend + API  | Next.js (React)                                         |
| Database + Auth + Storage | Supabase                                                |
| Hosting         | Vercel                                                  |
| Payments        | Razorpay — payment link generation                      |
| Messaging       | No WhatsApp Business API Integration instead a simple browser link                                   |

---

# Core Features (MVP)

## 1. Agent Authentication

* Sign up / Login via Supabase Auth

  * Email/password
  * Google SSO
* Protected dashboard routes

---

## 2. Insurance Product Catalog

Maintain a catalog of all available insurance products, including:

* Term insurance
* Health insurance
* Vehicle insurance
* Other applicable insurance products

Each insurance product should include all relevant information and eligibility criteria typically required by a real insurance company to determine whether a customer qualifies for the policy.:

---

## 3. Client Profile Creation

The agent fills out a client profile form containing:

* First name
* Last name
* Date of birth
* Phone number
* Email address
* Other eligibility fields, such as:

  * Age
  * Health status
  * Vehicle type
  * Similarly, the customer profile form should collect all the information that a real insurance company would typically require to determine the customer's eligibility for a particular insurance product.

### On Save

The system creates a **Client Profile** associated with the logged-in agent.

---

4. Policy Eligibility Matching

When a client profile is saved:

The system evaluates the client's information against the eligibility criteria defined for each insurance product.
The system checks the customer's details against the required eligibility rules.
The system returns a list of insurance products for which the customer is eligible.
Matching insurance products are displayed on the client's profile page.

### Example

> **Client:** Rahul, 32, healthy, non-smoker
> **Applicable Policies:** Term Insurance A, Health Insurance B

---

## 5. PDF Document Generation

The agent can select an applicable policy, such as health insurance.

The system generates a **personalized insurance document PDF** containing:

* Client name
* Policy name
* Policy details
* Coverage information
* Premium amount
* Other relevant policy information

### Requirements

* PDF generated automatically
* Agent can preview the PDF in-browser
* PDF should be available as a shareable link

---

## 6. WhatsApp Sharing

The agent can click:

> **Share via WhatsApp**

The system opens WhatsApp with a pre-filled message containing the personalized insurance document link.

The agent can review the message and manually send it to the client's WhatsApp number.

> **Note:** The MVP will **not integrate with the WhatsApp Business API**. WhatsApp sharing will use a simple redirect/deep link to WhatsApp.


## 7. Payment Link Generation

From the client profile, the agent can:

1. Select an applicable policy for the client.
2. Click **Generate Payment Link**.
3. The system creates a Razorpay payment link for the policy premium.
4. The agent can copy the payment link and share it with the client via WhatsApp.
5. The client completes the payment through the Razorpay payment link.
6. Once the payment is successful, the payment status is updated automatically in the agent's dashboard.
7. The agent can see the payment status directly on the client's profile and associated policy.

### Payment Notification

When a client successfully completes a payment, the system should notify the agent that the payment has been received.

The dashboard should clearly indicate:

* **Payment Status:** Paid / Pending / Failed
* **Payment Amount**
* **Payment Date**
* **Associated Policy**
* **Client Name**
* **Razorpay Payment ID** (if required)

This allows the agent to immediately identify which clients have completed their payments without manually checking Razorpay.


## 8. Payment Confirmation & Email Notification

When payment is successfully completed:

1. Razorpay sends a payment confirmation/webhook.
2. The policy application is marked as **active**.
3. The client receives an email confirmation.

### Email Example

> **Your [Policy Name] insurance is now active.**

The client's policy status should be updated from:

`pending` → `active`

---

# Out of Scope — MVP

The following features are explicitly excluded from the MVP:

* Customer-facing portal/dashboard
* WhatsApp chatbot / AI agent chat
* Multi-role admin panel
* Claims management
* Document e-signing

---

# Success Criteria

The MVP is considered successful when an insurance agent can:

* [x] Agent Sign up and log in
* [x] Create a client profile
* [x] Receive matching insurance policies
* [x] Generate a personalized PDF
* [x] Preview and share the PDF via WhatsApp
* [x] Generate a Razorpay payment link
* [x] Share the payment link via WhatsApp
* [x] Agent get notified about client's payment
* [x] Have the client receive an email after successful payment
* [x] Have the policy automatically marked as active after payment

---

# Future Phases

## Phase 1 — Customer Portal

* Customer login
* View active policies
* View policy documents
* View recommended policies
* Track payment/policy status

## Phase 2 — Insurance Company Admin Panel

* Manage insurance products
* Manage agents
* Manage commissions
* Monitor policy sales
* Manage eligibility rules

## Phase 3 — Advanced Operations

* Claims management
* Policy renewal reminders
* Analytics dashboard
* Agent performance tracking
* Customer/policy insights
