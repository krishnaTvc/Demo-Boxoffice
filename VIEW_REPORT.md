To view your test results with screenshots and videos:

1.  Run your tests:
    ```bash
    npx playwright test
    ```

2.  Open the report:
    ```bash
    npx playwright show-report
    ```

The HTML report will open in your browser. You can click on each test case to see:
*   **Steps**: Every action taken.
*   **Screenshots**: Captured at the end of every test (as we configured `screenshot: 'on'`).
*   **Video**: A full recording of the test execution.
*   **Trace**: A detailed timeline for debugging (click the "Trace" icon).
