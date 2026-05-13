# Skool Clone UML Reference

This document is the readable UML source for the current MVP.

It covers:
- actors
- use case diagrams
- use case wording
- sequence diagram coverage
- class diagram coverage

It is aligned with [docs/SOFTWARE_CONCEPTION.md](/Users/jaffa/Desktop/skool/docs/SOFTWARE_CONCEPTION.md).

Important rule:
- this file describes the current MVP behavior
- it does not describe every future Skool feature
- if the code changes, this file should follow the code, not the other way around

## 1. Current Verdict

The old LMS-style use cases are no longer correct.

The current MVP is now centered on:
- community discovery
- public about pages
- popup authentication
- direct join for free communities
- gated member spaces
- classroom access
- posts and comments
- owner management
- platform admin governance

The main documentation correction is this:
- `Request to join a community` is no longer the default public MVP flow
- for the current implementation, free communities are joined directly after authentication
- invitation handling remains active
- owner review of join requests should not be treated as a primary MVP use case unless that flow is reintroduced in code

## 2. Actor Model

### Visitor

A non-authenticated person discovering communities.

Main goals:
- discover communities
- search communities
- consult a community about page
- open the sign-in or sign-up popup
- join a free community after authentication

### Member

An authenticated user who belongs to one or more communities.

Main goals:
- access joined communities
- consult the community feed
- add comments
- consult classroom content
- open classroom items
- consult members
- track personal progress
- evaluate the classroom experience
- manage personal account information
- accept invitations

### Community Owner

A user who owns and manages a community.

Main goals:
- create communities
- edit community details
- create and manage classroom items
- attach document and video resources
- publish posts
- invite members
- remove members
- consult member progress

### Platform Admin

A global governance role.

Main goals:
- consult users
- delete users
- consult communities
- delete communities

## 3. Readable Use Case List

### Visitor

| Use case | Status in MVP | Notes |
| --- | --- | --- |
| Discover communities | Active | Homepage and discovery cards |
| Search communities | Active | Homepage search flow |
| Consult community about page | Active | Main public conversion surface |
| Open sign-in popup | Active | Intercepted modal auth flow |
| Open sign-up popup | Active | Same modal flow, alternate mode |
| Join free community | Active | Direct join after auth |

### Member

| Use case | Status in MVP | Notes |
| --- | --- | --- |
| Access joined communities | Active | Protected and public-member flows |
| Consult community feed | Active | Community tab |
| Add comment | Active | Post and discussion interaction |
| Consult classroom | Active | Classroom tab |
| Open classroom item | Active | Full classroom item view |
| Open or download classroom resource | Active | Document and resource links |
| Consult members list | Active | Members tab |
| Consult own progress | Active | Progress workspace |
| Evaluate classroom experience | Active | `0..20` evaluation |
| Edit personal information | Active | Account settings |
| Delete account | Active | Account settings |
| Accept invitation | Active | Invitation workflow |

### Community Owner

| Use case | Status in MVP | Notes |
| --- | --- | --- |
| Create community | Active | Owner workspace |
| Edit community details | Active | Owner workspace |
| Publish post | Active | Owner posts |
| Create classroom item | Active | Owner workspace |
| Attach document resource | Active | Classroom/community resource support |
| Attach video resource | Active | Video content type support |
| Edit classroom item | Active | Owner workspace |
| Delete classroom item | Active | Owner workspace |
| Invite member | Active | Member management |
| Remove member | Active | Member management |
| Consult member progress | Active | Progress workspace |

### Platform Admin

| Use case | Status in MVP | Notes |
| --- | --- | --- |
| Consult user | Active | Admin panel |
| Delete user | Active | Admin panel |
| Consult community | Active | Admin panel |
| Delete community | Active | Admin panel |

## 4. Use Cases That Need To Be Removed From Current MVP UML

Do not keep these in the current MVP use case diagrams unless the implementation changes again:
- Request to join a community as the default public flow
- Approve join request
- Reject join request
- Calendar
- Leaderboard
- Points and levels
- Billing and recurring payments
- Moderator-only workflows

Reason:
- they are either not implemented
- or they are no longer the current primary behavior

## 5. Recommended Use Case Diagram Split

Do not build one large unreadable diagram.
Use four diagrams.

### Diagram A: Visitor

Use cases:
- Discover communities
- Search communities
- Consult community about page
- Open sign-in popup
- Open sign-up popup
- Join free community

### Diagram B: Member

Use cases:
- Access joined communities
- Consult community feed
- Add comment
- Consult classroom
- Open classroom item
- Consult members list
- Consult own progress
- Evaluate classroom experience
- Edit personal information
- Delete account
- Accept invitation

### Diagram C: Community Owner

Use cases:
- Create community
- Edit community details
- Publish post
- Create classroom item
- Attach document
- Attach video
- Edit classroom item
- Delete classroom item
- Invite member
- Remove member
- Consult member progress

### Diagram D: Platform Admin

Use cases:
- Consult user
- Delete user
- Consult community
- Delete community

## 6. PlantUML Use Case Source

### 6.1 Visitor

