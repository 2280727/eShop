'use strict';

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import otelResources from '@opentelemetry/resources';
const { Resource } = otelResources;

export function initTracing({ serviceName, collectorUrl }) {
  const traceExporter = new OTLPTraceExporter({
    url: collectorUrl
  });

  const sdk = new NodeSDK({
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
    // resource: new Resource({
    //   [SemanticResourceAttributes.SERVICE_NAME]: serviceName
    // })
  });

try {
    sdk.start(); // Start the SDK synchronously
    console.log('✅ OpenTelemetry initialized');
} catch (error) {
    console.error('Error initializing OpenTelemetry', error);
}
  const shutdown = async () => {
    try {
      await sdk.shutdown();
      console.log('Tracing terminated gracefully');
    } catch (error) {
      console.error('Error terminating tracing', error);
    }
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  return sdk;
}