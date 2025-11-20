#!/bin/bash

# Production Deployment Script for SA Jobs + Mobile API
# Deploys to: https://sangapactutor.openplp.com (192.168.155.122:3030)

set -e  # Exit on error

PROD_SERVER="192.168.155.122"
PROD_PORT="3030"
PROD_USER="root"  # Change if needed
PROD_HOME="/app/sangapactutor"  # Change based on your server setup
REPO_URL="https://github.com/chhinhsovath/sangapactutor.git"
BRANCH="main"

echo "🚀 Starting Production Deployment"
echo "=================================="
echo "Server: $PROD_SERVER:$PROD_PORT"
echo "Branch: $BRANCH"
echo "Repository: $REPO_URL"
echo ""

# Option 1: Remote Deployment (requires SSH access)
deploy_remote() {
    echo "📤 Deploying to production server..."

    ssh -p 22 ${PROD_USER}@${PROD_SERVER} bash << 'EOFREMOTE'
        set -e

        echo "🔄 Pulling latest code..."
        cd /app/sangapactutor
        git fetch origin
        git checkout main
        git pull origin main

        echo "📦 Installing dependencies..."
        npm install --production

        echo "🔨 Building application..."
        npm run build

        echo "🔄 Running database migrations..."
        npm run db:migrate

        echo "🌱 Seeding database (if needed)..."
        npm run db:seed || true  # Don't fail if already seeded

        echo "🔄 Restarting application..."
        pm2 restart sa-jobs || pm2 start npm --name "sa-jobs" -- run start

        echo "✅ Deployment complete!"
        pm2 logs sa-jobs --lines 20
EOFREMOTE
}

# Option 2: Local Build + Upload (if SSH restrictions)
deploy_local_build() {
    echo "🔨 Building locally..."
    npm run build

    echo "📦 Creating deployment package..."
    tar -czf deploy.tar.gz \
        .next \
        node_modules \
        public \
        app \
        lib \
        prisma \
        migrations \
        package.json \
        package-lock.json \
        .env.production

    echo "📤 Uploading to production..."
    scp -P 22 deploy.tar.gz ${PROD_USER}@${PROD_SERVER}:${PROD_HOME}/

    echo "🔓 Extracting and deploying..."
    ssh -p 22 ${PROD_USER}@${PROD_SERVER} << 'EOFEXTRACT'
        cd /app/sangapactutor
        tar -xzf deploy.tar.gz

        echo "🔄 Restarting application..."
        pm2 restart sa-jobs || pm2 start npm --name "sa-jobs" -- run start

        echo "✅ Deployment complete!"
EOFEXTRACT

    rm deploy.tar.gz
}

# Verification step
verify_deployment() {
    echo ""
    echo "✅ Verifying deployment..."
    echo ""

    echo "Testing mobile auth endpoint..."
    RESPONSE=$(curl -s -X POST https://sangapactutor.openplp.com/api/mobile/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email":"john@example.com","password":"student123"}' \
        -w "\nHTTP:%{http_code}")

    echo "$RESPONSE"

    if echo "$RESPONSE" | grep -q "HTTP:200\|HTTP:401"; then
        echo "✅ API endpoint is responding correctly"
    else
        echo "⚠️  API endpoint not responding as expected"
        echo "   This may indicate the deployment needs more time to initialize"
    fi
}

# Main execution
echo ""
echo "Choose deployment method:"
echo "1) Remote deployment (SSH + git pull)"
echo "2) Local build + upload"
echo ""

read -p "Select option (1 or 2): " choice

case $choice in
    1)
        deploy_remote
        ;;
    2)
        deploy_local_build
        ;;
    *)
        echo "Invalid option. Exiting."
        exit 1
        ;;
esac

verify_deployment

echo ""
echo "🎉 Production deployment complete!"
echo "🌐 Access your app at: https://sangapactutor.openplp.com"
echo "📱 Mobile API at: https://sangapactutor.openplp.com/api/mobile"
echo ""