```plantuml
@startuml
left to right direction

actor Visitor

rectangle "Campus Digital MVP" {
  usecase "Discover communities" as UC1
  usecase "Search communities" as UC2
  usecase "Consult community about page" as UC3
  usecase "Open sign-in popup" as UC4
  usecase "Open sign-up popup" as UC5
  usecase "Join free community" as UC6
}

Visitor --> UC1
Visitor --> UC2
Visitor --> UC3
Visitor --> UC4
Visitor --> UC5
Visitor --> UC6

UC6 .> UC4 : <<include>>
@enduml
```

### 6.2 Member

```plantuml
@startuml
left to right direction

actor Member

rectangle "Member Community Space" {
  usecase "Sign in" as UC1
  usecase "Access joined communities" as UC2
  usecase "Consult community feed" as UC3
  usecase "Add comment" as UC4
  usecase "Consult classroom" as UC5
  usecase "Open classroom item" as UC6
  usecase "Consult members list" as UC7
  usecase "Consult own progress" as UC8
  usecase "Evaluate classroom experience" as UC9
  usecase "Edit personal information" as UC10
  usecase "Delete account" as UC11
  usecase "Accept invitation" as UC12
}

Member --> UC2
Member --> UC3
Member --> UC4
Member --> UC5
Member --> UC6
Member --> UC7
Member --> UC8
Member --> UC9
Member --> UC10
Member --> UC11
Member --> UC12

UC2 .> UC1 : <<include>>
UC3 .> UC1 : <<include>>
UC4 .> UC1 : <<include>>
UC5 .> UC1 : <<include>>
UC6 .> UC1 : <<include>>
UC7 .> UC1 : <<include>>
UC8 .> UC1 : <<include>>
UC9 .> UC1 : <<include>>
UC10 .> UC1 : <<include>>
UC11 .> UC1 : <<include>>
UC12 .> UC1 : <<include>>
@enduml
```

### 6.3 Community Owner

```plantuml
@startuml
left to right direction

actor "Community Owner" as Owner

rectangle "Community Owner Workspace" {
  usecase "Sign in" as UC1
  usecase "Create community" as UC2
  usecase "Edit community details" as UC3
  usecase "Publish post" as UC4
  usecase "Create classroom item" as UC5
  usecase "Attach document" as UC6
  usecase "Attach video" as UC7
  usecase "Edit classroom item" as UC8
  usecase "Delete classroom item" as UC9
  usecase "Invite member" as UC10
  usecase "Remove member" as UC11
  usecase "Consult member progress" as UC12
}

Owner --> UC2
Owner --> UC3
Owner --> UC4
Owner --> UC5
Owner --> UC8
Owner --> UC9
Owner --> UC10
Owner --> UC11
Owner --> UC12

UC2 .> UC1 : <<include>>
UC3 .> UC1 : <<include>>
UC4 .> UC1 : <<include>>
UC5 .> UC1 : <<include>>
UC8 .> UC1 : <<include>>
UC9 .> UC1 : <<include>>
UC10 .> UC1 : <<include>>
UC11 .> UC1 : <<include>>
UC12 .> UC1 : <<include>>
UC5 .> UC6 : <<extend>>
UC5 .> UC7 : <<extend>>
@enduml
```

### 6.4 Platform Admin

```plantuml
@startuml
left to right direction

actor "Platform Admin" as Admin

rectangle "Platform Administration" {
  usecase "Sign in" as UC1
  usecase "Consult user" as UC2
  usecase "Delete user" as UC3
  usecase "Consult community" as UC4
  usecase "Delete community" as UC5
}

Admin --> UC2
Admin --> UC3
Admin --> UC4
Admin --> UC5

UC2 .> UC1 : <<include>>
UC3 .> UC1 : <<include>>
UC4 .> UC1 : <<include>>
UC5 .> UC1 : <<include>>
@enduml
```

## 7. Sequence Diagram Source

Actual sequence diagram source now lives in:
- [docs/SKOOL_SEQUENCE_DIAGRAMS.md](/Users/jaffa/Desktop/skool/docs/SKOOL_SEQUENCE_DIAGRAMS.md)

Reason:
- sequence diagrams are longer
- separating them makes this file easier to read
- use cases and sequences should not be mixed into one hard-to-scan document

## 8. Class Diagram Source

Actual class diagram source now lives in:
- [docs/SKOOL_CLASS_DIAGRAM.md](/Users/jaffa/Desktop/skool/docs/SKOOL_CLASS_DIAGRAM.md)

Reason:
- the connected class diagram is large
- separating it keeps the use case document readable
- the class diagram should evolve with the actual schema and domain model

## 9. PDF Status

The old PDF is gone.

If a PDF is needed later, regenerate it from:
- [docs/SOFTWARE_CONCEPTION.md](/Users/jaffa/Desktop/skool/docs/SOFTWARE_CONCEPTION.md)
- [docs/SKOOL_UML_REPLACEMENT.md](/Users/jaffa/Desktop/skool/docs/SKOOL_UML_REPLACEMENT.md)
- [docs/SKOOL_CLASS_DIAGRAM.md](/Users/jaffa/Desktop/skool/docs/SKOOL_CLASS_DIAGRAM.md)
- [docs/SKOOL_SEQUENCE_DIAGRAMS.md](/Users/jaffa/Desktop/skool/docs/SKOOL_SEQUENCE_DIAGRAMS.md)
