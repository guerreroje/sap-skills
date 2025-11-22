# SAP Job Scheduling Service - Node.js Client Library

Complete guide for using the @sap/jobs-client Node.js library.

**Source**: https://www.npmjs.com/package/@sap/jobs-client

---

## Installation

```bash
npm install @sap/jobs-client
```

**Requirements**:
- Node.js 12.x or higher
- For X.509 certificates: version 1.6.3 or higher

---

## Basic Setup

```javascript
const JobSchedulerClient = require('@sap/jobs-client');
const xsenv = require('@sap/xsenv');

// Get credentials from environment
const credentials = xsenv.getServices({ jobscheduler: { tag: 'jobscheduler' } });

// Initialize scheduler client
const scheduler = new JobSchedulerClient.Scheduler({
  baseURL: credentials.jobscheduler.url,
  credentials: credentials.jobscheduler.uaa
});
```

---

## Job Management

### Create Job

```javascript
const jobConfig = {
  name: 'myScheduledJob',
  description: 'Processes orders every hour',
  action: 'https://my-app.cfapps.eu10.hana.ondemand.com/api/process',
  httpMethod: 'POST',
  active: true,
  schedules: [
    {
      repeatInterval: '1 hour',
      description: 'Hourly execution',
      active: true,
      data: {
        processType: 'full'
      }
    }
  ]
};

scheduler.createJob(jobConfig, (err, result) => {
  if (err) {
    console.error('Failed to create job:', err);
    return;
  }
  console.log('Job created with ID:', result._id);
});
```

### Fetch All Jobs

```javascript
scheduler.fetchAllJobs((err, jobs) => {
  if (err) {
    console.error('Failed to fetch jobs:', err);
    return;
  }
  console.log('Total jobs:', jobs.total);
  jobs.results.forEach(job => {
    console.log(`- ${job.name} (ID: ${job._id}, Active: ${job.active})`);
  });
});
```

### Fetch Job by ID

```javascript
const options = {
  jobId: 123
};

scheduler.fetchJob(options, (err, job) => {
  if (err) {
    console.error('Failed to fetch job:', err);
    return;
  }
  console.log('Job details:', job);
});
```

### Fetch Job by Name

```javascript
const options = {
  name: 'myScheduledJob'
};

scheduler.fetchJob(options, (err, job) => {
  if (err) {
    console.error('Failed to fetch job:', err);
    return;
  }
  console.log('Job details:', job);
});
```

### Update Job

```javascript
const updateOptions = {
  jobId: 123,
  job: {
    description: 'Updated description',
    active: false,
    httpMethod: 'GET'
  }
};

scheduler.updateJob(updateOptions, (err, result) => {
  if (err) {
    console.error('Failed to update job:', err);
    return;
  }
  console.log('Job updated successfully');
});
```

### Delete Job

```javascript
const deleteOptions = {
  jobId: 123
};

scheduler.deleteJob(deleteOptions, (err, result) => {
  if (err) {
    console.error('Failed to delete job:', err);
    return;
  }
  console.log('Job deleted successfully');
});
```

---

## Schedule Management

### Create Schedule

```javascript
const scheduleOptions = {
  jobId: 123,
  schedule: {
    repeatInterval: '30 minutes',
    description: 'Every 30 minutes',
    active: true,
    data: {
      mode: 'quick'
    }
  }
};

scheduler.createJobSchedule(scheduleOptions, (err, schedule) => {
  if (err) {
    console.error('Failed to create schedule:', err);
    return;
  }
  console.log('Schedule created with ID:', schedule.scheduleId);
});
```

### Create One-Time Schedule

```javascript
const oneTimeOptions = {
  jobId: 123,
  schedule: {
    time: 'now',
    description: 'Execute immediately',
    active: true
  }
};

scheduler.createJobSchedule(oneTimeOptions, (err, schedule) => {
  if (err) return console.error(err);
  console.log('One-time schedule created');
});
```

### Fetch Job Schedules

```javascript
const options = {
  jobId: 123
};

scheduler.fetchJobSchedules(options, (err, schedules) => {
  if (err) return console.error(err);
  schedules.results.forEach(schedule => {
    console.log(`Schedule: ${schedule.scheduleId} - ${schedule.description}`);
  });
});
```

### Fetch Schedule Details

```javascript
const options = {
  jobId: 123,
  scheduleId: 'abc123-def456'
};

scheduler.fetchJobSchedule(options, (err, schedule) => {
  if (err) return console.error(err);
  console.log('Schedule details:', schedule);
});
```

### Update Schedule

```javascript
const updateOptions = {
  jobId: 123,
  scheduleId: 'abc123-def456',
  schedule: {
    description: 'Updated schedule',
    active: false
  }
};

scheduler.updateJobSchedule(updateOptions, (err, result) => {
  if (err) return console.error(err);
  console.log('Schedule updated');
});
```

### Delete Schedule

```javascript
const deleteOptions = {
  jobId: 123,
  scheduleId: 'abc123-def456'
};

scheduler.deleteJobSchedule(deleteOptions, (err, result) => {
  if (err) return console.error(err);
  console.log('Schedule deleted');
});
```

