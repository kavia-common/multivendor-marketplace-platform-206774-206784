#!/bin/bash
cd /home/kavia/workspace/code-generation/multivendor-marketplace-platform-206774-206784/backend_express
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

