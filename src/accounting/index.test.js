/**
 * Unit tests for the Node.js Account Management System
 *
 * Maps directly to the test plan documented in docs/TESTPLAN.md
 * covering all business logic from the legacy COBOL application.
 */
const { DataProgram, Operations, AccountManagementSystem } = require('./index.js');

// =============================================================================
// Helper: suppress console.log during tests for cleaner output
// =============================================================================
let consoleOutput = [];
const originalLog = console.log;
beforeEach(() => {
    consoleOutput = [];
    console.log = (...args) => {
        consoleOutput.push(args.join(' '));
    };
});
afterEach(() => {
    console.log = originalLog;
});

// =============================================================================
// 1. Menu Navigation & Display
// =============================================================================
describe('Menu Navigation & Display', () => {
    // TC-MENU-001: Verify main menu displays correctly
    test('TC-MENU-001: Menu displays all four options', () => {
        const app = new AccountManagementSystem();
        app.displayMenu();
        const output = consoleOutput.join('\n');
        expect(output).toContain('Account Management System');
        expect(output).toContain('1. View Balance');
        expect(output).toContain('2. Credit Account');
        expect(output).toContain('3. Debit Account');
        expect(output).toContain('4. Exit');
        expect(output).toContain('--------------------------------');
        app.rl.close();
    });

    // TC-MENU-002: Invalid menu choice
    test('TC-MENU-002: Invalid menu choice displays error message', () => {
        const app = new AccountManagementSystem();
        app.handleChoice(5);
        expect(consoleOutput).toContain('Invalid choice, please select 1-4.');
        app.rl.close();
    });

    // TC-MENU-002 variant: non-numeric (0)
    test('TC-MENU-002: Invalid choice 0 handled gracefully', () => {
        const app = new AccountManagementSystem();
        app.handleChoice(0);
        expect(consoleOutput).toContain('Invalid choice, please select 1-4.');
        app.rl.close();
    });

    // TC-MENU-003: Exit application
    test('TC-MENU-003: Choice 4 sets continuing to false', () => {
        const app = new AccountManagementSystem();
        expect(app.continuing).toBe(true);
        app.handleChoice(4);
        expect(app.continuing).toBe(false);
        app.rl.close();
    });
});

// =============================================================================
// 2. View Balance
// =============================================================================
describe('View Balance', () => {
    // TC-BALANCE-001: Initial default balance
    test('TC-BALANCE-001: Initial balance displays 1000.00', () => {
        const data = new DataProgram();
        const ops = new Operations(data);
        const balance = ops.viewBalance();
        expect(balance).toBe(1000.00);
        expect(consoleOutput).toContain('Current balance: 1000.00');
    });

    // TC-BALANCE-002: Balance after credit
    test('TC-BALANCE-002: Balance reflects credit operation', () => {
        const data = new DataProgram();
        const ops = new Operations(data);
        ops.credit(500.00);
        consoleOutput = []; // clear

        const balance = ops.viewBalance();
        expect(balance).toBe(1500.00);
        expect(consoleOutput).toContain('Current balance: 1500.00');
    });

    // TC-BALANCE-003: Balance after debit
    test('TC-BALANCE-003: Balance reflects debit operation', () => {
        const data = new DataProgram();
        const ops = new Operations(data);
        ops.debit(200.00);
        consoleOutput = []; // clear

        const balance = ops.viewBalance();
        expect(balance).toBe(800.00);
        expect(consoleOutput).toContain('Current balance: 800.00');
    });
});

// =============================================================================
// 3. Credit Account
// =============================================================================
describe('Credit Account', () => {
    // TC-CREDIT-001: Valid credit
    test('TC-CREDIT-001: Credit 500.00 to initial balance of 1000.00', () => {
        const data = new DataProgram();
        const ops = new Operations(data);
        const result = ops.credit(500.00);
        expect(result.success).toBe(true);
        expect(result.balance).toBe(1500.00);
        expect(consoleOutput).toContain('Amount credited. New balance: 1500.00');
    });

    // TC-CREDIT-002: Multiple credits accumulate
    test('TC-CREDIT-002: Multiple credits accumulate correctly', () => {
        const data = new DataProgram();
        const ops = new Operations(data);
        ops.credit(250.00);
        expect(data.read()).toBe(1250.00);
        ops.credit(750.00);
        expect(data.read()).toBe(2000.00);
    });

    // TC-CREDIT-003: Zero-amount credit
    test('TC-CREDIT-003: Zero-amount credit does not change balance', () => {
        const data = new DataProgram();
        const ops = new Operations(data);
        const result = ops.credit(0);
        expect(result.success).toBe(true);
        expect(result.balance).toBe(1000.00);
        expect(data.read()).toBe(1000.00);
    });

    // TC-CREDIT-004: Large credit near maximum
    test('TC-CREDIT-004: Large credit amount near PIC 9(6)V99 limit', () => {
        const data = new DataProgram();
        const ops = new Operations(data);
        const result = ops.credit(999999.99);
        expect(result.success).toBe(true);
        expect(result.balance).toBe(1000999.99);
    });
});

