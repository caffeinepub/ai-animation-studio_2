# AI Animation Studio

## Current State
New project with empty Motoko backend and no frontend.

## Requested Changes (Diff)

### Add
- AI animation video generator app that accepts a text script or uploaded image as input
- Backend to store projects, scenes, and generation job status
- Frontend dashboard with three-panel layout: inputs, preview, controls
- Script text area + image upload tabs
- Video generation simulation with scene-by-scene progress
- Export controls panel
- Project history list

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Store animation projects with title, script, status (pending/generating/completed), scenes with status and thumbnail URLs
2. Backend: CRUD for projects; create job, update scene status, retrieve project
3. Frontend: Three-panel layout matching design preview (dark AI tool aesthetic)
4. Left panel: tabs for 'Upload Assets' / 'Write Script', settings rows, GENERATE button
5. Center panel: large video preview + scene thumbnail grid with progress bars
6. Right panel: video controls timeline, export dropdown, effects/timing actions
7. Top nav with logo, nav links, user avatar
8. Simulate generation progress with timed updates
