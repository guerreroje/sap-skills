---
name: sap-ai-core
description: |
  Guides development with SAP AI Core and SAP AI Launchpad for enterprise AI/ML workloads on SAP BTP. Use when: deploying generative AI models (GPT, Claude, Gemini, Llama), building orchestration workflows with templating/filtering/grounding, implementing RAG with vector databases, managing ML training pipelines with Argo Workflows, configuring content filtering and data masking for PII protection, using the Generative AI Hub for prompt experimentation, or integrating AI capabilities into SAP applications. Covers service plans (Free/Standard/Extended), model providers (Azure OpenAI, AWS Bedrock, GCP Vertex AI, Mistral, IBM), orchestration modules, embeddings, tool calling, and structured outputs.
license: MIT
---

# SAP AI Core & AI Launchpad Skill

## Overview

SAP AI Core is a service on SAP Business Technology Platform (BTP) that manages AI asset execution in a standardized, scalable, hyperscaler-agnostic manner. SAP AI Launchpad provides the management UI for AI runtimes including the Generative AI Hub.

### Core Capabilities

| Capability | Description |
|------------|-------------|
| **Generative AI Hub** | Access to LLMs from multiple providers with unified API |
| **Orchestration** | Modular pipeline for templating, filtering, grounding, masking |
| **ML Training** | Argo Workflows-based batch pipelines for model training |
| **Inference Serving** | Deploy models as HTTPS endpoints for predictions |
| **Grounding/RAG** | Vector database integration for contextual AI |

### Three Components

1. **SAP AI Core**: Execution engine for AI workflows and model serving
2. **SAP AI Launchpad**: Management UI for AI runtimes and GenAI Hub
3. **AI API**: Standardized lifecycle management across runtimes

## Quick Start

### Prerequisites

- SAP BTP enterprise account
- SAP AI Core service instance (Extended plan for GenAI)
- Service key with credentials

### 1. Get Authentication Token

```bash
# Set environment variables from service key
export AI_API_URL="<your-ai-api-url>"
export AUTH_URL="<your-auth-url>"
export CLIENT_ID="<your-client-id>"
export CLIENT_SECRET="<your-client-secret>"

# Get OAuth token
AUTH_TOKEN=$(curl -s -X POST "$AUTH_URL/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET" \
  | jq -r '.access_token')
```

### 2. Create Orchestration Deployment

```bash
# Check for existing orchestration deployment
curl -X GET "$AI_API_URL/v2/lm/deployments" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "AI-Resource-Group: default" \
  -H "Content-Type: application/json"

# Create orchestration deployment if needed
curl -X POST "$AI_API_URL/v2/lm/deployments" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "AI-Resource-Group: default" \
  -H "Content-Type: application/json" \
  -d '{
    "configurationId": "<orchestration-config-id>"
  }'
```

### 3. Use Harmonized API for Model Inference

```bash
ORCHESTRATION_URL="<deployment-url>"

curl -X POST "$ORCHESTRATION_URL/v2/completion" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "AI-Resource-Group: default" \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "module_configurations": {
        "llm_module_config": {
          "model_name": "gpt-4o",
          "model_version": "latest",
          "model_params": {
            "max_tokens": 1000,
            "temperature": 0.7
          }
        },
        "templating_module_config": {
          "template": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "{{?user_query}}"}
          ]
        }
      }
    },
    "input_params": {
      "user_query": "What is SAP AI Core?"
    }
  }'
```

## Service Plans

| Plan | Cost | GenAI Hub | Support | Resource Groups |
|------|------|-----------|---------|-----------------|
| **Free** | Free | No | Community only | Default only |
| **Standard** | Per resource + baseline | No | Full SLA | Multiple |
| **Extended** | Per resource + tokens | Yes | Full SLA | Multiple |

**Key Restrictions:**
- Free and Standard mutually exclusive in same subaccount
- Free → Standard upgrade possible; downgrade not supported
- Max 50 resource groups per tenant

## Model Providers

SAP AI Core provides access to models from six providers:

| Provider | Executable ID | Models |
|----------|---------------|--------|
| **Azure OpenAI** | `azure-openai` | GPT-4o, GPT-4 Turbo, GPT-3.5 |
| **SAP Open Source** | `aicore-opensource` | Llama, Falcon, Mistral variants |
| **Google Vertex AI** | `gcp-vertexai` | Gemini Pro, PaLM 2 |
| **AWS Bedrock** | `aws-bedrock` | Claude, Amazon Titan |
| **Mistral AI** | `aicore-mistralai` | Mistral Large, Medium, Small |
| **IBM** | `aicore-ibm` | Granite models |