// =============================================================================
// 4. Debit Account
// =============================================================================
describe('Debit Account', () => {
    // TC-DEBIT-001: Valid debit
    test('TC-DEBIT-001: Debit 300.00 from initial balance of 1000.00', () => {
        const data = new DataProgram();
        const ops = new Operations(data);
        const result = ops.debit(300.00);
        expect(result.success).toBe(true);
        expect(result.balance).toBe(700.00);
        expect(consoleOutput).toContain('Amount debited. New balance: 700.00');
    });

    // TC-DEBIT-002: Debit equal to balance
    test('TC-DEBIT-002: Debit entire balance (1000.00) reduces to 0.00', () => {
        const data = new DataProgram();
        const ops = new Operations(data);
        const result = ops.debit(1000.00);
        expect(result.success).toBe(true);
        expect(result.balance).toBe(0.00);
        expect(data.read()).toBe(0.00);
    });

    // TC-DEBIT-003: Insufficient funds
    test('TC-DEBIT-003: Debit exceeding balance is rejected', () => {
        const data = new DataProgram();
        const ops = new Operations(data);
        const result = ops.debit(1500.00);
        expect(result.success).toBe(false);
        expect(result.balance).toBe(1000.00);
        expect(consoleOutput).toContain('Insufficient funds for this debit.');
        // Verify balance unchanged
        expect(data.read()).toBe(1000.00);
    });

    // TC-DEBIT-004: Multiple debits
    test('TC-DEBIT-004: Multiple debits accumulate correctly', () => {
        const data = new DataProgram();
        const ops = new Operations(data);
        ops.debit(200.00);
        expect(data.read()).toBe(800.00);
        ops.debit(300.00);
        expect(data.read()).toBe(500.00);
        // Final verification
        expect(ops.viewBalance()).toBe(500.00);
    });

    // TC-DEBIT-005: Zero-amount debit
    test('TC-DEBIT-005: Zero-amount debit does not change balance', () => {
        const data = new DataProgram();
        const ops = new Operations(data);
        const result = ops.debit(0);
        expect(result.success).toBe(true);
        expect(result.balance).toBe(1000.00);
        expect(data.read()).toBe(1000.00);
    });

    // TC-DEBIT-006: Debit when balance is 0
    test('TC-DEBIT-006: Debit attempt after balance reaches zero shows insufficient funds', () => {
        const data = new DataProgram();
        const ops = new Operations(data);
        // Drain balance
        ops.debit(1000.00);
        expect(data.read()).toBe(0.00);

        // Attempt debit
        consoleOutput = [];
        const result = ops.debit(100.00);
        expect(result.success).toBe(false);
        expect(result.balance).toBe(0.00);
        expect(consoleOutput).toContain('Insufficient funds for this debit.');
        expect(data.read()).toBe(0.00);
    });
});

// =============================================================================
// 5. Mixed Operations (Integration Scenarios)
// =============================================================================
describe('Mixed Operations', () => {
    // TC-MIXED-001: Complete workflow
    test('TC-MIXED-001: Credit -> View -> Debit -> View', () => {
        const data = new DataProgram();
        const ops = new Operations(data);
        ops.credit(500.00);
        expect(ops.viewBalance()).toBe(1500.00);
        ops.debit(200.00);
        expect(ops.viewBalance()).toBe(1300.00);
    });

    // TC-MIXED-002: Recovery after insufficient funds
    test('TC-MIXED-002: Credit still works after failed debit', () => {
        const data = new DataProgram();
        const ops = new Operations(data);
        // Attempt debit that exceeds balance
        ops.debit(2000.00);
        expect(data.read()).toBe(1000.00);
        // Credit should still work
        ops.credit(500.00);
        expect(data.read()).toBe(1500.00);
    });

    // TC-MIXED-003: Long sequence of operations
    test('TC-MIXED-003: Long sequence of random operations without crashing', () => {
        const data = new DataProgram();
        const ops = new Operations(data);
        // Perform a sequence of mixed operations
        ops.credit(100.00);    // 1100.00
        ops.credit(250.50);    // 1350.50
        ops.debit(50.25);      // 1300.25
        ops.viewBalance();
        ops.debit(2000.00);    // insufficient funds
        ops.credit(499.75);    // 1800.00
        ops.debit(800.00);     // 1000.00
        ops.credit(0);         // 1000.00 (no change)
        ops.debit(1000.00);    // 0.00
        ops.debit(1.00);       // insufficient funds

        // Verify final state
        expect(data.read()).toBe(0.00);
    });
});

// =============================================================================
// 6. Data Program (Internal Storage)
// =============================================================================
describe('Data Program (Internal Storage)', () => {
    // TC-DATA-001: Initial balance
    test('TC-DATA-001: DataProgram initializes balance to 1000.00', () => {
        const data = new DataProgram();
        // Fresh instance should have 1000.00
        expect(data.read()).toBe(1000.00);
    });

    // TC-DATA-002: Persistence across operations
    test('TC-DATA-002: DataProgram persists balance across successive operations', () => {
        const data = new DataProgram();
        // Initial
        expect(data.read()).toBe(1000.00);
        // Credit
        data.write(data.read() + 500.00);
        expect(data.read()).toBe(1500.00);
        // Debit
        data.write(data.read() - 300.00);
        expect(data.read()).toBe(1200.00);
    });

    // Bonus: precision test
    test('TC-DATA-002b: DataProgram maintains 2-decimal precision', () => {
        const data = new DataProgram();
        data.write(10.999);
        expect(data.read()).toBe(11.00);
        data.write(10.555);
        expect(data.read()).toBe(10.56);
    });
});
