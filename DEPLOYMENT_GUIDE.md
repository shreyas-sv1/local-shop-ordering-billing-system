# 🚀 Deployment Guide

Complete guide to deploy the Local Shop application to various platforms.

---

## Table of Contents
1. [Heroku Deployment](#heroku-deployment)
2. [Vercel Deployment (Frontend)](#vercel-deployment-frontend)
3. [AWS Deployment](#aws-deployment)
4. [Azure Deployment](#azure-deployment)
5. [Railway.app Deployment](#railwayapp-deployment)
6. [Docker Deployment](#docker-deployment)
7. [Production Checklist](#production-checklist)

---

## Heroku Deployment

### Prerequisites
- Heroku account ([signup](https://signup.heroku.com/))
- Heroku CLI installed
- Git repository

### Backend Deployment

1. **Login to Heroku**
```bash
heroku login
```

2. **Create Heroku App**
```bash
cd backend
heroku create local-shop-api
```

3. **Add Procfile**
```bash
echo "web: node server.js" > Procfile
```

4. **Set Environment Variables**
```bash
heroku config:set DB_HOST=your-database-host
heroku config:set DB_USER=your-db-user
heroku config:set DB_PASSWORD=your-db-password
heroku config:set DB_NAME=grocery_shop_db
heroku config:set JWT_SECRET=your_super_secret_key_12345
heroku config:set NODE_ENV=production
heroku config:set FRONTEND_URL=https://your-frontend-url.com
```

5. **Deploy**
```bash
git push heroku main
```

6. **View Logs**
```bash
heroku logs --tail
```

### Frontend Deployment (Same Heroku)

If deploying both on same Heroku app:

```bash
# From root directory
npm run build

# Copy build to backend/public
cp -r build backend/public

# Update server.js to serve static files
# Add to server.js before routes:
# app.use(express.static(path.join(__dirname, 'public')));

git push heroku main
```

---

## Vercel Deployment (Frontend)

### Prerequisites
- Vercel account ([signup](https://vercel.com/signup))
- Vercel CLI or GitHub connection

### Using Vercel CLI

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd root-directory
vercel
```

3. **Configure**
- Select "Create and deploy?"
- Select "." for root directory
- Project setup: Default
- Framework: React
- Build command: `npm run build`
- Output directory: `build`

4. **Set Environment Variables**
```bash
vercel env add REACT_APP_API_URL
# Enter: https://your-backend-url.com/api
```

### Using GitHub Integration

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
- Go to vercel.com
- Import project from GitHub
- Select repository
- Framework: React
- Environment variables:
  - `REACT_APP_API_URL=https://your-backend-url.com/api`
- Deploy!

---

## AWS Deployment

### EC2 Deployment (Full Stack)

#### 1. Create EC2 Instance
- Go to AWS Console → EC2
- Launch instance (Ubuntu 20.04 LTS)
- Select t2.micro (free tier eligible)
- Configure security groups (allow ports 80, 443, 3000, 5000)

#### 2. SSH into Instance
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

#### 3. Install Dependencies
```bash
sudo apt update
sudo apt install -y nodejs npm mysql-server git

# Install PM2 for process management
sudo npm install -g pm2
```

#### 4. Clone and Setup Backend
```bash
git clone https://github.com/shreyas-sv1/local-shop-ordering-billing-system.git
cd local-shop-ordering-billing-system/backend

# Setup MySQL Database
mysql -u root -p < database.sql

npm install
cp .env.example .env

# Edit .env with production values
nano .env

# Start with PM2
pm2 start server.js --name "local-shop-api"
pm2 startup
pm2 save
```

#### 5. Build and Deploy Frontend
```bash
cd ../
npm install
npm run build

# Install Nginx
sudo apt install -y nginx

# Copy build to Nginx
sudo cp -r build /var/www/html/local-shop

# Configure Nginx
sudo nano /etc/nginx/sites-available/default
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/html/local-shop;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 6. Enable SSL (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### RDS Deployment (Database)
- Go to AWS Console → RDS
- Create MySQL database
- Security group: Allow port 3306
- Connect and run database migrations
- Update backend .env with RDS endpoint

---

## Azure Deployment

### Azure App Service

#### Backend Deployment

1. **Create Resource Group**
```bash
az group create --name local-shop-rg --location eastus
```

2. **Create App Service**
```bash
az appservice plan create --name local-shop-plan --resource-group local-shop-rg --sku B1 --is-linux

az webapp create --name local-shop-api --resource-group local-shop-rg --plan local-shop-plan --runtime "node|16"
```

3. **Deploy Code**
```bash
# Configure deployment
az webapp deployment user set --user-name your-username --password your-password

# Get Git URL
az webapp deployment source config-local-git --name local-shop-api --resource-group local-shop-rg
```

4. **Set Environment Variables**
```bash
az webapp config appsettings set --resource-group local-shop-rg --name local-shop-api --settings \
  DB_HOST=your-mysql-host \
  DB_USER=your-user \
  DB_PASSWORD=your-password \
  JWT_SECRET=your-secret \
  NODE_ENV=production
```

### Azure Database for MySQL
- Create MySQL database in Azure
- Configure firewall rules
- Run database migrations
- Update connection strings in App Service

---

## Railway.app Deployment

### Simple 2-Click Deployment

1. **Connect GitHub**
- Go to railway.app
- Connect your GitHub account
- Select repository

2. **Configure Services**
- Backend:
  - Service: Node.js
  - Start command: `npm start`
- Database:
  - Service: MySQL
  - Auto-created environment variables

3. **Environment Variables**
```
DB_HOST=${{ Mysql.MYSQL_HOST }}
DB_USER=${{ Mysql.MYSQL_USER }}
DB_PASSWORD=${{ Mysql.MYSQL_PASSWORD }}
DB_NAME=grocery_shop_db
JWT_SECRET=your_secret_key
NODE_ENV=production
FRONTEND_URL=your-frontend-url
```

4. **Deploy**
- Click "Deploy"
- Railway automatically deploys on push

---

## Docker Deployment

### Docker Setup

#### Dockerfile (Backend)
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

#### Dockerfile (Frontend)
```dockerfile
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:5.7
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: grocery_shop_db
    volumes:
      - mysql_data:/var/lib/mysql
      - ./backend/database.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "3306:3306"

  backend:
    build: ./backend
    environment:
      DB_HOST: mysql
      DB_USER: root
      DB_PASSWORD: root
      DB_NAME: grocery_shop_db
      JWT_SECRET: your_secret_key
      NODE_ENV: production
    ports:
      - "5000:5000"
    depends_on:
      - mysql

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

### Run Docker
```bash
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## Production Checklist

### Frontend
- [ ] Remove console.log statements
- [ ] Set REACT_APP_ENV=production
- [ ] Update API URLs to production
- [ ] Enable HTTPS
- [ ] Set up SSL certificate
- [ ] Configure CORS properly
- [ ] Enable gzip compression
- [ ] Set cache headers
- [ ] Test all pages
- [ ] Check mobile responsiveness

### Backend
- [ ] Set NODE_ENV=production
- [ ] Update JWT_SECRET to strong key
- [ ] Use production database
- [ ] Enable HTTPS
- [ ] Set secure CORS headers
- [ ] Add rate limiting
- [ ] Enable logging
- [ ] Set up error monitoring
- [ ] Configure backups
- [ ] Test all endpoints
- [ ] Monitor performance

### Database
- [ ] Regular backups enabled
- [ ] SSL connections enabled
- [ ] Strong passwords set
- [ ] Firewall rules configured
- [ ] Performance indexes created
- [ ] User privileges minimized

### Security
- [ ] HTTPS everywhere
- [ ] Environment variables protected
- [ ] No hardcoded secrets
- [ ] Input validation enabled
- [ ] SQL injection protection
- [ ] XSS protection enabled
- [ ] CSRF tokens implemented
- [ ] Dependencies updated

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic)
- [ ] Uptime monitoring
- [ ] Log aggregation
- [ ] Alerting configured
- [ ] Dashboard created

---

## Troubleshooting

### Database Connection Issues
```bash
# Test MySQL connection
mysql -h your-host -u your-user -p your-password

# Check backend logs
heroku logs --tail
# or
docker-compose logs backend
```

### CORS Errors
- Check FRONTEND_URL in .env
- Update CORS configuration in server.js
- Verify API_URL in frontend .env

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
# or on Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Build Failures
```bash
# Clear cache and rebuild
npm cache clean --force
npm install
npm run build
```

---

## Environment Variables Checklist

### Backend (production)
```
DB_HOST=production-mysql-host
DB_USER=prod-user
DB_PASSWORD=strong-password
DB_NAME=grocery_shop_db
JWT_SECRET=long-random-secure-key
JWT_EXPIRE=30d
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (production)
```
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_ENV=production
REACT_APP_NAME=Local Shop
```

---

## Performance Optimization

### Frontend
- Minify CSS/JS (automatic with build)
- Lazy load components
- Image optimization
- Code splitting
- Service Workers

### Backend
- Database query optimization
- Connection pooling
- Caching layer (Redis)
- Compression middleware
- Pagination

### Database
- Proper indexing
- Query optimization
- Connection pooling
- Regular maintenance

---

## Monitoring & Logging

```bash
# PM2 Monitoring
pm2 monit

# View logs
pm2 logs

# Save logs
pm2 save logs
```

---

## Support & Troubleshooting

- **Deployment Issues**: Check specific platform docs
- **Database Issues**: Verify connection strings
- **API Issues**: Test endpoints with Postman
- **Frontend Issues**: Check browser console

---

**Last Updated: April 2024**

For issues, refer to platform-specific documentation or GitHub issues.
