# Project Restructuring and Enhancement Plan

## Goal Description
The objective is to restructure the existing HealthOS application by separating it into distinct frontend and backend directories, adding a dedicated login page, and significantly improving the UI aesthetics for a more premium, modern feel.

## Proposed Changes

### Project Structure
- Create a `frontend` folder containing the client-side code ([index.html](file:///c:/Users/HP/Downloads/health/index.html), [styles.css](file:///c:/Users/HP/Downloads/health/styles.css), [script.js](file:///c:/Users/HP/Downloads/health/script.js)).
- Create a `backend` folder containing the server-side code (`app.py`, [requirements.txt](file:///c:/Users/HP/Downloads/health/requirements.txt)).
- Add a new `login.html` page and `login.js` to handle user authentication.

### Frontend UI Enhancements
#### [MODIFY] `frontend/styles.css`
- Implement a modern color palette (deep slate backgrounds, vibrant accents like neon greens/purples)
- Add glassmorphism effects for cards and panels.
- Enhance typography using carefully paired Google Fonts (e.g., Inter and Outfit).
- Add micro-interaction animations (hover states, smooth transitions).

#### [NEW] `frontend/login.html`
- A brand-new authenticating entry point with a rich, premium layout.
- Include email/password inputs and "Sign In/Sign Up" buttons.

#### [NEW] `frontend/login.js`
- Logic to communicate with the backend for authentication.
- Upon successful login, store a mock token and redirect to [index.html](file:///c:/Users/HP/Downloads/health/index.html).

#### [MODIFY] `frontend/index.html` & `frontend/script.js`
- Update links and structure.
- Check for auth token in [script.js](file:///c:/Users/HP/Downloads/health/script.js); if not present, redirect to `login.html`.

### Backend Implementation
#### [NEW] `backend/app.py`
- Setup a basic Flask server.
- Expose a `/login` endpoint.
- Expose a `/api/health-plan` endpoint to replace direct client-to-OpenRouter calls if desired, or just act as a proxy.

## Verification Plan
1. Start the Flask backend server.
2. Serve the frontend files.
3. Attempt to access [index.html](file:///c:/Users/HP/Downloads/health/index.html) directly—it should redirect to `login.html`.
4. Successfully log in through `login.html` and be redirected to [index.html](file:///c:/Users/HP/Downloads/health/index.html).
5. Verify the visual aesthetics of both pages in the browser.
