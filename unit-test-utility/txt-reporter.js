const fs = require('fs');
const path = require('path');

class TxtReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunComplete(contexts, results) {
    let output = `Test Run Summary\n`;
    output += `================\n`;
    output += `Total Tests: ${results.numTotalTests}\n`;
    output += `Passed: ${results.numPassedTests}\n`;
    output += `Failed: ${results.numFailedTests}\n`;
    output += `Time: ${(Date.now() - results.startTime) / 1000}s\n\n`;

    results.testResults.forEach(suite => {
      const relativePath = path.relative(process.cwd(), suite.testFilePath);
      output += `Suite: ${relativePath}\n`;
      output += `-`.repeat(suite.testFilePath.length) + `\n`;
      
      suite.testResults.forEach(test => {
        output += `  [${test.status.toUpperCase()}] ${test.title}\n`;
        if (test.failureMessages && test.failureMessages.length > 0) {
          test.failureMessages.forEach(msg => {
            // Clean ANSI escape codes from message
            const cleanMsg = msg.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
            output += `    Error details:\n${cleanMsg}\n`;
          });
        }
      });
      output += `\n`;
    });

    const outputPath = path.join(process.cwd(), 'test-results.txt');
    fs.writeFileSync(outputPath, output, 'utf8');
    console.log(`\nTest results successfully written to: ${outputPath}`);
  }
}

module.exports = TxtReporter;
