/**
 * Enum representing the possible outcomes of a test.
 * @enum {string}
 */
export enum TestOutcome {
    /**
     * Indicates that a test failed.
     */
    FAILED = 'failed',

    /**
     * Indicates that a test passed.
     */
    PASSED = 'passed',

    /**
     * Indicates that the test was exited.
     */
    EXIT = 'exit',
}