**API to list available models:**
```bash
curl -X GET "$AI_API_URL/v2/lm/scenarios/foundation-models/models" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "AI-Resource-Group: default"
```

**Reference:** SAP Note 3437766 for token rates, limits, and deprecation dates.

## Orchestration

The orchestration service (`scenarioId: orchestration`) provides unified access to multiple models through consistent configuration.

### Module Pipeline (Execution Order)

1. **Grounding** - Inject external context from vector database
2. **Templating** (mandatory) - Compose prompts with placeholders
3. **Input Translation** - Translate input to target language
4. **Data Masking** - Anonymize/pseudonymize PII
5. **Input Filtering** - Filter harmful content before LLM
6. **Model Configuration** (mandatory) - LLM parameters
7. **Output Filtering** - Filter harmful content in response
8. **Output Translation** - Translate output to source language

### Orchestration Configuration Template

```json
{
  "config": {
    "module_configurations": {
      "llm_module_config": {
        "model_name": "gpt-4o",
        "model_version": "latest",
        "model_params": {
          "max_tokens": 2000,
          "temperature": 0.5
        }
      },
      "templating_module_config": {
        "template": [
          {"role": "system", "content": "{{?system_prompt}}"},
          {"role": "user", "content": "{{?user_message}}"}
        ]
      },
      "filtering_module_config": {
        "input": {
          "filters": [
            {
              "type": "azure_content_safety",
              "config": {
                "Hate": 2,
                "Violence": 2,
                "Sexual": 2,
                "SelfHarm": 2
              }
            }
          ]
        }
      },
      "masking_module_config": {
        "masking_providers": [
          {
            "type": "sap_data_privacy_integration",
            "method": "pseudonymization",
            "entities": [
              {"type": "profile-person"},
              {"type": "profile-email"},
              {"type": "profile-phone"}
            ]
          }
        ]
      }
    }
  }
}
```

For detailed orchestration module configurations, see `references/orchestration-modules.md`.

## Content Filtering

### Azure Content Safety

| Category | Description | Severity Scale |
|----------|-------------|----------------|
| Hate | Discriminatory content | 0, 2, 4, 6 |
| Violence | Violent content | 0, 2, 4, 6 |
| Sexual | Sexual content | 0, 2, 4, 6 |
| SelfHarm | Self-harm content | 0, 2, 4, 6 |

**Note:** Azure OpenAI has a global filter blocking severity 4+ automatically.

Additional features:
- **PromptShield**: Detect malicious prompt injection attacks
- **Protected Material**: Detect code from public GitHub repos

### Llama Guard 3

14 categories: `violent_crimes`, `non_violent_crimes`, `sex_crimes`, `child_exploitation`, `defamation`, `specialized_advice`, `privacy`, `intellectual_property`, `indiscriminate_weapons`, `hate`, `self_harm`, `sexual_content`, `elections`, `code_interpreter_abuse`

## Data Masking

Two approaches for PII protection:

| Method | Placeholder | Reversible | Use Case |
|--------|-------------|------------|----------|
| **Anonymization** | MASKED_ENTITY | No | When original data not needed |
| **Pseudonymization** | MASKED_ENTITY_ID | Yes | When unmasking required in response |

### Supported Entity Types (25)

- **Personal**: profile-person, profile-email, profile-phone, profile-address
- **IDs**: profile-nationalid, profile-ssn, profile-passport, profile-driverlicense
- **Financial**: profile-iban, profile-credit-card-number
- **SAP-specific**: profile-sapids-internal, profile-sapids-public
- **Sensitive**: profile-gender, profile-ethnicity, profile-religious-group, profile-political-group

For complete entity list, see `references/orchestration-modules.md`.

## Grounding (RAG)

Integrate external data for contextually relevant AI responses.

### Supported Data Sources

| Source | Description |
|--------|-------------|
| Microsoft SharePoint | SharePoint document libraries |
| AWS S3 | S3 buckets |
| SFTP | SFTP servers |
| SAP Build Work Zone | Work Zone content |
| SAP Document Management | DMS documents |

