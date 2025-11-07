# AWS ECS + ECR (Node.js on port 8080)

## Screenshots
Place images in `screenshots/` and ensure these names exist:
- ecr-repo.png
- ecs-cluster.png
- ecs-task.png
- cloudwatch-logs.png
- app-running.png
- cluster-deleted.png

## Build & Push
```bash
docker build -t ecs .
docker tag ecs:latest 402961397340.dkr.ecr.us-east-1.amazonaws.com/ecs:latest
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 402961397340.dkr.ecr.us-east-1.amazonaws.com
docker push 402961397340.dkr.ecr.us-east-1.amazonaws.com/ecs:latest
Task Definition (port 8080)
json
Copy code
{
  "family": "ecs-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::402961397340:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::402961397340:role/ecsTaskRole",
  "containerDefinitions": [{
    "name": "nodecon",
    "image": "402961397340.dkr.ecr.us-east-1.amazonaws.com/ecs:latest",
    "essential": true,
    "portMappings": [{
      "containerPort": 8080,
      "hostPort": 8080,
      "protocol": "tcp",
      "appProtocol": "http"
    }],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/nodecon",
        "awslogs-region": "us-east-1",
        "awslogs-stream-prefix": "ecs"
      }
    }
  }]
}
Verify
bash
Copy code
aws ecs list-clusters --region us-east-1
aws ecs list-services --cluster <cluster> --region us-east-1
aws ecs list-tasks --cluster <cluster> --region us-east-1
aws ecs describe-tasks --cluster <cluster> --tasks <task-arn> --region us-east-1
Open: http://<public-ip>:8080

Cleanup
bash
Copy code
aws ecs stop-task --cluster <cluster> --task <task-arn> --region us-east-1
aws ecs delete-service --cluster <cluster> --service <service-name> --region us-east-1 --force
aws ecs delete-cluster --cluster <cluster> --region us-east-1
aws ecr delete-repository --repository-name ecs --region us-east-1 --force