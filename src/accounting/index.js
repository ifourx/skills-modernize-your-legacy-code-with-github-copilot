const readline = require('readline');

// =============================================================================
// DataProgram (data.cob)
// In-memory data storage simulator
// Mirrors the COBOL PIC 9(6)V99: fixed-point with 2 decimal places,
// max value 999999.99
// =============================================================================
class DataProgram {
    #storageBalance = 1000.00;

    /**
     * Read the current balance
     * @returns {number} Current balance with 2 decimal precision
     */
    read() {
        return this.#storageBalance;
    }

    /**
     * Write a new balance value
     * @param {number} balance - The balance to persist
     */
    write(balance) {
        // COBOL PIC 9(6)V99 clamps to 2 decimal places
        this.#storageBalance = Math.round(balance * 100) / 100;
    }

    /**
     * Reset balance to default (for testing)
     */
    reset() {
        this.#storageBalance = 1000.00;
    }
}

// =============================================================================
// Operations (operations.cob)
// Core business logic: view balance, credit, debit
// =============================================================================
class Operations {
    /**
     * @param {DataProgram} dataProgram
     */
    constructor(dataProgram) {
        this.data = dataProgram;
    }

    /**
     * TOTAL - View current balance
     * Mirrors COBOL: CALL 'DataProgram' USING 'READ', FINAL-BALANCE
     *               DISPLAY "Current balance: " FINAL-BALANCE
     * @returns {number} Current balance
     */
    viewBalance() {
        const balance = this.data.read();
        console.log(`Current balance: ${balance.toFixed(2)}`);
        return balance;
    }

    /**
     * CREDIT - Add funds to account
     * Mirrors COBOL: ACCEPT AMOUNT, READ balance, ADD AMOUNT, WRITE balance
     * @param {number} amount - The amount to credit (positive number)
     * @returns {{ success: boolean, balance: number }} Operation result
     */
    credit(amount) {
        const currentBalance = this.data.read();
        const newBalance = currentBalance + amount;
        this.data.write(newBalance);
        const finalBalance = this.data.read();
        console.log(`Amount credited. New balance: ${finalBalance.toFixed(2)}`);
        return { success: true, balance: finalBalance };
    }

    /**
     * DEBIT - Withdraw funds from account with insufficient funds check
     * Mirrors COBOL: ACCEPT AMOUNT, READ balance, IF >= THEN SUBTRACT & WRITE
     * @param {number} amount - The amount to debit (positive number)
     * @returns {{ success: boolean, balance: number }} Operation result
     */
    debit(amount) {
        const currentBalance = this.data.read();

        if (currentBalance >= amount) {
            const newBalance = currentBalance - amount;
            this.data.write(newBalance);
            const finalBalance = this.data.read();
            console.log(`Amount debited. New balance: ${finalBalance.toFixed(2)}`);
            return { success: true, balance: finalBalance };
        } else {
            console.log('Insufficient funds for this debit.');
            return { success: false, balance: currentBalance };
        }
    }
}

// =============================================================================
// MainProgram (main.cob)
// User interface and menu loop
// =============================================================================
class AccountManagementSystem {
    constructor() {
        this.dataProgram = new DataProgram();
        this.operations = new Operations(this.dataProgram);
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.continuing = true;
    }

    /**
     * Display the main menu
     */
    displayMenu() {
        console.log('--------------------------------');
        console.log('Account Management System');
        console.log('1. View Balance');
        console.log('2. Credit Account');
        console.log('3. Debit Account');
        console.log('4. Exit');
        console.log('--------------------------------');
    }

    /**
     * Prompt user for a menu choice
     * @returns {Promise<number>} The user's choice (1-4)
     */
    askChoice() {
        return new Promise((resolve) => {
            this.rl.question('Enter your choice (1-4): ', (answer) => {
                const choice = parseInt(answer.trim(), 10);
                resolve(choice);
            });
        });
    }

    /**
     * Prompt user for a numeric amount
     * @param {string} prompt - The prompt message
     * @returns {Promise<number>} The entered amount
     */
    askAmount(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                const amount = parseFloat(answer.trim());
                resolve(isNaN(amount) ? 0 : Math.round(amount * 100) / 100);
            });
        });
    }

    /**
     * Handle the user's menu selection
     * Mirrors COBOL EVALUATE USER-CHOICE block
     * @param {number} choice - The user's choice
     */
    async handleChoice(choice) {
        switch (choice) {
            case 1:
                // WHEN 1 CALL 'Operations' USING 'TOTAL '
                this.operations.viewBalance();
                break;

            case 2:
                // WHEN 2 CALL 'Operations' USING 'CREDIT'
                const creditAmount = await this.askAmount('Enter credit amount: ');
                this.operations.credit(creditAmount);
                break;

            case 3:
                // WHEN 3 CALL 'Operations' USING 'DEBIT '
                const debitAmount = await this.askAmount('Enter debit amount: ');
                this.operations.debit(debitAmount);
                break;

            case 4:
                // WHEN 4 MOVE 'NO' TO CONTINUE-FLAG
                this.continuing = false;
                break;

            default:
                // WHEN OTHER
                console.log('Invalid choice, please select 1-4.');
        }
    }

    /**
     * Run the main application loop
     * Mirrors COBOL: PERFORM UNTIL CONTINUE-FLAG = 'NO'
     */
    async run() {
        while (this.continuing) {
            this.displayMenu();
            const choice = await this.askChoice();
            await this.handleChoice(choice);
        }
        console.log('Exiting the program. Goodbye!');
        this.rl.close();
    }
}

// =============================================================================
// Entry point
// =============================================================================
if (require.main === module) {
    const app = new AccountManagementSystem();
    app.run().catch((err) => {
        console.error('Unexpected error:', err);
        process.exit(1);
    });
}

// Export classes for testing
module.exports = { AccountManagementSystem, Operations, DataProgram };