### Document Specifications

- **Formats**: PDF, HTML, TXT, JPEG, JPG, DOCX, PNG, TIFF, PPT
- **Refresh**: Daily automatic refresh
- **Limit**: 2,000 documents per pipeline

### Implementation Options

1. **Pipeline API**: Upload documents to repository; auto-embedding
2. **Vector API**: Direct chunk upload with custom embeddings

For detailed grounding setup, see `references/grounding-rag.md`.

## Tool Calling

Enable LLMs to make API calls and execute functions.

### Tool Definition Structure

```json
{
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_inventory",
        "description": "Get inventory quantity for a product",
        "strict": true,
        "parameters": {
          "type": "object",
          "properties": {
            "product_id": {
              "type": "string",
              "description": "The product identifier"
            }
          },
          "required": ["product_id"],
          "additionalProperties": false
        }
      }
    }
  ]
}
```

### Workflow

1. Send request with tool definitions
2. LLM returns `tool_calls` with function name and arguments
3. Execute function externally
4. Return result with matching `tool_call_id`
5. LLM incorporates result in response

## Structured Output

Force model output to match defined schemas.

### JSON Schema Response

```json
{
  "response_format": {
    "type": "json_schema",
    "json_schema": {
      "name": "product_info",
      "strict": true,
      "schema": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "price": {"type": "number"},
          "in_stock": {"type": "boolean"}
        },
        "required": ["name", "price", "in_stock"],
        "additionalProperties": false
      }
    }
  }
}
```

## Embeddings

Generate semantic embeddings for RAG and similarity search.

**Endpoint:** `POST {{Orchestration URL}}/v2/embeddings`

**Input Types:**
- `document`: For indexing document chunks
- `query`: For search queries
- `text`: For similarity optimization

## ML Training

SAP AI Core uses Argo Workflows for training pipelines.

### Key Requirements

1. Create object store secret named `default` for output artifacts
2. Define workflow template with training steps
3. Create configuration with parameters and input artifacts
4. Create execution to run training

### Training Workflow Example

```yaml
apiVersion: ai.sap.com/v1alpha1
kind: WorkflowTemplate
metadata:
  name: training-workflow
spec:
  entrypoint: main
  templates:
    - name: main
      steps:
        - - name: preprocess
            template: preprocess-data
        - - name: train
            template: train-model
```

For complete training workflow patterns, see `references/ml-operations.md`.

## Deployments

### Create Model Deployment

```bash
# 1. Create configuration
curl -X POST "$AI_API_URL/v2/lm/configurations" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "AI-Resource-Group: default" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "gpt4o-config",
    "executableId": "azure-openai",
    "scenarioId": "foundation-models",
    "parameterBindings": [
      {"key": "modelName", "value": "gpt-4o"},
      {"key": "modelVersion", "value": "latest"}
    ]
  }'

# 2. Create deployment
curl -X POST "$AI_API_URL/v2/lm/deployments" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "AI-Resource-Group: default" \
  -H "Content-Type: application/json" \
  -d '{
    "configurationId": "<config-id>",
    "ttl": "24h"
  }'
```

### Deployment Statuses

| Status | Description | Actions |
|--------|-------------|---------|
| Pending | Starting up | Can stop |
| Running | Active, serving requests | Can stop |
| Stopping | Shutting down | Wait |
| Stopped | Inactive | Delete only |
| Dead | Failed | Delete only |

**TTL Format:** `5m`, `2h`, `7d` (minutes, hours, days)

## SAP AI Launchpad

Web-based UI for managing AI runtimes and GenAI capabilities.

### Key Applications

| App | Purpose |
|-----|---------|
| **Workspaces** | Manage connections and resource groups |
| **ML Operations** | Train, deploy, monitor models |
| **Generative AI Hub** | Prompt experimentation and orchestration |
| **Functions Explorer** | Explore available AI functions |

### Required Roles

| Role | Capabilities |
|------|--------------|
| `genai_manager` | Full GenAI hub access |
| `genai_experimenter` | Prompt experimentation (no save) |
| `prompt_manager` | Prompt management with save |
| `orchestration_executor` | Execute orchestration workflows |
| `mloperations_editor` | Full ML operations access |

## API Reference

