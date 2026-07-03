# Test Plan: Account Management System (COBOL)

> **Purpose:** This test plan validates the business logic of the legacy COBOL Account Management System. It will serve as the basis for creating unit and integration tests in the target Node.js application during the migration.

---

## Test Cases

### 1. Menu Navigation & Display

| # | Heading | Details |
|---|---------|---------|
| **1.1** | **Test Case ID** | TC-MENU-001 |
| **Test Case Description** | Verify that the main menu is displayed correctly with all four options. |
| **Pre-conditions** | Application is launched. |
| **Test Steps** | 1. Start the application. |
| **Expected Result** | Menu displays: "View Balance", "Credit Account", "Debit Account", "Exit". |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Visual validation of menu text. |

| # | Heading | Details |
|---|---------|---------|
| **1.2** | **Test Case ID** | TC-MENU-002 |
| **Test Case Description** | Verify that an invalid menu choice is handled gracefully. |
| **Pre-conditions** | Application is running and menu is displayed. |
| **Test Steps** | 1. Enter an invalid choice (e.g., `5`, `0`, or a non-numeric character). |
| **Expected Result** | Message "Invalid choice, please select 1-4." is displayed and menu is redisplayed. |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Edge case: test with out-of-range numbers and alphabetic characters. |

| # | Heading | Details |
|---|---------|---------|
| **1.3** | **Test Case ID** | TC-MENU-003 |
| **Test Case Description** | Verify that selecting option 4 exits the application. |
| **Pre-conditions** | Application is running and menu is displayed. |
| **Test Steps** | 1. Enter `4`. |
| **Expected Result** | Message "Exiting the program. Goodbye!" is displayed and application terminates. |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Verify clean exit with no errors. |

---

### 2. View Balance

| # | Heading | Details |
|---|---------|---------|
| **2.1** | **Test Case ID** | TC-BALANCE-001 |
| **Test Case Description** | Verify that viewing the balance displays the initial default balance. |
| **Pre-conditions** | Application is running. No prior credit/debit operations have been performed in this session. |
| **Test Steps** | 1. Select option `1` (View Balance). |
| **Expected Result** | "Current balance: 001000.00" is displayed. |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Initial balance is hardcoded as 1000.00 in `DataProgram`. |

| # | Heading | Details |
|---|---------|---------|
| **2.2** | **Test Case ID** | TC-BALANCE-002 |
| **Test Case Description** | Verify that viewing the balance after a credit operation reflects the updated balance. |
| **Pre-conditions** | A credit operation has been performed (e.g., credited 500.00). |
| **Test Steps** | 1. Select option `1` (View Balance). |
| **Expected Result** | Balance displays the updated amount (e.g., "001500.00"). |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Balance is persisted in `DataProgram` working storage for the session. |

| # | Heading | Details |
|---|---------|---------|
| **2.3** | **Test Case ID** | TC-BALANCE-003 |
| **Test Case Description** | Verify that viewing the balance after a debit operation reflects the updated balance. |
| **Pre-conditions** | A debit operation has been performed successfully (e.g., debited 200.00). |
| **Test Steps** | 1. Select option `1` (View Balance). |
| **Expected Result** | Balance displays the updated amount (e.g., "000800.00"). |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Validate read-after-write consistency. |

---

### 3. Credit Account

| # | Heading | Details |
|---|---------|---------|
| **3.1** | **Test Case ID** | TC-CREDIT-001 |
| **Test Case Description** | Verify that a valid credit amount is added to the balance successfully. |
| **Pre-conditions** | Application is running. Current balance is 1000.00. |
| **Test Steps** | 1. Select option `2` (Credit Account). 2. Enter `500.00`. |
| **Expected Result** | "Amount credited. New balance: 001500.00" is displayed. |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Standard positive test case. |

| # | Heading | Details |
|---|---------|---------|
| **3.2** | **Test Case ID** | TC-CREDIT-002 |
| **Test Case Description** | Verify that multiple credit operations accumulate correctly. |
| **Pre-conditions** | Application is running. Current balance is 1000.00. |
| **Test Steps** | 1. Select option `2` and credit `250.00`. 2. Select option `2` and credit `750.00`. 3. Select option `1` (View Balance). |
| **Expected Result** | Balance displays "002000.00" (1000 + 250 + 750 = 2000). |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Validate cumulative credit logic. |

| # | Heading | Details |
|---|---------|---------|
| **3.3** | **Test Case ID** | TC-CREDIT-003 |
| **Test Case Description** | Verify that a zero-amount credit is accepted (edge case). |
| **Pre-conditions** | Application is running. |
| **Test Steps** | 1. Select option `2`. 2. Enter `0`. |
| **Expected Result** | Balance remains unchanged. "Amount credited. New balance: 001000.00" is displayed. |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Business rule: zero is a valid numeric amount. |

| # | Heading | Details |
|---|---------|---------|
| **3.4** | **Test Case ID** | TC-CREDIT-004 |
| **Test Case Description** | Verify that very large credit amounts are handled within the predefined limits. |
| **Pre-conditions** | Application is running. Current balance is 1000.00. |
| **Test Steps** | 1. Select option `2`. 2. Enter `999999.99` (maximum for PIC 9(6)V99). |
| **Expected Result** | Amount is accepted without overflow errors. |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | PIC 9(6)V99 supports up to 999999.99. Test boundary conditions. |

---

### 4. Debit Account

| # | Heading | Details |
|---|---------|---------|
| **4.1** | **Test Case ID** | TC-DEBIT-001 |
| **Test Case Description** | Verify that a valid debit amount is subtracted from the balance successfully. |
| **Pre-conditions** | Application is running. Current balance is 1000.00. |
| **Test Steps** | 1. Select option `3` (Debit Account). 2. Enter `300.00`. |
| **Expected Result** | "Amount debited. New balance: 000700.00" is displayed. |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Standard positive test case. |

