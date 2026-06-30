# Future Improvements

While this project is production-ready, scaling it to handle thousands of requests requires additional infrastructure:

## 1. Headless CAPTCHA / OTP Integration (If Legally Permissible)
If internal APIs or agreements exist, integrating a 2Captcha service or an SMS API (like Twilio) to automatically resolve the authentication wall would allow for fully unattended execution.

## 2. Worker Pools & Concurrency
Implement a Redis-backed job queue (e.g., BullMQ) to distribute EC search requests across a pool of Node.js worker processes. 

## 3. Containerization & Orchestration
- **Docker:** Containerize the application using the official `mcr.microsoft.com/playwright` image.
- **Kubernetes:** Deploy the worker pools into a K8s cluster with autoscaling based on queue length.

## 4. Monitoring & Metrics
Integrate Prometheus and Grafana to track:
- Success/Failure rates.
- Average portal response times.
- Session expiry frequencies.
- Active worker count.

## 5. REST API Wrapper
Expose an Express or Fastify API to allow other internal microservices to trigger EC downloads programmatically and retrieve the resulting PDF via AWS S3 or a local file server.