### Core Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/v2/lm/scenarios` | GET | List available scenarios |
| `/v2/lm/scenarios/foundation-models/models` | GET | List available models |
| `/v2/lm/configurations` | POST | Create configuration |
| `/v2/lm/deployments` | POST | Create deployment |
| `/v2/lm/deployments/{id}` | GET | Get deployment status |
| `/v2/lm/executions` | POST | Create execution |
| `/lm/meta` | GET | Get runtime capabilities |

### Meta API Capabilities

Check runtime capabilities with `/lm/meta`:
- `logs.executions`, `logs.deployments`
- `multitenant`, `shareable`
- `userDeployments`, `userExecutions`
- `timeToLiveDeployments`
- `executionSchedules`, `bulkUpdates`

For complete API reference, see `references/api-reference.md`.

## Common Patterns

### Pattern 1: Simple Chat Completion

```python
import requests

def chat_completion(prompt, model="gpt-4o"):
    response = requests.post(
        f"{ORCHESTRATION_URL}/v2/completion",
        headers={
            "Authorization": f"Bearer {AUTH_TOKEN}",
            "AI-Resource-Group": "default",
            "Content-Type": "application/json"
        },
        json={
            "config": {
                "module_configurations": {
                    "llm_module_config": {
                        "model_name": model,
                        "model_version": "latest"
                    },
                    "templating_module_config": {
                        "template": [
                            {"role": "user", "content": "{{?prompt}}"}
                        ]
                    }
                }
            },
            "input_params": {"prompt": prompt}
        }
    )
    return response.json()
```

### Pattern 2: RAG with Grounding

```json
{
  "config": {
    "module_configurations": {
      "grounding_module_config": {
        "grounding_service": "document_grounding_service",
        "grounding_service_configuration": {
          "grounding_input_parameters": ["user_query"],
          "grounding_output_parameter": "context"
        }
      },
      "templating_module_config": {
        "template": [
          {"role": "system", "content": "Answer based on context: {{?context}}"},
          {"role": "user", "content": "{{?user_query}}"}
        ]
      }
    }
  }
}
```

### Pattern 3: Secure Enterprise Chat

Combine filtering + masking + grounding:

```json
{
  "config": {
    "module_configurations": {
      "filtering_module_config": {
        "input": {
          "filters": [{"type": "azure_content_safety", "config": {"Hate": 2}}]
        },
        "output": {
          "filters": [{"type": "azure_content_safety", "config": {"Hate": 2}}]
        }
      },
      "masking_module_config": {
        "masking_providers": [{
          "type": "sap_data_privacy_integration",
          "method": "pseudonymization",
          "entities": [{"type": "profile-person"}, {"type": "profile-email"}]
        }]
      },
      "grounding_module_config": {
        "grounding_service": "document_grounding_service"
      }
    }
  }
}
```

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Token expired | Refresh OAuth token |
| 403 Forbidden | Missing role/quota | Check IAM roles, request quota increase |
| 404 Not Found | Invalid resource group | Verify AI-Resource-Group header |
| Deployment DEAD | Configuration error | Check deployment logs |
| Training failed | Missing default secret | Create object store secret named `default` |

### Quota Increase

Request quota increase via support ticket:
- Component: `CA-ML-AIC`
- Include: tenant ID, requested limits, justification

## References

For detailed documentation on specific topics:

- `references/generative-ai-hub.md` - Complete GenAI hub documentation
- `references/orchestration-modules.md` - All orchestration modules in detail
- `references/model-providers.md` - Model providers and configurations
- `references/grounding-rag.md` - Grounding and RAG implementation
- `references/api-reference.md` - Complete API endpoint reference
- `references/ml-operations.md` - ML operations and training
- `references/advanced-features.md` - Chat, applications, prompt templates, security, auditing
- `references/ai-launchpad-guide.md` - Complete SAP AI Launchpad UI guide

## Documentation Sources

| Resource | URL |
|----------|-----|
| SAP AI Core Guide | https://help.sap.com/docs/sap-ai-core |
| SAP AI Launchpad Guide | https://help.sap.com/docs/sap-ai-launchpad |
| GitHub Docs Source | https://github.com/SAP-docs/sap-artificial-intelligence |
| SAP Note (Models) | SAP Note 3437766 |
| SAP Discovery Center | https://discovery-center.cloud.sap/serviceCatalog/sap-ai-core |

---

**Last Updated**: 2025-11-22
**Next Review**: 2026-02-22