| # | Heading | Details |
|---|---------|---------|
| **4.2** | **Test Case ID** | TC-DEBIT-002 |
| **Test Case Description** | Verify that debiting an amount equal to the current balance is allowed. |
| **Pre-conditions** | Application is running. Current balance is 1000.00. |
| **Test Steps** | 1. Select option `3`. 2. Enter `1000.00`. |
| **Expected Result** | "Amount debited. New balance: 000000.00" is displayed. |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Balance can go to zero; no minimum balance requirement exists. |

| # | Heading | Details |
|---|---------|---------|
| **4.3** | **Test Case ID** | TC-DEBIT-003 |
| **Test Case Description** | Verify that debiting an amount exceeding the current balance is rejected. |
| **Pre-conditions** | Application is running. Current balance is 1000.00. |
| **Test Steps** | 1. Select option `3`. 2. Enter `1500.00`. |
| **Expected Result** | "Insufficient funds for this debit." is displayed. Balance remains 1000.00. |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Critical business rule: insufficient funds check. |

| # | Heading | Details |
|---|---------|---------|
| **4.4** | **Test Case ID** | TC-DEBIT-004 |
| **Test Case Description** | Verify that multiple debit operations work correctly in sequence. |
| **Pre-conditions** | Application is running. Current balance is 1000.00. |
| **Test Steps** | 1. Debit `200.00` (balance → 800.00). 2. Debit `300.00` (balance → 500.00). 3. View balance. |
| **Expected Result** | Balance displays "000500.00". |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Validate cumulative debit logic. |

| # | Heading | Details |
|---|---------|---------|
| **4.5** | **Test Case ID** | TC-DEBIT-005 |
| **Test Case Description** | Verify that a zero-amount debit is accepted (edge case). |
| **Pre-conditions** | Application is running. |
| **Test Steps** | 1. Select option `3`. 2. Enter `0`. |
| **Expected Result** | "Amount debited. New balance: 001000.00" is displayed. |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Edge case: zero is valid but no balance change occurs. |

| # | Heading | Details |
|---|---------|---------|
| **4.6** | **Test Case ID** | TC-DEBIT-006 |
| **Test Case Description** | Verify that a debit attempt after balance reaches zero shows insufficient funds. |
| **Pre-conditions** | Balance is 0.00 (after debiting the full amount). |
| **Test Steps** | 1. Select option `3`. 2. Enter any positive amount (e.g., `100.00`). |
| **Expected Result** | "Insufficient funds for this debit." is displayed. Balance remains 0.00. |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Overdraft is not allowed. |

---

### 5. Mixed Operations (Integration Scenarios)

| # | Heading | Details |
|---|---------|---------|
| **5.1** | **Test Case ID** | TC-MIXED-001 |
| **Test Case Description** | Verify a complete workflow: credit → view balance → debit → view balance. |
| **Pre-conditions** | Application is running. Initial balance is 1000.00. |
| **Test Steps** | 1. Credit `500.00`. 2. View balance. 3. Debit `200.00`. 4. View balance. |
| **Expected Result** | Step 2 shows "001500.00". Step 4 shows "001300.00". |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | End-to-end workflow validation. |

| # | Heading | Details |
|---|---------|---------|
| **5.2** | **Test Case ID** | TC-MIXED-002 |
| **Test Case Description** | Verify that after an insufficient funds error, subsequent valid operations still work. |
| **Pre-conditions** | Application is running. Balance is 1000.00. |
| **Test Steps** | 1. Attempt debit of `2000.00` (insufficient funds). 2. Credit `500.00`. 3. View balance. |
| **Expected Result** | Step 1 shows "Insufficient funds". Step 3 shows "001500.00" (credit still works after failed debit). |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Failed operations must not corrupt the balance state. |

| # | Heading | Details |
|---|---------|---------|
| **5.3** | **Test Case ID** | TC-MIXED-003 |
| **Test Case Description** | Verify that the application can handle a long sequence of random operations without crashing. |
| **Pre-conditions** | Application is running. |
| **Test Steps** | 1. Perform a sequence of 10+ random operations (credits, debits, balance views, invalid inputs). |
| **Expected Result** | All operations complete successfully; balance remains consistent. No crashes or hangs. |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Stress/robustness test for session stability. |

---

### 6. Data Program (Internal Storage)

| # | Heading | Details |
|---|---------|---------|
| **6.1** | **Test Case ID** | TC-DATA-001 |
| **Test Case Description** | Verify that `DataProgram` initializes the balance to 1000.00 on first read. |
| **Pre-conditions** | Application is freshly started. |
| **Test Steps** | 1. View balance immediately after start. |
| **Expected Result** | Balance is "001000.00". |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Validates the VALUE 1000.00 clause in `DataProgram`. |

| # | Heading | Details |
|---|---------|---------|
| **6.2** | **Test Case ID** | TC-DATA-002 |
| **Test Case Description** | Verify that `DataProgram` correctly persists balance between successive operations. |
| **Pre-conditions** | Application is running. A credit/debit has modified the balance. |
| **Test Steps** | 1. Credit 500.00. 2. Debit 300.00. 3. View balance. |
| **Expected Result** | Balance reflects 1200.00 (1000 + 500 - 300). |
| **Actual Result** | |
| **Status (Pass/Fail)** | |
| **Comments** | Validates READ/WRITE consistency in `DataProgram`. |

---

## Summary

| Category | Test Case Count |
|----------|----------------|
| Menu Navigation | 3 |
| View Balance | 3 |
| Credit Account | 4 |
| Debit Account | 6 |
| Mixed Operations | 3 |
| Data Program | 2 |
| **Total** | **21** |
