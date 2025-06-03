# RemoteIntegrity Backend Server

RemoteIntegrity is a comprehensive backend server that provides APIs for managing organizations, teams, employees, projects, tasks, sessions, and more.

## API Routes : 

Below is a detailed list of all available API endpoints organized by modules:

### User Module
- `POST /api/users/register` - Create a new user
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user by ID
- `PATCH /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

**Sample User Creation Object:**
```json
{
  "name" : "Foysal",
  "email" : "foysal6@gmail.com",
  "password" : "123456",
  "position" : "Dev",
  "department" : "IT",
  "role" : "user"
}
```


### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh authentication token
- `POST /api/auth/change-password` - Change user password
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

**Sample Login Object:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Sample Change Password Object:**
```json
{
  "oldPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

### Organization Module
- `POST /api/organizations` - Create a new organization
- `GET /api/organizations` - Get all organizations
- `GET /api/organizations/:id` - Get a specific organization
- `PATCH /api/organizations/:id` - Update an organization
- `DELETE /api/organizations/:id` - Delete an organization

**Sample Organization Creation Object:**
```json
{
  "name" : "Test Org Invite",
  "description" : "2nd Org description",
  "industry" : "Textile",
  "website" : "https://testorg.com",
  "logo" : "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&h=400&fit=crop"
}
```

### Project Module
- `POST /api/projects` - Create a new project
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a specific project
- `PATCH /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project
- `GET /api/projects/organization/:id` - Get projects by organization ID
- `GET /api/projects/team/:id` - Get projects by team ID

**Sample Project Creation Object:**
```json
{
  "name" : "Test Project 2",
  "description" : "This is a test Projects 2",
  "organizationId" : "67e88d6615135ea6a1202a9c",
  "startDate" : "2024-09-10",
  "endDate" : "",
  "status" : "planning",
  "budget" : 0
}
```

### Team Module
- `POST /api/teams` - Create a new team
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get a specific team
- `PATCH /api/teams/:id` - Update a team
- `DELETE /api/teams/:id` - Delete a team
- `GET /api/teams/organization/:id` - Get teams by organization ID

**Sample Team Creation Object:**
```json
{
  "name": "IT  Team",
  "description": "This a team of developers",
  "organizationId": "67e88d6615135ea6a1202a9c",
  "projectIds": ["67f076154e6a982b81d3f915"],
  "leaderId": "67f21c7c6145df85aea91b0b",
  "memberIds": ["67f21c7c6145df85aea91b0b", "67f21c7f6145df85aea91b11"]
}
```

### Task Module
- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/project/:id` - Get tasks by project ID
- `GET /api/tasks/assignee/:id` - Get tasks by assignee ID

**Sample Task Creation Object:**
```json
{
  "title": "Implement user authentication delete",
  "description": "Set up JWT-based authentication for the application",
  "organizationId" : "67e88d6615135ea6a1202a9c",
  "projectId": "67f076154e6a982b81d3f915",
  "assigneeId": "67f2574031b9c31e9c0d0e9b",
  "status": "review",
  "priority": "high",
  "dueDate": "2025-04-15T00:00:00.000Z",
  "estimatedHours": 8,
  "actualHours": 3,
  "tags": ["authentication", "backend", "security"]
}

```

### Employee Module
- `POST /api/employees` - Create a new employee
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get a specific employee
- `PATCH /api/employees/:id` - Update an employee
- `DELETE /api/employees/:id` - Delete an employee
- `GET /api/employees/organization/:id` - Get employees by organization ID

**Sample Employee Creation Object:**
```json
{
  "name": "Foysal another org test",
  "position": "Software Engineer",
  "department": "Development",
  "email": "john.doe@example.com",
  "avatar": "https://example.com/avatars/john-doe.png",
  "organizationId": "67e893926a9c7b8556326a52",
  "teamIds": [],
  "skills": [
    "JavaScript",
    "Node.js",
    "MongoDB"
  ],
  "hourlyRate": 50,
  "status": "active"
}

```


### Session Module
- `POST /api/sessions` - Create a new session
- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get a specific session
- `PATCH /api/sessions/:id` - Update a session
- `DELETE /api/sessions/:id` - Delete a session
- `GET /api/sessions/employee/:id` - Get sessions by employee ID
- `GET /api/sessions/project/:id` - Get sessions by project ID
- `GET /api/sessions/task/:id` - Get sessions by task ID

**Sample Session Creation Object:**
```json
{
  "employeeId": "67f21c7c6145df85aea91b0b",
  "projectId": "67f076154e6a982b81d3f915",
  "taskId": "67f53dd30530c0b8234879bf",
  "startTime": "2025-04-06T08:00:00.000Z",
  "endTime": "2025-04-06T10:00:00.000Z",
  "activeTime": 90,
  "idleTime": 30,
  "screenshots": [
    {
      "timestamp": "2025-04-06T08:30:00.000Z",
      "imageUrl": "https://example.com/screenshots/screenshot1.png"
    },
    {
      "timestamp": "2025-04-06T09:00:00.000Z",
      "imageUrl": "https://example.com/screenshots/screenshot2.png"
    }
  ],
  "applications": [
    {
      "name": "Visual Studio Code",
      "timeSpent": 60,
      "icon": "https://example.com/icons/vscode.png"
    },
    {
      "name": "Google Chrome",
      "timeSpent": 30,
      "icon": "https://example.com/icons/chrome.png"
    }
  ],
  "links": [
    {
      "url": "https://stackoverflow.com/questions/12345678",
      "title": "How to implement JWT in Node.js?",
      "timestamp": "2025-04-06T09:15:00.000Z"
    },
    {
      "url": "https://github.com/myproject/repo",
      "title": "Project Repository",
      "timestamp": "2025-04-06T09:45:00.000Z"
    }
  ],
  "notes": "Completed authentication flow setup."
}

```

## Data Models

The API uses the following main data models:

- **User**: Base user account with authentication details
- **Organization**: Company or entity information
- **Project**: Work projects with tasks
- **Team**: Groups within an organization
- **Task**: Individual work items within projects
- **Employee**: User with employee role and details
- **Session**: Time tracking and activity monitoring

## Authentication

Most API endpoints require authentication using JWT (JSON Web Tokens). Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start the server: `npm start`

## Development

- Development server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Test: `npm run test`
