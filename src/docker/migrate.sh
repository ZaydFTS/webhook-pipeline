#!/bin/sh
echo "Running migrations..."
npm run db:push
echo "Migrations done"