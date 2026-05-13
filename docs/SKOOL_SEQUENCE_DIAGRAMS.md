# Skool Clone Sequence Diagrams

This document contains actual sequence diagram source for the current MVP.

It is aligned with:
- [docs/SOFTWARE_CONCEPTION.md](/Users/jaffa/Desktop/skool/docs/SOFTWARE_CONCEPTION.md)
- [docs/SKOOL_UML_REPLACEMENT.md](/Users/jaffa/Desktop/skool/docs/SKOOL_UML_REPLACEMENT.md)

Important rule:
- these sequences describe current behavior
- they do not describe removed LMS flows
- they do not describe future Skool extensions that are not implemented yet

## 1. Sequence Set

Current MVP sequence diagrams:
- Authentication
- Registration
- Delete account
- Modify personal information
- Consult community about page
- Join free community
- Add comment
- Evaluate classroom experience
- Create community
- Invite member
- Remove member
- Consult member progress
- Consult user as admin
- Delete user as admin
- Consult community as admin
- Delete community as admin

## 2. PlantUML Sequence Source

### 2.1 Authentication

```plantuml
@startuml
actor User
participant "Auth Modal" as UI
participant "System" as SYS
database "Database" as DB

User -> UI : Open sign-in popup
UI -> User : Show email and password form
User -> UI : Submit credentials
UI -> SYS : Sign in request
SYS -> DB : Find user by email
DB --> SYS : User record
SYS -> SYS : Verify password

alt Valid credentials
  SYS --> UI : Auth success
  UI --> User : Redirect to callback page
else Invalid credentials
  SYS --> UI : Error
  UI --> User : Display invalid credentials
end
@enduml
```

### 2.2 Registration

```plantuml
@startuml
actor Visitor
participant "Auth Modal" as UI
participant "System" as SYS
database "Database" as DB

Visitor -> UI : Open sign-up popup
UI -> Visitor : Show registration form
Visitor -> UI : Submit profile and password
UI -> SYS : Registration request
SYS -> DB : Check email uniqueness

alt Email already exists
  DB --> SYS : Existing user found
  SYS --> UI : Registration error
  UI --> Visitor : Show email already used
else Email available
  DB --> SYS : No existing user
  SYS -> DB : Create user
  DB --> SYS : User created
  SYS --> UI : Registration success
  UI --> Visitor : Switch to sign-in mode
end
@enduml
```

### 2.3 Delete Account

```plantuml
@startuml
actor Member
participant "Account Settings" as UI
participant "System" as SYS
database "Database" as DB

Member -> UI : Click delete account
UI -> Member : Ask for confirmation
Member -> UI : Confirm deletion
UI -> SYS : Delete account request
SYS -> DB : Delete user and owned data

alt Deletion successful
  DB --> SYS : Deleted
  SYS --> UI : Success
  UI --> Member : Sign out and redirect
else Deletion failed
  DB --> SYS : Failure
  SYS --> UI : Error
  UI --> Member : Show deletion error
end
@enduml
```

### 2.4 Modify Personal Information

```plantuml
@startuml
actor Member
participant "Account Settings" as UI
participant "System" as SYS
database "Database" as DB

Member -> UI : Edit account information
UI -> Member : Show editable fields
Member -> UI : Submit updated information
UI -> SYS : Update profile request
SYS -> SYS : Validate input

alt Changes detected
  SYS -> DB : Update user and profile
  DB --> SYS : Saved
  SYS --> UI : Success
  UI --> Member : Show updated profile
else No changes detected
  SYS --> UI : No-op response
  UI --> Member : Show no changes detected
end
@enduml
```

### 2.5 Consult Community About Page

```plantuml
@startuml
actor Visitor
participant "About Page" as UI
participant "System" as SYS
database "Database" as DB

Visitor -> UI : Open community about page
UI -> SYS : Request public community data
SYS -> DB : Load community summary
DB --> SYS : Community data
SYS --> UI : About page content
UI --> Visitor : Show public offer, stats, and join CTA
@enduml
```

### 2.6 Join Free Community

```plantuml
@startuml
actor Visitor
participant "About Page" as UI
participant "Auth Modal" as AUTH
participant "System" as SYS
database "Database" as DB

Visitor -> UI : Click join group

alt Not authenticated
  UI -> AUTH : Open sign-in / sign-up modal
  AUTH --> Visitor : Authenticate user
end

UI -> SYS : Join community request
SYS -> DB : Check existing membership

alt Already active member
  DB --> SYS : Membership exists
  SYS --> UI : Already joined
  UI --> Visitor : Open community
else Not yet member
  DB --> SYS : No active membership
  SYS -> DB : Create or activate membership
  DB --> SYS : Membership active
  SYS --> UI : Join success
  UI --> Visitor : Redirect to community feed
end
@enduml
```

### 2.7 Add Comment

```plantuml
@startuml
actor Member
participant "Community Feed" as UI
participant "System" as SYS
database "Database" as DB

Member -> UI : Submit comment
UI -> SYS : Comment request
SYS -> DB : Save comment
DB --> SYS : Comment stored
SYS --> UI : Updated discussion state
UI --> Member : Render comment
@enduml
```

