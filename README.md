# Auto Care Authentication System

A modern, premium-looking authentication interface for an auto care service platform. Built with pure HTML5, CSS3, and Vanilla JavaScript - no frameworks required.

## Features

- **Split-screen layout** (54% left, 46% right)
- **Responsive design** for desktop, tablet, and mobile
- **Authentication pages**: Login, Register, Forgot Password
- **Form validation** with real-time error messages
- **Password visibility toggle**
- **Remember me functionality**
- **Google Sign-In button** (ready for OAuth integration)
- **Professional UI** with premium automotive theme
- **Smooth animations** and transitions

## Project Structure

```
project3/
│
├── index.html              # Redirects to login.html
├── login.html              # Sign In page
├── register.html           # Create Account page
├── forgot-password.html    # Password recovery page
│
├── css/
│   └── style.css           # Main stylesheet with responsive design
│
├── js/
│   └── script.js           # Form validation and interactivity
│
└── assets/
    ├── images/
    │   ├── login-car.jpg   # Background car image (add your own)
    │   └── README.md       # Image specifications
    └── icons/
        └── README.md       # Icon information
```

## Getting Started

### 1. Add the Car Image

Place a premium automotive image in `assets/images/` and name it `login-car.jpg`

**Image Requirements:**
- Dark automotive showroom or road background
- Premium luxury car (BMW-style)
- Dark blue and black color tones
- Dramatic spotlight lighting
- High resolution (1920x1080 or higher)

*Note: The design will work without the image using a dark gradient overlay.*

### 2. Open in Browser

#### Option A: Using VS Code Live Server (Recommended)
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html` or `login.html`
3. Select "Open with Live Server"

#### Option B: Direct File Open
Simply double-click `index.html` or `login.html` to open in your browser

### 3. Test the Pages

- **Login Page**: `/login.html` - Sign in form with email/password
- **Register Page**: `/register.html` - Create new account
- **Forgot Password**: `/forgot-password.html` - Password recovery

## Customization

### Colors

Edit `css/style.css` to change the color scheme:

```css
/* Primary blue */
--primary-blue: #1717FF;

/* Background colors */
--background: #FFFFFF;
--input-border: #BDBDBD;

/* Text colors */
--main-text: #111111;
--secondary-text: #777777;
```

### Layout

Adjust the split-screen ratio in `css/style.css`:

```css
.left-panel {
    width: 54%;  /* Change left panel width */
}

.right-panel {
    width: 46%;  /* Change right panel width */
}
```

### Typography

The project uses Google Fonts (Poppins). To change the font:

1. Visit https://fonts.google.com
2. Select your preferred font
3. Update the Google Fonts link in the HTML `<head>` section
4. Update `font-family` in `css/style.css`

## Backend Integration

The JavaScript is prepared for backend API integration. Look for TODO comments in `js/script.js`:

### Login API
```javascript
fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(loginData)
})
```

### Register API
```javascript
fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registerData)
})
```

### Forgot Password API
```javascript
fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(forgotData)
})
```

### Google OAuth

To enable Google Sign-In:

1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google Identity Services
3. Get your Client ID
4. Update the `handleGoogleAuth()` function in `js/script.js`
5. Add the Google Identity Services script to your HTML

## Form Validation

### Email Validation
- Must be a valid email format (e.g., user@example.com)
- Cannot be empty

### Password Validation
- Minimum 8 characters
- At least one letter
- At least one number

### Additional Validations
- Full name (register): Minimum 2 characters
- Confirm password: Must match password
- Terms agreement: Must be checked (register)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Breakpoints

- **Desktop**: > 1024px - Full split-screen layout
- **Tablet**: 768px - 1024px - Adjusted panel widths
- **Mobile**: < 768px - Stacked layout with compact header

## Security Notes

- All forms use POST method (when backend is integrated)
- Password fields use type="password"
- Password visibility toggle only changes display type
- CSRF protection should be added on the backend
- HTTPS should be used in production
- Never store passwords in localStorage (only remember email)

## Features Implemented

✅ Split-screen layout (54/46)
✅ Premium automotive theme
✅ Responsive design (desktop/tablet/mobile)
✅ Login page with email/password
✅ Register page with full validation
✅ Forgot password page
✅ Password show/hide toggle
✅ Remember me checkbox
✅ Form validation with error messages
✅ Success/error message notifications
✅ Navigation between pages
✅ Google Sign-In button (UI ready)
✅ Smooth animations
✅ Inline SVG icons (no external dependencies)
✅ Google Fonts integration
✅ Clean, semantic HTML
✅ Well-organized CSS
✅ Modular JavaScript

## License

This project is provided as-is for educational and commercial use.

## Support

For issues or questions, please refer to the code comments or modify the styling as needed for your specific requirements.
