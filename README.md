## HSK-12
A homeschool content management system.

## Tech/framework used
<b>Built with</b>
- Node.js   - v 8.9.4
- Express   - v 4.16.2
- MongoDB   - v 3.6.3
- Mongoose  - v 4.13.6

## Features
You can use this API as a standalone or combined with Homeschool Hub (in development) - https://github.com/billyderringer/Homeschool-Hub

## Installation
```
git clone https://github.com/billyderringer/hsk-12.git
cd hsk-12
npm install
npm run dev
```

## Use API
 ```
  Base URL: http://localhost:3005/api/v1
```

<b>Logic</b>
- Create teacher
- Create school terms in specified teacher
- Create students in specified term
- Create subjects in specified student
- Create assignments in specified subject

<b>/teacher</b>
- /register           - register new account
- /login              - returns jwt
- /logout
- /me                 - returns teacher ObjectId
- /teacherId          - get teacher by id
- /update/teacherId   - update teacher info
- /remove/teacherId   - delete teacher and all children

<b>/term</b>  
<b>/student</b>  
<b>/subject</b>  
<b>/assignment</b>  
- /create/parentId    - create new element
- /parent/elementId   - get all elements in parent
- /elementId          - get element by elementId
- /update/elementId   - update element by elementId
- /remove/elementId   - remove element and children by elementId