### 2.8 Evaluate Classroom Experience

```plantuml
@startuml
actor Member
participant "Progress Workspace" as UI
participant "System" as SYS
database "Database" as DB

Member -> UI : Submit evaluation
UI -> SYS : Evaluation request
SYS -> SYS : Validate note 0..20

alt Valid note
  SYS -> DB : Save evaluation
  DB --> SYS : Saved
  SYS --> UI : Success
  UI --> Member : Show evaluation saved
else Invalid note
  SYS --> UI : Validation error
  UI --> Member : Show note must be 0..20
end
@enduml
```

### 2.9 Create Community

```plantuml
@startuml
actor "Community Owner" as Owner
participant "Owner Workspace" as UI
participant "System" as SYS
database "Database" as DB

Owner -> UI : Create community
UI -> Owner : Show community form
Owner -> UI : Submit title, description, resources
UI -> SYS : Create community request
SYS -> DB : Create community and resources

alt Success
  DB --> SYS : Community created
  SYS --> UI : Success
  UI --> Owner : Show created community
else Failure
  DB --> SYS : Failure
  SYS --> UI : Error
  UI --> Owner : Show creation error
end
@enduml
```

### 2.10 Invite Member

```plantuml
@startuml
actor "Community Owner" as Owner
participant "Member Manager" as UI
participant "System" as SYS
database "Database" as DB

Owner -> UI : Invite member
UI -> Owner : Select target member
Owner -> UI : Confirm invitation
UI -> SYS : Invitation request
SYS -> DB : Check membership and pending invitation

alt Already a member
  DB --> SYS : Active membership found
  SYS --> UI : Reject invitation
  UI --> Owner : Show already member
else Pending invitation exists
  DB --> SYS : Pending invitation found
  SYS --> UI : Reject invitation
  UI --> Owner : Show invitation already pending
else Can invite
  DB --> SYS : No conflict
  SYS -> DB : Create invitation
  DB --> SYS : Invitation created
  SYS --> UI : Success
  UI --> Owner : Show invitation sent
end
@enduml
```

### 2.11 Remove Member

```plantuml
@startuml
actor "Community Owner" as Owner
participant "Member Manager" as UI
participant "System" as SYS
database "Database" as DB

Owner -> UI : Remove member
UI -> Owner : Ask for confirmation
Owner -> UI : Confirm removal
UI -> SYS : Remove member request
SYS -> DB : Update membership status

alt Success
  DB --> SYS : Membership removed
  SYS --> UI : Success
  UI --> Owner : Show member removed
else Failure
  DB --> SYS : Failure
  SYS --> UI : Error
  UI --> Owner : Show removal error
end
@enduml
```

### 2.12 Consult Member Progress

```plantuml
@startuml
actor "Community Owner" as Owner
participant "Progress Workspace" as UI
participant "System" as SYS
database "Database" as DB

Owner -> UI : Select community
UI -> SYS : Load members and progress
SYS -> DB : Load active memberships and classroom progress
DB --> SYS : Member progress data
SYS --> UI : Progress summary
UI --> Owner : Show member progress
@enduml
```

### 2.13 Consult User As Admin

```plantuml
@startuml
actor "Platform Admin" as Admin
participant "Admin Users Panel" as UI
participant "System" as SYS
database "Database" as DB

Admin -> UI : Search user
UI -> SYS : User search request
SYS -> DB : Query users
DB --> SYS : Matching users
SYS --> UI : Search results
UI --> Admin : Show user details
@enduml
```

### 2.14 Delete User As Admin

```plantuml
@startuml
actor "Platform Admin" as Admin
participant "Admin Users Panel" as UI
participant "System" as SYS
database "Database" as DB

Admin -> UI : Delete user
UI -> Admin : Ask for confirmation
Admin -> UI : Confirm delete
UI -> SYS : Delete user request
SYS -> DB : Delete user

alt Success
  DB --> SYS : Deleted
  SYS --> UI : Success
  UI --> Admin : Remove user from results
else Failure
  DB --> SYS : Failure
  SYS --> UI : Error
  UI --> Admin : Show deletion error
end
@enduml
```

### 2.15 Consult Community As Admin

```plantuml
@startuml
actor "Platform Admin" as Admin
participant "Admin Communities Panel" as UI
participant "System" as SYS
database "Database" as DB

Admin -> UI : Search or inspect community
UI -> SYS : Community query
SYS -> DB : Load communities
DB --> SYS : Community data
SYS --> UI : Community results
UI --> Admin : Show community details
@enduml
```

### 2.16 Delete Community As Admin

```plantuml
@startuml
actor "Platform Admin" as Admin
participant "Admin Communities Panel" as UI
participant "System" as SYS
database "Database" as DB

Admin -> UI : Delete community
UI -> Admin : Ask for confirmation
Admin -> UI : Confirm delete
UI -> SYS : Delete community request
SYS -> DB : Delete community

alt Success
  DB --> SYS : Deleted
  SYS --> UI : Success
  UI --> Admin : Remove community from results
else Failure
  DB --> SYS : Failure
  SYS --> UI : Error
  UI --> Admin : Show deletion error
end
@enduml
```
