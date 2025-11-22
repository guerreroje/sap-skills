/**
 * SAP Job Scheduling Service - Node.js Async Job Handler Template
 *
 * This template demonstrates how to implement an asynchronous job endpoint
 * that handles long-running operations (> 15 seconds).
 *
 * Usage:
 * 1. Configure your job with this endpoint as the action URL
 * 2. Job Scheduler will invoke this endpoint with job headers
 * 3. Endpoint returns 202 Accepted immediately
 * 4. After processing, call Update Run Log API to report status
 */

const express = require('express');
const JobSchedulerClient = require('@sap/jobs-client');
const xsenv = require('@sap/xsenv');
const xssec = require('@sap/xssec');

const app = express();
app.use(express.json());

// Initialize Job Scheduler client
const credentials = xsenv.getServices({ jobscheduler: { tag: 'jobscheduler' } });
const xsuaaCredentials = xsenv.getServices({ uaa: { tag: 'xsuaa' } }).uaa;

const scheduler = new JobSchedulerClient.Scheduler({
  baseURL: credentials.jobscheduler.url,
  credentials: credentials.jobscheduler.uaa
});

/**
 * Token validation middleware
 */
function validateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  xssec.createSecurityContext(token, xsuaaCredentials, (err, securityContext) => {
    if (err) {
      console.error('Token validation failed:', err);
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Optional: Check for specific scope
    if (!securityContext.checkLocalScope('JOBSCHEDULER')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    req.securityContext = securityContext;
    next();
  });
}

/**
 * Async job endpoint
 *
 * Job Scheduler passes these headers:
 * - x-sap-job-id: Job identifier
 * - x-sap-job-schedule-id: Schedule identifier
 * - x-sap-job-run-id: Run identifier
 * - x-sap-scheduler-host: Scheduler host URL
 */
app.post('/api/async-job', validateToken, async (req, res) => {
  // Extract job headers
  const jobId = req.headers['x-sap-job-id'];
  const scheduleId = req.headers['x-sap-job-schedule-id'];
  const runId = req.headers['x-sap-job-run-id'];
  const schedulerHost = req.headers['x-sap-scheduler-host'];

  console.log(`Job received - ID: ${jobId}, Schedule: ${scheduleId}, Run: ${runId}`);

  // Validate required headers
  if (!jobId || !scheduleId || !runId) {
    return res.status(400).json({
      error: 'Missing required job headers',
      required: ['x-sap-job-id', 'x-sap-job-schedule-id', 'x-sap-job-run-id']
    });
  }

  // Return 202 Accepted immediately for async processing
  res.status(202).json({
    message: 'Job accepted for processing',
    jobId: jobId,
    runId: runId
  });

  // Process job asynchronously
  processJobAsync(jobId, scheduleId, runId, req.body);
});

/**
 * Async job processing function
 */
async function processJobAsync(jobId, scheduleId, runId, data) {
  const startTime = Date.now();

  try {
    console.log(`Starting async processing for job ${jobId}, run ${runId}`);

    // ============================================
    // YOUR LONG-RUNNING LOGIC HERE
    // ============================================
    const result = await performLongRunningTask(data);
    // ============================================

    const duration = Date.now() - startTime;
    console.log(`Job ${jobId} completed successfully in ${duration}ms`);

    // Update run log with success
    await updateRunLog(jobId, scheduleId, runId, {
      success: true,
      message: `Job completed successfully in ${duration}ms. Result: ${JSON.stringify(result)}`
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Job ${jobId} failed after ${duration}ms:`, error);

    // Update run log with failure
    await updateRunLog(jobId, scheduleId, runId, {
      success: false,
      message: `Job failed after ${duration}ms: ${error.message}`
    });
  }
}

/**
 * Placeholder for your long-running task
 * Replace this with your actual business logic
 */
async function performLongRunningTask(data) {
  // Example: Simulate a 2-minute task
  console.log('Processing data:', JSON.stringify(data));

  // Simulate work
  await new Promise(resolve => setTimeout(resolve, 120000)); // 2 minutes

  return {
    processed: true,
    recordsProcessed: 1000,
    timestamp: new Date().toISOString()
  };
}

/**
 * Update job run log with completion status
 */
function updateRunLog(jobId, scheduleId, runId, status) {
  return new Promise((resolve, reject) => {
    scheduler.updateJobRunLog({
      jobId: parseInt(jobId),
      scheduleId: scheduleId,
      runId: runId,
      data: status
    }, (err, result) => {
      if (err) {
        console.error('Failed to update run log:', err);
        reject(err);
      } else {
        console.log('Run log updated successfully');
        resolve(result);
      }
    });
  });
}

/**
 * Synchronous job endpoint (for jobs completing in < 15 seconds)
 */
app.post('/api/sync-job', validateToken, async (req, res) => {
  try {
    console.log('Processing synchronous job');

    // Your quick processing logic here
    const result = await quickProcess(req.body);

    // Return success (200-399, except 202)
    res.status(200).json({
      success: true,
      result: result
    });

  } catch (error) {
    console.error('Sync job failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

async function quickProcess(data) {
  // Your quick processing logic (< 15 seconds)
  return { processed: true };
}

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Job handler listening on port ${port}`);
});

module.exports = app;