### Delete All Schedules

```javascript
const options = {
  jobId: 123
};

scheduler.deleteAllJobSchedules(options, (err, result) => {
  if (err) return console.error(err);
  console.log('All schedules deleted');
});
```

---

## Schedule Control

### Activate All Schedules

```javascript
const options = {
  jobId: 123
};

scheduler.activateAllSchedules(options, (err, result) => {
  if (err) return console.error(err);
  console.log('All schedules activated');
});
```

### Deactivate All Schedules

```javascript
const options = {
  jobId: 123
};

scheduler.deactivateAllSchedules(options, (err, result) => {
  if (err) return console.error(err);
  console.log('All schedules deactivated');
});
```

---

## Run Logs

### Get Run Logs

```javascript
const options = {
  jobId: 123,
  scheduleId: 'abc123-def456',
  page_size: 20,
  offset: 1
};

scheduler.getRunLogs(options, (err, logs) => {
  if (err) return console.error(err);
  console.log('Total runs:', logs.total);
  logs.results.forEach(log => {
    console.log(`Run ${log.runId}: ${log.runStatus} - ${log.runState}`);
  });
});
```

### Update Run Log (Async Jobs)

```javascript
const updateOptions = {
  jobId: 123,
  scheduleId: 'abc123-def456',
  runId: 'run789',
  data: {
    success: true,
    message: 'Processing completed successfully'
  }
};

scheduler.updateJobRunLog(updateOptions, (err, result) => {
  if (err) return console.error(err);
  console.log('Run log updated');
});
```

---

## Job Count

### Get Job Count by Status

```javascript
scheduler.getJobCount((err, counts) => {
  if (err) return console.error(err);
  console.log('Job counts:', counts);
});
```

---

## Action Logs

### Get Job Action Logs

```javascript
const options = {
  jobId: 123
};

scheduler.getJobActionLogs(options, (err, logs) => {
  if (err) return console.error(err);
  console.log('Action logs:', logs);
});
```

### Get Schedule Action Logs

```javascript
const options = {
  jobId: 123,
  scheduleId: 'abc123-def456'
};

scheduler.getScheduleActionLogs(options, (err, logs) => {
  if (err) return console.error(err);
  console.log('Schedule action logs:', logs);
});
```

---

## Async Job Handler Pattern

Complete example for handling asynchronous jobs:

```javascript
const express = require('express');
const JobSchedulerClient = require('@sap/jobs-client');
const xsenv = require('@sap/xsenv');

const app = express();
app.use(express.json());

// Initialize scheduler
const credentials = xsenv.getServices({ jobscheduler: { tag: 'jobscheduler' } });
const scheduler = new JobSchedulerClient.Scheduler({
  baseURL: credentials.jobscheduler.url,
  credentials: credentials.jobscheduler.uaa
});

// Async job endpoint
app.post('/api/async-job', async (req, res) => {
  // Extract job headers
  const jobId = req.headers['x-sap-job-id'];
  const scheduleId = req.headers['x-sap-job-schedule-id'];
  const runId = req.headers['x-sap-job-run-id'];

  // Immediately return 202 Accepted
  res.status(202).json({ message: 'Job accepted' });

  // Process asynchronously
  try {
    await performLongRunningTask(req.body);

    // Update run log with success
    scheduler.updateJobRunLog({
      jobId: parseInt(jobId),
      scheduleId: scheduleId,
      runId: runId,
      data: {
        success: true,
        message: 'Job completed successfully'
      }
    }, (err) => {
      if (err) console.error('Failed to update run log:', err);
    });

  } catch (error) {
    // Update run log with failure
    scheduler.updateJobRunLog({
      jobId: parseInt(jobId),
      scheduleId: scheduleId,
      runId: runId,
      data: {
        success: false,
        message: `Job failed: ${error.message}`
      }
    }, (err) => {
      if (err) console.error('Failed to update run log:', err);
    });
  }
});

async function performLongRunningTask(data) {
  // Your long-running logic here
  await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute
}

app.listen(process.env.PORT || 3000);
```

---

## Error Handling

```javascript
scheduler.createJob(jobConfig, (err, result) => {
  if (err) {
    switch (err.statusCode) {
      case 400:
        console.error('Invalid request:', err.message);
        break;
      case 401:
        console.error('Authentication failed');
        break;
      case 429:
        console.error('Rate limit exceeded. Retry after:', err.retryAfter);
        break;
      case 503:
        console.error('Service unavailable. Retry later.');
        break;
      default:
        console.error('Unknown error:', err);
    }
    return;
  }
  // Success
});
```

---

## Promise-Based Usage

Wrap callbacks in promises:

```javascript
function createJobAsync(config) {
  return new Promise((resolve, reject) => {
    scheduler.createJob(config, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

// Usage
async function main() {
  try {
    const job = await createJobAsync(jobConfig);
    console.log('Job created:', job._id);
  } catch (error) {
    console.error('Failed:', error);
  }
}
```

---

**Documentation Source**: https://github.com/SAP-docs/btp-job-scheduling-service/blob/main/docs/40---Using-JOB-SCHDULR-TITLE/node-js-client-library-9b86127.md
