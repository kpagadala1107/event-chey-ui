# Quick Start Guide - Authentication & Event Tabs

## 🚀 What's New

### Authentication
✅ Google OAuth login  
✅ Facebook OAuth login  
✅ Email/password login  
✅ Protected routes  

### Event Management
✅ **Organized Tab** - Events you created  
✅ **Invited Tab** - Pending invitations  
✅ **Going Tab** - Events you're attending  
✅ **Declined Tab** - Events you declined  

### RSVP System
✅ Accept/Decline/Tentative responses  
✅ Real-time status updates  
✅ Visual response indicators  

## 📦 Installation

```bash
# Already installed
npm install @react-oauth/google --legacy-peer-deps
```

## ⚙️ Configuration

### 1. Update .env file

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your credentials
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id
```

### 2. Get OAuth Credentials

#### Google:
1. Visit: https://console.cloud.google.com/
2. Create project → Enable Google+ API
3. Create OAuth Client ID
4. Add `http://localhost:3000` to authorized origins
5. Copy Client ID to `.env`

#### Facebook:
1. Visit: https://developers.facebook.com/
2. Create app → Add Facebook Login
3. Add `http://localhost:3000/` to redirect URIs
4. Copy App ID to `.env`

## 🏃 Running the App

```bash
npm start
```

Visit: http://localhost:3000

## 📋 Backend Requirements

Your backend needs these endpoints:

### Authentication
```
POST /api/auth/google          - Google OAuth login
POST /api/auth/facebook        - Facebook OAuth login
POST /api/auth/login           - Email/password login
GET  /api/auth/me              - Get current user
```

### Events & RSVP
```
GET    /api/events             - Get all events (with attendees)
GET    /api/events/:id         - Get single event
PATCH  /api/events/:id/attendees/me/respond  - Respond to invitation
```

### Event Data Structure
```json
{
  "id": "event-123",
  "name": "Event Name",
  "createdBy": "user-email-or-id",
  "attendees": [
    {
      "id": "att-1",
      "email": "user@example.com",
      "status": "ACCEPTED|DECLINED|TENTATIVE|PENDING"
    }
  ]
}
```

## 🎯 Usage

### Login
1. Go to http://localhost:3000/login
2. Choose Google/Facebook or email login
3. Authorize and you'll be redirected to events

### View Events by Category
- **Organized**: Your created events
- **Invited**: Events awaiting your response
- **Going**: Events you accepted
- **Declined**: Events you declined

### Respond to Invitations
1. Click on an event where you're invited
2. Use the RSVP buttons on the right:
   - ✅ **Accept** - You're going
   - ❓ **Tentative** - You might go
   - ❌ **Decline** - You're not going

## 📁 New/Modified Files

### Created:
- `src/pages/LoginPage.jsx` - Login page with OAuth
- `src/api/authApi.js` - Authentication API
- `AUTHENTICATION_GUIDE.md` - Detailed documentation

### Modified:
- `src/App.js` - Added OAuth provider & protected routes
- `src/pages/EventsPage.jsx` - Added event tabs
- `src/pages/EventDetailsPage.jsx` - Added RSVP buttons
- `src/api/attendeeApi.js` - Added respond to invitation
- `public/index.html` - Added Facebook SDK
- `.env.example` - Added OAuth variables

## 🐛 Common Issues

**Login doesn't work?**
- Check OAuth credentials in `.env`
- Verify authorized URIs in OAuth console
- Check browser console for errors

**Tabs showing wrong events?**
- Ensure backend returns attendees array
- Check user email/ID matching
- Verify attendee status values

**RSVP not working?**
- Check backend endpoint exists
- Verify request payload format
- Check authentication token

## 📖 Full Documentation

See `AUTHENTICATION_GUIDE.md` for:
- Detailed setup instructions
- API specifications
- Security considerations
- Testing checklist
- Troubleshooting guide

## 🎨 UI Preview

### Login Page
- Clean, modern design
- OAuth buttons prominently displayed
- Email login as fallback option

### Events Page with Tabs
```
┌─────────────────────────────────────────┐
│  Organized (2)  Invited (3)  Going (5)  │
│  [Active tab highlighted in indigo]     │
└─────────────────────────────────────────┘
```

### Event Details - RSVP Section
```
┌──────────────────┐
│ Your Response:   │
│ Pending          │
│                  │
│ [✓ Accept]       │
│ [? Tentative]    │
│ [✗ Decline]      │
└──────────────────┘
```

## ✨ Features in Action

1. **User logs in with Google** → Sees personalized event tabs
2. **Clicks "Invited" tab** → Views pending invitations
3. **Opens event details** → Sees RSVP buttons
4. **Clicks "Accept"** → Event moves to "Going" tab
5. **Status updates** → Visible to organizer immediately

## 🔐 Security Notes

- Tokens stored in localStorage
- Protected routes enforce authentication
- OAuth follows industry best practices
- All API calls include auth headers

## 🚀 Next Steps

1. Configure OAuth credentials
2. Update backend to support new endpoints
3. Test authentication flow
4. Test event tabs filtering
5. Test RSVP functionality

## 💡 Tips

- Use Chrome DevTools to debug OAuth flow
- Check Network tab for API responses
- Verify token is being sent with requests
- Test with multiple user accounts

---

**Need Help?** Check `AUTHENTICATION_GUIDE.md` for detailed documentation!
